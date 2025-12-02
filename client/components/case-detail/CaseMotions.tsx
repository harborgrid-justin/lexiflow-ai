/**
 * ENZYME MIGRATION - CaseMotions Component
 *
 * Enzyme Features Implemented:
 * - ✅ useTrackEvent() - Analytics tracking for motion actions
 * - ✅ useLatestCallback() - Stable callbacks for all handlers
 * - ✅ useIsMounted() - Safe state updates after async fetch
 *
 * Event Tracking:
 * - case_motion_created - When motion is saved
 * - case_motion_strategy_generated - When AI generates strategy
 * - case_motion_calendar_synced - When calendar sync is clicked
 * - case_motion_workflow_added - When motion is added to workflow
 * - case_motion_detail_viewed - When motion detail is opened
 *
 * Migration completed by Agent 18 on December 2, 2025
 */

import React, { useState, useEffect } from 'react';
import { Motion, MotionStatus, MotionType, User, DocketEntry } from '../../types';
import { ApiService } from '../../services/apiService';
import { TableHeader, TableBody, TableRow, TableHead, TableCell } from '../common/Table';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Plus, Gavel, Calendar, Wand2, ArrowRight, RefreshCw, GitGraph, Clock, ExternalLink, FileText, Link as LinkIcon } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Inputs';
import { MotionDetail } from './MotionDetail';
import { useTrackEvent, useLatestCallback, useIsMounted } from '../../enzyme';

interface CaseMotionsProps {
  caseId: string;
  caseTitle: string;
  currentUser?: User;
}

