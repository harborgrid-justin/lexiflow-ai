// Workflow Orchestrator - Stage Operations Helper
// Handles stage lifecycle and conditional logic

import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkflowStage, WorkflowTask } from '../../../../models/workflow.model';
import { ConditionalService } from '../conditional.service';
import { AuditService } from '../audit.service';
import { NotificationService } from '../notification.service';

@Injectable()
export class StageOperationsHelper {
  private readonly logger = new Logger(StageOperationsHelper.name);

  constructor(
    @InjectModel(WorkflowStage)
    private stageModel: typeof WorkflowStage,
    @InjectModel(WorkflowTask)
    private taskModel: typeof WorkflowTask,
    private conditionalService: ConditionalService,
    private auditService: AuditService,
    private notificationService: NotificationService,
  ) {}

  async evaluateStageConditions(stageId: string, context: Record<string, unknown>): Promise<{ action?: string; value?: unknown; triggered: boolean }> {
    try {
      const result = this.conditionalService.evaluateRule(stageId, context);
      if (result) {
        this.logger.log(`Conditional rule triggered for stage ${stageId}: ${result.action}`);
        await this.executeConditionalAction(stageId, result.action, result.value);
        return { action: result.action, value: result.value, triggered: true };
      }
      return { triggered: false };
    } catch (error) {
      this.logger.error(`Error evaluating conditions for stage ${stageId}`, error);
      return { triggered: false };
    }
  }

  async checkStageCompletion(stageId: string): Promise<boolean> {
    const pendingTasks = await this.taskModel.count({
      where: { stage_id: stageId, status: ['pending', 'in_progress'] },
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

  async skipStage(stageId: string): Promise<void> {
    const stage = await this.stageModel.findByPk(stageId);
    if (stage) {
      await stage.update({ status: 'skipped' });
      await this.taskModel.update({ status: 'skipped' }, { where: { stage_id: stageId } });
      this.auditService.log('stage', stageId, 'skipped', 'system', { metadata: { reason: 'Conditional rule triggered' } });
    }
  }

  async createTaskFromTemplate(stageId: string, template: Record<string, unknown>): Promise<WorkflowTask> {
    const stage = await this.stageModel.findByPk(stageId);
    if (!stage) {throw new Error(`Stage not found: ${stageId}`);}
    const task = await this.taskModel.create({
      case_id: stage.case_id,
      stage_id: stageId,
      name: (template.name as string) || 'New Task',
      description: template.description as string,
      status: 'pending',
      priority: (template.priority as string) || 'Medium',
      assigned_to: template.assignee as string,
      due_date: template.dueDate as Date,
    });
    this.auditService.log('task', task.id, 'created', 'system', { metadata: { source: 'conditional_rule', stageId } });
    return task;
  }

  private async executeConditionalAction(stageId: string, action: string, value: unknown): Promise<void> {
    switch (action) {
      case 'skipStage':
        await this.skipStage(stageId);
        break;
      case 'addTask':
        if (typeof value === 'object' && value !== null) {
          await this.createTaskFromTemplate(stageId, value as Record<string, unknown>);
        }
        break;
      case 'assignTo':
        if (typeof value === 'string') {
          const tasks = await this.taskModel.findAll({ where: { stage_id: stageId, status: 'pending' } });
          for (const task of tasks) {await task.update({ assigned_to: value });}
        }
        break;
      case 'setPriority':
        if (typeof value === 'string') {
          await this.taskModel.update({ priority: value }, { where: { stage_id: stageId } });
        }
        break;
      case 'notify':
        if (typeof value === 'object' && value !== null) {
          const notifyConfig = value as { userId: string; message: string };
          await this.notificationService.create('stage_completed', notifyConfig.userId, 'Stage Notification', notifyConfig.message);
        }
        break;
      default:
        this.logger.warn(`Unknown conditional action: ${action}`);
    }
  }
}
