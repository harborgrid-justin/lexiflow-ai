// Workflow Service
import { WorkflowStage, WorkflowTask } from '../../types';
import { ApiWorkflowStage } from '../../shared-types';
import { transformApiWorkflowStage } from '../../utils/type-transformers';
import { fetchJson, postJson, putJson, buildQueryString } from '../http-client';

export const workflowService = {
  stages: {
    getAll: async (caseId?: string): Promise<WorkflowStage[]> => {
      const apiStages = await fetchJson<ApiWorkflowStage[]>(`/workflow/stages${buildQueryString({ caseId })}`);
      return (apiStages || []).map(transformApiWorkflowStage);
    },

    getById: async (id: string): Promise<WorkflowStage> => {
      const apiStage = await fetchJson<ApiWorkflowStage>(`/workflow/stages/${id}`);
      return transformApiWorkflowStage(apiStage);
    },

    create: (data: Partial<WorkflowStage>) =>
      postJson<WorkflowStage>('/workflow/stages', data),

    update: (id: string, data: Partial<WorkflowStage>) =>
      putJson<WorkflowStage>(`/workflow/stages/${id}`, data),
  },

  tasks: {
    getAll: async (stageId?: string, assigneeId?: string) => {
      const tasks = await fetchJson<WorkflowTask[]>(`/workflow/tasks${buildQueryString({ stageId, assigneeId })}`);
      return tasks || [];
    },

    getById: (id: string) =>
      fetchJson<WorkflowTask>(`/workflow/tasks/${id}`),

    create: (data: Partial<WorkflowTask>) =>
      postJson<WorkflowTask>('/workflow/tasks', data),

    update: (id: string, data: Partial<WorkflowTask>) =>
      putJson<WorkflowTask>(`/workflow/tasks/${id}`, data),
  },
};
