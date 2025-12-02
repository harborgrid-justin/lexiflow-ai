/**
 * Evidence Feature - API Service
 *
 * Handles all API calls for evidence vault and chain of custody.
 */

import { ApiService } from '@/services/apiService';
import type { EvidenceItem, ChainOfCustodyEvent } from '@/types';
import type { EvidenceStats } from './evidence.types';

export const EvidenceApi = {
  // Evidence Items
  getAll: async (): Promise<EvidenceItem[]> => {
    return ApiService.evidence.getAll();
  },

  getById: async (id: string): Promise<EvidenceItem> => {
    return ApiService.evidence.getById(id);
  },

  create: async (data: Partial<EvidenceItem>): Promise<EvidenceItem> => {
    return ApiService.evidence.create(data);
  },

  update: async (id: string, data: Partial<EvidenceItem>): Promise<EvidenceItem> => {
    return ApiService.evidence.update(id, data);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`/api/v1/evidence/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to delete evidence');
  },

  // Chain of Custody
  getCustodyLog: async (evidenceId: string): Promise<ChainOfCustodyEvent[]> => {
    const evidence = await ApiService.evidence.getById(evidenceId);
    return evidence.chainOfCustody || [];
  },

  addCustodyEvent: async (
    evidenceId: string,
    event: Omit<ChainOfCustodyEvent, 'id'>
  ): Promise<ChainOfCustodyEvent> => {
    const evidence = await ApiService.evidence.getById(evidenceId);
    const newEvent: ChainOfCustodyEvent = {
      ...event,
      id: `cust-${Date.now()}`
    };
    
    const updatedChain = [newEvent, ...(evidence.chainOfCustody || [])];
    await ApiService.evidence.update(evidenceId, { chainOfCustody: updatedChain });
    
    return newEvent;
  },

  // Stats
  getStats: async (): Promise<EvidenceStats> => {
    const items = await ApiService.evidence.getAll();
    
    return {
      totalItems: items.length,
      physicalItems: items.filter(e => e.type === 'Physical').length,
      digitalItems: items.filter(e => e.type === 'Digital').length,
      documentItems: items.filter(e => e.type === 'Document').length,
      forensicItems: items.filter(e => e.type === 'Forensic').length,
      admissibleCount: items.filter(e => e.admissibility === 'Admissible').length,
      challengedCount: items.filter(e => e.admissibility === 'Challenged').length,
      pendingCount: items.filter(e => e.admissibility === 'Pending').length,
      blockchainVerifiedCount: items.filter(e => !!e.blockchainHash).length
    };
  },

  // Search
  search: async (query: string): Promise<EvidenceItem[]> => {
    const items = await ApiService.evidence.getAll();
    const lowerQuery = query.toLowerCase();
    
    return items.filter(item =>
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.caseId.toLowerCase().includes(lowerQuery) ||
      item.custodian.toLowerCase().includes(lowerQuery)
    );
  },

  // Verify blockchain hash
  verifyBlockchain: async (evidenceId: string): Promise<{ verified: boolean; hash: string }> => {
    const evidence = await ApiService.evidence.getById(evidenceId);
    
    return {
      verified: !!evidence.blockchainHash,
      hash: evidence.blockchainHash || ''
    };
  }
};

export default EvidenceApi;
