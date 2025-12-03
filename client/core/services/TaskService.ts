/**
 * Task Service Implementation
 * 
 * Handles workflow task management, assignments, and status tracking.
 */

import { BaseService } from './BaseService';
import { ITaskService, QueryOptions, ServiceResponse } from '../contracts';
import { ApiService } from '../../services/apiService';
import { WorkflowTask } from '../../types';

export class TaskService extends BaseService<WorkflowTask> implements ITaskService {
  constructor() {
    super('TaskService');
  }

  async getAll(options?: QueryOptions): Promise<ServiceResponse<WorkflowTask[]>> {
    return this.executeWithErrorHandling(async () => {
      const tasks = await ApiService.tasks.getAll(
        options?.filter?.caseId,
        options?.filter?.assigneeId
      );
      return tasks || [];
    }, 'Failed to retrieve tasks');
  }

  async getById(id: string): Promise<ServiceResponse<WorkflowTask>> {
    return this.executeWithErrorHandling(async () => {
      const task = await ApiService.tasks.getById(id);
      if (!task) {
        throw new Error(`Task with ID ${id} not found`);
      }
      return task;
    }, `Failed to retrieve task ${id}`);
  }

  async create(entity: Partial<WorkflowTask>): Promise<ServiceResponse<WorkflowTask>> {
    const validation = this.validate(entity);
    if (!validation.isValid) {
      return {
        data: null as WorkflowTask,
        success: false,
        message: 'Validation failed',
        errors: validation.errors.map(e => e.message)
      };
    }

    return this.executeWithErrorHandling(async () => {
      const task = await ApiService.tasks.create(entity);
      return task;
    }, 'Failed to create task');
  }

  async update(id: string, entity: Partial<WorkflowTask>): Promise<ServiceResponse<WorkflowTask>> {
    return this.executeWithErrorHandling(async () => {
      const updatedTask = await ApiService.tasks.update(id, entity);
      return updatedTask;
    }, `Failed to update task ${id}`);
  }

  async delete(id: string): Promise<ServiceResponse<void>> {
    return this.executeWithErrorHandling(async () => {
      await ApiService.tasks.delete(id);
    }, `Failed to delete task ${id}`);
  }

  // ITaskService specific methods
  async getTasksByAssignee(userId: string): Promise<ServiceResponse<WorkflowTask[]>> {
    return this.executeWithErrorHandling(async () => {
      const tasks = await ApiService.tasks.getAll(undefined, userId);
      return tasks || [];
    }, 'Failed to retrieve user tasks');
  }

  async getTasksByCase(caseId: string): Promise<ServiceResponse<WorkflowTask[]>> {
    return this.executeWithErrorHandling(async () => {
      const tasks = await ApiService.tasks.getAll(caseId);
      return tasks || [];
    }, 'Failed to retrieve case tasks');
  }

  async updateTaskStatus(taskId: string, status: string): Promise<ServiceResponse<WorkflowTask>> {
    return this.executeWithErrorHandling(async () => {
      const updatedTask = await ApiService.tasks.update(taskId, { status } as Partial<WorkflowTask>);
      return updatedTask;
    }, `Failed to update task status ${taskId}`);
  }

  async getTaskDependencies(taskId: string): Promise<ServiceResponse<WorkflowTask[]>> {
    return this.executeWithErrorHandling(async () => {
      // For now, return empty array as dependency management isn't implemented
      // TODO: Implement task dependency tracking
      return [];
    }, `Failed to get task dependencies for ${taskId}`);
  }

  async assignTask(taskId: string, userId: string): Promise<ServiceResponse<void>> {
    return this.executeWithErrorHandling(async () => {
      await ApiService.tasks.update(taskId, { assigneeId: userId } as Partial<WorkflowTask>);
    }, `Failed to assign task ${taskId}`);
  }
}