// Stage Management Service
// Handles workflow stage operations and transitions

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkflowStage, WorkflowTask } from '../../../../models/workflow.model';
import { AuditService } from '../audit.service';
import { TimeTrackingService } from '../time-tracking.service';
import { ReassignmentService } from '../reassignment.service';

@Injectable()
export class StageManagementService {
  private readonly logger = new Logger(StageManagementService.name);

  constructor(
    @InjectModel(WorkflowStage)
    private stageModel: typeof WorkflowStage,
    @InjectModel(WorkflowTask)
    private taskModel: typeof WorkflowTask,
    private auditService: AuditService,
    private timeTrackingService: TimeTrackingService,
    private reassignmentService: ReassignmentService,
  ) {}

  async getStageOrThrow(stageId: string): Promise<WorkflowStage> {
    const stage = await this.stageModel.findByPk(stageId);
    if (!stage) {
      throw new Error(`Stage ${stageId} not found`);
    }
    return stage;
  }

  async getTasksForStage(stageId: string): Promise<WorkflowTask[]> {
    return this.taskModel.findAll({
      where: { stage_id: stageId },
    });
  }

  async checkStageCompletion(stageId: string): Promise<boolean> {
    const pendingTasks = await this.taskModel.count({
      where: {
        stage_id: stageId,
        status: ['pending', 'in_progress'],
      },
    });

    if (pendingTasks === 0) {
      const stage = await this.stageModel.findByPk(stageId);
      if (stage && stage.status !== 'completed') {
        await stage.update({ status: 'completed' });
        this.auditService.log('stage', stageId, 'completed', 'system');
        return true;
      }
    }

    return false;
  }

  async skipStage(stageId: string, reason?: string): Promise<void> {
    const stage = await this.stageModel.findByPk(stageId);
    if (stage) {
      await stage.update({ status: 'skipped' });

      // Mark all tasks in stage as skipped
      await this.taskModel.update(
        { status: 'skipped' },
        { where: { stage_id: stageId } },
      );

      this.auditService.log('stage', stageId, 'skipped', 'system', {
        metadata: { reason: reason || 'Conditional rule triggered' },
      });
    }
  }

  async pauseStage(stageId: string, reason?: string): Promise<void> {
    const tasks = await this.getTasksForStage(stageId);
    
    for (const task of tasks) {
      if (task.status === 'in_progress') {
        this.timeTrackingService.stopTimer(task.id, 'system', reason || 'Stage paused');
      }
    }

    this.auditService.log('stage', stageId, 'paused', 'system', {
      metadata: { reason, taskCount: tasks.length },
    });
  }

  async resumeStage(stageId: string): Promise<void> {
    const tasks = await this.getTasksForStage(stageId);
    
    for (const task of tasks) {
      if (task.status === 'in_progress') {
        this.timeTrackingService.startTimer(task.id, 'system');
      }
    }

    this.auditService.log('stage', stageId, 'resumed', 'system', {
      metadata: { taskCount: tasks.length },
    });
  }

  async bulkAssignStage(
    stageId: string,
    assignments: Array<{taskId: string, userId: string}>,
  ): Promise<void> {
    for (const assignment of assignments) {
      await this.reassignmentService.reassignTask(
        assignment.taskId,
        assignment.userId,
        'system',
        'bulk_assignment',
      );
    }

    this.auditService.log('stage', stageId, 'bulk_assigned', 'system', {
      metadata: { assignments },
    });
  }

  async initiateStageTransition(
    fromStageId: string,
    toStageId: string,
    context: Record<string, unknown>,
  ): Promise<void> {
    this.auditService.log('stage', fromStageId, 'transition', 'system', {
      metadata: { toStageId, context },
    });
  }

  async initializeStage(
    stageId: string,
    context: Record<string, unknown> = {},
    config: {
      enableSLA?: boolean;
      enableApprovals?: boolean;
      enableParallel?: boolean;
      enableConditional?: boolean;
      enableRecurring?: boolean;
      enableIntegrations?: boolean;
    } = {},
  ): Promise<void> {
    const _stage = await this.getStageOrThrow(stageId);
    
    // Initialize features with logging
    if (config.enableSLA !== false) {
      this.logger.debug(`SLA initialization for stage ${stageId}`);
    }

    if (config.enableApprovals !== false) {
      this.logger.debug(`Approvals initialization for stage ${stageId}`);
    }

    if (config.enableParallel !== false) {
      this.logger.debug(`Parallel groups initialization for stage ${stageId}`);
    }

    if (config.enableConditional !== false) {
      this.logger.debug(`Conditional rules initialization for stage ${stageId}`);
    }

    if (config.enableRecurring !== false) {
      this.logger.debug(`Recurring tasks initialization for stage ${stageId}`);
    }

    if (config.enableIntegrations !== false) {
      this.logger.debug(`Integrations initialization for stage ${stageId}`);
    }

    this.auditService.log('stage', stageId, 'initialized', 'system', {
      metadata: { config, context },
    });
  }
}
