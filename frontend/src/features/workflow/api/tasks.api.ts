/**
 * Task API - TanStack Query Hooks
 * Enterprise-grade task management API layer
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import {
  Task,
  TaskComment,
  TaskActivity,
  TaskFilters,
  TaskSortOptions,
  TaskStatistics,
  CreateTaskInput,
  UpdateTaskInput,
  BulkTaskAction,
  TimeEntry,
  ChecklistItem,
} from '../types';

// API Base URL - adjust based on your backend
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
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters?: TaskFilters) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  comments: (taskId: string) => [...taskKeys.detail(taskId), 'comments'] as const,
  activities: (taskId: string) => [...taskKeys.detail(taskId), 'activities'] as const,
  statistics: () => [...taskKeys.all, 'statistics'] as const,
  myTasks: () => [...taskKeys.all, 'my-tasks'] as const,
};

// ==================== QUERIES ====================

/**
 * Fetch all tasks with optional filters
 */
export function useTasks(
  filters?: TaskFilters,
  sort?: TaskSortOptions,
  options?: Omit<UseQueryOptions<Task[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Task[], Error>({
    queryKey: taskKeys.list(filters),
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters) {
        if (filters.status) params.append('status', filters.status.join(','));
        if (filters.priority) params.append('priority', filters.priority.join(','));
        if (filters.assigneeId) params.append('assigneeId', filters.assigneeId.join(','));
        if (filters.caseId) params.append('caseId', filters.caseId);
        if (filters.tags) params.append('tags', filters.tags.join(','));
        if (filters.dueDateFrom) params.append('dueDateFrom', filters.dueDateFrom);
        if (filters.dueDateTo) params.append('dueDateTo', filters.dueDateTo);
        if (filters.search) params.append('search', filters.search);
        if (filters.workflowId) params.append('workflowId', filters.workflowId);
        if (filters.isOverdue !== undefined) params.append('isOverdue', String(filters.isOverdue));
      }

      if (sort) {
        params.append('sortField', sort.field);
        params.append('sortDirection', sort.direction);
      }

      const queryString = params.toString();
      return fetchApi<Task[]>(`/tasks${queryString ? `?${queryString}` : ''}`);
    },
    ...options,
  });
}

/**
 * Fetch single task by ID
 */
export function useTask(
  id: string,
  options?: Omit<UseQueryOptions<Task, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Task, Error>({
    queryKey: taskKeys.detail(id),
    queryFn: () => fetchApi<Task>(`/tasks/${id}`),
    enabled: !!id,
    ...options,
  });
}

/**
 * Fetch current user's tasks
 */
export function useMyTasks(
  filters?: Partial<TaskFilters>,
  options?: Omit<UseQueryOptions<Task[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<Task[], Error>({
    queryKey: [...taskKeys.myTasks(), filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters) {
        if (filters.status) params.append('status', filters.status.join(','));
        if (filters.priority) params.append('priority', filters.priority.join(','));
        if (filters.isOverdue !== undefined) params.append('isOverdue', String(filters.isOverdue));
      }

      const queryString = params.toString();
      return fetchApi<Task[]>(`/tasks/my-tasks${queryString ? `?${queryString}` : ''}`);
    },
    ...options,
  });
}

/**
 * Fetch task comments
 */
export function useTaskComments(
  taskId: string,
  options?: Omit<UseQueryOptions<TaskComment[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TaskComment[], Error>({
    queryKey: taskKeys.comments(taskId),
    queryFn: () => fetchApi<TaskComment[]>(`/tasks/${taskId}/comments`),
    enabled: !!taskId,
    ...options,
  });
}

/**
 * Fetch task activity log
 */
export function useTaskActivities(
  taskId: string,
  options?: Omit<UseQueryOptions<TaskActivity[], Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TaskActivity[], Error>({
    queryKey: taskKeys.activities(taskId),
    queryFn: () => fetchApi<TaskActivity[]>(`/tasks/${taskId}/activities`),
    enabled: !!taskId,
    ...options,
  });
}

/**
 * Fetch task statistics
 */
export function useTaskStatistics(
  filters?: TaskFilters,
  options?: Omit<UseQueryOptions<TaskStatistics, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TaskStatistics, Error>({
    queryKey: [...taskKeys.statistics(), filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.caseId) params.append('caseId', filters.caseId);
      if (filters?.assigneeId) params.append('assigneeId', filters.assigneeId.join(','));

      const queryString = params.toString();
      return fetchApi<TaskStatistics>(`/tasks/statistics${queryString ? `?${queryString}` : ''}`);
    },
    ...options,
  });
}

