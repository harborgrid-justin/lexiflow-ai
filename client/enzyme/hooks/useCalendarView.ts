/**
 * useCalendarView Hook - Calendar Management
 *
 * Manages calendar events from tasks, cases, and compliance checks.
 *
 * @see /client/enzyme/ENZYME_COMPLETE_GUIDE.md
 */

import { useState, useMemo } from 'react';
import { useApiRequest } from '../services/hooks';
import { useLatestCallback, useIsMounted } from '../index';
import type { WorkflowTask, Case, ConflictCheck } from '../../types';

export const useCalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [error, setError] = useState<string | null>(null);
  const isMounted = useIsMounted();

  // Parallel API requests with Enzyme - automatic caching
  const {
    data: tasks = [],
    isLoading: loadingTasks,
    refetch: refetchTasks,
  } = useApiRequest<WorkflowTask[]>({
    endpoint: '/workflow/tasks',
    options: {
      staleTime: 2 * 60 * 1000,
      onError: (err) => {
        console.error('Failed to fetch tasks:', err);
        if (isMounted()) {
          setError(`Failed to load calendar: ${err.message}`);
        }
      },
    },
  });

  const {
    data: cases = [],
    isLoading: loadingCases,
    refetch: refetchCases,
  } = useApiRequest<Case[]>({
    endpoint: '/cases',
    options: {
      staleTime: 5 * 60 * 1000,
    },
  });

  const {
    data: conflicts = [],
    isLoading: loadingConflicts,
    refetch: refetchConflicts,
  } = useApiRequest<ConflictCheck[]>({
    endpoint: '/compliance',
    options: {
      staleTime: 5 * 60 * 1000,
    },
  });

  const loading = loadingTasks || loadingCases || loadingConflicts;

  const events = useMemo(
    () => [
      ...tasks.map((t) => ({
        id: t.id,
        title: t.title,
        date: t.dueDate,
        type: 'task',
        priority: t.priority,
        caseId: t.caseId,
      })),
      ...cases.map((c) => ({
        id: c.id,
        title: `Filing: ${c.title}`,
        date: c.filingDate || '',
        type: 'case',
        priority: 'High',
        caseId: c.id,
      })),
      ...conflicts.map((c) => ({
        id: c.id,
        title: `Conflict Check: ${c.entityName}`,
        date: c.date,
        type: 'compliance',
        priority: 'Medium',
        caseId: undefined,
      })),
    ],
    [tasks, cases, conflicts]
  );

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => e.date === dateStr);
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const monthLabel = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const refresh = useLatestCallback(async () => {
    await Promise.all([refetchTasks(), refetchCases(), refetchConflicts()]);
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

export default useCalendarView;
