// Reassignment Service
// Handles task reassignment with rules and history

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkflowTask } from '../../../models/workflow.model';
import { ReassignmentRule, ReassignmentHistory } from './types';
import { InMemoryStore } from './store';
import { AuditService } from './audit.service';
import { NotificationService } from './notification.service';

@Injectable()
export class ReassignmentService {
  private rules = new InMemoryStore<ReassignmentRule>();
  private historyStore = new InMemoryStore<ReassignmentHistory>();

  constructor(
    @InjectModel(WorkflowTask)
    private taskModel: typeof WorkflowTask,
    private auditService: AuditService,
    private notificationService: NotificationService,
  ) {}

  createRule(rule: Omit<ReassignmentRule, 'id'>): ReassignmentRule {
    this.validateRule(rule);
    const fullRule: ReassignmentRule = {
      ...rule,
      id: this.generateId(),
    };
    this.rules.set(fullRule.id, fullRule);
    return fullRule;
  }

  async reassignTask(
    taskId: string,
    newAssigneeId: string,
    reason: string,
    reassignedBy: string,
  ): Promise<boolean> {
    const task = await this.taskModel.findByPk(taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    const oldAssigneeId = task.assigned_to;

    // Check reassignment rules
    const canReassign = this.checkReassignmentRules(task, newAssigneeId);
    if (!canReassign.allowed) {
      throw new Error(canReassign.reason || 'Reassignment not allowed');
    }

    // Update task
    await task.update({ assigned_to: newAssigneeId });

    // Record history
    const historyEntry: ReassignmentHistory = {
      id: this.generateId(),
      taskId,
      fromUserId: oldAssigneeId || undefined,
      toUserId: newAssigneeId,
      reason,
      reassignedBy,
      timestamp: new Date(),
    };
    this.historyStore.set(historyEntry.id, historyEntry);

    // Audit log
    this.auditService.log(
      'task',
      taskId,
      'reassigned',
      reassignedBy,
      {
        previousValue: { assigned_to: oldAssigneeId },
        newValue: { assigned_to: newAssigneeId },
        metadata: { reason },
      },
    );

    // Notify users
    if (oldAssigneeId) {
      await this.notificationService.create(
        'task_assigned',
        oldAssigneeId,
        'Task Reassigned',
        `Task reassigned from you: ${reason}`,
        { taskId },
      );
    }

    await this.notificationService.create(
      'task_assigned',
      newAssigneeId,
      'Task Assigned',
      'New task assigned to you',
      { taskId },
    );

    return true;
  }

  getTaskHistory(taskId: string): ReassignmentHistory[] {
    return this.historyStore.filter(h => h.taskId === taskId);
  }

  getUserReassignments(userId: string): ReassignmentHistory[] {
    return this.historyStore.filter(
      h => h.fromUserId === userId || h.toUserId === userId,
    );
  }

  private checkReassignmentRules(
    task: WorkflowTask,
    newAssigneeId: string,
  ): { allowed: boolean; reason?: string } {
    const taskRules = this.rules.filter(() => true);

    for (const rule of taskRules) {
      // Check blocked users
      if (rule.blockedAssignees?.includes(newAssigneeId)) {
        return { allowed: false, reason: 'User is blocked for this task type' };
      }

      // Check allowed users
      if (
        rule.allowedAssignees &&
        !rule.allowedAssignees.includes(newAssigneeId)
      ) {
        return { allowed: false, reason: 'User not in allowed list' };
      }

      // Check max reassignments
      if (rule.maxReassignments) {
        const count = this.historyStore.filter(h => h.taskId === task.id).length;
        if (count >= rule.maxReassignments) {
          return { allowed: false, reason: 'Max reassignments reached' };
        }
      }
    }

    return { allowed: true };
  }

  private validateRule(rule: Omit<ReassignmentRule, 'id'>): void {
    if (
      !rule.allowedAssignees &&
      !rule.blockedAssignees &&
      !rule.maxReassignments
    ) {
      throw new Error('Rule must have at least one constraint');
    }
  }

  private generateId(): string {
    return `reassign_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}