// ==================== MUTATIONS ====================

/**
 * Create new task
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, CreateTaskInput>({
    mutationFn: (data: CreateTaskInput) =>
      fetchApi<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (newTask) => {
      // Invalidate and refetch task lists
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
      queryClient.invalidateQueries({ queryKey: taskKeys.statistics() });

      // Add to cache
      queryClient.setQueryData(taskKeys.detail(newTask.id), newTask);
    },
  });
}

/**
 * Update existing task
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, { id: string; data: UpdateTaskInput }>({
    mutationFn: ({ id, data }) =>
      fetchApi<Task>(`/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (updatedTask, variables) => {
      // Update cache
      queryClient.setQueryData(taskKeys.detail(variables.id), updatedTask);

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
      queryClient.invalidateQueries({ queryKey: taskKeys.statistics() });
    },
  });
}

/**
 * Complete task
 */
export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, string>({
    mutationFn: (taskId: string) =>
      fetchApi<Task>(`/tasks/${taskId}/complete`, {
        method: 'POST',
      }),
    onSuccess: (updatedTask, taskId) => {
      queryClient.setQueryData(taskKeys.detail(taskId), updatedTask);
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
      queryClient.invalidateQueries({ queryKey: taskKeys.statistics() });
    },
  });
}

/**
 * Delete task
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (taskId: string) =>
      fetchApi<void>(`/tasks/${taskId}`, {
        method: 'DELETE',
      }),
    onSuccess: (_, taskId) => {
      queryClient.removeQueries({ queryKey: taskKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
      queryClient.invalidateQueries({ queryKey: taskKeys.statistics() });
    },
  });
}

/**
 * Add comment to task
 */
export function useAddTaskComment() {
  const queryClient = useQueryClient();

  return useMutation<TaskComment, Error, { taskId: string; content: string; mentions?: string[] }>({
    mutationFn: ({ taskId, content, mentions }) =>
      fetchApi<TaskComment>(`/tasks/${taskId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ content, mentions }),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.comments(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.activities(variables.taskId) });
    },
  });
}

/**
 * Add time entry
 */
export function useAddTimeEntry() {
  const queryClient = useQueryClient();

  return useMutation<TimeEntry, Error, { taskId: string; hours: number; description?: string; billable: boolean }>({
    mutationFn: ({ taskId, hours, description, billable }) =>
      fetchApi<TimeEntry>(`/tasks/${taskId}/time-entries`, {
        method: 'POST',
        body: JSON.stringify({ hours, description, billable }),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.activities(variables.taskId) });
    },
  });
}

/**
 * Update checklist item
 */
export function useUpdateChecklistItem() {
  const queryClient = useQueryClient();

  return useMutation<ChecklistItem, Error, { taskId: string; itemId: string; completed: boolean }>({
    mutationFn: ({ taskId, itemId, completed }) =>
      fetchApi<ChecklistItem>(`/tasks/${taskId}/checklist/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed }),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.taskId) });
    },
  });
}

/**
 * Bulk task actions
 */
export function useBulkTaskAction() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, BulkTaskAction>({
    mutationFn: (action: BulkTaskAction) =>
      fetchApi<void>('/tasks/bulk', {
        method: 'POST',
        body: JSON.stringify(action),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
      queryClient.invalidateQueries({ queryKey: taskKeys.statistics() });
    },
  });
}

/**
 * Assign task to user
 */
export function useAssignTask() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, { taskId: string; assigneeId: string }>({
    mutationFn: ({ taskId, assigneeId }) =>
      fetchApi<Task>(`/tasks/${taskId}/assign`, {
        method: 'POST',
        body: JSON.stringify({ assigneeId }),
      }),
    onSuccess: (updatedTask, variables) => {
      queryClient.setQueryData(taskKeys.detail(variables.taskId), updatedTask);
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.myTasks() });
    },
  });
}

/**
 * Update task priority
 */
export function useUpdateTaskPriority() {
  const queryClient = useQueryClient();

  return useMutation<Task, Error, { taskId: string; priority: string }>({
    mutationFn: ({ taskId, priority }) =>
      fetchApi<Task>(`/tasks/${taskId}/priority`, {
        method: 'PATCH',
        body: JSON.stringify({ priority }),
      }),
    onSuccess: (updatedTask, variables) => {
      queryClient.setQueryData(taskKeys.detail(variables.taskId), updatedTask);
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}
