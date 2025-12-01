export interface WorkflowMetrics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  avgCompletionTime: number;
  slaCompliance: number;
}

export interface TaskBottleneck {
  taskId: string;
  taskName: string;
  avgTimeInStage: number;
  currentWaitTime: number;
  assignee?: string;
}
