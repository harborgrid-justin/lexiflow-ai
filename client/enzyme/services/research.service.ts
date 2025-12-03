// Research Service using Enzyme API Client
// Provides type-safe legal research operations

import { enzymeClient } from './client';
import {
  SearchQuery,
  SearchResponse,
  SearchResult,
  CaseAnalysis,
  AIAnalysisResponse,
  CitationCheckResult,
  CitationGraph,
  SavedSearch,
  ResearchFolder,
  ResearchHistoryItem,
  SearchSuggestion,
  SearchTemplate,
  Statute,
  SecondarySource,
  CitationAlert,
  CitationValidation,
} from '../../features/research/api/research.types';

const ENDPOINTS = {
  search: {
    base: '/search',
    naturalLanguage: '/search/natural-language',
    suggestions: '/search/suggestions',
    templates: '/search/templates',
  },
  research: {
    caselaw: '/research/caselaw',
    statutes: '/research/statutes',
    statuteDetail: (id: string) => `/research/statutes/${id}`,
    statuteCases: (id: string) => `/research/statutes/${id}/cases`,
    secondary: '/research/secondary',
    cases: {
      analysis: (id: string) => `/research/cases/${id}/analysis`,
      similar: (id: string) => `/research/cases/${id}/similar`,
      citing: (id: string) => `/research/cases/${id}/citing`,
      cited: (id: string) => `/research/cases/${id}/cited`,
      citationGraph: (id: string) => `/research/cases/${id}/citation-graph`,
    },
    citations: {
      validate: '/research/citations/validate',
    },
    history: {
      base: '/research/history',
      item: (id: string) => `/research/history/${id}`,
    },
    savedSearches: {
      base: '/research/saved-searches',
      detail: (id: string) => `/research/saved-searches/${id}`,
      execute: (id: string) => `/research/saved-searches/${id}/execute`,
    },
    folders: {
      base: '/research/folders',
      detail: (id: string) => `/research/folders/${id}`,
      cases: (id: string) => `/research/folders/${id}/cases`,
      case: (folderId: string, caseId: string) => `/research/folders/${folderId}/cases/${caseId}`,
      export: (id: string) => `/research/folders/${id}/export`,
    },
    alerts: {
      base: '/research/citation-alerts',
      detail: (id: string) => `/research/citation-alerts/${id}`,
      toggle: (id: string) => `/research/citation-alerts/${id}/toggle`,
    },
    export: '/research/export',
  },
  ai: {
    analyzeCase: '/ai/analyze-case',
    opposingArguments: '/ai/opposing-arguments',
    citationCheck: '/ai/citation-check',
    researchSummary: '/ai/research-summary',
    extractHoldings: '/ai/extract-holdings',
    generateMemo: '/ai/generate-memo',
    casesLikeThis: (id: string) => `/ai/cases-like-this/${id}`,
  },
} as const;

