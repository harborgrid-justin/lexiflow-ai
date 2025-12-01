import React from 'react';
import { CheckCircle, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import type { TaskVelocity, WorkflowMetrics } from '../../../types/workflow-engine';
import { MetricCard } from './MetricCard';

interface WorkflowMetricGridProps {
  metrics: WorkflowMetrics | null;
  velocity: TaskVelocity | null;
}

const calculateCompletionRate = (data: WorkflowMetrics | null): number => {
  if (!data || !data.totalTasks) return 0;
  return Math.round((data.completedTasks / data.totalTasks) * 100);
};

export const WorkflowMetricGrid: React.FC<WorkflowMetricGridProps> = ({ metrics, velocity }) => {
  const completionRate = calculateCompletionRate(metrics);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        icon={<CheckCircle className="h-5 w-5" />}
        label="Completion Rate"
        value={`${completionRate}%`}
        subValue={`${metrics?.completedTasks || 0}/${metrics?.totalTasks || 0} tasks`}
        color="green"
      />
      <MetricCard
        icon={<TrendingUp className="h-5 w-5" />}
        label="Velocity"
        value={`${velocity?.velocity || 0}`}
        subValue="tasks/day (7d avg)"
        color="blue"
      />
      <MetricCard
        icon={<AlertTriangle className="h-5 w-5" />}
        label="Overdue"
        value={`${metrics?.overdueTasks || 0}`}
        subValue="tasks overdue"
        color={metrics?.overdueTasks ? 'red' : 'slate'}
      />
      <MetricCard
        icon={<Clock className="h-5 w-5" />}
        label="Avg Completion"
        value={`${metrics?.averageCompletionTime || 0}h`}
        subValue="per task"
        color="purple"
      />
    </div>
  );
};
