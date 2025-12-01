import React from 'react';
import { Activity, AlertTriangle } from 'lucide-react';
import type { WorkflowMetrics } from '../../../types/workflow-engine';
import { Card } from '../../common/Card';
import { getPriorityColor, getStatusColor } from './colorHelpers';

interface TaskDistributionSectionProps {
  metrics: WorkflowMetrics | null;
}

export const TaskDistributionSection: React.FC<TaskDistributionSectionProps> = ({ metrics }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card title="Tasks by Status" action={<Activity className="h-4 w-4 text-slate-400" />}>
      <div className="space-y-3">
        {metrics &&
          Object.entries(metrics.tasksByStatus).map(([status, count]) => (
            <div key={status} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
              <span className="flex-1 text-sm text-slate-600 capitalize">{status.replace('-', ' ')}</span>
              <span className="text-sm font-bold text-slate-900">{count}</span>
            </div>
          ))}
      </div>
    </Card>

    <Card title="Tasks by Priority" action={<AlertTriangle className="h-4 w-4 text-slate-400" />}>
      <div className="space-y-3">
        {metrics &&
          Object.entries(metrics.tasksByPriority).map(([priority, count]) => (
            <div key={priority} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority)}`} />
              <span className="flex-1 text-sm text-slate-600 capitalize">{priority}</span>
              <span className="text-sm font-bold text-slate-900">{count}</span>
            </div>
          ))}
      </div>
    </Card>
  </div>
);
