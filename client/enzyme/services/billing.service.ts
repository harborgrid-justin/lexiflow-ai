// Billing Service using Enzyme API Client
// Provides type-safe billing and time entry operations

import { enzymeClient } from './client';
import { TimeEntry } from '../../types';

/**
 * Endpoint definitions for billing
 */
const ENDPOINTS = {
  timeEntries: {
    list: '/billing/time-entries',
    detail: (id: string) => `/billing/time-entries/${id}`,
  },
  stats: '/billing/stats',
  invoices: {
    list: '/billing/invoices',
    detail: (id: string) => `/billing/invoices/${id}`,
  },
} as const;

/**
 * Query parameters for listing time entries
 */
interface TimeEntryListParams {
  caseId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  billable?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Billing statistics response
 */
interface BillingStats {
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
  totalRevenue: number;
  unbilledAmount: number;
  collectedAmount: number;
}

/**
 * Billing service using Enzyme API client
 * Provides type-safe, retry-enabled, rate-limited API calls
 */
export const enzymeBillingService = {
  /**
   * Time entry operations
   */
  timeEntries: {
    /**
     * Get all time entries with optional filtering
     * @example
     * const entries = await enzymeBillingService.timeEntries.getAll({ caseId: 'case-123' });
     */
    async getAll(params?: TimeEntryListParams): Promise<TimeEntry[]> {
      const response = await enzymeClient.get<TimeEntry[]>(ENDPOINTS.timeEntries.list, {
        params: params as Record<string, string | number | boolean>,
      });
      return response.data || [];
    },

    /**
     * Get a single time entry by ID
     * @example
     * const entry = await enzymeBillingService.timeEntries.getById('entry-123');
     */
    async getById(id: string): Promise<TimeEntry> {
      const response = await enzymeClient.get<TimeEntry>(ENDPOINTS.timeEntries.detail(id));
      return response.data;
    },

    /**
     * Create a new time entry
     * @example
     * const entry = await enzymeBillingService.timeEntries.create({
     *   caseId: 'case-123',
     *   userId: 'user-123',
     *   duration: 150,
     *   description: 'Document review'
     * });
     */
    async create(data: Partial<TimeEntry>): Promise<TimeEntry> {
      const apiRequest = {
        case_id: data.caseId,
        user_id: data.userId,
        duration: data.duration,
        description: data.description,
        date: data.date,
        status: data.status,
        rate: data.rate,
        total: data.total,
      };

      const cleanRequest = Object.fromEntries(
        Object.entries(apiRequest).filter(([_, v]) => v !== undefined)
      );

      const response = await enzymeClient.post<TimeEntry>(ENDPOINTS.timeEntries.list, {
        body: cleanRequest,
      });
      return response.data;
    },

    /**
     * Update an existing time entry
     * @example
     * const updated = await enzymeBillingService.timeEntries.update('entry-123', { duration: 180 });
     */
    async update(id: string, data: Partial<TimeEntry>): Promise<TimeEntry> {
      const apiRequest = {
        duration: data.duration,
        description: data.description,
        date: data.date,
        status: data.status,
        rate: data.rate,
        total: data.total,
      };

      const cleanRequest = Object.fromEntries(
        Object.entries(apiRequest).filter(([_, v]) => v !== undefined)
      );

      const response = await enzymeClient.put<TimeEntry>(ENDPOINTS.timeEntries.detail(id), {
        body: cleanRequest,
      });
      return response.data;
    },

    /**
     * Delete a time entry
     * @example
     * await enzymeBillingService.timeEntries.delete('entry-123');
     */
    async delete(id: string): Promise<void> {
      await enzymeClient.delete(ENDPOINTS.timeEntries.detail(id));
    },
  },

  /**
   * Get billing statistics
   * @example
   * const stats = await enzymeBillingService.getStats({ caseId: 'case-123' });
   */
  async getStats(params?: {
    caseId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<BillingStats> {
    const response = await enzymeClient.get<BillingStats>(ENDPOINTS.stats, {
      params: params as Record<string, string | number | boolean>,
    });
    return response.data;
  },
};

export default enzymeBillingService;
