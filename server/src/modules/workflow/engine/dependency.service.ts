// Task Dependencies Service
// Manages blocking and informational dependencies between tasks

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkflowTask } from '../../../models/workflow.model';
import { TaskDependency } from './types';
import { InMemoryStore } from './store';
import {
  TaskNotFoundError,
  CircularDependencyError,
  DependencyError,
} from './errors';

@Injectable()
export class DependencyService {
  private dependencies = new InMemoryStore<TaskDependency>();

  constructor(
    @InjectModel(WorkflowTask)
    private taskModel: typeof WorkflowTask,
  ) {}

  async setDependencies(
    taskId: string,
    dependsOn: string[],
    type: 'blocking' | 'informational' = 'blocking',
  ): Promise<TaskDependency> {
    // Validate task exists
    const task = await this.taskModel.findByPk(taskId);
    if (!task) {
      throw new TaskNotFoundError(taskId);
    }

    // Validate dependency tasks exist
    for (const depId of dependsOn) {
      const depTask = await this.taskModel.findByPk(depId);
      if (!depTask) {
        throw new TaskNotFoundError(depId);
      }
    }

    // Check for circular dependencies
    const chain = await this.detectCircularDependency(taskId, dependsOn);
    if (chain.length > 0) {
      throw new CircularDependencyError(taskId, chain);
    }

    const dependency: TaskDependency = { taskId, dependsOn, type };
    this.dependencies.set(taskId, dependency);

    return dependency;
  }

  async canStartTask(taskId: string): Promise<{
    canStart: boolean;
    blockedBy: string[];
  }> {
    const dependency = this.dependencies.get(taskId);
    if (!dependency || dependency.type === 'informational') {
      return { canStart: true, blockedBy: [] };
    }

    const blockedBy: string[] = [];
    for (const depId of dependency.dependsOn) {
      const depTask = await this.taskModel.findByPk(depId);
      if (depTask && depTask.status !== 'done') {
        blockedBy.push(depId);
      }
    }

    return { canStart: blockedBy.length === 0, blockedBy };
  }

  getDependencies(taskId: string): TaskDependency | undefined {
    return this.dependencies.get(taskId);
  }

  removeDependencies(taskId: string): boolean {
    return this.dependencies.delete(taskId);
  }

  async getDependencyGraph(caseId: string): Promise<Map<string, string[]>> {
    const tasks = await this.taskModel.findAll({
      where: { case_id: caseId },
    });

    const graph = new Map<string, string[]>();
    for (const task of tasks) {
      const dep = this.dependencies.get(task.id);
      graph.set(task.id, dep?.dependsOn || []);
    }

    return graph;
  }

  private async detectCircularDependency(
    taskId: string,
    dependsOn: string[],
    visited: Set<string> = new Set(),
  ): Promise<string[]> {
    if (visited.has(taskId)) {
      return Array.from(visited);
    }
    visited.add(taskId);

    for (const depId of dependsOn) {
      if (depId === taskId) {
        return [...visited, depId];
      }
      const dep = this.dependencies.get(depId);
      if (dep) {
        const chain = await this.detectCircularDependency(
          depId,
          dep.dependsOn,
          new Set(visited),
        );
        if (chain.length > 0) {
          return chain;
        }
      }
    }

    return [];
  }

  async validateTaskStart(taskId: string): Promise<void> {
    const result = await this.canStartTask(taskId);
    if (!result.canStart) {
      throw new DependencyError(taskId, result.blockedBy);
    }
  }
}
