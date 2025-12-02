/**
 * Legal Research API Service
 * Backend endpoints for LexiFlow AI's legal research system
 * Backend: http://localhost:3001/api/v1
 */

import { fetchJson, postJson, putJson, deleteJson, buildQueryString } from '../../../services/http-client';
import type {
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
} from './research.types';

export const researchService = {
  // ==================== Main Search ====================

  /**
   * Perform comprehensive legal research search
   */
  search: (query: SearchQuery) =>
    postJson<SearchResponse>('/search', query),

  /**
   * Perform natural language search
   */
  naturalLanguageSearch: (query: string, filters?: SearchQuery['filters']) =>
    postJson<SearchResponse>('/search/natural-language', { query, filters }),

  // ==================== Specialized Search ====================

  /**
   * Search case law specifically
   */
  searchCaselaw: (query: string, filters?: SearchQuery['filters']) =>
    postJson<SearchResult[]>('/research/caselaw', { query, filters }),

  /**
   * Search statutes
   */
  searchStatutes: (query: string, jurisdiction?: string) =>
    postJson<Statute[]>('/research/statutes', { query, jurisdiction }),

  /**
   * Search secondary sources (articles, treatises, etc.)
   */
  searchSecondary: (query: string, sourceTypes?: string[]) =>
    postJson<SecondarySource[]>('/research/secondary', { query, sourceTypes }),

  /**
   * Get search suggestions as user types
   */
  getSuggestions: (partialQuery: string) =>
    fetchJson<SearchSuggestion[]>(`/search/suggestions${buildQueryString({ q: partialQuery })}`),

  /**
   * Get search templates for common legal research queries
   */
  getSearchTemplates: (category?: string) =>
    fetchJson<SearchTemplate[]>(`/search/templates${buildQueryString({ category })}`),

  // ==================== Case Analysis ====================

  /**
   * Get detailed case analysis by case ID
   */
  getCaseAnalysis: (caseId: string) =>
    fetchJson<CaseAnalysis>(`/research/cases/${caseId}/analysis`),

  /**
   * Get AI-powered case analysis and insights
   */
  getAICaseAnalysis: (caseId: string) =>
    postJson<AIAnalysisResponse>('/ai/analyze-case', { caseId }),

  /**
   * Get cases similar to the given case
   */
  getSimilarCases: (caseId: string, limit?: number) =>
    fetchJson<SearchResult[]>(`/research/cases/${caseId}/similar${buildQueryString({ limit })}`),

  /**
   * Get opposing arguments and counter-cases
   */
  getOpposingArguments: (caseId: string) =>
    postJson<AIAnalysisResponse['opposingArguments']>('/ai/opposing-arguments', { caseId }),

  // ==================== Citation Services ====================

  /**
   * Check citations in a document
   */
  checkCitations: (documentId: string) =>
    postJson<CitationCheckResult>('/ai/citation-check', { documentId }),

  /**
   * Validate a specific citation
   */
  validateCitation: (citation: string) =>
    postJson<CitationValidation>('/research/citations/validate', { citation }),

  /**
   * Get citation network/graph for a case
   */
  getCitationGraph: (caseId: string, depth?: number) =>
    fetchJson<CitationGraph>(`/research/cases/${caseId}/citation-graph${buildQueryString({ depth })}`),

  /**
   * Get cases that cite this case
   */
  getCitingCases: (caseId: string, limit?: number) =>
    fetchJson<SearchResult[]>(`/research/cases/${caseId}/citing${buildQueryString({ limit })}`),

  /**
   * Get cases cited by this case
   */
  getCitedCases: (caseId: string, limit?: number) =>
    fetchJson<SearchResult[]>(`/research/cases/${caseId}/cited${buildQueryString({ limit })}`),

  // ==================== Research History ====================

  /**
   * Get user's research history
   */
  getResearchHistory: (limit?: number) =>
    fetchJson<ResearchHistoryItem[]>(`/research/history${buildQueryString({ limit })}`),

  /**
   * Clear research history
   */
  clearResearchHistory: () =>
    deleteJson('/research/history'),

  /**
   * Delete specific history item
   */
  deleteHistoryItem: (id: string) =>
    deleteJson(`/research/history/${id}`),

  // ==================== Saved Searches ====================

  /**
   * Get all saved searches
   */
  getSavedSearches: () =>
    fetchJson<SavedSearch[]>('/research/saved-searches'),

  /**
   * Create a new saved search
   */
  createSavedSearch: (data: Omit<SavedSearch, 'id' | 'createdAt'>) =>
    postJson<SavedSearch>('/research/saved-searches', data),

  /**
   * Update saved search
   */
  updateSavedSearch: (id: string, data: Partial<SavedSearch>) =>
    putJson<SavedSearch>(`/research/saved-searches/${id}`, data),

  /**
   * Delete saved search
   */
  deleteSavedSearch: (id: string) =>
    deleteJson(`/research/saved-searches/${id}`),

  /**
   * Execute a saved search
   */
  executeSavedSearch: (id: string) =>
    postJson<SearchResponse>(`/research/saved-searches/${id}/execute`, {}),

  // ==================== Research Folders ====================

  /**
   * Get all research folders
   */
  getFolders: () =>
    fetchJson<ResearchFolder[]>('/research/folders'),

  /**
   * Get specific folder
   */
  getFolder: (id: string) =>
    fetchJson<ResearchFolder>(`/research/folders/${id}`),

  /**
   * Create research folder
   */
  createFolder: (data: Omit<ResearchFolder, 'id' | 'createdAt' | 'updatedAt'>) =>
    postJson<ResearchFolder>('/research/folders', data),

  /**
   * Update research folder
   */
  updateFolder: (id: string, data: Partial<ResearchFolder>) =>
    putJson<ResearchFolder>(`/research/folders/${id}`, data),

  /**
   * Delete research folder
   */
  deleteFolder: (id: string) =>
    deleteJson(`/research/folders/${id}`),

  /**
   * Add case to folder
   */
  addCaseToFolder: (folderId: string, caseId: string) =>
    postJson<void>(`/research/folders/${folderId}/cases`, { caseId }),

  /**
   * Remove case from folder
   */
  removeCaseFromFolder: (folderId: string, caseId: string) =>
    deleteJson(`/research/folders/${folderId}/cases/${caseId}`),

  // ==================== Citation Alerts ====================

  /**
   * Get all citation alerts
   */
  getCitationAlerts: () =>
    fetchJson<CitationAlert[]>('/research/citation-alerts'),

  /**
   * Create citation alert
   */
  createCitationAlert: (data: Omit<CitationAlert, 'id' | 'createdAt'>) =>
    postJson<CitationAlert>('/research/citation-alerts', data),

  /**
   * Update citation alert
   */
  updateCitationAlert: (id: string, data: Partial<CitationAlert>) =>
    putJson<CitationAlert>(`/research/citation-alerts/${id}`, data),

  /**
   * Delete citation alert
   */
  deleteCitationAlert: (id: string) =>
    deleteJson(`/research/citation-alerts/${id}`),

  /**
   * Toggle citation alert
   */
  toggleCitationAlert: (id: string, enabled: boolean) =>
    putJson<CitationAlert>(`/research/citation-alerts/${id}/toggle`, { enabled }),

  // ==================== Statute Research ====================

  /**
   * Get full statute by ID
   */
  getStatute: (id: string) =>
    fetchJson<Statute>(`/research/statutes/${id}`),

  /**
   * Get related cases for a statute
   */
  getStatuteRelatedCases: (statuteId: string, limit?: number) =>
    fetchJson<SearchResult[]>(`/research/statutes/${statuteId}/cases${buildQueryString({ limit })}`),

  // ==================== AI-Powered Features ====================

  /**
   * Get AI-generated research summary for multiple cases
   */
  getResearchSummary: (caseIds: string[]) =>
    postJson<{ summary: string; keyPoints: string[]; sources: SearchResult[] }>('/ai/research-summary', { caseIds }),

  /**
   * Extract key holdings from case text
   */
  extractKeyHoldings: (caseText: string) =>
    postJson<{ holdings: string[] }>('/ai/extract-holdings', { caseText }),

  /**
   * Generate legal research memo
   */
  generateResearchMemo: (query: string, caseIds: string[]) =>
    postJson<{ memo: string; confidence: number }>('/ai/generate-memo', { query, caseIds }),

  /**
   * Get AI-powered "Cases like this" suggestions
   */
  getCasesLikeThis: (caseId: string, limit?: number) =>
    fetchJson<SearchResult[]>(`/ai/cases-like-this/${caseId}${buildQueryString({ limit })}`),

  // ==================== Export ====================

  /**
   * Export search results
   */
  exportResults: (resultIds: string[], format: 'pdf' | 'docx' | 'csv') =>
    postJson<{ downloadUrl: string }>('/research/export', { resultIds, format }),

  /**
   * Export research folder
   */
  exportFolder: (folderId: string, format: 'pdf' | 'docx') =>
    fetchJson<{ downloadUrl: string }>(`/research/folders/${folderId}/export${buildQueryString({ format })}`),
};
