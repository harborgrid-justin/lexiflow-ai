import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkflowStage, WorkflowTask } from '../../models/workflow.model';
import { User } from '../../models/user.model';

// Enterprise Engine integration for backward compatibility
// The WorkflowEngineService provides advanced features while this service maintains the original API

@Injectable()
export class WorkflowService {
  constructor(
    @InjectModel(WorkflowStage)
    private workflowStageModel: typeof WorkflowStage,
    @InjectModel(WorkflowTask)
    private workflowTaskModel: typeof WorkflowTask,
  ) {}

  async createStage(createStageData: Partial<WorkflowStage>): Promise<WorkflowStage> {
    return this.workflowStageModel.create(createStageData);
  }

  async createTask(createTaskData: Partial<WorkflowTask>): Promise<WorkflowTask> {
    return this.workflowTaskModel.create(createTaskData);
  }

  async findStages(caseId?: string): Promise<WorkflowStage[]> {
    const whereClause = caseId ? { case_id: caseId } : {};
    return this.workflowStageModel.findAll({
      where: whereClause,
      order: [['order', 'ASC']],
      include: [
        {
          model: WorkflowTask,
          as: 'tasks',
          include: [
            {
              model: User,
              as: 'assignee',
              attributes: ['id', 'first_name', 'last_name', 'email'],
            },
          ],
        },
      ],
    });
  }

  async findTasks(stageId?: string, assigneeId?: string): Promise<WorkflowTask[]> {
    const whereClause: Record<string, string> = {};
    if (stageId) {whereClause.stage_id = stageId;}
    if (assigneeId) {whereClause.assignee_id = assigneeId;}

    return this.workflowTaskModel.findAll({
      where: whereClause,
      order: [['created_at', 'ASC']],
    });
  }

  async findStage(id: string): Promise<WorkflowStage> {
    const stage = await this.workflowStageModel.findByPk(id);

    if (!stage) {
      throw new NotFoundException(`Workflow stage with ID ${id} not found`);
    }

    return stage;
  }

  async findTask(id: string): Promise<WorkflowTask> {
    const task = await this.workflowTaskModel.findByPk(id);

    if (!task) {
      throw new NotFoundException(`Workflow task with ID ${id} not found`);
    }

    return task;
  }

  async updateStage(id: string, updateData: Partial<WorkflowStage>): Promise<WorkflowStage> {
    const [affectedCount, affectedRows] = await this.workflowStageModel.update(
      updateData,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Workflow stage with ID ${id} not found`);
    }

    return affectedRows[0];
  }

  async updateTask(id: string, updateData: Partial<WorkflowTask>): Promise<WorkflowTask> {
    const [affectedCount, affectedRows] = await this.workflowTaskModel.update(
      updateData,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Workflow task with ID ${id} not found`);
    }

    return affectedRows[0];
  }
}