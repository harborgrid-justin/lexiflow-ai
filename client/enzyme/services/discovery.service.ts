// Discovery Service using Enzyme API Client
// Provides type-safe discovery request operations

import { enzymeClient } from './client';
import { DiscoveryRequest } from '../../types';

/**
 * Endpoint definitions for discovery
 */
const ENDPOINTS = {
  list: '/discovery',
  detail: (id: string) => `/discovery/${id}`,
  responses: (id: string) => `/discovery/${id}/responses`,
  production: (id: string) => `/discovery/${id}/production`,
} as const;

/**
 * Query parameters for listing discovery requests
 */
interface DiscoveryListParams {
  caseId?: string;
  type?: string;
  status?: string;
  direction?: 'incoming' | 'outgoing';
  page?: number;
  limit?: number;
}

/**
 * Discovery service using Enzyme API client
 * Provides type-safe, retry-enabled, rate-limited API calls
 */
export const enzymeDiscoveryService = {
  /**
   * Get all discovery requests with optional filtering
   * @example
   * const requests = await enzymeDiscoveryService.getAll({ caseId: 'case-123' });
   */
  async getAll(params?: DiscoveryListParams): Promise<DiscoveryRequest[]> {
    const response = await enzymeClient.get<DiscoveryRequest[]>(ENDPOINTS.list, {
      params: params as Record<string, string | number | boolean>,
    });
    return response.data || [];
  },

  /**
   * Get a single discovery request by ID
   * @example
   * const request = await enzymeDiscoveryService.getById('discovery-123');
   */
  async getById(id: string): Promise<DiscoveryRequest> {
    const response = await enzymeClient.get<DiscoveryRequest>(ENDPOINTS.detail(id));
    return response.data;
  },

  /**
   * Create a new discovery request
   * @example
   * const request = await enzymeDiscoveryService.create({
   *   caseId: 'case-123',
   *   type: 'Interrogatories',
   *   description: 'Initial interrogatories to defendant'
   * });
   */
  async create(data: Partial<DiscoveryRequest>): Promise<DiscoveryRequest> {
    const apiRequest = {
      case_id: data.caseId,
      type: data.type,
      title: data.title,
      description: data.description,
      status: data.status,
      due_date: data.dueDate,
      service_date: data.serviceDate,
      propounding_party: data.propoundingParty,
      responding_party: data.respondingParty,
      response_preview: data.responsePreview,
    };

    const cleanRequest = Object.fromEntries(
      Object.entries(apiRequest).filter(([_, v]) => v !== undefined)
    );

    const response = await enzymeClient.post<DiscoveryRequest>(ENDPOINTS.list, {
      body: cleanRequest,
    });
    return response.data;
  },

  /**
   * Update an existing discovery request
   * @example
   * const updated = await enzymeDiscoveryService.update('discovery-123', { status: 'Responded' });
   */
  async update(id: string, data: Partial<DiscoveryRequest>): Promise<DiscoveryRequest> {
    const apiRequest = {
      type: data.type,
      title: data.title,
      description: data.description,
      status: data.status,
      due_date: data.dueDate,
      service_date: data.serviceDate,
      propounding_party: data.propoundingParty,
      responding_party: data.respondingParty,
      response_preview: data.responsePreview,
    };

    const cleanRequest = Object.fromEntries(
      Object.entries(apiRequest).filter(([_, v]) => v !== undefined)
    );

    const response = await enzymeClient.put<DiscoveryRequest>(ENDPOINTS.detail(id), {
      body: cleanRequest,
    });
    return response.data;
  },

  /**
   * Delete a discovery request
   * @example
   * await enzymeDiscoveryService.delete('discovery-123');
   */
  async delete(id: string): Promise<void> {
    await enzymeClient.delete(ENDPOINTS.detail(id));
  },

  /**
   * Get responses for a discovery request
   * @example
   * const responses = await enzymeDiscoveryService.getResponses('discovery-123');
   */
  async getResponses(id: string): Promise<unknown[]> {
    const response = await enzymeClient.get<unknown[]>(ENDPOINTS.responses(id));
    return response.data || [];
  },

  /**
   * Add a response to a discovery request
   * @example
   * await enzymeDiscoveryService.addResponse('discovery-123', { 
   *   content: 'Response content',
   *   objections: ['Vague and ambiguous']
   * });
   */
  async addResponse(id: string, data: unknown): Promise<unknown> {
    const response = await enzymeClient.post(ENDPOINTS.responses(id), {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },
};

export default enzymeDiscoveryService;
