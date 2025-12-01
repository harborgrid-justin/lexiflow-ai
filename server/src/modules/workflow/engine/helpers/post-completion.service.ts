// Post-Completion Processing Service
// Handles actions after task completion

import { Injectable, Logger } from '@nestjs/common';
import { WorkflowTask } from '../../../../models/workflow.model';
import { ParallelService } from '../parallel.service';
import { EscalationService } from '../escalation.service';
import { ConditionalHandlerService } from './conditional-handler.service';
import { StageManagementService } from './stage-management.service';

@Injectable()
export class PostCompletionService {
  private readonly logger = new Logger(PostCompletionService.name);

  constructor(
    private parallelService: ParallelService,
    private escalationService: EscalationService,
    private conditionalHandlerService: ConditionalHandlerService,
    private stageManagementService: StageManagementService,
  ) {}

  async processPostCompletion(
    task: WorkflowTask,
    context?: Record<string, unknown>,
  ): Promise<{ nextTasks: string[]; actions: string[] }> {
    const nextTasks: string[] = [];
    const actions: string[] = [];

    // Check parallel group completion
    const parallelResult = await this.parallelService.markTaskComplete(task.id);
    if (parallelResult.groupComplete) {
      actions.push('parallel_group_completed');
      if (parallelResult.nextTaskId) {
        nextTasks.push(parallelResult.nextTaskId);
      }
    }

    // Evaluate stage conditions
    if (task.stage_id) {
      const conditionResult = await this.conditionalHandlerService.evaluateStageConditions(
        task.stage_id,
        { taskCompleted: task.id, ...context },
      );
      if (conditionResult.triggered && conditionResult.action) {
        actions.push(`conditional:${conditionResult.action}`);
      }
    }

    // Resolve any escalations
    if (this.escalationService.resolveEscalation(task.id)) {
      actions.push('escalation_resolved');
    }

    // Check if stage is complete
    if (task.stage_id) {
      const stageComplete = await this.stageManagementService.checkStageCompletion(task.stage_id);
      if (stageComplete) {
        actions.push('stage_completed');
      }
    }

    return { nextTasks, actions };
  }
}
