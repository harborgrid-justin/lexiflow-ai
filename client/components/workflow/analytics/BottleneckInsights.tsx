import React from 'react';
import { AlertTriangle, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';
import type { BottleneckAnalysis } from '../../../types/workflow-engine';
import { Badge } from '../../common/Badge';
import { CollapsibleSection } from './CollapsibleSection';

interface BottleneckInsightsProps {
  bottlenecks: BottleneckAnalysis | null;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigateToTask?: (taskId: string) => void;
}

export const BottleneckInsights: React.FC<BottleneckInsightsProps> = ({
  bottlenecks,
  isExpanded,
  onToggle,
  onNavigateToTask,
}) => (
  <CollapsibleSection
    title="Bottleneck Analysis"
    icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
    isExpanded={isExpanded}
    onToggle={onToggle}
    badge={
      bottlenecks?.blockedTasks.length ? (
        <Badge variant="error">{bottlenecks.blockedTasks.length} Blocked</Badge>
      ) : undefined
    }
  >
    <div className="p-4 space-y-6">
      {bottlenecks?.slowestStages.length ? (
        <section>
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" /> Slowest Stages
          </h4>
          <div className="space-y-2">
            {bottlenecks.slowestStages.slice(0, 3).map((stage) => (
              <div key={stage.stageId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-700">{stage.name}</span>
                <span className="text-sm font-bold text-slate-900">{stage.avgDays} days avg</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {bottlenecks?.blockedTasks?.length ? (
        <section>
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" /> Blocked Tasks
          </h4>
          <div className="space-y-2">
            {bottlenecks.blockedTasks.map((task) => (
              <button
                type="button"
                key={task.taskId}
                className="w-full flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100 text-left hover:bg-red-100 transition-colors"
                onClick={() => onNavigateToTask?.(task.taskId)}
              >
                <div>
                  <span className="text-sm font-medium text-red-900">{task.title}</span>
                  <p className="text-xs text-red-600">Blocked by {task.blockedBy?.length || 0} task(s)</p>
                </div>
                <ArrowRight className="h-4 w-4 text-red-400" />
              </button>
            ))}
          </div>
        </section>
      ) : (
        <div className="text-center py-4 text-slate-500">
          <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
          <p className="text-sm">No blocked tasks</p>
        </div>
      )}

      {bottlenecks?.overloadedUsers?.length ? (
        <section>
          <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" /> Overloaded Team Members
          </h4>
          <div className="space-y-2">
            {bottlenecks.overloadedUsers.map((user) => (
              <div key={user.userId} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                <span className="text-sm text-amber-900">{user.userId}</span>
                <Badge variant="warning">{user.taskCount} tasks</Badge>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  </CollapsibleSection>
);
