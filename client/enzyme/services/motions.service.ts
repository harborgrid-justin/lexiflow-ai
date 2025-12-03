// Motions Service using Enzyme API Client
// Provides type-safe motion operations

import { enzymeClient } from './client';
import { Motion } from '../../types';

/**
 * Endpoint definitions for motions
 */
const ENDPOINTS = {
  list: '/motions',
  detail: (id: string) => `/motions/${id}`,
  byStatus: (status: string) => `/motions/status/${encodeURIComponent(status)}`,
} as const;

/**
 * Query parameters for listing motions
 */
interface MotionListParams {
  caseId?: string;
  status?: string;
  type?: string;
  page?: number;
  limit?: number;
}

/**
 * Motions service using Enzyme API client
 * Provides type-safe, retry-enabled, rate-limited API calls
 */
export const enzymeMotionsService = {
  /**
   * Get all motions with optional filtering
   * @example
   * const motions = await enzymeMotionsService.getAll({ caseId: 'case-123' });
   */
  async getAll(params?: MotionListParams): Promise<Motion[]> {
    const response = await enzymeClient.get<Motion[]>(ENDPOINTS.list, {
      params: params as Record<string, string | number | boolean>,
    });
    return response.data || [];
  },

  /**
   * Get a single motion by ID
   * @example
   * const motion = await enzymeMotionsService.getById('motion-123');
   */
  async getById(id: string): Promise<Motion> {
    const response = await enzymeClient.get<Motion>(ENDPOINTS.detail(id));
    return response.data;
  },

  /**
   * Get motions by status
   * @example
   * const pending = await enzymeMotionsService.getByStatus('Pending');
   */
  async getByStatus(status: string): Promise<Motion[]> {
    const response = await enzymeClient.get<Motion[]>(ENDPOINTS.byStatus(status));
    return response.data || [];
  },

  /**
   * Create a new motion
   * @example
   * const motion = await enzymeMotionsService.create({
   *   caseId: 'case-123',
   *   type: 'Motion to Dismiss',
   *   title: 'Motion to Dismiss for Failure to State a Claim'
   * });
   */
  async create(data: Partial<Motion>): Promise<Motion> {
    const apiRequest = {
      case_id: data.caseId,
      type: data.type,
      title: data.title,
      status: data.status,
      filing_date: data.filingDate,
      hearing_date: data.hearingDate,
      outcome: data.outcome,
      documents: data.documents,
      assigned_attorney: data.assignedAttorney,
      opposition_due_date: data.oppositionDueDate,
      reply_due_date: data.replyDueDate,
      created_by: data.createdBy,
      docket_entry_id: data.docketEntryId,
      pacer_doc_link: data.pacerDocLink,
    };

    const cleanRequest = Object.fromEntries(
      Object.entries(apiRequest).filter(([_, v]) => v !== undefined)
    );

    const response = await enzymeClient.post<Motion>(ENDPOINTS.list, {
      body: cleanRequest,
    });
    return response.data;
  },

  /**
   * Update an existing motion
   * @example
   * const updated = await enzymeMotionsService.update('motion-123', { status: 'Granted' });
   */
  async update(id: string, data: Partial<Motion>): Promise<Motion> {
    const apiRequest = {
      type: data.type,
      title: data.title,
      status: data.status,
      filing_date: data.filingDate,
      hearing_date: data.hearingDate,
      outcome: data.outcome,
      documents: data.documents,
      assigned_attorney: data.assignedAttorney,
      opposition_due_date: data.oppositionDueDate,
      reply_due_date: data.replyDueDate,
      created_by: data.createdBy,
      docket_entry_id: data.docketEntryId,
      pacer_doc_link: data.pacerDocLink,
    };

    const cleanRequest = Object.fromEntries(
      Object.entries(apiRequest).filter(([_, v]) => v !== undefined)
    );

    const response = await enzymeClient.put<Motion>(ENDPOINTS.detail(id), {
      body: cleanRequest,
    });
    return response.data;
  },

  /**
   * Delete a motion
   * @example
   * await enzymeMotionsService.delete('motion-123');
   */
  async delete(id: string): Promise<void> {
    await enzymeClient.delete(ENDPOINTS.detail(id));
  },
};

export default enzymeMotionsService;
