export type { WorkflowTask } from '../../../../models/workflow.model';

export interface TaskDependency {
  taskId: string;
  dependsOn: string[];
  type: 'blocking' | 'informational';
}

export interface TaskTimeEntry {
  taskId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  description?: string;
  billable: boolean;
}
