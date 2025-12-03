/**
 * Workflow API Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enzymeWorkflowService } from '../../../enzyme/services/workflow.service';
import { enzymeTasksService } from '../../../enzyme/services/tasks.service';
import type { WorkflowTask } from '@/types';

// Query Keys
export const workflowKeys = {
  all: ['workflow'] as const,
  stages: () => [...workflowKeys.all, 'stages'] as const,
  stage: (id: string) => [...workflowKeys.stages(), id] as const,
  tasks: () => [...workflowKeys.all, 'tasks'] as const,
  task: (id: string) => [...workflowKeys.tasks(), id] as const,
  caseTasks: (caseId: string) => [...workflowKeys.tasks(), 'case', caseId] as const,
  templates: () => [...workflowKeys.all, 'templates'] as const,
  template: (id: string) => [...workflowKeys.templates(), id] as const,
};

// Queries
export function useWorkflowStages(caseId?: string) {
  return useQuery({
    queryKey: caseId ? [...workflowKeys.stages(), caseId] : workflowKeys.stages(),
    queryFn: () => enzymeWorkflowService.stages.getAll(caseId ? { caseId } : undefined),
    staleTime: 5 * 60 * 1000,
  });
}

export function useWorkflowTasks(caseId?: string) {
  return useQuery({
    queryKey: caseId ? workflowKeys.caseTasks(caseId) : workflowKeys.tasks(),
    queryFn: () => enzymeTasksService.getAll(caseId ? { caseId } : undefined),
    staleTime: 5 * 60 * 1000,
  });
}

export function useWorkflowTask(id: string) {
  return useQuery({
    queryKey: workflowKeys.task(id),
    queryFn: () => enzymeTasksService.getById(id),
    enabled: !!id,
  });
}

export function useWorkflowTemplates() {
  return useQuery({
    queryKey: workflowKeys.templates(),
    // Templates not yet implemented in API - return empty array
    queryFn: async () => [] as any[],
    staleTime: 10 * 60 * 1000,
  });
}

// Mutations
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<WorkflowTask>) => enzymeTasksService.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.tasks() });
      if (variables.caseId) {
        queryClient.invalidateQueries({ queryKey: workflowKeys.caseTasks(variables.caseId) });
      }
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkflowTask> }) =>
      enzymeTasksService.update(id, data),
    onSuccess: (_, { id, data }) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.task(id) });
      queryClient.invalidateQueries({ queryKey: workflowKeys.tasks() });
      if (data.caseId) {
        queryClient.invalidateQueries({ queryKey: workflowKeys.caseTasks(data.caseId) });
      }
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: WorkflowTask['status'] }) =>
      enzymeTasksService.update(id, { status }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.task(id) });
      queryClient.invalidateQueries({ queryKey: workflowKeys.tasks() });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => enzymeTasksService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.tasks() });
    },
  });
}

export function useApplyTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    // Template application not yet implemented - placeholder
    mutationFn: async ({ templateId, caseId }: { templateId: string; caseId: string }) => {
      console.warn('Template application not yet implemented', { templateId, caseId });
      return { templateId, caseId };
    },
    onSuccess: (_, { caseId }) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.stages() });
      queryClient.invalidateQueries({ queryKey: workflowKeys.caseTasks(caseId) });
    },
  });
}
