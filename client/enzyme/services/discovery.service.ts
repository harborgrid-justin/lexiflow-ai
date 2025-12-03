// Discovery Service using Enzyme API Client
// Provides type-safe discovery request operations

import { enzymeClient } from './client';
import { DiscoveryRequest } from '../../types';
import { LegalHold, PrivilegeLogEntry, DiscoveryProduction, CreateDiscoveryRequestInput, UpdateDiscoveryRequestInput } from '../../features/discovery/api/discovery.types';

/**
 * Endpoint definitions for discovery
 */
const ENDPOINTS = {
  requests: {
    list: '/discovery/requests',
    detail: (id: string) => `/discovery/requests/${id}`,
  },
  legalHolds: {
    list: '/discovery/legal-holds',
    detail: (id: string) => `/discovery/legal-holds/${id}`,
    release: (id: string) => `/discovery/legal-holds/${id}/release`,
  },
  privilegeLog: {
    list: '/discovery/privilege-log',
  },
  productions: {
    list: '/discovery/productions',
  },
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
   * Discovery Requests
   */
  requests: {
    /**
     * Get all discovery requests
     */
    async getAll(params?: DiscoveryListParams): Promise<DiscoveryRequest[]> {
      const response = await enzymeClient.get<DiscoveryRequest[]>(ENDPOINTS.requests.list, {
        params: params as Record<string, string | number | boolean>,
      });
      return response.data || [];
    },

    /**
     * Get a single discovery request by ID
     */
    async getById(id: string): Promise<DiscoveryRequest> {
      const response = await enzymeClient.get<DiscoveryRequest>(ENDPOINTS.requests.detail(id));
      return response.data;
    },

    /**
     * Create a new discovery request
     */
    async create(data: CreateDiscoveryRequestInput): Promise<DiscoveryRequest> {
      const response = await enzymeClient.post<DiscoveryRequest>(ENDPOINTS.requests.list, {
        body: data as Record<string, unknown>,
      });
      return response.data;
    },

    /**
     * Update an existing discovery request
     */
    async update(id: string, data: UpdateDiscoveryRequestInput): Promise<DiscoveryRequest> {
      const response = await enzymeClient.put<DiscoveryRequest>(ENDPOINTS.requests.detail(id), {
        body: data as Record<string, unknown>,
      });
      return response.data;
    },
  },

  /**
   * Legal Holds
   */
  legalHolds: {
    async getAll(): Promise<LegalHold[]> {
      const response = await enzymeClient.get<LegalHold[]>(ENDPOINTS.legalHolds.list);
      return response.data || [];
    },

    async create(data: Omit<LegalHold, 'id'>): Promise<LegalHold> {
      const response = await enzymeClient.post<LegalHold>(ENDPOINTS.legalHolds.list, {
        body: data as Record<string, unknown>,
      });
      return response.data;
    },

    async release(id: string): Promise<LegalHold> {
      const response = await enzymeClient.post<LegalHold>(ENDPOINTS.legalHolds.release(id));
      return response.data;
    },
  },

  /**
   * Privilege Log
   */
  privilegeLog: {
    async getAll(): Promise<PrivilegeLogEntry[]> {
      const response = await enzymeClient.get<PrivilegeLogEntry[]>(ENDPOINTS.privilegeLog.list);
      return response.data || [];
    },

    async add(data: Omit<PrivilegeLogEntry, 'id'>): Promise<PrivilegeLogEntry> {
      const response = await enzymeClient.post<PrivilegeLogEntry>(ENDPOINTS.privilegeLog.list, {
        body: data as Record<string, unknown>,
      });
      return response.data;
    },
  },

  /**
   * Productions
   */
  productions: {
    async getAll(requestId?: string): Promise<DiscoveryProduction[]> {
      const response = await enzymeClient.get<DiscoveryProduction[]>(ENDPOINTS.productions.list, {
        params: requestId ? { requestId } : undefined,
      });
      return response.data || [];
    },

    async create(data: Omit<DiscoveryProduction, 'id'>): Promise<DiscoveryProduction> {
      const response = await enzymeClient.post<DiscoveryProduction>(ENDPOINTS.productions.list, {
        body: data as Record<string, unknown>,
      });
      return response.data;
    },
  },

  // Legacy methods for backward compatibility (mapped to new structure)
  async getAll(params?: DiscoveryListParams): Promise<DiscoveryRequest[]> {
    return enzymeDiscoveryService.requests.getAll(params);
  },
  async getById(id: string): Promise<DiscoveryRequest> {
    return enzymeDiscoveryService.requests.getById(id);
  },
  async create(data: any): Promise<DiscoveryRequest> {
    return enzymeDiscoveryService.requests.create(data);
  },
  async update(id: string, data: any): Promise<DiscoveryRequest> {
    return enzymeDiscoveryService.requests.update(id, data);
  },
};

export default enzymeDiscoveryService;

