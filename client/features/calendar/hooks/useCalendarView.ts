/**
 * useCalendarView Hook
 *
 * Data fetching and state management for the calendar view.
 * Aggregates tasks, cases, and compliance events for display.
 */

import { useState, useMemo } from 'react';
import { useApiRequest, useLatestCallback, useIsMounted } from '@/enzyme';
import { ApiService } from '@/services/apiService';
import type { WorkflowTask, Case, ConflictCheck } from '@/types';

interface CalendarEvent {
  id: string;
  title: string;
  date: string | undefined;
  type: 'task' | 'case' | 'compliance';
  priority: string;
  caseId?: string;
}

export const useCalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const isMounted = useIsMounted();

  // Fetch tasks
  const { data: tasks = [], isLoading: loadingTasks } = useApiRequest<WorkflowTask[]>({
    endpoint: '/workflow/tasks',
    options: {
      staleTime: 2 * 60 * 1000, // 2 min cache
      onError: (err) => {
        if (isMounted()) {
          setError('Failed to load tasks');
        }
      }
    }
  });

  // Fetch cases
  const { data: cases = [], isLoading: loadingCases } = useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      try {
        return (await ApiService.cases.getAll()) as Case[];
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  // Fetch compliance conflicts
  const { data: conflicts = [], isLoading: loadingConflicts } = useQuery({
    queryKey: ['compliance'],
    queryFn: async () => {
      try {
        return (await ApiService.compliance.getAll()) as ConflictCheck[];
      } catch {
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  const loading = loadingTasks || loadingCases || loadingConflicts;

  const events = useMemo<CalendarEvent[]>(() => {
    return [
      ...tasks.map((t) => ({
        id: t.id,
        title: t.title,
        date: t.dueDate,
        type: 'task' as const,
        priority: t.priority,
        caseId: t.caseId,
      })),
      ...cases.map((c) => ({
        id: c.id,
        title: `Filing: ${c.title}`,
        date: c.filingDate,
        type: 'case' as const,
        priority: 'High',
        caseId: c.id,
      })),
      ...conflicts.map((c) => ({
        id: c.id,
        title: `Conflict Check: ${c.entityName}`,
        date: c.date,
        type: 'compliance' as const,
        priority: 'Medium',
        caseId: undefined,
      })),
    ];
  }, [tasks, cases, conflicts]);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => e.date === dateStr);
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1)
    );
  };

  const monthLabel = currentMonth.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const refresh = useLatestCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['workflow', 'tasks'] });
    queryClient.invalidateQueries({ queryKey: ['cases'] });
    queryClient.invalidateQueries({ queryKey: ['compliance'] });
  });

  return {
    currentMonth,
    events,
    daysInMonth,
    firstDay,
    getEventsForDay,
    changeMonth,
    monthLabel,
    loading,
    error,
    refresh,
  };
};
