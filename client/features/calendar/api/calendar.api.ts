/**
 * Calendar API Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enzymeCalendarService, CalendarEvent } from '../../../enzyme/services/calendar.service';

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
    queryFn: () => enzymeCalendarService.getAll({ startDate: dateRange?.start, endDate: dateRange?.end }),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCalendarEvent(id: string) {
  return useQuery({
    queryKey: calendarKeys.event(id),
    queryFn: () => enzymeCalendarService.getById(id),
    enabled: !!id,
  });
}

export function useCaseEvents(caseId: string) {
  return useQuery({
    queryKey: calendarKeys.caseEvents(caseId),
    queryFn: () => enzymeCalendarService.getAll({ caseId }),
    enabled: !!caseId,
  });
}

// Mutations
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CalendarEvent>) => enzymeCalendarService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.events() });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CalendarEvent> }) =>
      enzymeCalendarService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.event(id) });
      queryClient.invalidateQueries({ queryKey: calendarKeys.events() });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await enzymeCalendarService.delete(id);
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: calendarKeys.events() });
    },
  });
}
