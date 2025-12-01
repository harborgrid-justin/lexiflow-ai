export type AuditEntityType = 'task' | 'stage' | 'workflow';

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  entityType: AuditEntityType;
  entityId: string;
  action: string;
  previousValue?: any;
  newValue?: any;
  userId: string;
  userName?: string;
  metadata?: Record<string, any>;
}
