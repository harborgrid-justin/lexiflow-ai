// Workflow Service using Enzyme API Client
// Provides type-safe workflow stage and task operations

import { enzymeClient } from './client';
import { WorkflowStage, WorkflowTask } from '../../types';
import { ApiWorkflowStage } from '../../shared-types';
import { transformApiWorkflowStage } from '../../utils/type-transformers';

/**
 * Endpoint definitions for workflow
 */
const ENDPOINTS = {
  stages: {
    list: '/workflow/stages',
    detail: (id: string) => `/workflow/stages/${id}`,
  },
  tasks: {
    list: '/workflow/tasks',
    detail: (id: string) => `/workflow/tasks/${id}`,
  },
} as const;

/**
 * Query parameters for listing workflow stages
 */
interface StageListParams {
  caseId?: string;
  status?: string;
}

/**
 * Query parameters for listing workflow tasks
 */
interface TaskListParams {
  stageId?: string;
  assigneeId?: string;
  status?: string;
  priority?: string;
}

/**
 * Workflow service using Enzyme API client
 * Provides type-safe, retry-enabled, rate-limited API calls
 */
export const enzymeWorkflowService = {
  /**
   * Stage operations
   */
  stages: {
    /**
     * Get all workflow stages with optional filtering
     * @example
     * const stages = await enzymeWorkflowService.stages.getAll({ caseId: 'case-123' });
     */
    async getAll(params?: StageListParams): Promise<WorkflowStage[]> {
      const response = await enzymeClient.get<ApiWorkflowStage[]>(ENDPOINTS.stages.list, {
        params: params as Record<string, string | number | boolean>,
      });
      return (response.data || []).map(transformApiWorkflowStage);
    },

    /**
     * Get a single workflow stage by ID
     * @example
     * const stage = await enzymeWorkflowService.stages.getById('stage-123');
     */
    async getById(id: string): Promise<WorkflowStage> {
      const response = await enzymeClient.get<ApiWorkflowStage>(ENDPOINTS.stages.detail(id));
      return transformApiWorkflowStage(response.data);
    },

    /**
     * Create a new workflow stage
     * @example
     * const stage = await enzymeWorkflowService.stages.create({ title: 'Discovery' });
     */
    async create(data: Partial<WorkflowStage>): Promise<WorkflowStage> {
      const apiRequest = {
        title: data.title,
        status: data.status,
        tasks: data.tasks,
      };

      const cleanRequest = Object.fromEntries(
        Object.entries(apiRequest).filter(([_, v]) => v !== undefined)
      );

      const response = await enzymeClient.post<ApiWorkflowStage>(ENDPOINTS.stages.list, {
        body: cleanRequest,
      });
      return transformApiWorkflowStage(response.data);
    },

    /**
     * Update an existing workflow stage
     * @example
     * const updated = await enzymeWorkflowService.stages.update('stage-123', { status: 'Completed' });
     */
    async update(id: string, data: Partial<WorkflowStage>): Promise<WorkflowStage> {
      const apiRequest = {
        title: data.title,
        status: data.status,
        tasks: data.tasks,
      };

      const cleanRequest = Object.fromEntries(
        Object.entries(apiRequest).filter(([_, v]) => v !== undefined)
      );

      const response = await enzymeClient.put<ApiWorkflowStage>(ENDPOINTS.stages.detail(id), {
        body: cleanRequest,
      });
      return transformApiWorkflowStage(response.data);
    },
  },

  /**
   * Task operations
   */
  tasks: {
    /**
     * Get all workflow tasks with optional filtering
     * @example
     * const tasks = await enzymeWorkflowService.tasks.getAll({ stageId: 'stage-123' });
     */
    async getAll(params?: TaskListParams): Promise<WorkflowTask[]> {
      const response = await enzymeClient.get<WorkflowTask[]>(ENDPOINTS.tasks.list, {
        params: params as Record<string, string | number | boolean>,
      });
      return response.data || [];
    },

    /**
     * Get a single workflow task by ID
     * @example
     * const task = await enzymeWorkflowService.tasks.getById('task-123');
     */
    async getById(id: string): Promise<WorkflowTask> {
      const response = await enzymeClient.get<WorkflowTask>(ENDPOINTS.tasks.detail(id));
      return response.data;
    },

    /**
     * Create a new workflow task
     * @example
     * const task = await enzymeWorkflowService.tasks.create({ title: 'Review Documents', stageId: 'stage-123' });
     */
    async create(data: Partial<WorkflowTask>): Promise<WorkflowTask> {
      const response = await enzymeClient.post<WorkflowTask>(ENDPOINTS.tasks.list, {
        body: data,
      });
      return response.data;
    },

    /**
     * Update an existing workflow task
     * @example
     * const updated = await enzymeWorkflowService.tasks.update('task-123', { status: 'Completed' });
     */
    async update(id: string, data: Partial<WorkflowTask>): Promise<WorkflowTask> {
      const response = await enzymeClient.put<WorkflowTask>(ENDPOINTS.tasks.detail(id), {
        body: data,
      });
      return response.data;
    },
  },
};

export default enzymeWorkflowService;
