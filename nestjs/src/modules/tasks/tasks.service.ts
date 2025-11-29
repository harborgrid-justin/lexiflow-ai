import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task } from '../../models/task.model';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private taskModel: typeof Task,
  ) {}

  async create(createTaskData: Partial<Task>): Promise<Task> {
    return this.taskModel.create(createTaskData);
  }

  async findAll(caseId?: string, assigneeId?: string): Promise<Task[]> {
    const whereClause: any = {};
    if (caseId) whereClause.case_id = caseId;
    if (assigneeId) whereClause.assignee_id = assigneeId;

    return this.taskModel.findAll({
      where: whereClause,
      include: ['case', 'assignee', 'creator', 'organization'],
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel.findByPk(id, {
      include: ['case', 'assignee', 'creator', 'organization'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateData: Partial<Task>): Promise<Task> {
    const [affectedCount, affectedRows] = await this.taskModel.update(
      updateData,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return affectedRows[0];
  }

  async remove(id: string): Promise<void> {
    const deletedCount = await this.taskModel.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async findByStatus(status: string): Promise<Task[]> {
    return this.taskModel.findAll({
      where: { status },
      include: ['case', 'assignee', 'creator', 'organization'],
    });
  }
}