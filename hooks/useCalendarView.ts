
import { useState, useMemo } from 'react';
import { MOCK_TASKS } from '../data/mockWorkflow';
import { MOCK_CASES } from '../data/mockCases';
import { MOCK_CONFLICTS } from '../data/mockCompliance';

export const useCalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const events = useMemo(() => [
    ...MOCK_TASKS.map(t => ({ id: t.id, title: t.title, date: t.dueDate, type: 'task', priority: t.priority })),
    ...MOCK_CASES.map(c => ({ id: c.id, title: `Filing: ${c.title}`, date: c.filingDate, type: 'case', priority: 'High' })),
    ...MOCK_CONFLICTS.map(c => ({ id: c.id, title: `Conflict Check: ${c.entityName}`, date: c.date, type: 'compliance', priority: 'Medium' }))
  ], []);

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

  return {
    currentMonth,
    events,
    daysInMonth,
    firstDay,
    getEventsForDay,
    changeMonth,
    monthLabel
  };
};
