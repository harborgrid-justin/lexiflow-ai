// Evidence Service using Enzyme API Client
// Provides type-safe evidence operations with retry and rate limiting

import { enzymeClient } from './client';
import { EvidenceItem } from '../../types';
import { ApiEvidence } from '../../shared-types';
import { transformApiEvidence } from '../../utils/type-transformers';

/**
 * Endpoint definitions for evidence
 */
const ENDPOINTS = {
  list: '/evidence',
  detail: (id: string) => `/evidence/${id}`,
} as const;

/**
 * Query parameters for listing evidence
 */
interface EvidenceListParams {
  caseId?: string;
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Evidence service using Enzyme API client
 * Provides type-safe, retry-enabled, rate-limited API calls
 */
export const enzymeEvidenceService = {
  /**
   * Get all evidence items with optional filtering
   * @example
   * const evidence = await enzymeEvidenceService.getAll({ caseId: 'case-123' });
   */
  async getAll(params?: EvidenceListParams): Promise<EvidenceItem[]> {
    const response = await enzymeClient.get<ApiEvidence[]>(ENDPOINTS.list, {
      params: params as Record<string, string | number | boolean>,
    });
    return (response.data || []).map(transformApiEvidence);
  },

  /**
   * Get a single evidence item by ID
   * @example
   * const evidence = await enzymeEvidenceService.getById('evidence-123');
   */
  async getById(id: string): Promise<EvidenceItem> {
    const response = await enzymeClient.get<ApiEvidence>(ENDPOINTS.detail(id));
    return transformApiEvidence(response.data);
  },

  /**
   * Create a new evidence item
   * @example
   * const evidence = await enzymeEvidenceService.create({ 
   *   title: 'Exhibit A', 
   *   type: 'Document', 
   *   caseId: 'case-123' 
   * });
   */
  async create(data: Partial<EvidenceItem>): Promise<EvidenceItem> {
    const apiRequest = {
      title: data.title,
      type: data.type,
      description: data.description,
      case_id: data.caseId,
      tracking_uuid: data.trackingUuid,
      blockchain_hash: data.blockchainHash,
      file_type: data.fileType,
      file_size: data.fileSize,
      collection_date: data.collectionDate,
      collected_by: data.collectedBy,
      collected_by_user_id: data.collectedByUserId,
      custodian: data.custodian,
      location: data.location,
      admissibility: data.admissibility,
      chain_of_custody: data.chainOfCustody,
      tags: data.tags,
    };

    const cleanRequest = Object.fromEntries(
      Object.entries(apiRequest).filter(([_, v]) => v !== undefined)
    );

    const response = await enzymeClient.post<ApiEvidence>(ENDPOINTS.list, {
      body: cleanRequest,
    });
    return transformApiEvidence(response.data);
  },

  /**
   * Update an existing evidence item
   * @example
   * const updated = await enzymeEvidenceService.update('evidence-123', { admissibility: 'Admissible' });
   */
  async update(id: string, data: Partial<EvidenceItem>): Promise<EvidenceItem> {
    const apiRequest = {
      title: data.title,
      type: data.type,
      description: data.description,
      tracking_uuid: data.trackingUuid,
      blockchain_hash: data.blockchainHash,
      file_type: data.fileType,
      file_size: data.fileSize,
      collection_date: data.collectionDate,
      collected_by: data.collectedBy,
      collected_by_user_id: data.collectedByUserId,
      custodian: data.custodian,
      location: data.location,
      admissibility: data.admissibility,
      chain_of_custody: data.chainOfCustody,
      tags: data.tags,
    };

    const cleanRequest = Object.fromEntries(
      Object.entries(apiRequest).filter(([_, v]) => v !== undefined)
    );

    const response = await enzymeClient.put<ApiEvidence>(ENDPOINTS.detail(id), {
      body: cleanRequest,
    });
    return transformApiEvidence(response.data);
  },

  /**
   * Delete an evidence item
   * @example
   * await enzymeEvidenceService.delete('evidence-123');
   */
  async delete(id: string): Promise<void> {
    await enzymeClient.delete(ENDPOINTS.detail(id));
  },
};

export default enzymeEvidenceService;
