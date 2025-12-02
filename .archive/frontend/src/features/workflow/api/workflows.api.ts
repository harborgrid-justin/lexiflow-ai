/**
 * Workflow API - TanStack Query Hooks
 * Enterprise workflow template and instance management
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import {
  WorkflowTemplate,
  WorkflowInstance,
  WorkflowStage,
  WorkflowAnalytics,
} from '../types';

// API Base URL
const API_BASE = '/api';

/**
 * Fetch with auth headers helper
 */
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('auth_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options?.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Query Keys for cache management
 */
export const workflowKeys = {
  all: ['workflows'] as const,
  templates: () => [...workflowKeys.all, 'templates'] as const,
  template: (id: string) => [...workflowKeys.templates(), id] as const,
  instances: () => [...workflowKeys.all, 'instances'] as const,
  instance: (id: string) => [...workflowKeys.instances(), id] as const,
  instancesByCase: (caseId: string) => [...workflowKeys.instances(), 'case', caseId] as const,
  analytics: (instanceId: string) => [...workflowKeys.instance(instanceId), 'analytics'] as const,
};

// ==================== TEMPLATE QUERIES ====================

/**
 * Fetch all workflow templates
 */
export function useWorkflows(
  filters?: { category?: string; isActive?: boolean },
  options?: Omit<UseQueryOptions<WorkflowTemplate[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<WorkflowTemplate[], Error>({
    queryKey: [...workflowKeys.templates(), filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.category) params.append('category', filters.category);
      if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));

      const queryString = params.toString();
      return fetchApi<WorkflowTemplate[]>(`/workflows${queryString ? `?${queryString}` : ''}`);
    },
    ...options,
  });
}

/**
 * Fetch single workflow template
 */
export function useWorkflow(
  id: string,
  options?: Omit<UseQueryOptions<WorkflowTemplate, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<WorkflowTemplate, Error>({
    queryKey: workflowKeys.template(id),
    queryFn: () => fetchApi<WorkflowTemplate>(`/workflows/${id}`),
    enabled: !!id,
    ...options,
  });
}

// ==================== INSTANCE QUERIES ====================

/**
 * Fetch workflow instances
 */
export function useWorkflowInstances(
  filters?: { caseId?: string; status?: string },
  options?: Omit<UseQueryOptions<WorkflowInstance[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<WorkflowInstance[], Error>({
    queryKey: [...workflowKeys.instances(), filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.caseId) params.append('caseId', filters.caseId);
      if (filters?.status) params.append('status', filters.status);

      const queryString = params.toString();
      return fetchApi<WorkflowInstance[]>(
        `/workflow-engine/instances${queryString ? `?${queryString}` : ''}`
      );
    },
    ...options,
  });
}

/**
 * Fetch single workflow instance
 */
