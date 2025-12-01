export type NotificationType =
  | 'task_assigned'
  | 'task_completed'
  | 'task_overdue'
  | 'approval_requested'
  | 'approval_granted'
  | 'approval_denied'
  | 'stage_completed'
  | 'workflow_completed'
  | 'sla_warning'
  | 'sla_breach'
  | 'escalation';

export interface WorkflowNotification {
  id: string;
  type: NotificationType;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  metadata?: Record<string, any>;
}
