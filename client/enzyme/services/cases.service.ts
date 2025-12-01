// Cases Service using Enzyme API Client
// Example migration showing how to use @missionfabric-js/enzyme for API calls
// This can be used alongside or as a replacement for the existing casesService

import { enzymeClient } from './client';
import { Case, CaseStatus } from '../../types';
import { ApiCase } from '../../shared-types';
import { transformApiCase } from '../../utils/type-transformers';

/**
 * Type-safe endpoint definitions for cases
 * Following Enzyme's pattern for organized API endpoints
 * Note: enzymeClient baseUrl already includes /api/v1, so paths start with /cases
 */
const ENDPOINTS = {
  list: '/cases',
  detail: (id: string) => `/cases/${id}`,
  documents: (id: string) => `/cases/${id}/documents`,
  team: (id: string) => `/cases/${id}/team`,
  workflow: (id: string) => `/cases/${id}/workflow`,
  timeline: (id: string) => `/cases/${id}/timeline`,
  stats: '/cases/stats',
} as const;

/**
 * Query parameters for listing cases
 */
interface CaseListParams {
  status?: CaseStatus;
  clientId?: string;
  assigneeId?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'filingDate' | 'title';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Cases service using Enzyme API client
 * Provides type-safe, retry-enabled, rate-limited API calls
 */
export const enzymeCasesService = {
  /**
   * Get all cases with optional filtering
   * @example
   * const cases = await enzymeCasesService.getAll({ status: 'Active' });
   */
  async getAll(params?: CaseListParams): Promise<Case[]> {
    const response = await enzymeClient.get<ApiCase[]>(ENDPOINTS.list, { 
      params: params as Record<string, string | number | boolean> 
    });
    return response.data.map(transformApiCase);
  },

  /**
   * Get a single case by ID
   * @example
   * const caseData = await enzymeCasesService.getById('case-123');
   */
  async getById(id: string): Promise<Case> {
    const response = await enzymeClient.get<ApiCase>(ENDPOINTS.detail(id));
    return transformApiCase(response.data);
  },

  /**
   * Create a new case
   * @example
   * const newCase = await enzymeCasesService.create({ title: 'New Case', client: 'Acme Corp' });
   */
  async create(data: Partial<Case>): Promise<Case> {
    // Transform frontend Case to API format
    const apiRequest = {
      title: data.title,
      client_name: data.client,
      opposing_counsel: data.opposingCounsel,
      status: data.status,
      filing_date: data.filingDate,
      description: data.description,
      value: data.value,
      matter_type: data.matterType,
      jurisdiction: data.jurisdiction,
      court: data.court,
      billing_model: data.billingModel,
      judge: data.judge,
      owner_org_id: data.ownerOrgId,
    };
    
    // Remove undefined values
    const cleanRequest = Object.fromEntries(
      Object.entries(apiRequest).filter(([_, v]) => v !== undefined)
    );
    
    const response = await enzymeClient.post<ApiCase>(ENDPOINTS.list, { 
      body: cleanRequest 
    });
    return transformApiCase(response.data);
  },

  /**
   * Update an existing case
   * @example
   * const updated = await enzymeCasesService.update('case-123', { status: 'Closed' });
   */
  async update(id: string, data: Partial<Case>): Promise<Case> {
    const apiRequest = {
      title: data.title,
      client_name: data.client,
      opposing_counsel: data.opposingCounsel,
      status: data.status,
      filing_date: data.filingDate,
      description: data.description,
      value: data.value,
      matter_type: data.matterType,
      jurisdiction: data.jurisdiction,
      court: data.court,
      billing_model: data.billingModel,
      judge: data.judge,
      owner_org_id: data.ownerOrgId,
    };
    
    const cleanRequest = Object.fromEntries(
      Object.entries(apiRequest).filter(([_, v]) => v !== undefined)
    );
    
    const response = await enzymeClient.put<ApiCase>(ENDPOINTS.detail(id), { 
      body: cleanRequest 
    });
    return transformApiCase(response.data);
  },

  /**
   * Delete a case
   * @example
   * await enzymeCasesService.delete('case-123');
   */
  async delete(id: string): Promise<void> {
    await enzymeClient.delete(ENDPOINTS.detail(id));
  },

  /**
   * Get case statistics
   */
  async getStats(): Promise<{
    total: number;
    active: number;
    closed: number;
    pending: number;
  }> {
    const response = await enzymeClient.get<{
      total: number;
      active: number;
      closed: number;
      pending: number;
    }>(ENDPOINTS.stats);
    return response.data;
  },

  /**
   * Get documents for a case
   */
  async getDocuments(caseId: string) {
    const response = await enzymeClient.get(ENDPOINTS.documents(caseId));
    return response.data;
  },

  /**
   * Get team members for a case
   */
  async getTeam(caseId: string) {
    const response = await enzymeClient.get(ENDPOINTS.team(caseId));
    return response.data;
  },
};

export default enzymeCasesService;
