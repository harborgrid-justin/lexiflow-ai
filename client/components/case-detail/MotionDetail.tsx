/**
 * MotionDetail Component
 *
 * ENZYME MIGRATION - Agent 26 - December 2, 2025
 *
 * Displays detailed view of a specific motion with timeline, AI analysis, drafts, and workflow status.
 *
 * Enzyme Features Implemented:
 * - useTrackEvent: Tracks user interactions (AI analysis, export, navigation, task actions)
 * - useLatestCallback: Stable callbacks for all action handlers
 * - useIsMounted: Available for safe async operations
 *
 * Analytics Events:
 * - motion_detail_back_clicked: Navigation back to motions list
 * - motion_detail_ai_analysis_clicked: AI analysis button engagement
 * - motion_detail_export_clicked: Export bundle action
 * - motion_detail_add_task_clicked: Task creation action
 * - motion_detail_document_opened: Document/draft viewing (tracks documentName)
 *
 * Migration Notes:
 * - Component is presentational with action buttons requiring tracking
 * - No async data fetching (data passed via props), so no isMounted guards needed yet
 * - Static AI analysis content displayed, could be enhanced with real AI integration
 * - Document open handlers created for tracking (currently placeholder logic)
 */

import React from 'react';
import { ArrowLeft, Calendar, FileText, Gavel, User, CheckCircle, Clock, AlertCircle, Wand2, Download, Plus } from 'lucide-react';
import { Motion } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import {
  useLatestCallback,
  useTrackEvent,
  useIsMounted
} from '../../enzyme';

interface MotionDetailProps {
  motion: Motion;
  onBack: () => void;
}

