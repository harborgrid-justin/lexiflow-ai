/**
 * Jurisdiction Feature - API Service
 */

import type { Court, RegulatoryBody, ArbitrationOrganization, LocalRule } from './jurisdiction.types';

export const JurisdictionApi = {
  // Federal Courts
  getFederalCourts: async (): Promise<Court[]> => {
    const response = await fetch('/api/v1/jurisdiction/federal', {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch federal courts');
    return response.json();
  },

  // State Courts
  getStateCourts: async (state?: string): Promise<Court[]> => {
    const url = state 
      ? `/api/v1/jurisdiction/state?state=${state}`
      : '/api/v1/jurisdiction/state';
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch state courts');
    return response.json();
  },

  // Regulatory Bodies
  getRegulatoryBodies: async (): Promise<RegulatoryBody[]> => {
    const response = await fetch('/api/v1/jurisdiction/regulatory', {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch regulatory bodies');
    return response.json();
  },

  // Arbitration Organizations
  getArbitrationOrgs: async (): Promise<ArbitrationOrganization[]> => {
    const response = await fetch('/api/v1/jurisdiction/arbitration', {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch arbitration organizations');
    return response.json();
  },

  // Local Rules
  getLocalRules: async (courtId: string): Promise<LocalRule[]> => {
    const response = await fetch(`/api/v1/jurisdiction/courts/${courtId}/local-rules`, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch local rules');
    return response.json();
  },

  // Search
  search: async (query: string): Promise<Court[]> => {
    const response = await fetch(`/api/v1/jurisdiction/search?q=${encodeURIComponent(query)}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to search jurisdictions');
    return response.json();
  }
};

export default JurisdictionApi;