export const CaseMotions: React.FC<CaseMotionsProps> = ({ caseId, caseTitle, currentUser }) => {
  const trackEvent = useTrackEvent();
  const isMounted = useIsMounted();

  const [motions, setMotions] = useState<Motion[]>([]);
  const [docketEntries, setDocketEntries] = useState<DocketEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMotion, setNewMotion] = useState<Partial<Motion>>({ type: 'Dismiss', status: 'Draft' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMotionId, setSelectedMotionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [motionsData, docketData] = await Promise.all([
              ApiService.getCaseMotions(caseId),
              ApiService.getDocketEntries(caseId)
            ]);
            if (isMounted()) {
              setMotions(motionsData);
              setDocketEntries(docketData || []);
            }
        } catch (e) {
            console.error("Failed to fetch motions and docket entries", e);
        }
    };
    if (caseId) fetchData();
  }, [caseId, isMounted]);

  // Auto-calculate deadlines when hearing date changes
  useEffect(() => {
    if (newMotion.hearingDate) {
      const hearing = new Date(newMotion.hearingDate);
      if (!isNaN(hearing.getTime())) {
        const opp = new Date(hearing);
        opp.setDate(hearing.getDate() - 14); // ~14 calendar days prior
        const reply = new Date(hearing);
        reply.setDate(hearing.getDate() - 7); // ~7 calendar days prior
        
        const newDates = {
          oppositionDueDate: opp.toISOString().split('T')[0],
          replyDueDate: reply.toISOString().split('T')[0]
        };
        
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setNewMotion(prev => ({
          ...prev,
          ...newDates
        }));
      }
    }
   
  }, [newMotion.hearingDate]);

  const handleSave = useLatestCallback(async () => {
    if (!newMotion.title) return;
    try {
      const motionData: Partial<Motion> = {
        caseId,
        title: newMotion.title,
        type: newMotion.type as MotionType,
        status: newMotion.status as MotionStatus,
        assignedAttorney: currentUser?.name || 'Current User',
        createdBy: currentUser?.id,
        filingDate: new Date().toISOString().split('T')[0],
        hearingDate: newMotion.hearingDate,
        oppositionDueDate: newMotion.oppositionDueDate,
        replyDueDate: newMotion.replyDueDate
      };
      const createdMotion = await ApiService.createMotion(motionData);
      setMotions([...motions, createdMotion]);
      setIsModalOpen(false);
      setNewMotion({ type: 'Dismiss', status: 'Draft' });

      // Track motion creation
      trackEvent('case_motion_created', {
        motionType: newMotion.type,
        hasHearingDate: !!newMotion.hearingDate,
        caseId
      });
    } catch (error) {
      console.error("Failed to create motion", error);
    }
  });

  const handleGenerateStrategy = useLatestCallback(async () => {
    if (!newMotion.title) return;
    setIsGenerating(true);
    // Simulate AI generation for strategy
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert(`AI Strategy Generated: Arguments for ${newMotion.title} based on ${caseTitle} have been drafted to your documents.`);
    setIsGenerating(false);

    // Track AI strategy generation
    trackEvent('case_motion_strategy_generated', {
      motionTitle: newMotion.title,
      motionType: newMotion.type,
      caseTitle
    });
  });

  const handleSyncCalendar = useLatestCallback(() => {
    const deadlinesCount = motions.filter(m => m.hearingDate).length * 3; // Hearing + Opp + Reply
    alert(`Synced ${deadlinesCount} deadlines to Master Calendar and Outlook.`);

    // Track calendar sync
    trackEvent('case_motion_calendar_synced', {
      deadlinesCount,
      motionsWithHearing: motions.filter(m => m.hearingDate).length,
      caseId
    });
  });

  const handleAddToWorkflow = useLatestCallback((motion: Motion) => {
      alert(`Created new Workflow Stage: "${motion.title} Prep" with tasks for Research, Drafting, and Filing.`);

      // Track workflow addition
      trackEvent('case_motion_workflow_added', {
        motionId: motion.id,
        motionTitle: motion.title,
        motionType: motion.type,
        caseId
      });
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'neutral';
      case 'Filed': return 'info';
      case 'Hearing Set': return 'warning';
      case 'Decided': return 'success';
      default: return 'neutral';
    }
  };

  const handleMotionDetailView = useLatestCallback((motionId: string) => {
    setSelectedMotionId(motionId);

    const motion = motions.find(m => m.id === motionId);
    if (motion) {
      // Track motion detail view
      trackEvent('case_motion_detail_viewed', {
        motionId,
        motionTitle: motion.title,
        motionType: motion.type,
        motionStatus: motion.status,
        caseId
      });
    }
  });

  if (selectedMotionId) {
    const selectedMotion = motions.find(m => m.id === selectedMotionId);
    if (selectedMotion) {
      return <MotionDetail motion={selectedMotion} onBack={() => setSelectedMotionId(null)} />;
    }
  }

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in pb-2">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Motion Practice</h3>
          <p className="text-sm text-slate-500">Track filings, opposition deadlines, and hearings.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={handleSyncCalendar}>Sync Calendar</Button>
          <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsModalOpen(true)}>New Motion</Button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block flex-1 overflow-hidden min-h-0">
        <div className="h-full overflow-y-auto border border-slate-200 rounded-lg shadow-sm bg-white">
          <table className="min-w-full divide-y divide-slate-200">
          <TableHeader>
            <TableHead>Motion Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Hearing</TableHead>
            <TableHead>Opp. Due</TableHead>
            <TableHead>Reply Due</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableHeader>
          <TableBody>
            {motions.map(motion => {
              const linkedDocket = motion.docketEntryId ? docketEntries.find(d => d.id === motion.docketEntryId) : null;
              return (
              <TableRow key={motion.id}>
                <TableCell className="font-medium text-slate-900">
                  <div className="flex items-center gap-2">
                    <Gavel className="h-4 w-4 text-slate-400 shrink-0" />
                    <div className="flex-1">
                      <div>{motion.title}</div>
                      {linkedDocket && (
                        <div className="flex items-center gap-2 mt-1 text-xs text-blue-600">
                          <FileText className="h-3 w-3" />
                          <span>Docket #{linkedDocket.entryNumber}</span>
                          {linkedDocket.docLink && (
                            <a href={linkedDocket.docLink} target="_blank" rel="noopener noreferrer" className="flex items-center hover:underline">
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>{motion.type}</TableCell>
                <TableCell>
                  <Badge variant={getStatusColor(motion.status) as any}>{motion.status}</Badge>
                </TableCell>
                <TableCell>
                  {motion.hearingDate ? (
                    <span className="flex items-center text-red-600 font-medium text-xs">
                      <Calendar className="h-3 w-3 mr-1" /> {motion.hearingDate}
                    </span>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {motion.oppositionDueDate ? (
                    <span className="text-xs text-slate-600 font-mono">{motion.oppositionDueDate}</span>
                  ) : '-'}
                </TableCell>
                <TableCell>
                  {motion.replyDueDate ? (
                    <span className="text-xs text-slate-600 font-mono">{motion.replyDueDate}</span>
                  ) : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" className="text-indigo-600" onClick={() => handleAddToWorkflow(motion)} icon={GitGraph}>To Workflow</Button>
                    <Button size="sm" variant="ghost" className="text-blue-600" onClick={() => handleMotionDetailView(motion.id)}>Details</Button>
                  </div>
                </TableCell>
              </TableRow>
            );
            })}
            {motions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-400 italic">No active motions.</TableCell>
              </TableRow>
            )}
          </TableBody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 overflow-y-auto flex-1">
        {motions.map(motion => (
          <div key={motion.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Gavel className="h-4 w-4 text-blue-500" />
                {motion.title}
              </h4>
              <Badge variant={getStatusColor(motion.status) as any}>{motion.status}</Badge>
            </div>
            <div className="text-xs text-slate-500 mb-3">{motion.type} • Filed: {motion.filingDate || 'Draft'}</div>
            
            {motion.hearingDate && (
              <div className="bg-slate-50 p-3 rounded border border-slate-100 space-y-2 mb-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium flex items-center"><Calendar className="h-3 w-3 mr-1"/> Hearing</span>
                  <span className="font-bold text-slate-900">{motion.hearingDate}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Opposition Due</span>
                  <span className="font-mono text-slate-600">{motion.oppositionDueDate}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Reply Due</span>
                  <span className="font-mono text-slate-600">{motion.replyDueDate}</span>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button size="sm" variant="outline" className="flex-1" icon={GitGraph} onClick={() => handleAddToWorkflow(motion)}>To Workflow</Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => handleMotionDetailView(motion.id)}>Details</Button>
            </div>
          </div>
        ))}
        {motions.length === 0 && (
          <div className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-lg">No active motions.</div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Draft New Motion">
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Motion Type</label>
            <select 
              className="w-full px-3 py-2 border rounded-md text-sm bg-white"
              value={newMotion.type}
              onChange={(e) => setNewMotion({...newMotion, type: e.target.value as MotionType})}
            >
              <option value="Dismiss">Motion to Dismiss</option>
              <option value="Summary Judgment">Summary Judgment</option>
              <option value="Compel Discovery">Compel Discovery</option>
              <option value="In Limine">Motion In Limine</option>
              <option value="Continuance">Motion for Continuance</option>
            </select>
          </div>
          
          <Input 
            label="Title" 
            placeholder="e.g. Motion to Dismiss Count III"
            value={newMotion.title || ''}
            onChange={(e) => setNewMotion({...newMotion, title: e.target.value})}
          />

          {docketEntries.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                <LinkIcon className="h-3 w-3 inline mr-1" />
                Link to PACER Docket Entry (Optional)
              </label>
              <select 
                className="w-full px-3 py-2 border rounded-md text-sm bg-white"
                value={newMotion.docketEntryId || ''}
                onChange={(e) => {
                  const entryId = e.target.value;
                  const entry = docketEntries.find(d => d.id === entryId);
                  setNewMotion({
                    ...newMotion, 
                    docketEntryId: entryId || undefined,
                    pacerDocLink: entry?.docLink
                  });
                }}
              >
                <option value="">No Link</option>
                {docketEntries
                  .filter(d => d.documentType?.toLowerCase().includes('motion') || d.text.toLowerCase().includes('motion'))
                  .map(entry => (
                    <option key={entry.id} value={entry.id}>
                      Entry #{entry.entryNumber} - {entry.dateFiled} - {entry.text.substring(0, 60)}...
                    </option>
                  ))}
              </select>
              {newMotion.pacerDocLink && (
                <a 
                  href={newMotion.pacerDocLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  View in PACER
                </a>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Hearing Date (Optional)</label>
            <input 
              type="date"
              className="w-full px-3 py-2 border rounded-md text-sm bg-white"
              value={newMotion.hearingDate || ''}
              onChange={(e) => setNewMotion({...newMotion, hearingDate: e.target.value})}
            />
            {newMotion.hearingDate && (
              <div className="mt-2 text-xs text-blue-600 flex items-center gap-4 bg-blue-50 p-2 rounded">
                <span><Clock className="h-3 w-3 inline mr-1"/> Opp: {newMotion.oppositionDueDate}</span>
                <span><Clock className="h-3 w-3 inline mr-1"/> Reply: {newMotion.replyDueDate}</span>
              </div>
            )}
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex items-start gap-3">
            <Wand2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5"/>
            <div>
              <h4 className="text-sm font-bold text-indigo-900">AI Strategy Assistance</h4>
              <p className="text-xs text-indigo-700 mt-1 mb-2">Gemini can analyze case facts and local rules to suggest arguments for this motion.</p>
              <button 
                onClick={handleGenerateStrategy}
                disabled={isGenerating || !newMotion.title}
                className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {isGenerating ? 'Analyzing Case Law...' : 'Generate Arguments'}
              </button>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} icon={ArrowRight}>Create Draft</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