export const MotionDetail: React.FC<MotionDetailProps> = ({ motion, onBack }) => {
  const trackEvent = useTrackEvent();

  // Handler: Back navigation with tracking
  const handleBack = useLatestCallback(() => {
    trackEvent('motion_detail_back_clicked', {
      motionId: motion.id,
      motionType: motion.type,
      motionStatus: motion.status
    });
    onBack();
  });

  // Handler: AI Analysis with tracking
  const handleAIAnalysis = useLatestCallback(() => {
    trackEvent('motion_detail_ai_analysis_clicked', {
      motionId: motion.id,
      motionType: motion.type,
      motionStatus: motion.status,
      hasHearingDate: !!motion.hearingDate
    });
    // TODO: Implement AI analysis modal/panel
    console.log('AI Analysis clicked for motion:', motion.id);
  });

  // Handler: Export Bundle with tracking
  const handleExportBundle = useLatestCallback(() => {
    trackEvent('motion_detail_export_clicked', {
      motionId: motion.id,
      motionType: motion.type,
      motionStatus: motion.status,
      hasHearingDate: !!motion.hearingDate,
      hasFiling: !!motion.filingDate
    });
    // TODO: Implement export bundle logic
    console.log('Export Bundle clicked for motion:', motion.id);
  });

  // Handler: Add Task with tracking
  const handleAddTask = useLatestCallback(() => {
    trackEvent('motion_detail_add_task_clicked', {
      motionId: motion.id,
      motionType: motion.type,
      motionStatus: motion.status
    });
    // TODO: Implement add task modal
    console.log('Add Task clicked for motion:', motion.id);
  });

  // Handler: Document open with tracking
  const handleDocumentOpen = useLatestCallback((documentName: string) => {
    trackEvent('motion_detail_document_opened', {
      motionId: motion.id,
      motionType: motion.type,
      documentName
    });
    // TODO: Implement document open logic
    console.log('Document opened:', documentName);
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleBack} icon={ArrowLeft}>Back</Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900">{motion.title}</h2>
            <Badge variant={
              motion.status === 'Decided' ? 'success' :
              motion.status === 'Hearing Set' ? 'warning' :
              motion.status === 'Filed' ? 'info' : 'neutral'
            }>
              {motion.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
            <span className="flex items-center"><Gavel className="h-4 w-4 mr-1"/> {motion.type}</span>
            <span className="flex items-center"><User className="h-4 w-4 mr-1"/> {motion.assignedAttorney || 'Unassigned'}</span>
            <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded">{motion.id}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={Download} onClick={handleExportBundle}>Export Bundle</Button>
          <Button variant="primary" icon={Wand2} onClick={handleAIAnalysis}>AI Analysis</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Timeline / Dates */}
          <Card title="Critical Dates">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <p className="text-xs text-slate-500 font-medium uppercase mb-1">Filing Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500"/>
                  <span className="font-semibold text-slate-900">{motion.filingDate || 'Not Filed'}</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <p className="text-xs text-slate-500 font-medium uppercase mb-1">Opposition Due</p>
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500"/>
                  <span className="font-semibold text-slate-900">{motion.oppositionDueDate || 'TBD'}</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-100">
                <p className="text-xs text-slate-500 font-medium uppercase mb-1">Reply Due</p>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-500"/>
                  <span className="font-semibold text-slate-900">{motion.replyDueDate || 'TBD'}</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded border border-blue-100">
                <p className="text-xs text-blue-600 font-bold uppercase mb-1">Hearing Date</p>
                <div className="flex items-center gap-2">
                  <Gavel className="h-4 w-4 text-blue-600"/>
                  <span className="font-bold text-blue-900">{motion.hearingDate || 'Not Set'}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Strategy Analysis */}
          <Card title="AI Strategy Analysis" className="border-purple-100">
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <h4 className="font-bold text-purple-900 flex items-center gap-2 mb-2">
                  <Wand2 className="h-4 w-4"/> Strengths & Weaknesses
                </h4>
                <p className="text-sm text-purple-800 leading-relaxed">
                  Based on recent rulings in this jurisdiction, the motion has a strong probability of success regarding the retaliation claim (Count II). However, the argument for dismissal of the discrimination claim (Count I) is weaker due to factual disputes that may require discovery.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Recommended Citations</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-600 p-2 hover:bg-slate-50 rounded cursor-pointer">
                    <FileText className="h-4 w-4 text-slate-400 mt-0.5"/>
                    <span><em>Smith v. Corp Inc.</em>, 452 F.3d 112 (2023) - Establishing standard for pretext in retaliation.</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-600 p-2 hover:bg-slate-50 rounded cursor-pointer">
                    <FileText className="h-4 w-4 text-slate-400 mt-0.5"/>
                    <span><em>Doe v. State</em>, 2022 WL 44551 - Recent application of summary judgment standard.</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Drafting Workspace */}
          <Card title="Drafting Workspace">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-slate-200 rounded hover:border-blue-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded text-blue-600">
                    <FileText className="h-5 w-5"/>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Motion Draft v3.docx</p>
                    <p className="text-xs text-slate-500">Last edited by You • 2 hours ago</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => handleDocumentOpen('Motion Draft v3.docx')}>Open</Button>
              </div>

              <div className="flex items-center justify-between p-3 border border-slate-200 rounded hover:border-blue-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded text-slate-500">
                    <FileText className="h-5 w-5"/>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Proposed Order.docx</p>
                    <p className="text-xs text-slate-500">Last edited by Alexandra H. • Yesterday</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => handleDocumentOpen('Proposed Order.docx')}>Open</Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Status Tracker */}
          <Card title="Workflow Status">
            <div className="relative pl-4 border-l-2 border-slate-200 space-y-6 my-2">
              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white ring-1 ring-slate-200"></div>
                <p className="text-sm font-bold text-slate-900">Drafting</p>
                <p className="text-xs text-slate-500">Completed Feb 10</p>
              </div>
              <div className="relative">
                <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ring-1 ring-slate-200 ${motion.status === 'Filed' || motion.status === 'Hearing Set' || motion.status === 'Decided' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                <p className={`text-sm font-bold ${motion.status === 'Filed' || motion.status === 'Hearing Set' || motion.status === 'Decided' ? 'text-slate-900' : 'text-slate-400'}`}>Filing</p>
                {motion.filingDate && <p className="text-xs text-slate-500">{motion.filingDate}</p>}
              </div>
              <div className="relative">
                <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ring-1 ring-slate-200 ${motion.status === 'Hearing Set' || motion.status === 'Decided' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                <p className={`text-sm font-bold ${motion.status === 'Hearing Set' || motion.status === 'Decided' ? 'text-slate-900' : 'text-slate-400'}`}>Hearing</p>
                {motion.hearingDate && <p className="text-xs text-slate-500">{motion.hearingDate}</p>}
              </div>
              <div className="relative">
                <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 border-white ring-1 ring-slate-200 ${motion.status === 'Decided' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                <p className={`text-sm font-bold ${motion.status === 'Decided' ? 'text-slate-900' : 'text-slate-400'}`}>Ruling</p>
              </div>
            </div>
          </Card>

          {/* Tasks */}
          <Card title="Related Tasks">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="mt-0.5"><CheckCircle className="h-4 w-4 text-green-500"/></div>
                <div>
                  <p className="text-sm text-slate-900 line-through text-slate-400">Research precedents</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5"><div className="h-4 w-4 rounded-full border-2 border-slate-300"></div></div>
                <div>
                  <p className="text-sm text-slate-900">Finalize exhibits</p>
                  <p className="text-xs text-red-500">Due Tomorrow</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="mt-0.5"><div className="h-4 w-4 rounded-full border-2 border-slate-300"></div></div>
                <div>
                  <p className="text-sm text-slate-900">Serve opposing counsel</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="w-full text-blue-600 mt-2" icon={Plus} onClick={handleAddTask}>Add Task</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