export function useWorkflowInstance(
  id: string,
  options?: Omit<UseQueryOptions<WorkflowInstance, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<WorkflowInstance, Error>({
    queryKey: workflowKeys.instance(id),
    queryFn: () => fetchApi<WorkflowInstance>(`/workflow-engine/instances/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Fetch workflow analytics
 */
export function useWorkflowAnalytics(
  instanceId: string,
  options?: Omit<UseQueryOptions<WorkflowAnalytics, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<WorkflowAnalytics, Error>({
    queryKey: workflowKeys.analytics(instanceId),
    queryFn: () => fetchApi<WorkflowAnalytics>(`/workflow-engine/instances/${instanceId}/analytics`),
    enabled: !!instanceId,
    ...options,
  });
}

// ==================== TEMPLATE MUTATIONS ====================

/**
 * Create workflow template
 */
export function useCreateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation<WorkflowTemplate, Error, Partial<WorkflowTemplate>>({
    mutationFn: (data: Partial<WorkflowTemplate>) =>
      fetchApi<WorkflowTemplate>('/workflows', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (newWorkflow) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.templates() });
      queryClient.setQueryData(workflowKeys.template(newWorkflow.id), newWorkflow);
    },
  });
}

/**
 * Update workflow template
 */
export function useUpdateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation<WorkflowTemplate, Error, { id: string; data: Partial<WorkflowTemplate> }>({
    mutationFn: ({ id, data }) =>
      fetchApi<WorkflowTemplate>(`/workflows/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (updatedWorkflow, variables) => {
      queryClient.setQueryData(workflowKeys.template(variables.id), updatedWorkflow);
      queryClient.invalidateQueries({ queryKey: workflowKeys.templates() });
    },
  });
}

/**
 * Delete workflow template
 */
export function useDeleteWorkflow() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (workflowId: string) =>
      fetchApi<void>(`/workflows/${workflowId}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, workflowId) => {
      queryClient.removeQueries({ queryKey: workflowKeys.template(workflowId) });
      queryClient.invalidateQueries({ queryKey: workflowKeys.templates() });
    },
  });
}

/**
 * Duplicate workflow template
 */
export function useDuplicateWorkflow() {
  const queryClient = useQueryClient();

  return useMutation<WorkflowTemplate, Error, { id: string; name: string }>({
    mutationFn: ({ id, name }) =>
      fetchApi<WorkflowTemplate>(`/workflows/${id}/duplicate`, {
        method: 'POST',
        body: JSON.stringify({ name }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.templates() });
    },
  });
}

// ==================== INSTANCE MUTATIONS ====================

/**
 * Start workflow instance
 */
export function useStartWorkflow() {
  const queryClient = useQueryClient();

  return useMutation<
    WorkflowInstance,
    Error,
    { templateId: string; caseId: string; variables?: Record<string, any> }
  >({
    mutationFn: ({ templateId, caseId, variables }) =>
      fetchApi<WorkflowInstance>('/workflow-engine/instances', {
        method: 'POST',
        body: JSON.stringify({ templateId, caseId, variables }),
      }),
    onSuccess: (newInstance) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.instances() });
      queryClient.setQueryData(workflowKeys.instance(newInstance.id), newInstance);
    },
  });
}

/**
 * Pause workflow instance
 */
export function usePauseWorkflow() {
  const queryClient = useQueryClient();

  return useMutation<WorkflowInstance, Error, string>({
    mutationFn: (instanceId: string) =>
      fetchApi<WorkflowInstance>(`/workflow-engine/instances/${instanceId}/pause`, {
        method: 'POST',
      }),
    onSuccess: (updatedInstance, instanceId) => {
      queryClient.setQueryData(workflowKeys.instance(instanceId), updatedInstance);
      queryClient.invalidateQueries({ queryKey: workflowKeys.instances() });
    },
  });
}

/**
 * Resume workflow instance
 */
export function useResumeWorkflow() {
  const queryClient = useQueryClient();

  return useMutation<WorkflowInstance, Error, string>({
    mutationFn: (instanceId: string) =>
      fetchApi<WorkflowInstance>(`/workflow-engine/instances/${instanceId}/resume`, {
        method: 'POST',
      }),
    onSuccess: (updatedInstance, instanceId) => {
      queryClient.setQueryData(workflowKeys.instance(instanceId), updatedInstance);
      queryClient.invalidateQueries({ queryKey: workflowKeys.instances() });
    },
  });
}

/**
 * Cancel workflow instance
 */
export function useCancelWorkflow() {
  const queryClient = useQueryClient();

  return useMutation<WorkflowInstance, Error, string>({
    mutationFn: (instanceId: string) =>
      fetchApi<WorkflowInstance>(`/workflow-engine/instances/${instanceId}/cancel`, {
        method: 'POST',
      }),
    onSuccess: (updatedInstance, instanceId) => {
      queryClient.setQueryData(workflowKeys.instance(instanceId), updatedInstance);
      queryClient.invalidateQueries({ queryKey: workflowKeys.instances() });
    },
  });
}

/**
 * Complete workflow stage
 */
export function useCompleteStage() {
  const queryClient = useQueryClient();

  return useMutation<WorkflowInstance, Error, { instanceId: string; stageId: string }>({
    mutationFn: ({ instanceId, stageId }) =>
      fetchApi<WorkflowInstance>(`/workflow-engine/instances/${instanceId}/stages/${stageId}/complete`, {
        method: 'POST',
      }),
    onSuccess: (updatedInstance, variables) => {
      queryClient.setQueryData(workflowKeys.instance(variables.instanceId), updatedInstance);
      queryClient.invalidateQueries({ queryKey: workflowKeys.instances() });
      queryClient.invalidateQueries({ queryKey: workflowKeys.analytics(variables.instanceId) });
    },
  });
}

/**
 * Update stage assignee
 */
export function useUpdateStageAssignee() {
  const queryClient = useQueryClient();

  return useMutation<WorkflowStage, Error, { instanceId: string; stageId: string; assigneeId: string }>({
    mutationFn: ({ instanceId, stageId, assigneeId }) =>
      fetchApi<WorkflowStage>(
        `/workflow-engine/instances/${instanceId}/stages/${stageId}/assign`,
        {
          method: 'POST',
          body: JSON.stringify({ assigneeId }),
        }
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.instance(variables.instanceId) });
    },
  });
}

/**
 * Add stage to workflow instance
 */
export function useAddStage() {
  const queryClient = useQueryClient();

  return useMutation<WorkflowStage, Error, { instanceId: string; stage: Partial<WorkflowStage> }>({
    mutationFn: ({ instanceId, stage }) =>
      fetchApi<WorkflowStage>(`/workflow-engine/instances/${instanceId}/stages`, {
        method: 'POST',
        body: JSON.stringify(stage),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.instance(variables.instanceId) });
    },
  });
}

/**
 * Remove stage from workflow instance
 */
export function useRemoveStage() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { instanceId: string; stageId: string }>({
    mutationFn: ({ instanceId, stageId }) =>
      fetchApi<void>(`/workflow-engine/instances/${instanceId}/stages/${stageId}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.instance(variables.instanceId) });
    },
  });
}

/**
 * Update workflow variables
 */
export function useUpdateWorkflowVariables() {
  const queryClient = useQueryClient();

  return useMutation<WorkflowInstance, Error, { instanceId: string; variables: Record<string, any> }>({
    mutationFn: ({ instanceId, variables }) =>
      fetchApi<WorkflowInstance>(`/workflow-engine/instances/${instanceId}/variables`, {
        method: 'PATCH',
        body: JSON.stringify({ variables }),
      }),
    onSuccess: (updatedInstance, variables) => {
      queryClient.setQueryData(workflowKeys.instance(variables.instanceId), updatedInstance);
    },
  });
}
