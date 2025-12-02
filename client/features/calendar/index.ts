/**
 * Calendar Feature Module
 */

// API Hooks
export {
  calendarKeys,
  useCalendarEvents,
  useCalendarEvent,
  useCaseEvents,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
} from './api/calendar.api';

// Types
export type {
  CalendarEvent,
  CalendarEventType,
  EventAttendee,
  EventReminder,
  RecurrenceRule,
  CalendarFilters,
  CalendarViewMode,
} from './api/calendar.types';

// Store
export { useCalendarStore } from './store/calendar.store';

// Hooks
export { useCalendarView } from './hooks';

// Pages
export { CalendarPage } from './pages/CalendarPage';

