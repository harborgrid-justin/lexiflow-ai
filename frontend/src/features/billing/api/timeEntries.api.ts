// Time Entries API Hooks for LexiFlow AI
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  TimeEntry,
  TimeEntryFilters,
  TimeEntrySummary,
  RunningTimer,
  CreateTimeEntryRequest,
  UpdateTimeEntryRequest,
  StartTimerRequest,
} from './billing.types';

const API_BASE = '/api/billing';

// Query Keys
export const timeEntriesKeys = {
  all: ['timeEntries'] as const,
  lists: () => [...timeEntriesKeys.all, 'list'] as const,
  list: (filters: TimeEntryFilters) => [...timeEntriesKeys.lists(), filters] as const,
  details: () => [...timeEntriesKeys.all, 'detail'] as const,
  detail: (id: string) => [...timeEntriesKeys.details(), id] as const,
  summary: (filters: TimeEntryFilters) => [...timeEntriesKeys.all, 'summary', filters] as const,
  timer: () => ['runningTimer'] as const,
};

// API Functions
const fetchTimeEntries = async (filters: TimeEntryFilters): Promise<TimeEntry[]> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) params.append(key, String(value));
  });

  const { data } = await axios.get<TimeEntry[]>(`${API_BASE}/time-entries?${params}`);
  return data;
};

const fetchTimeEntry = async (id: string): Promise<TimeEntry> => {
  const { data } = await axios.get<TimeEntry>(`${API_BASE}/time-entries/${id}`);
  return data;
};

const fetchTimeEntrySummary = async (filters: TimeEntryFilters): Promise<TimeEntrySummary> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined) params.append(key, String(value));
  });

  const { data } = await axios.get<TimeEntrySummary>(`${API_BASE}/time-entries/summary?${params}`);
  return data;
};

const createTimeEntry = async (request: CreateTimeEntryRequest): Promise<TimeEntry> => {
  const { data } = await axios.post<TimeEntry>(`${API_BASE}/time-entries`, request);
  return data;
};

const updateTimeEntry = async ({
  id,
  ...request
}: UpdateTimeEntryRequest & { id: string }): Promise<TimeEntry> => {
  const { data } = await axios.put<TimeEntry>(`${API_BASE}/time-entries/${id}`, request);
  return data;
};

const deleteTimeEntry = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE}/time-entries/${id}`);
};

const fetchRunningTimer = async (): Promise<RunningTimer | null> => {
  try {
    const { data } = await axios.get<RunningTimer>(`${API_BASE}/timer`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

const startTimer = async (request: StartTimerRequest): Promise<RunningTimer> => {
  const { data } = await axios.post<RunningTimer>(`${API_BASE}/timer/start`, request);
  return data;
};

const stopTimer = async (): Promise<TimeEntry> => {
  const { data } = await axios.post<TimeEntry>(`${API_BASE}/timer/stop`);
  return data;
};

const pauseTimer = async (): Promise<RunningTimer> => {
  const { data } = await axios.post<RunningTimer>(`${API_BASE}/timer/pause`);
  return data;
};

const resumeTimer = async (): Promise<RunningTimer> => {
  const { data } = await axios.post<RunningTimer>(`${API_BASE}/timer/resume`);
  return data;
};

// React Query Hooks

/**
 * Fetch time entries with optional filters
 */
export const useTimeEntries = (filters: TimeEntryFilters = {}) => {
  return useQuery({
    queryKey: timeEntriesKeys.list(filters),
    queryFn: () => fetchTimeEntries(filters),
    staleTime: 30000, // 30 seconds
  });
};

/**
 * Fetch a single time entry by ID
 */
export const useTimeEntry = (id: string) => {
  return useQuery({
    queryKey: timeEntriesKeys.detail(id),
    queryFn: () => fetchTimeEntry(id),
    enabled: !!id,
  });
};

/**
 * Fetch time entry summary statistics
 */
export const useTimeEntrySummary = (filters: TimeEntryFilters = {}) => {
  return useQuery({
    queryKey: timeEntriesKeys.summary(filters),
    queryFn: () => fetchTimeEntrySummary(filters),
    staleTime: 30000,
  });
};

/**
 * Create a new time entry
 */
export const useCreateTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTimeEntry,
    onSuccess: (newEntry) => {
      // Invalidate all time entry lists
      queryClient.invalidateQueries({ queryKey: timeEntriesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: timeEntriesKeys.all });

      // Optimistically update the cache
      queryClient.setQueryData(timeEntriesKeys.detail(newEntry.id), newEntry);
    },
  });
};

/**
 * Update an existing time entry
 */
export const useUpdateTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTimeEntry,
    onSuccess: (updatedEntry) => {
      // Update the specific entry in cache
      queryClient.setQueryData(timeEntriesKeys.detail(updatedEntry.id), updatedEntry);

      // Invalidate lists to refetch with updated data
      queryClient.invalidateQueries({ queryKey: timeEntriesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: timeEntriesKeys.all });
    },
  });
};

/**
 * Delete a time entry
 */
export const useDeleteTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTimeEntry,
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: timeEntriesKeys.detail(deletedId) });

      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: timeEntriesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: timeEntriesKeys.all });
    },
  });
};

/**
 * Fetch the currently running timer
 */
export const useRunningTimer = () => {
  return useQuery({
    queryKey: timeEntriesKeys.timer(),
    queryFn: fetchRunningTimer,
    refetchInterval: (query) => {
      // Refetch every 5 seconds if there's a running timer
      return query.state.data ? 5000 : false;
    },
    staleTime: 0,
  });
};

/**
 * Start a new timer
 */
export const useStartTimer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startTimer,
    onSuccess: (timer) => {
      // Update timer cache
      queryClient.setQueryData(timeEntriesKeys.timer(), timer);
    },
  });
};

/**
 * Stop the running timer and create a time entry
 */
export const useStopTimer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: stopTimer,
    onSuccess: (timeEntry) => {
      // Clear timer cache
      queryClient.setQueryData(timeEntriesKeys.timer(), null);

      // Add the new time entry to cache
      queryClient.setQueryData(timeEntriesKeys.detail(timeEntry.id), timeEntry);

      // Invalidate time entry lists
      queryClient.invalidateQueries({ queryKey: timeEntriesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: timeEntriesKeys.all });
    },
  });
};

/**
 * Pause the running timer
 */
export const usePauseTimer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: pauseTimer,
    onSuccess: (timer) => {
      queryClient.setQueryData(timeEntriesKeys.timer(), timer);
    },
  });
};

/**
 * Resume a paused timer
 */
export const useResumeTimer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: resumeTimer,
    onSuccess: (timer) => {
      queryClient.setQueryData(timeEntriesKeys.timer(), timer);
    },
  });
};

/**
 * Bulk update multiple time entries
 */
export const useBulkUpdateTimeEntries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: { id: string; data: UpdateTimeEntryRequest }[]) => {
      const promises = updates.map(({ id, data }) =>
        updateTimeEntry({ id, ...data })
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timeEntriesKeys.all });
    },
  });
};

/**
 * Bulk delete multiple time entries
 */
export const useBulkDeleteTimeEntries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const promises = ids.map((id) => deleteTimeEntry(id));
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timeEntriesKeys.all });
    },
  });
};
