// Tasks Service
import { WorkflowTask } from '../../types';
import { fetchJson, postJson, putJson, deleteJson, buildQueryString } from '../http-client';

export const tasksService = {
  getAll: (caseId?: string, assigneeId?: string) =>
    fetchJson<WorkflowTask[]>(`/tasks${buildQueryString({ caseId, assigneeId })}`),

  getById: (id: string) =>
    fetchJson<WorkflowTask>(`/tasks/${id}`),

  getByStatus: (status: string) =>
    fetchJson<WorkflowTask[]>(`/tasks/status/${encodeURIComponent(status)}`),

  create: (data: Partial<WorkflowTask>) =>
    postJson<WorkflowTask>('/tasks', data),

  update: (id: string, data: Partial<WorkflowTask>) =>
    putJson<WorkflowTask>(`/tasks/${id}`, data),

  delete: (id: string) =>
    deleteJson(`/tasks/${id}`),
};