export const enzymeResearchService = {
  search: {
    async perform(query: SearchQuery): Promise<SearchResponse> {
      const response = await enzymeClient.post<SearchResponse>(ENDPOINTS.search.base, { body: query });
      return response.data;
    },
    async naturalLanguage(query: string, filters?: SearchQuery['filters']): Promise<SearchResponse> {
      const response = await enzymeClient.post<SearchResponse>(ENDPOINTS.search.naturalLanguage, {
        body: { query, filters },
      });
      return response.data;
    },
    async getSuggestions(partialQuery: string): Promise<SearchSuggestion[]> {
      const response = await enzymeClient.get<SearchSuggestion[]>(ENDPOINTS.search.suggestions, {
        params: { q: partialQuery },
      });
      return response.data || [];
    },
    async getTemplates(category?: string): Promise<SearchTemplate[]> {
      const response = await enzymeClient.get<SearchTemplate[]>(ENDPOINTS.search.templates, {
        params: category ? { category } : {},
      });
      return response.data || [];
    },
  },
  
  specialized: {
    async searchCaselaw(query: string, filters?: SearchQuery['filters']): Promise<SearchResult[]> {
      const response = await enzymeClient.post<SearchResult[]>(ENDPOINTS.research.caselaw, {
        body: { query, filters },
      });
      return response.data || [];
    },
    async searchStatutes(query: string, jurisdiction?: string): Promise<Statute[]> {
      const response = await enzymeClient.post<Statute[]>(ENDPOINTS.research.statutes, {
        body: { query, jurisdiction },
      });
      return response.data || [];
    },
    async searchSecondary(query: string, sourceTypes?: string[]): Promise<SecondarySource[]> {
      const response = await enzymeClient.post<SecondarySource[]>(ENDPOINTS.research.secondary, {
        body: { query, sourceTypes },
      });
      return response.data || [];
    },
  },

  cases: {
    async getAnalysis(caseId: string): Promise<CaseAnalysis> {
      const response = await enzymeClient.get<CaseAnalysis>(ENDPOINTS.research.cases.analysis(caseId));
      return response.data;
    },
    async getSimilar(caseId: string, limit?: number): Promise<SearchResult[]> {
      const response = await enzymeClient.get<SearchResult[]>(ENDPOINTS.research.cases.similar(caseId), {
        params: limit ? { limit } : {},
      });
      return response.data || [];
    },
    async getCiting(caseId: string, limit?: number): Promise<SearchResult[]> {
      const response = await enzymeClient.get<SearchResult[]>(ENDPOINTS.research.cases.citing(caseId), {
        params: limit ? { limit } : {},
      });
      return response.data || [];
    },
    async getCited(caseId: string, limit?: number): Promise<SearchResult[]> {
      const response = await enzymeClient.get<SearchResult[]>(ENDPOINTS.research.cases.cited(caseId), {
        params: limit ? { limit } : {},
      });
      return response.data || [];
    },
    async getCitationGraph(caseId: string, depth?: number): Promise<CitationGraph> {
      const response = await enzymeClient.get<CitationGraph>(ENDPOINTS.research.cases.citationGraph(caseId), {
        params: depth ? { depth } : {},
      });
      return response.data;
    },
  },

  ai: {
    async analyzeCase(caseId: string): Promise<AIAnalysisResponse> {
      const response = await enzymeClient.post<AIAnalysisResponse>(ENDPOINTS.ai.analyzeCase, {
        body: { caseId },
      });
      return response.data;
    },
    async getOpposingArguments(caseId: string): Promise<AIAnalysisResponse['opposingArguments']> {
      const response = await enzymeClient.post<AIAnalysisResponse['opposingArguments']>(ENDPOINTS.ai.opposingArguments, {
        body: { caseId },
      });
      return response.data;
    },
    async checkCitations(documentId: string): Promise<CitationCheckResult> {
      const response = await enzymeClient.post<CitationCheckResult>(ENDPOINTS.ai.citationCheck, {
        body: { documentId },
      });
      return response.data;
    },
    async getResearchSummary(caseIds: string[]): Promise<{ summary: string; keyPoints: string[]; sources: SearchResult[] }> {
      const response = await enzymeClient.post<{ summary: string; keyPoints: string[]; sources: SearchResult[] }>(ENDPOINTS.ai.researchSummary, {
        body: { caseIds },
      });
      return response.data;
    },
    async extractKeyHoldings(caseText: string): Promise<{ holdings: string[] }> {
      const response = await enzymeClient.post<{ holdings: string[] }>(ENDPOINTS.ai.extractHoldings, {
        body: { caseText },
      });
      return response.data;
    },
    async generateResearchMemo(query: string, caseIds: string[]): Promise<{ memo: string; confidence: number }> {
      const response = await enzymeClient.post<{ memo: string; confidence: number }>(ENDPOINTS.ai.generateMemo, {
        body: { query, caseIds },
      });
      return response.data;
    },
    async getCasesLikeThis(caseId: string, limit?: number): Promise<SearchResult[]> {
      const response = await enzymeClient.get<SearchResult[]>(ENDPOINTS.ai.casesLikeThis(caseId), {
        params: limit ? { limit } : {},
      });
      return response.data || [];
    },
  },

  citations: {
    async validate(citation: string): Promise<CitationValidation> {
      const response = await enzymeClient.post<CitationValidation>(ENDPOINTS.research.citations.validate, {
        body: { citation },
      });
      return response.data;
    },
  },

  history: {
    async get(limit?: number): Promise<ResearchHistoryItem[]> {
      const response = await enzymeClient.get<ResearchHistoryItem[]>(ENDPOINTS.research.history.base, {
        params: limit ? { limit } : {},
      });
      return response.data || [];
    },
    async clear(): Promise<void> {
      await enzymeClient.delete(ENDPOINTS.research.history.base);
    },
    async deleteItem(id: string): Promise<void> {
      await enzymeClient.delete(ENDPOINTS.research.history.item(id));
    },
  },

  savedSearches: {
    async getAll(): Promise<SavedSearch[]> {
      const response = await enzymeClient.get<SavedSearch[]>(ENDPOINTS.research.savedSearches.base);
      return response.data || [];
    },
    async create(data: Omit<SavedSearch, 'id' | 'createdAt'>): Promise<SavedSearch> {
      const response = await enzymeClient.post<SavedSearch>(ENDPOINTS.research.savedSearches.base, {
        body: data,
      });
      return response.data;
    },
    async update(id: string, data: Partial<SavedSearch>): Promise<SavedSearch> {
      const response = await enzymeClient.put<SavedSearch>(ENDPOINTS.research.savedSearches.detail(id), {
        body: data,
      });
      return response.data;
    },
    async delete(id: string): Promise<void> {
      await enzymeClient.delete(ENDPOINTS.research.savedSearches.detail(id));
    },
    async execute(id: string): Promise<SearchResponse> {
      const response = await enzymeClient.post<SearchResponse>(ENDPOINTS.research.savedSearches.execute(id), {
        body: {},
      });
      return response.data;
    },
  },

  folders: {
    async getAll(): Promise<ResearchFolder[]> {
      const response = await enzymeClient.get<ResearchFolder[]>(ENDPOINTS.research.folders.base);
      return response.data || [];
    },
    async getById(id: string): Promise<ResearchFolder> {
      const response = await enzymeClient.get<ResearchFolder>(ENDPOINTS.research.folders.detail(id));
      return response.data;
    },
    async create(data: Omit<ResearchFolder, 'id' | 'createdAt' | 'updatedAt'>): Promise<ResearchFolder> {
      const response = await enzymeClient.post<ResearchFolder>(ENDPOINTS.research.folders.base, {
        body: data,
      });
      return response.data;
    },
    async update(id: string, data: Partial<ResearchFolder>): Promise<ResearchFolder> {
      const response = await enzymeClient.put<ResearchFolder>(ENDPOINTS.research.folders.detail(id), {
        body: data,
      });
      return response.data;
    },
    async delete(id: string): Promise<void> {
      await enzymeClient.delete(ENDPOINTS.research.folders.detail(id));
    },
    async addCase(folderId: string, caseId: string): Promise<void> {
      await enzymeClient.post(ENDPOINTS.research.folders.cases(folderId), {
        body: { caseId },
      });
    },
    async removeCase(folderId: string, caseId: string): Promise<void> {
      await enzymeClient.delete(ENDPOINTS.research.folders.case(folderId, caseId));
    },
    async export(folderId: string, format: 'pdf' | 'docx'): Promise<{ downloadUrl: string }> {
      const response = await enzymeClient.get<{ downloadUrl: string }>(ENDPOINTS.research.folders.export(folderId), {
        params: { format },
      });
      return response.data;
    },
  },

  alerts: {
    async getAll(): Promise<CitationAlert[]> {
      const response = await enzymeClient.get<CitationAlert[]>(ENDPOINTS.research.alerts.base);
      return response.data || [];
    },
    async create(data: Omit<CitationAlert, 'id' | 'createdAt'>): Promise<CitationAlert> {
      const response = await enzymeClient.post<CitationAlert>(ENDPOINTS.research.alerts.base, {
        body: data,
      });
      return response.data;
    },
    async update(id: string, data: Partial<CitationAlert>): Promise<CitationAlert> {
      const response = await enzymeClient.put<CitationAlert>(ENDPOINTS.research.alerts.detail(id), {
        body: data,
      });
      return response.data;
    },
    async delete(id: string): Promise<void> {
      await enzymeClient.delete(ENDPOINTS.research.alerts.detail(id));
    },
    async toggle(id: string, enabled: boolean): Promise<CitationAlert> {
      const response = await enzymeClient.put<CitationAlert>(ENDPOINTS.research.alerts.toggle(id), {
        body: { enabled },
      });
      return response.data;
    },
  },

  statutes: {
    async getById(id: string): Promise<Statute> {
      const response = await enzymeClient.get<Statute>(ENDPOINTS.research.statuteDetail(id));
      return response.data;
    },
    async getRelatedCases(statuteId: string, limit?: number): Promise<SearchResult[]> {
      const response = await enzymeClient.get<SearchResult[]>(ENDPOINTS.research.statuteCases(statuteId), {
        params: limit ? { limit } : {},
      });
      return response.data || [];
    },
  },

  export: {
    async results(resultIds: string[], format: 'pdf' | 'docx' | 'csv'): Promise<{ downloadUrl: string }> {
      const response = await enzymeClient.post<{ downloadUrl: string }>(ENDPOINTS.research.export, {
        body: { resultIds, format },
      });
      return response.data;
    },
  },
};
