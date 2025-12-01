// Recurring Workflows Service
// Scheduled workflow triggers

import { Injectable, Logger } from '@nestjs/common';
import { RecurringWorkflow, RecurrencePattern } from './types';
import { InMemoryStore } from './store';

@Injectable()
export class RecurringService {
  private readonly logger = new Logger(RecurringService.name);
  private recurring = new InMemoryStore<RecurringWorkflow>();

  createRecurring(
    data: Omit<RecurringWorkflow, 'id' | 'nextRun'>,
  ): RecurringWorkflow {
    const nextRun = this.calculateNextRun(data.pattern, data.cronExpression);

    const workflow: RecurringWorkflow = {
      ...data,
      id: this.generateId(),
      nextRun,
    };

    this.recurring.set(workflow.id, workflow);
    return workflow;
  }

  getRecurring(id: string): RecurringWorkflow | undefined {
    return this.recurring.get(id);
  }

  getAllRecurring(): RecurringWorkflow[] {
    return this.recurring.values();
  }

  getEnabled(): RecurringWorkflow[] {
    return this.recurring.filter(r => r.enabled);
  }

  updateRecurring(
    id: string,
    updates: Partial<RecurringWorkflow>,
  ): RecurringWorkflow | null {
    const existing = this.recurring.get(id);
    if (!existing) {
      return null;
    }

    const updated = { ...existing, ...updates, id: existing.id };

    // Recalculate next run if pattern changed
    if (updates.pattern || updates.cronExpression) {
      updated.nextRun = this.calculateNextRun(
        updated.pattern,
        updated.cronExpression,
      );
    }

    this.recurring.set(id, updated);
    return updated;
  }

  deleteRecurring(id: string): boolean {
    return this.recurring.delete(id);
  }

  getDueRecurrences(): RecurringWorkflow[] {
    const now = new Date();
    return this.recurring.filter(
      r => r.enabled && r.nextRun <= now,
    );
  }

  async processRecurrence(id: string): Promise<{ caseId?: string }> {
    const workflow = this.recurring.get(id);
    if (!workflow) {
      throw new Error(`Recurring workflow not found: ${id}`);
    }

    // Mark as last run and calculate next
    workflow.lastRun = new Date();
    workflow.nextRun = this.calculateNextRun(
      workflow.pattern,
      workflow.cronExpression,
    );
    this.recurring.set(id, workflow);

    // Would create new case/workflow here
    this.logger.log(`Processing recurring: ${workflow.name}`);

    return { caseId: `case_${Date.now()}` };
  }

  toggleEnabled(id: string): boolean {
    const workflow = this.recurring.get(id);
    if (!workflow) {
      return false;
    }

    workflow.enabled = !workflow.enabled;
    if (workflow.enabled) {
      workflow.nextRun = this.calculateNextRun(
        workflow.pattern,
        workflow.cronExpression,
      );
    }
    this.recurring.set(id, workflow);
    return workflow.enabled;
  }

  private calculateNextRun(
    pattern: RecurrencePattern,
    cronExpression?: string,
  ): Date {
    const now = new Date();

    if (pattern === 'custom' && cronExpression) {
      // Simplified cron parsing - would use cron-parser in production
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }

    switch (pattern) {
      case 'daily':
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
      case 'weekly':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case 'monthly': {
        const nextMonth = new Date(now);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        return nextMonth;
      }
      case 'quarterly': {
        const nextQuarter = new Date(now);
        nextQuarter.setMonth(nextQuarter.getMonth() + 3);
        return nextQuarter;
      }
      case 'yearly': {
        const nextYear = new Date(now);
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        return nextYear;
      }
      default:
        return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    }
  }

  private generateId(): string {
    return `recur_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}
