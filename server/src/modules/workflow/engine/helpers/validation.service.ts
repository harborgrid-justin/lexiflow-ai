// Workflow Validation Service
// Validates task and stage operations

import { Injectable, Logger } from '@nestjs/common';
import { WorkflowTask } from '../../../../models/workflow.model';
import { DependencyService } from '../dependency.service';
import { ApprovalService } from '../approval.service';
import { WorkflowEngineError, DependencyError } from '../errors';

@Injectable()
export class ValidationService {
  private readonly logger = new Logger(ValidationService.name);

  constructor(
    private dependencyService: DependencyService,
    private approvalService: ApprovalService,
  ) {}

  async validateTaskCompletion(
    task: WorkflowTask,
    userId: string,
  ): Promise<void> {
    // Check approval requirements
    const approval = this.approvalService.getChain(task.id);
    if (approval && approval.status !== 'approved') {
      throw new WorkflowEngineError(
        'Task requires approval before completion',
        'APPROVAL_REQUIRED',
        { taskId: task.id, approvalStatus: approval.status },
      );
    }

    // Check if user is authorized
    if (task.assigned_to && task.assigned_to !== userId) {
      this.logger.warn(
        `User ${userId} completing task ${task.id} assigned to ${task.assigned_to}`,
      );
    }

    // Check dependencies
    const canComplete = await this.dependencyService.canStartTask(task.id);
    if (!canComplete.canStart) {
      throw new DependencyError(
        task.id,
        canComplete.blockedBy || [],
      );
    }
  }

  async validateTaskStart(taskId: string): Promise<{ canStart: boolean; blockedBy?: string[] }> {
    return this.dependencyService.canStartTask(taskId);
  }
}
