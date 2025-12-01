export interface EscalationRule {
  id: string;
  taskId: string;
  triggerAfterHours: number;
  escalateTo: string;
  notifyOriginalAssignee: boolean;
  reason?: string;
}

export interface EscalationHistory {
  taskId: string;
  escalatedFrom: string;
  escalatedTo: string;
  escalatedAt: Date;
  reason: string;
  resolved: boolean;
}
