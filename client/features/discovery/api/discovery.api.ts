/**
 * Discovery Feature - API Service
 *
 * Handles all API calls for discovery requests, legal holds, and privilege log.
 */

import { enzymeClient } from '@/enzyme';
import type { DiscoveryRequest } from '@/types';
import type {
  LegalHold,
  PrivilegeLogEntry,
  DiscoveryProduction,
  CreateDiscoveryRequestInput,
  UpdateDiscoveryRequestInput
} from './discovery.types';

export const DiscoveryApi = {
  // Discovery Requests
  getRequests: async (): Promise<DiscoveryRequest[]> => {
    const { data } = await enzymeClient.get<DiscoveryRequest[]>('/discovery/requests');
    return data;
  },

  getRequest: async (id: string): Promise<DiscoveryRequest> => {
    const { data } = await enzymeClient.get<DiscoveryRequest>(`/discovery/requests/${id}`);
    return data;
  },

  createRequest: async (data: CreateDiscoveryRequestInput): Promise<DiscoveryRequest> => {
    const { data: response } = await enzymeClient.post<DiscoveryRequest>('/discovery/requests', data);
    return response;
  },

  updateRequest: async (id: string, data: UpdateDiscoveryRequestInput): Promise<DiscoveryRequest> => {
    const { data: response } = await enzymeClient.put<DiscoveryRequest>(`/discovery/requests/${id}`, data);
    return response;
  },

  // Legal Holds
  getLegalHolds: async (): Promise<LegalHold[]> => {
    const { data } = await enzymeClient.get<LegalHold[]>('/discovery/legal-holds');
    return data;
  },

  createLegalHold: async (data: Omit<LegalHold, 'id'>): Promise<LegalHold> => {
    const { data: response } = await enzymeClient.post<LegalHold>('/discovery/legal-holds', data);
    return response;
  },

  releaseLegalHold: async (id: string): Promise<LegalHold> => {
    const { data: response } = await enzymeClient.post<LegalHold>(`/discovery/legal-holds/${id}/release`);
    return response;
  },

  // Privilege Log
  getPrivilegeLog: async (): Promise<PrivilegeLogEntry[]> => {
    const { data } = await enzymeClient.get<PrivilegeLogEntry[]>('/discovery/privilege-log');
    return data;
  },

  addPrivilegeEntry: async (data: Omit<PrivilegeLogEntry, 'id'>): Promise<PrivilegeLogEntry> => {
    const { data: response } = await enzymeClient.post<PrivilegeLogEntry>('/discovery/privilege-log', data);
    return response;
  },

  // Productions
  getProductions: async (requestId?: string): Promise<DiscoveryProduction[]> => {
    const url = requestId 
      ? `/discovery/productions?requestId=${requestId}`
      : '/discovery/productions';
    const { data } = await enzymeClient.get<DiscoveryProduction[]>(url);
    return data;
  },

  createProduction: async (data: Omit<DiscoveryProduction, 'id'>): Promise<DiscoveryProduction> => {
    const { data: response } = await enzymeClient.post<DiscoveryProduction>('/discovery/productions', data);
    return response;
  },

};

export default DiscoveryApi;
