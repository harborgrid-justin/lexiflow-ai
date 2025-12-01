// SLA Management Service
// Configurable SLA rules with warning and breach detection

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { WorkflowTask } from '../../../models/workflow.model';
import { SLARule, SLAStatus } from './types';
import { InMemoryStore, generateId } from './store';
import { TaskNotFoundError } from './errors';

@Injectable()
export class SLAService {
  private rules = new InMemoryStore<SLARule>();

  constructor(
    @InjectModel(WorkflowTask)
    private taskModel: typeof WorkflowTask,
  ) {
    this.initializeDefaultRules();
  }

  private initializeDefaultRules(): void {
    const defaults: SLARule[] = [
      {
        id: 'sla-critical',
        name: 'Critical Priority',
        priority: 'Critical',
        warningHours: 4,
        breachHours: 8,
        autoNotify: true,
      },
      {
        id: 'sla-high',
        name: 'High Priority',
        priority: 'High',
        warningHours: 24,
        breachHours: 48,
        autoNotify: true,
      },
      {
        id: 'sla-medium',
        name: 'Medium Priority',
        priority: 'Medium',
        warningHours: 72,
        breachHours: 120,
        autoNotify: true,
      },
      {
        id: 'sla-low',
        name: 'Low Priority',
        priority: 'Low',
        warningHours: 168,
        breachHours: 336,
        autoNotify: false,
      },
    ];

    defaults.forEach(rule => this.rules.set(rule.id, rule));
  }

  setRule(rule: SLARule): SLARule {
    if (!rule.id) {
      rule.id = generateId('sla');
    }
    this.rules.set(rule.id, rule);
    return rule;
  }

  getRule(id: string): SLARule | undefined {
    return this.rules.get(id);
  }

  getRuleForPriority(priority: string): SLARule | undefined {
    const priorityMap: Record<string, string> = {
      critical: 'sla-critical',
      high: 'sla-high',
      medium: 'sla-medium',
      low: 'sla-low',
    };
    return this.rules.get(priorityMap[priority.toLowerCase()] || 'sla-medium');
  }

  getAllRules(): SLARule[] {
    return this.rules.values();
  }

  async getTaskSLAStatus(taskId: string): Promise<SLAStatus> {
    const task = await this.taskModel.findByPk(taskId);
    if (!task) {
      throw new TaskNotFoundError(taskId);
    }

    if (task.status === 'done') {
      return { status: 'ok' };
    }

    const rule = this.getRuleForPriority(task.priority || 'medium');
    if (!rule || !task.due_date) {
      return { status: 'ok', rule };
    }

    const now = new Date();
    const dueDate = new Date(task.due_date);
    const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilDue < 0) {
      return {
        status: 'breached',
        rule,
        hoursOverdue: Math.abs(hoursUntilDue),
      };
    }

    if (hoursUntilDue <= rule.warningHours) {
      return {
        status: 'warning',
        rule,
        hoursRemaining: hoursUntilDue,
      };
    }

    return { status: 'ok', rule, hoursRemaining: hoursUntilDue };
  }

  async checkBreaches(caseId?: string): Promise<{
    warnings: WorkflowTask[];
    breaches: WorkflowTask[];
  }> {
    const whereClause: any = { status: { [Op.ne]: 'done' } };
    if (caseId) {
      whereClause.case_id = caseId;
    }

    const tasks = await this.taskModel.findAll({ where: whereClause });
    const warnings: WorkflowTask[] = [];
    const breaches: WorkflowTask[] = [];

    for (const task of tasks) {
      const status = await this.getTaskSLAStatus(task.id);
      if (status.status === 'warning') {
        warnings.push(task);
      } else if (status.status === 'breached') {
        breaches.push(task);
        task.sla_warning = true;
        await task.save();
      }
    }

    return { warnings, breaches };
  }

  async getOverdueTasks(caseId?: string): Promise<WorkflowTask[]> {
    const { breaches } = await this.checkBreaches(caseId);
    return breaches;
  }
}
