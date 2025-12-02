/**
 * Calendar API Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/services/apiService';

// Query Keys
export const calendarKeys = {
  all: ['calendar'] as const,
  events: () => [...calendarKeys.all, 'events'] as const,
  event: (id: string) => [...calendarKeys.events(), id] as const,
  dateRange: (start: string, end: string) => [...calendarKeys.events(), start, end] as const,
  caseEvents: (caseId: string) => [...calendarKeys.events(), 'case', caseId] as const,
};

// Queries
export function useCalendarEvents(dateRange?: { start: string; end: string }) {
  return useQuery({
    queryKey: dateRange ? calendarKeys.dateRange(dateRange.start, dateRange.end) : calendarKeys.events(),
    queryFn: () => ApiService.calendar.getAll(undefined, dateRange?.start, dateRange?.end),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCalendarEvent(id: string) {
  return useQuery({
    queryKey: calendarKeys.event(id),
    queryFn: () => ApiService.calendar.getById(id),
    enabled: !!id,
  });
}

export function useCaseEvents(caseId: string) {
  return useQuery({
    queryKey: calendarKeys.caseEvents(caseId),
    queryFn: () => ApiService.calendar.getAll(caseId),
    enabled: !!caseId,
  });
}

// Mutations
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => ApiService.calendar.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.events() });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      ApiService.calendar.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.event(id) });
      queryClient.invalidateQueries({ queryKey: calendarKeys.events() });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    // Note: Delete not available in API yet - placeholder for future implementation
    mutationFn: async (id: string) => {
      console.warn('Calendar delete not implemented in API');
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.events() });
    },
  });
}
