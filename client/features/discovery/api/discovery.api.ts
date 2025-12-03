/**
 * Discovery Feature - API Service
 *
 * Handles all API calls for discovery requests, legal holds, and privilege log.
 */

import { enzymeDiscoveryService } from '@/enzyme/services/discovery.service';
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
    return enzymeDiscoveryService.requests.getAll();
  },

  getRequest: async (id: string): Promise<DiscoveryRequest> => {
    return enzymeDiscoveryService.requests.getById(id);
  },

  createRequest: async (data: CreateDiscoveryRequestInput): Promise<DiscoveryRequest> => {
    return enzymeDiscoveryService.requests.create(data);
  },

  updateRequest: async (id: string, data: UpdateDiscoveryRequestInput): Promise<DiscoveryRequest> => {
    return enzymeDiscoveryService.requests.update(id, data);
  },

  // Legal Holds
  getLegalHolds: async (): Promise<LegalHold[]> => {
    return enzymeDiscoveryService.legalHolds.getAll();
  },

  createLegalHold: async (data: Omit<LegalHold, 'id'>): Promise<LegalHold> => {
    return enzymeDiscoveryService.legalHolds.create(data);
  },

  releaseLegalHold: async (id: string): Promise<LegalHold> => {
    return enzymeDiscoveryService.legalHolds.release(id);
  },

  // Privilege Log
  getPrivilegeLog: async (): Promise<PrivilegeLogEntry[]> => {
    return enzymeDiscoveryService.privilegeLog.getAll();
  },

  addPrivilegeEntry: async (data: Omit<PrivilegeLogEntry, 'id'>): Promise<PrivilegeLogEntry> => {
    return enzymeDiscoveryService.privilegeLog.add(data);
  },

  // Productions
  getProductions: async (requestId?: string): Promise<DiscoveryProduction[]> => {
    return enzymeDiscoveryService.productions.getAll(requestId);
  },

  createProduction: async (data: Omit<DiscoveryProduction, 'id'>): Promise<DiscoveryProduction> => {
    return enzymeDiscoveryService.productions.create(data);
  },

};

export default DiscoveryApi;
