
import { useState, useMemo, useEffect, useCallback } from 'react';
import { ApiService, ApiError } from '../services/apiService';
import { WorkflowTask, Case, ConflictCheck } from '../types';

export const useCalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tasks, setTasks] = useState<WorkflowTask[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [conflicts, setConflicts] = useState<ConflictCheck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [t, c, conf] = await Promise.all([
        ApiService.tasks.getAll(),
        ApiService.cases.getAll(),
        ApiService.compliance.getAll()
      ]);

      setTasks(t);
      setCases(c);
      setConflicts(conf);
    } catch (err) {
      console.error('Failed to fetch calendar data:', err);

      if (err instanceof ApiError) {
        setError(`Failed to load calendar: ${err.statusText}`);
      } else {
        setError('Failed to load calendar. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const events = useMemo(() => [
    ...tasks.map(t => ({ id: t.id, title: t.title, date: t.dueDate, type: 'task', priority: t.priority, caseId: t.caseId })),
    ...cases.map(c => ({ id: c.id, title: `Filing: ${c.title}`, date: c.filingDate, type: 'case', priority: 'High', caseId: c.id })),
    ...conflicts.map(c => ({ id: c.id, title: `Conflict Check: ${c.entityName}`, date: c.date, type: 'compliance', priority: 'Medium', caseId: undefined }))
  ], [tasks, cases, conflicts]);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  const monthLabel = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  const refresh = useCallback(() => {
    return fetchData();
  }, [fetchData]);

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
    refresh
  };
};
