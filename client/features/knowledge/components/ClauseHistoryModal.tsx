/**
 * ClauseHistoryModal - Clause Version History Modal Component
 *
 * Displays clause version history with comparison capabilities.
 *
 * Features:
 * - Side-by-side version comparison
 * - Version timeline view
 * - Analytics tracking for user interactions
 */

import React, { useState } from 'react';
import { History, ArrowLeftRight, X } from 'lucide-react';
import { Badge } from '@/components/common';
import {
  useLatestCallback,
  useTrackEvent,
  useIsMounted,
  HydrationBoundary
} from '@/enzyme';
import type { Clause } from '../api/knowledge.types';

interface ClauseHistoryModalProps {
  clause: Clause;
  onClose: () => void;
}

export const ClauseHistoryModal: React.FC<ClauseHistoryModalProps> = ({ clause, onClose }) => {
  const [compareMode, setCompareMode] = useState(false);
  const isMounted = useIsMounted();
  const trackEvent = useTrackEvent();

  const handleToggleCompareMode = useLatestCallback(() => {
    const newMode = !compareMode;
    setCompareMode(newMode);
    trackEvent('clause_history_compare_toggle', {
      clauseId: clause.id,
      clauseName: clause.name,
      compareMode: newMode
    });
  });

  const handleClose = useLatestCallback(() => {
    if (isMounted()) {
      trackEvent('clause_history_modal_close', {
        clauseId: clause.id,
        wasInCompareMode: compareMode
      });
      onClose();
    }
  });

  const versions = clause.versions || [];
  const hasMultipleVersions = versions.length > 1;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <HydrationBoundary id={`clause-history-${clause.id}`} priority="low" trigger="interaction">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-lg text-slate-900 flex items-center">
              <History className="mr-2 h-5 w-5 text-blue-600" /> 
              History: {clause.name}
            </h3>
            <div className="flex items-center space-x-2">
              {hasMultipleVersions && (
                <button
                  onClick={handleToggleCompareMode}
                  className={`px-3 py-1.5 text-sm font-medium rounded border transition-colors ${
                    compareMode 
                      ? 'bg-blue-100 text-blue-700 border-blue-200' 
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ArrowLeftRight className="h-4 w-4 inline mr-1" /> 
                  {compareMode ? 'Exit Compare' : 'Compare Versions'}
                </button>
              )}
              <button 
                onClick={handleClose}
                className="p-1 hover:bg-slate-100 rounded"
              >
                <X className="h-5 w-5 text-slate-400 hover:text-slate-600" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {compareMode && hasMultipleVersions ? (
              <CompareView versions={versions} />
            ) : (
              <TimelineView versions={versions} />
            )}
          </div>
        </div>
      </HydrationBoundary>
    </div>
  );
};

interface CompareViewProps {
  versions: NonNullable<Clause['versions']>;
}

const CompareView: React.FC<CompareViewProps> = ({ versions }) => (
  <div className="grid grid-cols-2 gap-4 h-full">
    <div className="border rounded-lg p-4 bg-slate-50">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-sm">Version {versions[0].version} (Current)</span>
        <span className="text-xs text-slate-500">{versions[0].date}</span>
      </div>
      <p className="text-sm font-serif leading-relaxed text-slate-800 whitespace-pre-wrap">
        {versions[0].content}
      </p>
    </div>
    <div className="border rounded-lg p-4 bg-white border-slate-200">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-sm">Version {versions[1].version} (Previous)</span>
        <span className="text-xs text-slate-500">{versions[1].date}</span>
      </div>
      <p className="text-sm font-serif leading-relaxed text-slate-600 whitespace-pre-wrap">
        {versions[1].content}
      </p>
    </div>
  </div>
);

interface TimelineViewProps {
  versions: NonNullable<Clause['versions']>;
}

const TimelineView: React.FC<TimelineViewProps> = ({ versions }) => (
  <div className="space-y-4">
    {versions.map((v, idx) => (
      <div 
        key={v.id} 
        className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <Badge variant={idx === 0 ? 'active' : 'inactive'} size="sm" className="mr-2">
              v{v.version}
            </Badge>
            <span className="text-xs text-slate-500">
              Edited by {v.author} on {v.date}
            </span>
          </div>
        </div>
        <p className="text-sm font-serif text-slate-800">{v.content}</p>
        {v.changes && (
          <p className="text-xs text-slate-500 mt-2 italic">Changes: {v.changes}</p>
        )}
      </div>
    ))}
  </div>
);

export default ClauseHistoryModal;
