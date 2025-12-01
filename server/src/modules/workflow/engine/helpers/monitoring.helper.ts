// Workflow Orchestrator - Monitoring Helper
// Handles scheduled checks, analytics, health status

import { Injectable, Logger } from '@nestjs/common';
import { SLAService } from '../sla.service';
import { EscalationService } from '../escalation.service';
import { RecurringService } from '../recurring.service';
import { AnalyticsService } from '../analytics.service';

@Injectable()
export class MonitoringHelper {
  private readonly logger = new Logger(MonitoringHelper.name);

  constructor(
    private slaService: SLAService,
    private escalationService: EscalationService,
    private recurringService: RecurringService,
    private analyticsService: AnalyticsService,
  ) {}

  async runScheduledChecks(): Promise<{
    slaBreaches: number;
    escalations: number;
    recurringProcessed: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let slaBreaches = 0;
    try {
      const breachResult = await this.slaService.checkBreaches();
      slaBreaches = breachResult.breaches.length;
    } catch (error) {
      errors.push(`SLA check failed: ${error}`);
    }

    let escalationCount = 0;
    try {
      const escalations = await this.escalationService.checkAndEscalate();
      escalationCount = escalations.length;
    } catch (error) {
      errors.push(`Escalation check failed: ${error}`);
    }

    let recurringCount = 0;
    try {
      const dueRecurrences = this.recurringService.getDueRecurrences();
      for (const recurring of dueRecurrences) {
        try {
          await this.recurringService.processRecurrence(recurring.id);
          recurringCount++;
        } catch (error) {
          errors.push(`Recurring ${recurring.id} failed: ${error}`);
        }
      }
    } catch (error) {
      errors.push(`Recurring check failed: ${error}`);
    }

    this.logger.log(`Scheduled checks: ${slaBreaches} breaches, ${escalationCount} escalations, ${recurringCount} recurrences, ${errors.length} errors`);
    return { slaBreaches, escalations: escalationCount, recurringProcessed: recurringCount, errors };
  }

  async getCaseWorkflowStatus(caseId: string): Promise<{
    metrics: Awaited<ReturnType<typeof this.analyticsService.getMetrics>>;
    bottlenecks: Awaited<ReturnType<typeof this.analyticsService.getBottlenecks>>;
    velocity: { velocity: number; unit: string };
  }> {
    const [metrics, bottlenecks, velocity] = await Promise.all([
      this.analyticsService.getMetrics(caseId),
      this.analyticsService.getBottlenecks(caseId),
      this.analyticsService.getVelocity(caseId),
    ]);
    return { metrics, bottlenecks, velocity };
  }
}
