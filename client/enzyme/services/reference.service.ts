// Reference Service using Enzyme API Client
import { enzymeClient } from './client';
import { Reference } from '../types';

const REFERENCE_ENDPOINTS = {
  list: '/references',
  lookup: '/references/lookup',
  crossReference: '/references/cross-reference',
  knowledgeGraph: (id: string) => `/references/${id}/knowledge-graph`,
  semanticSearch: '/references/semantic-search',
  checkAuthority: (id: string) => `/references/${id}/authority`,
  network: (id: string) => `/references/${id}/network`,
  bibliography: '/references/bibliography',
} as const;

export const enzymeReferenceService = {
  async getAll(params?: { query?: string }): Promise<Reference[]> {
    const response = await enzymeClient.get<Reference[]>(REFERENCE_ENDPOINTS.list, {
      params: params as Record<string, string | number | boolean>,
    });
    return response.data || [];
  },

  async lookup(query: string): Promise<Reference | null> {
    const response = await enzymeClient.get<Reference>(REFERENCE_ENDPOINTS.lookup, {
      params: { query },
    });
    return response.data;
  },

  async findCrossReferences(documentId: string): Promise<Reference[]> {
    const response = await enzymeClient.get<Reference[]>(REFERENCE_ENDPOINTS.crossReference, {
      params: { documentId },
    });
    return response.data || [];
  },

  async getKnowledgeGraph(id: string): Promise<any> {
    const response = await enzymeClient.get<any>(REFERENCE_ENDPOINTS.knowledgeGraph(id));
    return response.data;
  },

  async semanticSearch(query: string): Promise<Reference[]> {
    const response = await enzymeClient.post<Reference[]>(REFERENCE_ENDPOINTS.semanticSearch, {
      body: { query },
    });
    return response.data || [];
  },

  async checkAuthority(id: string): Promise<{ status: string; reason: string }> {
    const response = await enzymeClient.get<{ status: string; reason: string }>(REFERENCE_ENDPOINTS.checkAuthority(id));
    return response.data;
  },

  async getReferenceNetwork(id: string): Promise<any> {
    const response = await enzymeClient.get<any>(REFERENCE_ENDPOINTS.network(id));
    return response.data;
  },

  async generateBibliography(referenceIds: string[], style: string): Promise<string> {
    const response = await enzymeClient.post<{ bibliography: string }>(REFERENCE_ENDPOINTS.bibliography, {
      body: { referenceIds, style },
    });
    return response.data.bibliography;
  },
};
