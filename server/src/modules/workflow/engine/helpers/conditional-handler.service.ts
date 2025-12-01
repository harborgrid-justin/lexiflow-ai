// Conditional Rule Handler Service
// Executes conditional branching and routing logic

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkflowTask } from '../../../../models/workflow.model';
import { ConditionalService } from '../conditional.service';
import { NotificationService } from '../notification.service';
import { AuditService } from '../audit.service';
import { StageManagementService } from './stage-management.service';
import { TaskLifecycleService } from './task-lifecycle.service';

@Injectable()
export class ConditionalHandlerService {
  private readonly logger = new Logger(ConditionalHandlerService.name);

  constructor(
    @InjectModel(WorkflowTask)
    private taskModel: typeof WorkflowTask,
    private conditionalService: ConditionalService,
    private notificationService: NotificationService,
    private auditService: AuditService,
    private stageManagementService: StageManagementService,
    private taskLifecycleService: TaskLifecycleService,
  ) {}

  async evaluateStageConditions(
    stageId: string,
    context: Record<string, unknown>,
  ): Promise<{ action?: string; value?: unknown; triggered: boolean }> {
    try {
      const result = this.conditionalService.evaluateRule(stageId, context);

      if (result) {
        this.logger.log(
          `Conditional rule triggered for stage ${stageId}: ${result.action}`,
        );

        await this.executeConditionalAction(stageId, result.action, result.value);

        return { action: result.action, value: result.value, triggered: true };
      }

      return { triggered: false };
    } catch (error) {
      this.logger.error(`Error evaluating conditions for stage ${stageId}`, error);
      return { triggered: false };
    }
  }

  private async executeConditionalAction(
    stageId: string,
    action: string,
    value: unknown,
  ): Promise<void> {
    switch (action) {
      case 'skipStage':
        await this.stageManagementService.skipStage(stageId, 'Conditional rule');
        break;

      case 'addTask': {
        if (typeof value === 'object' && value !== null) {
          const stage = await this.stageManagementService.getStageOrThrow(stageId);
          await this.taskLifecycleService.createTaskFromTemplate(
            stageId,
            stage.case_id,
            value as Record<string, unknown>,
          );
        }
        break;
      }

      case 'assignTo': {
        if (typeof value === 'string') {
          const tasks = await this.taskModel.findAll({
            where: { stage_id: stageId, status: 'pending' },
          });
          for (const task of tasks) {
            await task.update({ assigned_to: value });
          }
        }
        break;
      }

      case 'setPriority': {
        if (typeof value === 'string') {
          await this.taskModel.update(
            { priority: value },
            { where: { stage_id: stageId } },
          );
        }
        break;
      }

      case 'notify': {
        if (typeof value === 'object' && value !== null) {
          const notifyConfig = value as { userId: string; message: string };
          await this.notificationService.create(
            'stage_completed',
            notifyConfig.userId,
            'Stage Notification',
            notifyConfig.message,
          );
        }
        break;
      }

      default:
        this.logger.warn(`Unknown conditional action: ${action}`);
    }
  }
}
