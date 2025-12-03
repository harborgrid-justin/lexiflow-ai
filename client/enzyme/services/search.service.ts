// Search Service using Enzyme API Client
// Provides type-safe search operations including semantic search and legal research

import { enzymeClient } from './client';
import { ResearchSession } from '../../types';
import { SemanticSearchResult } from '../../services/api-error';

/**
 * Endpoint definitions for search
 */
const ENDPOINTS = {
  semantic: '/search/semantic',
  hybrid: '/search/hybrid',
  similarDocuments: (id: string) => `/search/similar-documents/${id}`,
  legalCitations: '/search/legal-citations',
  queryHistory: '/search/query-history',
  legalResearch: '/search/legal-research',
  caseLaw: '/search/case-law',
  statutes: '/search/statutes',
  legalNews: '/search/legal-news',
  history: '/search/history',
  sessions: '/search/sessions',
  sessionFeedback: (id: string) => `/search/sessions/${id}/feedback`,
  perform: '/search',
} as const;

/**
 * Legal research result item
 */
interface LegalResearchResultItem {
  title: string;
  url: string;
  snippet: string;
  source: string;
  relevanceScore?: number;
}

/**
 * Legal research response
 */
interface LegalResearchResponse {
  query: string;
  jurisdiction?: string;
  results: {
    caseLaw?: LegalResearchResultItem[];
    statutes?: LegalResearchResultItem[];
    articles?: LegalResearchResultItem[];
    general?: LegalResearchResultItem[];
    news?: LegalResearchResultItem[];
  };
  totalResults: number;
  timestamp: string;
}

/**
 * Search service using Enzyme API client
 * Provides type-safe, retry-enabled, rate-limited API calls
 */
export const enzymeSearchService = {
  /**
   * Perform semantic search
   * @example
   * const results = await enzymeSearchService.semantic('contract breach remedies', { limit: 10 });
   */
  async semantic(
    query: string,
    options?: { limit?: number; threshold?: number; embedding?: number[] }
  ): Promise<SemanticSearchResult[]> {
    const response = await enzymeClient.post<SemanticSearchResult[]>(ENDPOINTS.semantic, {
      body: {
        query,
        limit: options?.limit,
        threshold: options?.threshold,
        embedding: options?.embedding,
      },
    });
    return response.data || [];
  },

  /**
   * Perform hybrid search (semantic + keyword)
   * @example
   * const results = await enzymeSearchService.hybrid('motion to dismiss', { semanticWeight: 0.7 });
   */
  async hybrid(
    query: string,
    options?: { limit?: number; semanticWeight?: number; embedding?: number[] }
  ): Promise<SemanticSearchResult[]> {
    const response = await enzymeClient.post<SemanticSearchResult[]>(ENDPOINTS.hybrid, {
      body: {
        query,
        limit: options?.limit,
        semanticWeight: options?.semanticWeight,
        embedding: options?.embedding,
      },
    });
    return response.data || [];
  },

  /**
   * Find similar documents
   * @example
   * const similar = await enzymeSearchService.findSimilarDocuments('doc-123', 5);
   */
  async findSimilarDocuments(documentId: string, limit?: number): Promise<SemanticSearchResult[]> {
    const response = await enzymeClient.get<SemanticSearchResult[]>(
      ENDPOINTS.similarDocuments(documentId),
      { params: limit ? { limit } : undefined }
    );
    return response.data || [];
  },

  /**
   * Extract legal citations from text
   * @example
   * const { citations } = await enzymeSearchService.extractLegalCitations('The court in Brown v. Board...');
   */
  async extractLegalCitations(
    text: string,
    documentId?: string
  ): Promise<{ citations: string[]; count: number }> {
    const response = await enzymeClient.post<{ citations: string[]; count: number }>(
      ENDPOINTS.legalCitations,
      { body: { text, documentId } }
    );
    return response.data;
  },

  /**
   * Get query history
   * @example
   * const history = await enzymeSearchService.getQueryHistory(20);
   */
  async getQueryHistory(limit?: number): Promise<unknown[]> {
    const response = await enzymeClient.get<unknown[]>(ENDPOINTS.queryHistory, {
      params: limit ? { limit } : undefined,
    });
    return response.data || [];
  },

  /**
   * Perform comprehensive legal research
   * @example
   * const research = await enzymeSearchService.legalResearch({
   *   query: 'summary judgment standard',
   *   jurisdiction: 'federal',
   *   includeCaseLaw: true,
   *   includeStatutes: true
   * });
   */
  async legalResearch(params: {
    query: string;
    jurisdiction?: string;
    includeCaseLaw?: boolean;
    includeStatutes?: boolean;
    includeArticles?: boolean;
    includeNews?: boolean;
  }): Promise<LegalResearchResponse> {
    const response = await enzymeClient.post<LegalResearchResponse>(ENDPOINTS.legalResearch, {
      body: params,
    });
    return response.data;
  },

  /**
   * Search case law
   * @example
   * const cases = await enzymeSearchService.searchCaseLaw('negligence standard', 'california');
   */
  async searchCaseLaw(query: string, jurisdiction?: string): Promise<LegalResearchResultItem[]> {
    const response = await enzymeClient.post<LegalResearchResultItem[]>(ENDPOINTS.caseLaw, {
      body: { query, jurisdiction },
    });
    return response.data || [];
  },

  /**
   * Search statutes
   * @example
   * const statutes = await enzymeSearchService.searchStatutes('civil procedure', 'federal');
   */
  async searchStatutes(query: string, jurisdiction?: string): Promise<LegalResearchResultItem[]> {
    const response = await enzymeClient.post<LegalResearchResultItem[]>(ENDPOINTS.statutes, {
      body: { query, jurisdiction },
    });
    return response.data || [];
  },

  /**
   * Search legal news
   * @example
   * const news = await enzymeSearchService.searchLegalNews('supreme court ruling', 30);
   */
  async searchLegalNews(query: string, daysBack?: number): Promise<LegalResearchResultItem[]> {
    const response = await enzymeClient.post<LegalResearchResultItem[]>(ENDPOINTS.legalNews, {
      body: { query, daysBack },
    });
    return response.data || [];
  },

  /**
   * Get research session history
   * @example
   * const sessions = await enzymeSearchService.getResearchHistory();
   */
  async getResearchHistory(): Promise<ResearchSession[]> {
    const response = await enzymeClient.get<ResearchSession[]>(ENDPOINTS.history);
    return response.data || [];
  },

  /**
   * Save a research session
   * @example
   * const session = await enzymeSearchService.saveResearchSession({ query: 'contract law', response: '...' });
   */
  async saveResearchSession(data: Partial<ResearchSession>): Promise<ResearchSession> {
    const response = await enzymeClient.post<ResearchSession>(ENDPOINTS.sessions, {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  /**
   * Update research feedback
   * @example
   * await enzymeSearchService.updateResearchFeedback('session-123', 'positive');
   */
  async updateResearchFeedback(id: string, feedback: 'positive' | 'negative'): Promise<void> {
    await enzymeClient.put(ENDPOINTS.sessionFeedback(id), {
      body: { feedback },
    });
  },

  /**
   * Perform a general search
   * @example
   * const results = await enzymeSearchService.perform('contract terms');
   */
  async perform(query: string): Promise<unknown> {
    const response = await enzymeClient.post(ENDPOINTS.perform, {
      body: { query },
    });
    return response.data;
  },
};

export default enzymeSearchService;
