// Workflow Orchestrator - Task Operations Helper
// Handles task lifecycle operations (start, complete, assign, validate)

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkflowTask } from '../../../../models/workflow.model';
import { WorkflowEngineError, DependencyError } from '../errors';
import { DependencyService } from '../dependency.service';
import { TimeTrackingService } from '../time-tracking.service';
import { AuditService } from '../audit.service';
import { NotificationService } from '../notification.service';
import { ReassignmentService } from '../reassignment.service';
import { ApprovalService } from '../approval.service';
import { ParallelService } from '../parallel.service';
import { EscalationService } from '../escalation.service';
import { ExternalIntegrationService } from '../external-integration.service';

@Injectable()
export class TaskLifecycleHelper {
  private readonly logger = new Logger(TaskLifecycleHelper.name);

  constructor(
    @InjectModel(WorkflowTask)
    private taskModel: typeof WorkflowTask,
    private dependencyService: DependencyService,
    private timeTrackingService: TimeTrackingService,
    private auditService: AuditService,
    private notificationService: NotificationService,
    private reassignmentService: ReassignmentService,
    private approvalService: ApprovalService,
    private parallelService: ParallelService,
    private escalationService: EscalationService,
    private externalIntegrationService: ExternalIntegrationService,
  ) {}

  async completeTask(
    task: WorkflowTask,
    userId: string,
    data?: { comments?: string; context?: Record<string, unknown> },
  ): Promise<{ nextTasks: string[]; actions: string[] }> {
    await this.validateTaskCompletion(task, userId);
    this.timeTrackingService.stopTimer(task.id, userId);
    const previousStatus = task.status;
    await task.update({ status: 'done', completed_date: new Date() });
    this.auditService.log('task', task.id, 'completed', userId, {
      previousValue: { status: previousStatus },
      newValue: { status: 'done' },
      metadata: data,
    });
    const results = await this.processPostCompletion(task, data?.context);
    this.triggerIntegrationsSafe('task.completed', {
      taskId: task.id,
      userId,
      caseId: task.case_id,
      stageId: task.stage_id,
    });
    return results;
  }

  async startTask(task: WorkflowTask, userId: string): Promise<{ canStart: boolean; blockedBy?: string[] }> {
    const canStart = await this.dependencyService.canStartTask(task.id);
    if (!canStart.canStart) {
      return { canStart: false, blockedBy: canStart.blockedBy };
    }
    await task.update({ status: 'in_progress', started_date: new Date() });
    this.timeTrackingService.startTimer(task.id, userId);
    this.auditService.log('task', task.id, 'started', userId);
    return { canStart: true };
  }

  async assignTask(task: WorkflowTask, assigneeId: string, assignedBy: string, reason?: string): Promise<{ reassigned: boolean }> {
    const wasAssigned = !!task.assigned_to;
    if (wasAssigned) {
      await this.reassignmentService.reassignTask(task.id, assigneeId, reason || 'Reassigned', assignedBy);
      return { reassigned: true };
    }
    await task.update({ assigned_to: assigneeId });
    this.auditService.log('task', task.id, 'assigned', assignedBy, { newValue: { assigned_to: assigneeId } });
    await this.notificationService.create('task_assigned', assigneeId, 'New Task Assigned', 'A task has been assigned to you', { taskId: task.id, caseId: task.case_id });
    return { reassigned: false };
  }

  private async validateTaskCompletion(task: WorkflowTask, userId: string): Promise<void> {
    const approval = this.approvalService.getChain(task.id);
    if (approval && approval.status !== 'approved') {
      throw new WorkflowEngineError('Task requires approval before completion', 'APPROVAL_REQUIRED', { taskId: task.id, approvalStatus: approval.status });
    }
    if (task.assigned_to && task.assigned_to !== userId) {
      this.logger.warn(`User ${userId} completing task ${task.id} assigned to ${task.assigned_to}`);
    }
    const canComplete = await this.dependencyService.canStartTask(task.id);
    if (!canComplete.canStart) {
      throw new DependencyError(task.id, canComplete.blockedBy || []);
    }
  }

  private async processPostCompletion(task: WorkflowTask, context?: Record<string, unknown>): Promise<{ nextTasks: string[]; actions: string[] }> {
    const nextTasks: string[] = [];
    const actions: string[] = [];
    const parallelResult = await this.parallelService.markTaskComplete(task.id);
    if (parallelResult.groupComplete) {
      actions.push('parallel_group_completed');
      if (parallelResult.nextTaskId) nextTasks.push(parallelResult.nextTaskId);
    }
    if (this.escalationService.resolveEscalation(task.id)) actions.push('escalation_resolved');
    return { nextTasks, actions };
  }

  private triggerIntegrationsSafe(event: string, data: Record<string, unknown>): void {
    this.externalIntegrationService.triggerEvent(event, data).catch(error => {
      this.logger.error(`Integration trigger failed for ${event}`, error);
    });
  }
}
