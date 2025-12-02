/**
 * Discovery Feature - API Service
 *
 * Handles all API calls for discovery requests, legal holds, and privilege log.
 */

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
    const response = await fetch('/api/v1/discovery/requests', {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch discovery requests');
    return response.json();
  },

  getRequest: async (id: string): Promise<DiscoveryRequest> => {
    const response = await fetch(`/api/v1/discovery/requests/${id}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch discovery request');
    return response.json();
  },

  createRequest: async (data: CreateDiscoveryRequestInput): Promise<DiscoveryRequest> => {
    const response = await fetch('/api/v1/discovery/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create discovery request');
    return response.json();
  },

  updateRequest: async (id: string, data: UpdateDiscoveryRequestInput): Promise<DiscoveryRequest> => {
    const response = await fetch(`/api/v1/discovery/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update discovery request');
    return response.json();
  },

  // Legal Holds
  getLegalHolds: async (): Promise<LegalHold[]> => {
    const response = await fetch('/api/v1/discovery/legal-holds', {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch legal holds');
    return response.json();
  },

  createLegalHold: async (data: Omit<LegalHold, 'id'>): Promise<LegalHold> => {
    const response = await fetch('/api/v1/discovery/legal-holds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create legal hold');
    return response.json();
  },

  releaseLegalHold: async (id: string): Promise<LegalHold> => {
    const response = await fetch(`/api/v1/discovery/legal-holds/${id}/release`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to release legal hold');
    return response.json();
  },

  // Privilege Log
  getPrivilegeLog: async (): Promise<PrivilegeLogEntry[]> => {
    const response = await fetch('/api/v1/discovery/privilege-log', {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch privilege log');
    return response.json();
  },

  addPrivilegeEntry: async (data: Omit<PrivilegeLogEntry, 'id'>): Promise<PrivilegeLogEntry> => {
    const response = await fetch('/api/v1/discovery/privilege-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to add privilege entry');
    return response.json();
  },

  // Productions
  getProductions: async (requestId?: string): Promise<DiscoveryProduction[]> => {
    const url = requestId 
      ? `/api/v1/discovery/productions?requestId=${requestId}`
      : '/api/v1/discovery/productions';
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch productions');
    return response.json();
  },

  createProduction: async (data: Omit<DiscoveryProduction, 'id'>): Promise<DiscoveryProduction> => {
    const response = await fetch('/api/v1/discovery/productions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create production');
    return response.json();
  }
};

export default DiscoveryApi;
