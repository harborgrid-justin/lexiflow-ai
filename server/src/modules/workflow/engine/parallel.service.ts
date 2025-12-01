// Parallel Tasks Service
// Manages concurrent task execution groups

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkflowTask } from '../../../models/workflow.model';
import { ParallelTaskGroup, ParallelCompletionRule } from './types';
import { InMemoryStore } from './store';

interface ExtendedParallelGroup extends ParallelTaskGroup {
  completedTasks: string[];
  nextTaskId?: string;
}

@Injectable()
export class ParallelService {
  private groups = new InMemoryStore<ExtendedParallelGroup>();

  constructor(
    @InjectModel(WorkflowTask)
    private taskModel: typeof WorkflowTask,
  ) {}

  createGroup(config: {
    name: string;
    stageId: string;
    tasks: string[];
    completionRule: ParallelCompletionRule;
    completionThreshold?: number;
    nextTaskId?: string;
  }): ExtendedParallelGroup {
    if (config.tasks.length < 2) {
      throw new Error('Parallel group needs at least 2 tasks');
    }

    if (
      config.completionRule === 'percentage' &&
      (!config.completionThreshold || config.completionThreshold > 100)
    ) {
      throw new Error('Invalid completionThreshold for percentage rule');
    }

    const group: ExtendedParallelGroup = {
      id: this.generateId(),
      stageId: config.stageId,
      tasks: config.tasks,
      completionRule: config.completionRule,
      completionThreshold: config.completionThreshold,
      nextTaskId: config.nextTaskId,
      completedTasks: [],
      status: 'pending',
    };

    this.groups.set(group.id, group);
    return group;
  }

  getGroup(groupId: string): ExtendedParallelGroup | undefined {
    return this.groups.get(groupId);
  }

  getGroupByTask(taskId: string): ExtendedParallelGroup | undefined {
    return this.groups.find(g => g.tasks.includes(taskId));
  }

  async markTaskComplete(taskId: string): Promise<{
    groupComplete: boolean;
    nextTaskId?: string;
  }> {
    const group = this.getGroupByTask(taskId);
    if (!group) {
      return { groupComplete: false };
    }

    if (!group.completedTasks.includes(taskId)) {
      group.completedTasks.push(taskId);
    }

    const isComplete = this.checkCompletion(group);

    if (isComplete) {
      group.status = 'completed';
      this.groups.set(group.id, group);

      // Activate next task if specified
      if (group.nextTaskId) {
        await this.activateNextTask(group.nextTaskId);
      }

      return { groupComplete: true, nextTaskId: group.nextTaskId };
    }

    this.groups.set(group.id, group);
    return { groupComplete: false };
  }

  checkCompletion(group: ExtendedParallelGroup): boolean {
    const completed = group.completedTasks.length;
    const total = group.tasks.length;

    switch (group.completionRule) {
      case 'all':
        return completed === total;

      case 'any':
        return completed >= 1;

      case 'percentage': {
        const pct = (completed / total) * 100;
        return pct >= (group.completionThreshold || 100);
      }

      default:
        return false;
    }
  }

  getGroupProgress(groupId: string): {
    completed: number;
    total: number;
    percentage: number;
  } | null {
    const group = this.groups.get(groupId);
    if (!group) {
      return null;
    }

    const completed = group.completedTasks.length;
    const total = group.tasks.length;
    const percentage = Math.round((completed / total) * 100);

    return { completed, total, percentage };
  }

  async startGroup(groupId: string): Promise<void> {
    const group = this.groups.get(groupId);
    if (!group) {
      throw new Error(`Group not found: ${groupId}`);
    }

    group.status = 'in-progress';

    // Activate all tasks in the group
    await Promise.all(
      group.tasks.map(taskId =>
        this.taskModel.update(
          { status: 'in_progress' },
          { where: { id: taskId } },
        ),
      ),
    );

    this.groups.set(groupId, group);
  }

  private async activateNextTask(taskId: string): Promise<void> {
    await this.taskModel.update(
      { status: 'in_progress' },
      { where: { id: taskId } },
    );
  }

  private generateId(): string {
    return `pgroup_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}
