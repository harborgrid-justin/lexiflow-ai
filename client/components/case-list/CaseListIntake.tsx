
import React, { useState, useEffect, useCallback } from 'react';
import { GripVertical, Calendar, Plus, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { ApiService } from '../../services/apiService';
import type { Case } from '../../types';

// Pipeline stages for intake workflow
const PIPELINE_STAGES = ['New Lead', 'Conflict Check', 'Engagement Letter', 'Matter Created'] as const;
type PipelineStage = typeof PIPELINE_STAGES[number];

// Map case status to pipeline stage
const statusToStage = (status: string): PipelineStage => {
  const mapping: Record<string, PipelineStage> = {
    'new': 'New Lead',
    'new_lead': 'New Lead',
    'New Lead': 'New Lead',
    'conflict_check': 'Conflict Check',
    'Conflict Check': 'Conflict Check',
    'engagement': 'Engagement Letter',
    'engagement_letter': 'Engagement Letter',
    'Engagement Letter': 'Engagement Letter',
    'active': 'Matter Created',
    'matter_created': 'Matter Created',
    'Matter Created': 'Matter Created',
  };
  return mapping[status] || 'New Lead';
};

// Map pipeline stage back to case status for API
const stageToStatus = (stage: PipelineStage): string => {
  const mapping: Record<PipelineStage, string> = {
    'New Lead': 'new_lead',
    'Conflict Check': 'conflict_check',
    'Engagement Letter': 'engagement_letter',
    'Matter Created': 'active',
  };
  return mapping[stage];
};

// Format value for display
const formatValue = (value: number | undefined): string => {
  if (!value) return '$0';
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
  return `$${value}`;
};

// Calculate age from date
const calculateAge = (date: string | Date | undefined): string => {
  if (!date) return 'N/A';
  const created = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffDays > 30) return `${Math.floor(diffDays / 30)}mo`;
  if (diffDays > 0) return `${diffDays}d`;
  if (diffHours > 0) return `${diffHours}h`;
  return 'Just now';
};

export const CaseListIntake: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [draggedCaseId, setDraggedCaseId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  // Fetch cases from API
  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedCases = await ApiService.cases.getAll();
      setCases(fetchedCases);
    } catch (err) {
      console.error('Failed to fetch cases:', err);
      setError('Failed to load cases. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedCaseId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (newStage: PipelineStage) => {
    if (draggedCaseId === null) return;

    const caseToUpdate = cases.find(c => c.id === draggedCaseId);
    if (!caseToUpdate) return;

    const currentStage = statusToStage(caseToUpdate.status);
    if (currentStage === newStage) {
      // No change needed
      setDraggedCaseId(null);
      setDragOverStage(null);
      return;
    }

    // Optimistically update UI
    const previousCases = [...cases];
    setCases(prev => prev.map(c =>
      c.id === draggedCaseId ? { ...c, status: stageToStatus(newStage) } : c
    ));

    setDraggedCaseId(null);
    setDragOverStage(null);

    // Persist to database
    try {
      setUpdating(draggedCaseId);
      await ApiService.cases.update(draggedCaseId, {
        status: stageToStatus(newStage)
      });
      console.log(`Case ${draggedCaseId} moved to ${newStage}`);
    } catch (err) {
      console.error('Failed to update case stage:', err);
      // Revert on error
      setCases(previousCases);
      setError('Failed to update case. Please try again.');
      // Clear error after 3 seconds
      setTimeout(() => setError(null), 3000);
    } finally {
      setUpdating(null);
    }
  };

  const handleAddLead = async () => {
    try {
      const newCase = await ApiService.cases.create({
        title: 'New Prospect - Pending Intake',
        client: 'New Prospect',
        status: 'new_lead',
        matterType: 'General',
        value: 0,
      });
      setCases(prev => [...prev, newCase]);
    } catch (err) {
      console.error('Failed to create case:', err);
      setError('Failed to create new lead. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Get cases for a specific stage
  const getCasesForStage = (stage: PipelineStage) => {
    return cases.filter(c => statusToStage(c.status) === stage);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading pipeline...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="font-bold text-slate-900">Pipeline Board</h3>
        <div className="flex items-center gap-4">
          {error && (
            <div className="flex items-center text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </div>
          )}
          <button
            onClick={fetchCases}
            className="text-slate-500 hover:text-blue-600 p-1 rounded transition-colors"
            title="Refresh pipeline"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <p className="text-sm text-slate-500 flex items-center">
            <GripVertical className="h-4 w-4 mr-1"/> Drag cards to move stages
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px] overflow-x-auto pb-4">
        {PIPELINE_STAGES.map((stage, idx) => {
          const stageCases = getCasesForStage(stage);
          return (
            <div
              key={stage}
              className={`flex flex-col rounded-lg p-3 h-full border-2 transition-colors duration-200 ${
                dragOverStage === stage
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-slate-100 border-transparent'
              }`}
              onDragOver={(e) => handleDragOver(e, stage)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(stage)}
            >
              <div className="flex justify-between items-center mb-3 px-1">
                <span className="font-bold text-slate-700 text-sm">{stage}</span>
                <span className="bg-white px-2 py-0.5 rounded-full text-xs font-bold text-slate-500 border border-slate-200">
                  {stageCases.length}
                </span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                {stageCases.map(caseItem => (
                  <div
                    key={caseItem.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, caseItem.id)}
                    className={`bg-white p-3 rounded-lg shadow-sm border cursor-move transition-all duration-200 group ${
                      draggedCaseId === caseItem.id
                        ? 'opacity-50 ring-2 ring-blue-400 rotate-2 scale-95'
                        : updating === caseItem.id
                          ? 'opacity-70 ring-2 ring-yellow-400'
                          : 'border-slate-200 hover:shadow-md hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 line-clamp-1">
                        {caseItem.client || caseItem.title}
                      </h4>
                      {updating === caseItem.id ? (
                        <Loader2 className="h-3 w-3 text-yellow-500 animate-spin" />
                      ) : (
                        <GripVertical className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100"/>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-1">
                      {caseItem.matterType || 'General'}
                    </p>
                    <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-50">
                      <span className="font-mono text-emerald-600 font-medium">
                        {formatValue(caseItem.value)}
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3"/> {calculateAge(caseItem.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
                {stageCases.length === 0 && (
                  <div className="h-24 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 text-xs">
                    Drop items here
                  </div>
                )}
              </div>

              {idx === 0 && (
                <button
                  onClick={handleAddLead}
                  className="mt-3 w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 text-xs font-bold hover:bg-white hover:text-blue-600 hover:border-blue-300 transition-all flex items-center justify-center"
                >
                  <Plus className="h-3 w-3 mr-1"/> Add Lead
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
