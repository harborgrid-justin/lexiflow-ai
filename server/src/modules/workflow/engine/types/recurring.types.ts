export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface RecurringWorkflow {
  id: string;
  workflowId: string;
  pattern: RecurrencePattern;
  startDate: Date;
  endDate?: Date;
  nextRun: Date;
  lastRun?: Date;
  active: boolean;
}
