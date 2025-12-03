// Calendar Service using Enzyme API Client
// Provides type-safe calendar event operations

import { enzymeClient } from './client';

/**
 * Endpoint definitions for calendar
 */
const ENDPOINTS = {
  list: '/calendar',
  detail: (id: string) => `/calendar/${id}`,
  upcoming: '/calendar/upcoming',
  byType: (type: string) => `/calendar/type/${encodeURIComponent(type)}`,
} as const;

/**
 * Calendar event interface
 */
export interface CalendarEvent {
  id: string;
  title: string;
  type: 'Hearing' | 'Deposition' | 'Meeting' | 'Deadline' | 'Court Date' | 'Other';
  startDate: string;
  endDate?: string;
  allDay?: boolean;
  location?: string;
  description?: string;
  caseId?: string;
  participants?: string[];
  reminders?: string[];
  status?: 'Scheduled' | 'Completed' | 'Cancelled' | 'Rescheduled';
}

/**
 * Query parameters for listing calendar events
 */
export interface CalendarListParams {
  caseId?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  page?: number;
  limit?: number;
}

/**
 * Calendar service using Enzyme API client
 * Provides type-safe, retry-enabled, rate-limited API calls
 */
export const enzymeCalendarService = {
  /**
   * Get all calendar events with optional filtering
   * @example
   * const events = await enzymeCalendarService.getAll({ 
   *   caseId: 'case-123',
   *   startDate: '2024-01-01',
   *   endDate: '2024-12-31'
   * });
   */
  async getAll(params?: CalendarListParams): Promise<CalendarEvent[]> {
    const response = await enzymeClient.get<CalendarEvent[]>(ENDPOINTS.list, {
      params: params as Record<string, string | number | boolean>,
    });
    return response.data || [];
  },

  /**
   * Get a single calendar event by ID
   * @example
   * const event = await enzymeCalendarService.getById('event-123');
   */
  async getById(id: string): Promise<CalendarEvent> {
    const response = await enzymeClient.get<CalendarEvent>(ENDPOINTS.detail(id));
    return response.data;
  },

  /**
   * Get upcoming calendar events
   * @example
   * const upcoming = await enzymeCalendarService.getUpcoming(7); // next 7 days
   */
  async getUpcoming(days?: number): Promise<CalendarEvent[]> {
    const response = await enzymeClient.get<CalendarEvent[]>(ENDPOINTS.upcoming, {
      params: days ? { days } : undefined,
    });
    return response.data || [];
  },

  /**
   * Get calendar events by type
   * @example
   * const hearings = await enzymeCalendarService.getByType('Hearing');
   */
  async getByType(type: string): Promise<CalendarEvent[]> {
    const response = await enzymeClient.get<CalendarEvent[]>(ENDPOINTS.byType(type));
    return response.data || [];
  },

  /**
   * Create a new calendar event
   * @example
   * const event = await enzymeCalendarService.create({
   *   title: 'Motion Hearing',
   *   type: 'Hearing',
   *   startDate: '2024-03-15T10:00:00Z',
   *   caseId: 'case-123'
   * });
   */
  async create(data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const apiRequest = {
      title: data.title,
      type: data.type,
      start_date: data.startDate,
      end_date: data.endDate,
      all_day: data.allDay,
      location: data.location,
      description: data.description,
      case_id: data.caseId,
      participants: data.participants,
      reminders: data.reminders,
      status: data.status,
    };

    const cleanRequest = Object.fromEntries(
      Object.entries(apiRequest).filter(([_, v]) => v !== undefined)
    );

    const response = await enzymeClient.post<CalendarEvent>(ENDPOINTS.list, {
      body: cleanRequest,
    });
    return response.data;
  },

  /**
   * Update an existing calendar event
   * @example
   * const updated = await enzymeCalendarService.update('event-123', { status: 'Rescheduled' });
   */
  async update(id: string, data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const apiRequest = {
      title: data.title,
      type: data.type,
      start_date: data.startDate,
      end_date: data.endDate,
      all_day: data.allDay,
      location: data.location,
      description: data.description,
      participants: data.participants,
      reminders: data.reminders,
      status: data.status,
    };

    const cleanRequest = Object.fromEntries(
      Object.entries(apiRequest).filter(([_, v]) => v !== undefined)
    );

    const response = await enzymeClient.put<CalendarEvent>(ENDPOINTS.detail(id), {
      body: cleanRequest,
    });
    return response.data;
  },

  /**
   * Delete a calendar event
   * @example
   * await enzymeCalendarService.delete('event-123');
   */
  async delete(id: string): Promise<void> {
    await enzymeClient.delete(ENDPOINTS.detail(id));
  },
};

export default enzymeCalendarService;
