// Tasks Service using Enzyme API Client
// Provides type-safe task operations

import { enzymeClient } from './client';
import { WorkflowTask } from '../../types';

/**
 * Endpoint definitions for tasks
 */
const ENDPOINTS = {
  list: '/tasks',
  detail: (id: string) => `/tasks/${id}`,
  byStatus: (status: string) => `/tasks/status/${encodeURIComponent(status)}`,
} as const;

/**
 * Query parameters for listing tasks
 */
interface TaskListParams {
  caseId?: string;
  assigneeId?: string;
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}

/**
 * Tasks service using Enzyme API client
 * Provides type-safe, retry-enabled, rate-limited API calls
 */
export const enzymeTasksService = {
  /**
   * Get all tasks with optional filtering
   * @example
   * const tasks = await enzymeTasksService.getAll({ caseId: 'case-123' });
   */
  async getAll(params?: TaskListParams): Promise<WorkflowTask[]> {
    const response = await enzymeClient.get<WorkflowTask[]>(ENDPOINTS.list, {
      params: params as Record<string, string | number | boolean>,
    });
    return response.data || [];
  },

  /**
   * Get a single task by ID
   * @example
   * const task = await enzymeTasksService.getById('task-123');
   */
  async getById(id: string): Promise<WorkflowTask> {
    const response = await enzymeClient.get<WorkflowTask>(ENDPOINTS.detail(id));
    return response.data;
  },

  /**
   * Get tasks by status
   * @example
   * const pending = await enzymeTasksService.getByStatus('Pending');
   */
  async getByStatus(status: string): Promise<WorkflowTask[]> {
    const response = await enzymeClient.get<WorkflowTask[]>(ENDPOINTS.byStatus(status));
    return response.data || [];
  },

  /**
   * Create a new task
   * @example
   * const task = await enzymeTasksService.create({
   *   title: 'Review Discovery Documents',
   *   caseId: 'case-123',
   *   assigneeId: 'user-123'
   * });
   */
  async create(data: Partial<WorkflowTask>): Promise<WorkflowTask> {
    const response = await enzymeClient.post<WorkflowTask>(ENDPOINTS.list, {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  /**
   * Update an existing task
   * @example
   * const updated = await enzymeTasksService.update('task-123', { status: 'Completed' });
   */
  async update(id: string, data: Partial<WorkflowTask>): Promise<WorkflowTask> {
    const response = await enzymeClient.put<WorkflowTask>(ENDPOINTS.detail(id), {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  /**
   * Delete a task
   * @example
   * await enzymeTasksService.delete('task-123');
   */
  async delete(id: string): Promise<void> {
    await enzymeClient.delete(ENDPOINTS.detail(id));
  },
};

export default enzymeTasksService;
