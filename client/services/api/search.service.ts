// Search Service
import { ResearchSession } from '../../types';
import { SemanticSearchResult } from '../api-error';
import { fetchJson, postJson, putJson, buildQueryString } from '../http-client';

export const searchService = {
  semantic: (query: string, options?: { limit?: number; threshold?: number; embedding?: number[] }) =>
    postJson<SemanticSearchResult[]>('/search/semantic', {
      query,
      limit: options?.limit,
      threshold: options?.threshold,
      embedding: options?.embedding
    }),

  hybrid: (query: string, options?: { limit?: number; semanticWeight?: number; embedding?: number[] }) =>
    postJson<SemanticSearchResult[]>('/search/hybrid', {
      query,
      limit: options?.limit,
      semanticWeight: options?.semanticWeight,
      embedding: options?.embedding
    }),

  findSimilarDocuments: (documentId: string, limit?: number) =>
    fetchJson<SemanticSearchResult[]>(`/search/similar-documents/${documentId}${buildQueryString({ limit })}`),

  extractLegalCitations: (text: string, documentId?: string) =>
    postJson<{ citations: string[]; count: number }>('/search/legal-citations', { text, documentId }),

  getQueryHistory: (limit?: number) =>
    fetchJson<any[]>(`/search/query-history${buildQueryString({ limit })}`),

  legalResearch: (params: {
    query: string;
    jurisdiction?: string;
    includeCaseLaw?: boolean;
    includeStatutes?: boolean;
    includeArticles?: boolean;
    includeNews?: boolean;
  }) => postJson<{
    query: string;
    jurisdiction?: string;
    results: {
      caseLaw?: Array<{
        title: string;
        url: string;
        snippet: string;
        source: string;
        relevanceScore?: number;
      }>;
      statutes?: Array<{
        title: string;
        url: string;
        snippet: string;
        source: string;
        relevanceScore?: number;
      }>;
      articles?: Array<{
        title: string;
        url: string;
        snippet: string;
        source: string;
        relevanceScore?: number;
      }>;
      general?: Array<{
        title: string;
        url: string;
        snippet: string;
        source: string;
        relevanceScore?: number;
      }>;
      news?: Array<{
        title: string;
        url: string;
        snippet: string;
        source: string;
        relevanceScore?: number;
      }>;
    };
    totalResults: number;
    timestamp: string;
  }>('/search/legal-research', params),

  searchCaseLaw: (query: string, jurisdiction?: string) =>
    postJson<Array<{
      title: string;
      url: string;
      snippet: string;
      source: string;
      relevanceScore?: number;
    }>>('/search/case-law', { query, jurisdiction }),

  searchStatutes: (query: string, jurisdiction?: string) =>
    postJson<Array<{
      title: string;
      url: string;
      snippet: string;
      source: string;
      relevanceScore?: number;
    }>>('/search/statutes', { query, jurisdiction }),

  searchLegalNews: (query: string, daysBack?: number) =>
    postJson<Array<{
      title: string;
      url: string;
      snippet: string;
      source: string;
      relevanceScore?: number;
    }>>('/search/legal-news', { query, daysBack }),

  getResearchHistory: () =>
    fetchJson<ResearchSession[]>('/search/history'),

  saveResearchSession: (data: Partial<ResearchSession>) =>
    postJson<ResearchSession>('/search/sessions', data),

  updateResearchFeedback: (id: string, feedback: 'positive' | 'negative') =>
    putJson<void>(`/search/sessions/${id}/feedback`, { feedback }),

  perform: (query: string) =>
    postJson<any>('/search', { query }),
};
