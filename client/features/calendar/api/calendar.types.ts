/**
 * Calendar Module Types
 */

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  allDay?: boolean;
  type: CalendarEventType;
  caseId?: string;
  caseName?: string;
  location?: string;
  attendees?: EventAttendee[];
  reminders?: EventReminder[];
  status: 'scheduled' | 'completed' | 'cancelled';
  isRecurring?: boolean;
  recurrenceRule?: RecurrenceRule;
  color?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type CalendarEventType = 
  | 'hearing'
  | 'deposition'
  | 'meeting'
  | 'deadline'
  | 'court-date'
  | 'filing'
  | 'conference'
  | 'other';

export interface EventAttendee {
  id: string;
  userId?: string;
  email: string;
  name: string;
  role: 'organizer' | 'required' | 'optional';
  status: 'pending' | 'accepted' | 'declined' | 'tentative';
}

export interface EventReminder {
  type: 'email' | 'push' | 'sms';
  minutes: number;
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: string;
  count?: number;
  daysOfWeek?: number[];
}

export interface CalendarFilters {
  types?: CalendarEventType[];
  caseId?: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'all';
  search?: string;
}

export type CalendarViewMode = 'month' | 'week' | 'day' | 'agenda';
