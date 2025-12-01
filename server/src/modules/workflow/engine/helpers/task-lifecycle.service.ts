// Task Lifecycle Management Service
// Handles task state transitions and lifecycle operations

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkflowTask } from '../../../../models/workflow.model';
import { DependencyService } from '../dependency.service';
import { TimeTrackingService } from '../time-tracking.service';
import { AuditService } from '../audit.service';
import { NotificationService } from '../notification.service';
import { ReassignmentService } from '../reassignment.service';
import { TaskNotFoundError } from '../errors';

@Injectable()
export class TaskLifecycleService {
  private readonly logger = new Logger(TaskLifecycleService.name);

  constructor(
    @InjectModel(WorkflowTask)
    private taskModel: typeof WorkflowTask,
    private dependencyService: DependencyService,
    private timeTrackingService: TimeTrackingService,
    private auditService: AuditService,
    private notificationService: NotificationService,
    private reassignmentService: ReassignmentService,
  ) {}

  async completeTask(
    taskId: string,
    userId: string,
    data?: { comments?: string; context?: Record<string, unknown> },
  ): Promise<void> {
    const task = await this.getTaskOrThrow(taskId);

    // Stop any active timers
    this.timeTrackingService.stopTimer(taskId, userId);

    // Update task status
    const previousStatus = task.status;
    await task.update({
      status: 'done',
      completed_date: new Date(),
    });

    // Log the completion
    this.auditService.log('task', taskId, 'completed', userId, {
      previousValue: { status: previousStatus },
      newValue: { status: 'done' },
      metadata: data,
    });
  }

  async startTask(
    taskId: string,
    userId: string,
  ): Promise<{ success: boolean; blockedBy?: string[] }> {
    const task = await this.getTaskOrThrow(taskId);

    // Check dependencies
    const canStart = await this.dependencyService.canStartTask(taskId);
    if (!canStart.canStart) {
      return {
        success: false,
        blockedBy: canStart.blockedBy,
      };
    }

    // Update task status
    await task.update({
      status: 'in_progress',
      started_date: new Date(),
    });

    // Start time tracking
    this.timeTrackingService.startTimer(taskId, userId);

    // Audit
    this.auditService.log('task', taskId, 'started', userId);

    return { success: true };
  }

  async assignTask(
    taskId: string,
    assigneeId: string,
    assignedBy: string,
    reason?: string,
  ): Promise<{ success: boolean; reassigned: boolean }> {
    const task = await this.getTaskOrThrow(taskId);

    const wasAssigned = !!task.assigned_to;

    if (wasAssigned) {
      // Use reassignment service for existing assignments
      await this.reassignmentService.reassignTask(
        taskId,
        assigneeId,
        reason || 'Reassigned',
        assignedBy,
      );
      return { success: true, reassigned: true };
    }

    // Direct assignment
    await task.update({ assigned_to: assigneeId });

    this.auditService.log('task', taskId, 'assigned', assignedBy, {
      newValue: { assigned_to: assigneeId },
    });

    await this.notificationService.create(
      'task_assigned',
      assigneeId,
      'New Task Assigned',
      'A task has been assigned to you',
      { taskId, caseId: task.case_id },
    );

    return { success: true, reassigned: false };
  }

  async pauseTask(taskId: string, userId: string, reason?: string): Promise<void> {
    const task = await this.getTaskOrThrow(taskId);
    
    if (task.status === 'in_progress') {
      this.timeTrackingService.stopTimer(taskId, userId, reason || 'Task paused');
      
      this.auditService.log('task', taskId, 'paused', userId, {
        metadata: { reason },
      });
    }
  }

  async resumeTask(taskId: string, userId: string): Promise<void> {
    const task = await this.getTaskOrThrow(taskId);
    
    if (task.status === 'in_progress') {
      this.timeTrackingService.startTimer(taskId, userId);
      
      this.auditService.log('task', taskId, 'resumed', userId);
    }
  }

  async createTaskFromTemplate(
    stageId: string,
    caseId: string,
    template: Record<string, unknown>,
  ): Promise<WorkflowTask> {
    const task = await this.taskModel.create({
      case_id: caseId,
      stage_id: stageId,
      name: (template.name as string) || 'New Task',
      description: template.description as string,
      status: 'pending',
      priority: (template.priority as string) || 'Medium',
      assigned_to: template.assignee as string,
      due_date: template.dueDate as Date,
    });

    this.auditService.log('task', task.id, 'created', 'system', {
      metadata: { source: 'template', stageId },
    });

    return task;
  }

  private async getTaskOrThrow(taskId: string): Promise<WorkflowTask> {
    const task = await this.taskModel.findByPk(taskId);
    if (!task) {
      throw new TaskNotFoundError(taskId);
    }
    return task;
  }
}
