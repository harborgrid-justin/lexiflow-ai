// Audit Trail Service
// Complete history tracking for all workflow changes

import { Injectable } from '@nestjs/common';
import { AuditLogEntry, AuditEntityType } from './types';
import { generateId } from './store';

@Injectable()
export class AuditService {
  private logs: AuditLogEntry[] = [];
  private readonly maxLogs = 10000;

  log(
    entityType: AuditEntityType,
    entityId: string,
    action: string,
    userId: string,
    options?: {
      previousValue?: any;
      newValue?: any;
      userName?: string;
      metadata?: Record<string, any>;
    },
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      id: generateId('audit'),
      timestamp: new Date(),
      entityType,
      entityId,
      action,
      userId,
      previousValue: options?.previousValue,
      newValue: options?.newValue,
      userName: options?.userName,
      metadata: options?.metadata,
    };

    this.logs.push(entry);

    // Trim old logs if exceeding max
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    return entry;
  }

  getByEntity(entityType: AuditEntityType, entityId: string): AuditLogEntry[] {
    return this.logs
      .filter(e => e.entityType === entityType && e.entityId === entityId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getByUser(userId: string, limit = 100): AuditLogEntry[] {
    return this.logs
      .filter(e => e.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  getByAction(action: string, limit = 100): AuditLogEntry[] {
    return this.logs
      .filter(e => e.action === action)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  getRecent(limit = 100): AuditLogEntry[] {
    return this.logs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  search(
    filters: {
      entityType?: AuditEntityType;
      entityId?: string;
      action?: string;
      userId?: string;
      startDate?: Date;
      endDate?: Date;
    },
    limit = 100,
  ): AuditLogEntry[] {
    return this.logs
      .filter(e => {
        if (filters.entityType && e.entityType !== filters.entityType) {
          return false;
        }
        if (filters.entityId && e.entityId !== filters.entityId) {
          return false;
        }
        if (filters.action && !e.action.includes(filters.action)) {
          return false;
        }
        if (filters.userId && e.userId !== filters.userId) {
          return false;
        }
        if (filters.startDate && e.timestamp < filters.startDate) {
          return false;
        }
        if (filters.endDate && e.timestamp > filters.endDate) {
          return false;
        }
        return true;
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Convenience methods
  logTaskCreated(taskId: string, userId: string, taskData: any): AuditLogEntry {
    return this.log('task', taskId, 'task_created', userId, {
      newValue: taskData,
    });
  }

  logTaskUpdated(
    taskId: string,
    userId: string,
    previousValue: any,
    newValue: any,
  ): AuditLogEntry {
    return this.log('task', taskId, 'task_updated', userId, {
      previousValue,
      newValue,
    });
  }

  logTaskCompleted(taskId: string, userId: string): AuditLogEntry {
    return this.log('task', taskId, 'task_completed', userId);
  }

  logTaskReassigned(
    taskId: string,
    userId: string,
    fromUser: string,
    toUser: string,
  ): AuditLogEntry {
    return this.log('task', taskId, 'task_reassigned', userId, {
      previousValue: { assignee: fromUser },
      newValue: { assignee: toUser },
    });
  }

  logStageAdvanced(
    stageId: string,
    userId: string,
    fromStatus: string,
    toStatus: string,
  ): AuditLogEntry {
    return this.log('stage', stageId, 'stage_advanced', userId, {
      previousValue: { status: fromStatus },
      newValue: { status: toStatus },
    });
  }

  getStats(): {
    totalLogs: number;
    byEntityType: Record<string, number>;
    byAction: Record<string, number>;
  } {
    const byEntityType: Record<string, number> = {};
    const byAction: Record<string, number> = {};

    this.logs.forEach(e => {
      byEntityType[e.entityType] = (byEntityType[e.entityType] || 0) + 1;
      byAction[e.action] = (byAction[e.action] || 0) + 1;
    });

    return {
      totalLogs: this.logs.length,
      byEntityType,
      byAction,
    };
  }
}
