// Escalation Service
// Auto-escalate overdue tasks based on rules

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { WorkflowTask } from '../../../models/workflow.model';
import { EscalationRule, EscalationEvent } from './types';
import { InMemoryStore } from './store';
import { NotificationService } from './notification.service';
import { AuditService } from './audit.service';

@Injectable()
export class EscalationService {
  private rules = new InMemoryStore<EscalationRule>();
  private events = new InMemoryStore<EscalationEvent>();

  constructor(
    @InjectModel(WorkflowTask)
    private taskModel: typeof WorkflowTask,
    private notificationService: NotificationService,
    private auditService: AuditService,
  ) {}

  createRule(rule: Omit<EscalationRule, 'id'>): EscalationRule {
    const fullRule: EscalationRule = {
      ...rule,
      id: this.generateId('rule'),
    };
    this.rules.set(fullRule.id, fullRule);
    return fullRule;
  }

  getRule(ruleId: string): EscalationRule | undefined {
    return this.rules.get(ruleId);
  }

  getAllRules(): EscalationRule[] {
    return this.rules.values();
  }

  deleteRule(ruleId: string): boolean {
    return this.rules.delete(ruleId);
  }

  async checkAndEscalate(): Promise<EscalationEvent[]> {
    const overdueTasks = await this.getOverdueTasks();
    const escalatedEvents: EscalationEvent[] = [];

    for (const task of overdueTasks) {
      const applicable = this.findApplicableRule(task);
      if (!applicable) {continue;}

      const hoursOverdue = this.getHoursOverdue(task);
      if (hoursOverdue < applicable.triggerHoursOverdue) {continue;}

      const existingEvent = this.events.find(
        e => e.taskId === task.id && !e.resolved,
      );
      const currentLevel = existingEvent?.level || 0;

      if (currentLevel >= applicable.maxEscalationLevel) {continue;}

      const event = await this.escalateTask(
        task,
        applicable,
        currentLevel + 1,
      );
      escalatedEvents.push(event);
    }

    return escalatedEvents;
  }

  async escalateTask(
    task: WorkflowTask,
    rule: EscalationRule,
    level: number,
  ): Promise<EscalationEvent> {
    const escalateTo = rule.escalateToUserId || rule.escalateToRole;

    const event: EscalationEvent = {
      id: this.generateId('event'),
      taskId: task.id,
      level,
      escalatedAt: new Date(),
      escalatedTo: escalateTo,
      reason: `Task overdue by ${this.getHoursOverdue(task).toFixed(1)}h`,
      resolved: false,
    };

    this.events.set(event.id, event);

    // Auto-reassign if configured
    if (rule.autoReassign && rule.escalateToUserId) {
      await task.update({ assigned_to: rule.escalateToUserId });
    }

    // Notify escalation target
    await this.notificationService.create(
      'escalation',
      escalateTo,
      'Task Escalated',
      `Task escalated to you (Level ${level}): ${event.reason}`,
      { taskId: task.id, priority: 'urgent' },
    );

    // Notify original assignee if configured
    if (rule.notifyOriginalAssignee && task.assigned_to) {
      await this.notificationService.create(
        'escalation',
        task.assigned_to,
        'Task Escalated',
        `Your task has been escalated (Level ${level})`,
        { taskId: task.id, priority: 'high' },
      );
    }

    // Audit log
    this.auditService.log('task', task.id, 'escalated', 'system', {
      newValue: { level, escalatedTo: escalateTo },
      metadata: { rule: rule.id, reason: event.reason },
    });

    return event;
  }

  resolveEscalation(taskId: string): boolean {
    const event = this.events.find(
      e => e.taskId === taskId && !e.resolved,
    );
    if (!event) {return false;}

    event.resolved = true;
    this.events.set(event.id, event);
    return true;
  }

  getTaskEscalations(taskId: string): EscalationEvent[] {
    return this.events.filter(e => e.taskId === taskId);
  }

  private async getOverdueTasks(): Promise<WorkflowTask[]> {
    const now = new Date();
    return this.taskModel.findAll({
      where: {
        status: { [Op.notIn]: ['done', 'cancelled'] },
        due_date: { [Op.lt]: now },
      },
    });
  }

  private findApplicableRule(_task: WorkflowTask): EscalationRule | undefined {
    return this.rules.values()[0]; // Simplified - use first rule
  }

  private getHoursOverdue(task: WorkflowTask): number {
    if (!task.due_date) {return 0;}
    const now = new Date().getTime();
    const due = new Date(task.due_date).getTime();
    return (now - due) / (1000 * 60 * 60);
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}
