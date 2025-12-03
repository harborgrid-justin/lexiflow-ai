// Docket Service using Enzyme API Client
import { enzymeClient } from './client';

const DOCKET_ENDPOINTS = {
  entries: (caseId: string) => `/docket-entries?case_id=${caseId}`,
  create: '/docket-entries',
  consolidatedCases: (caseId: string) => `/consolidated-cases?case_id=${caseId}`,
  createConsolidatedCase: '/consolidated-cases',
  attorneys: (partyId: string) => `/attorneys?party_id=${partyId}`,
  createAttorney: '/attorneys',
  updateAttorney: (id: string) => `/attorneys/${id}`,
} as const;

export const enzymeDocketService = {
  async getDocketEntries(caseId: string): Promise<any[]> {
    const response = await enzymeClient.get<any[]>(DOCKET_ENDPOINTS.entries(caseId));
    return response.data || [];
  },

  async createDocketEntry(data: any): Promise<any> {
    const response = await enzymeClient.post<any>(DOCKET_ENDPOINTS.create, {
      body: data,
    });
    return response.data;
  },

  async getConsolidatedCases(caseId: string): Promise<any[]> {
    const response = await enzymeClient.get<any[]>(DOCKET_ENDPOINTS.consolidatedCases(caseId));
    return response.data || [];
  },

  async createConsolidatedCase(data: any): Promise<any> {
    const response = await enzymeClient.post<any>(DOCKET_ENDPOINTS.createConsolidatedCase, {
      body: data,
    });
    return response.data;
  },

  async getAttorneys(partyId: string): Promise<any[]> {
    const response = await enzymeClient.get<any[]>(DOCKET_ENDPOINTS.attorneys(partyId));
    return response.data || [];
  },

  async createAttorney(data: any): Promise<any> {
    const response = await enzymeClient.post<any>(DOCKET_ENDPOINTS.createAttorney, {
      body: data,
    });
    return response.data;
  },

  async updateAttorney(id: string, data: any): Promise<any> {
    const response = await enzymeClient.put<any>(DOCKET_ENDPOINTS.updateAttorney(id), {
      body: data,
    });
    return response.data;
  },
};
