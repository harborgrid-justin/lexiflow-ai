import React from 'react';
import type { WorkflowMetrics } from '../../../types/workflow-engine';
import { CollapsibleSection } from './CollapsibleSection';
import { Target } from 'lucide-react';

interface StageProgressSectionProps {
  metrics: WorkflowMetrics | null;
  isExpanded: boolean;
  onToggle: () => void;
}

export const StageProgressSection: React.FC<StageProgressSectionProps> = ({ metrics, isExpanded, onToggle }) => (
  <CollapsibleSection
    title="Stage Progress"
    icon={<Target className="h-5 w-5 text-blue-500" />}
    isExpanded={isExpanded}
    onToggle={onToggle}
  >
    <div className="p-4 space-y-4">
      {metrics?.stageProgress.map((stage, idx) => (
        <div key={stage.stageId} className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
            {idx + 1}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-slate-700">{stage.stageName}</span>
              <span className="text-sm font-bold text-slate-900">{stage.progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  stage.progress === 100
                    ? 'bg-green-500'
                    : stage.progress > 50
                    ? 'bg-blue-500'
                    : stage.progress > 0
                    ? 'bg-amber-500'
                    : 'bg-slate-300'
                }`}
                style={{ width: `${stage.progress}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  </CollapsibleSection>
);
