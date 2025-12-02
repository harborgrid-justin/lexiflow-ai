/**
 * Legal Research API Hooks
 * TanStack Query hooks with Enzyme integration for LexiFlow AI
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { researchService } from './research.service';
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

// ==================== Query Keys ====================

export const researchKeys = {
  all: ['research'] as const,
  search: (query: SearchQuery) => [...researchKeys.all, 'search', query] as const,
  caselaw: (query: string) => [...researchKeys.all, 'caselaw', query] as const,
  statutes: (query: string) => [...researchKeys.all, 'statutes', query] as const,
  secondary: (query: string) => [...researchKeys.all, 'secondary', query] as const,
  suggestions: (query: string) => [...researchKeys.all, 'suggestions', query] as const,
  templates: (category?: string) => [...researchKeys.all, 'templates', category] as const,
  caseAnalysis: (caseId: string) => [...researchKeys.all, 'case-analysis', caseId] as const,
  aiAnalysis: (caseId: string) => [...researchKeys.all, 'ai-analysis', caseId] as const,
  similarCases: (caseId: string) => [...researchKeys.all, 'similar-cases', caseId] as const,
  citationCheck: (documentId: string) => [...researchKeys.all, 'citation-check', documentId] as const,
  citationGraph: (caseId: string) => [...researchKeys.all, 'citation-graph', caseId] as const,
  citingCases: (caseId: string) => [...researchKeys.all, 'citing-cases', caseId] as const,
  citedCases: (caseId: string) => [...researchKeys.all, 'cited-cases', caseId] as const,
  history: () => [...researchKeys.all, 'history'] as const,
  savedSearches: () => [...researchKeys.all, 'saved-searches'] as const,
  folders: () => [...researchKeys.all, 'folders'] as const,
  folder: (id: string) => [...researchKeys.all, 'folders', id] as const,
  citationAlerts: () => [...researchKeys.all, 'citation-alerts'] as const,
  statute: (id: string) => [...researchKeys.all, 'statute', id] as const,
};

// ==================== Search Hooks ====================

/**
 * Main search hook
 */
export const useSearch = (
  query: SearchQuery,
  options?: Omit<UseQueryOptions<SearchResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: researchKeys.search(query),
    queryFn: () => researchService.search(query),
    enabled: !!query.query && query.query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Natural language search hook
 */
export const useNaturalLanguageSearch = () => {
  return useMutation({
    mutationFn: ({ query, filters }: { query: string; filters?: SearchQuery['filters'] }) =>
      researchService.naturalLanguageSearch(query, filters),
  });
};

/**
 * Case law search hook
 */
export const useCaselaw = (
  query: string,
  filters?: SearchQuery['filters'],
  options?: Omit<UseQueryOptions<SearchResult[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: researchKeys.caselaw(query),
    queryFn: () => researchService.searchCaselaw(query, filters),
    enabled: !!query && query.length > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Statutes search hook
 */
export const useStatutes = (
  query: string,
  jurisdiction?: string,
  options?: Omit<UseQueryOptions<Statute[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: researchKeys.statutes(query),
    queryFn: () => researchService.searchStatutes(query, jurisdiction),
    enabled: !!query && query.length > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Secondary sources search hook
 */
export const useSecondaryResearch = (
  query: string,
  sourceTypes?: string[],
  options?: Omit<UseQueryOptions<SecondarySource[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: researchKeys.secondary(query),
    queryFn: () => researchService.searchSecondary(query, sourceTypes),
    enabled: !!query && query.length > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Search suggestions hook (for autocomplete)
 */
export const useSearchSuggestions = (
  partialQuery: string,
  options?: Omit<UseQueryOptions<SearchSuggestion[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: researchKeys.suggestions(partialQuery),
    queryFn: () => researchService.getSuggestions(partialQuery),
    enabled: !!partialQuery && partialQuery.length >= 3,
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

/**
 * Search templates hook
 */
export const useSearchTemplates = (
  category?: string,
  options?: Omit<UseQueryOptions<SearchTemplate[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: researchKeys.templates(category),
    queryFn: () => researchService.getSearchTemplates(category),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

// ==================== Case Analysis Hooks ====================

/**
 * Case analysis hook
 */
export const useCaseAnalysis = (
  caseId: string,
  options?: Omit<UseQueryOptions<CaseAnalysis>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: researchKeys.caseAnalysis(caseId),
    queryFn: () => researchService.getCaseAnalysis(caseId),
    enabled: !!caseId,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * AI-powered case analysis hook
 */
export const useAIAnalysis = (
  caseId: string,
  options?: Omit<UseQueryOptions<AIAnalysisResponse>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: researchKeys.aiAnalysis(caseId),
    queryFn: () => researchService.getAICaseAnalysis(caseId),
    enabled: !!caseId,
    staleTime: 15 * 60 * 1000, // 15 minutes (AI analysis is expensive)
    ...options,
  });
};

/**
 * Similar cases hook
 */
export const useSimilarCases = (
  caseId: string,
  limit?: number,
  options?: Omit<UseQueryOptions<SearchResult[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: researchKeys.similarCases(caseId),
    queryFn: () => researchService.getSimilarCases(caseId, limit),
    enabled: !!caseId,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Opposing arguments hook
 */
export const useOpposingArguments = () => {
  return useMutation({
    mutationFn: (caseId: string) => researchService.getOpposingArguments(caseId),
  });
};

// ==================== Citation Hooks ====================

/**
 * Citation check hook
 */
export const useCitationCheck = (
  documentId: string,
  options?: Omit<UseQueryOptions<CitationCheckResult>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: researchKeys.citationCheck(documentId),
    queryFn: () => researchService.checkCitations(documentId),
    enabled: !!documentId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Validate single citation hook
 */
export const useValidateCitation = () => {
  return useMutation({
    mutationFn: (citation: string) => researchService.validateCitation(citation),
  });
};

/**
 * Citation graph hook
 */
export const useCitationGraph = (
  caseId: string,
  depth?: number,
  options?: Omit<UseQueryOptions<CitationGraph>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: researchKeys.citationGraph(caseId),
    queryFn: () => researchService.getCitationGraph(caseId, depth),
    enabled: !!caseId,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Citing cases hook
 */
export const useCitingCases = (
  caseId: string,
  limit?: number,
  options?: Omit<UseQueryOptions<SearchResult[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: researchKeys.citingCases(caseId),
    queryFn: () => researchService.getCitingCases(caseId, limit),
    enabled: !!caseId,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Cited cases hook
 */
export const useCitedCases = (
  caseId: string,
  limit?: number,
  options?: Omit<UseQueryOptions<SearchResult[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: researchKeys.citedCases(caseId),
    queryFn: () => researchService.getCitedCases(caseId, limit),
    enabled: !!caseId,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

// ==================== History Hooks ====================

/**
 * Research history hook
 */
export const useResearchHistory = (
  limit?: number,
  options?: Omit<UseQueryOptions<ResearchHistoryItem[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: researchKeys.history(),
    queryFn: () => researchService.getResearchHistory(limit),
    staleTime: 1 * 60 * 1000, // 1 minute
    ...options,
  });
};

/**
 * Clear history mutation
 */
export const useClearHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => researchService.clearResearchHistory(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.history() });
    },
  });
};

/**
 * Delete history item mutation
 */
export const useDeleteHistoryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => researchService.deleteHistoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.history() });
    },
  });
};

// ==================== Saved Searches Hooks ====================

/**
 * Saved searches hook
 */
export const useSavedSearches = (
  options?: Omit<UseQueryOptions<SavedSearch[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: researchKeys.savedSearches(),
    queryFn: () => researchService.getSavedSearches(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Create saved search mutation
 */
export const useCreateSavedSearch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<SavedSearch, 'id' | 'createdAt'>) =>
      researchService.createSavedSearch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.savedSearches() });
    },
  });
};

/**
 * Update saved search mutation
 */
export const useUpdateSavedSearch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SavedSearch> }) =>
      researchService.updateSavedSearch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.savedSearches() });
    },
  });
};

/**
 * Delete saved search mutation
 */
export const useDeleteSavedSearch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => researchService.deleteSavedSearch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.savedSearches() });
    },
  });
};

/**
 * Execute saved search mutation
 */
export const useExecuteSavedSearch = () => {
  return useMutation({
    mutationFn: (id: string) => researchService.executeSavedSearch(id),
  });
};

// ==================== Research Folders Hooks ====================

/**
 * Research folders hook
 */
export const useResearchFolders = (
  options?: Omit<UseQueryOptions<ResearchFolder[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: researchKeys.folders(),
    queryFn: () => researchService.getFolders(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Single research folder hook
 */
export const useResearchFolder = (
  id: string,
  options?: Omit<UseQueryOptions<ResearchFolder>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: researchKeys.folder(id),
    queryFn: () => researchService.getFolder(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Create folder mutation
 */
export const useCreateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<ResearchFolder, 'id' | 'createdAt' | 'updatedAt'>) =>
      researchService.createFolder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.folders() });
    },
  });
};

/**
 * Update folder mutation
 */
export const useUpdateFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ResearchFolder> }) =>
      researchService.updateFolder(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: researchKeys.folders() });
      queryClient.invalidateQueries({ queryKey: researchKeys.folder(id) });
    },
  });
};

/**
 * Delete folder mutation
 */
export const useDeleteFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => researchService.deleteFolder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.folders() });
    },
  });
};

/**
 * Add case to folder mutation
 */
export const useAddCaseToFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ folderId, caseId }: { folderId: string; caseId: string }) =>
      researchService.addCaseToFolder(folderId, caseId),
    onSuccess: (_, { folderId }) => {
      queryClient.invalidateQueries({ queryKey: researchKeys.folder(folderId) });
    },
  });
};

/**
 * Remove case from folder mutation
 */
export const useRemoveCaseFromFolder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ folderId, caseId }: { folderId: string; caseId: string }) =>
      researchService.removeCaseFromFolder(folderId, caseId),
    onSuccess: (_, { folderId }) => {
      queryClient.invalidateQueries({ queryKey: researchKeys.folder(folderId) });
    },
  });
};

// ==================== Citation Alerts Hooks ====================

/**
 * Citation alerts hook
 */
export const useCitationAlerts = (
  options?: Omit<UseQueryOptions<CitationAlert[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: researchKeys.citationAlerts(),
    queryFn: () => researchService.getCitationAlerts(),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Create citation alert mutation
 */
export const useCreateCitationAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<CitationAlert, 'id' | 'createdAt'>) =>
      researchService.createCitationAlert(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.citationAlerts() });
    },
  });
};

/**
 * Update citation alert mutation
 */
export const useUpdateCitationAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CitationAlert> }) =>
      researchService.updateCitationAlert(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.citationAlerts() });
    },
  });
};

/**
 * Delete citation alert mutation
 */
export const useDeleteCitationAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => researchService.deleteCitationAlert(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.citationAlerts() });
    },
  });
};

/**
 * Toggle citation alert mutation
 */
export const useToggleCitationAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      researchService.toggleCitationAlert(id, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: researchKeys.citationAlerts() });
    },
  });
};

// ==================== Statute Hooks ====================

/**
 * Statute hook
 */
export const useStatute = (
  id: string,
  options?: Omit<UseQueryOptions<Statute>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: researchKeys.statute(id),
    queryFn: () => researchService.getStatute(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

/**
 * Statute related cases hook
 */
export const useStatuteRelatedCases = (statuteId: string, limit?: number) => {
  return useQuery({
    queryKey: [...researchKeys.statute(statuteId), 'cases'],
    queryFn: () => researchService.getStatuteRelatedCases(statuteId, limit),
    enabled: !!statuteId,
    staleTime: 10 * 60 * 1000,
  });
};

// ==================== AI-Powered Hooks ====================

/**
 * Research summary mutation
 */
export const useResearchSummary = () => {
  return useMutation({
    mutationFn: (caseIds: string[]) => researchService.getResearchSummary(caseIds),
  });
};

/**
 * Extract key holdings mutation
 */
export const useExtractKeyHoldings = () => {
  return useMutation({
    mutationFn: (caseText: string) => researchService.extractKeyHoldings(caseText),
  });
};

/**
 * Generate research memo mutation
 */
export const useGenerateResearchMemo = () => {
  return useMutation({
    mutationFn: ({ query, caseIds }: { query: string; caseIds: string[] }) =>
      researchService.generateResearchMemo(query, caseIds),
  });
};

/**
 * Cases like this hook
 */
export const useCasesLikeThis = (
  caseId: string,
  limit?: number,
  options?: Omit<UseQueryOptions<SearchResult[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: [...researchKeys.aiAnalysis(caseId), 'similar'],
    queryFn: () => researchService.getCasesLikeThis(caseId, limit),
    enabled: !!caseId,
    staleTime: 10 * 60 * 1000,
    ...options,
  });
};

// ==================== Export Hooks ====================

/**
 * Export results mutation
 */
export const useExportResults = () => {
  return useMutation({
    mutationFn: ({ resultIds, format }: { resultIds: string[]; format: 'pdf' | 'docx' | 'csv' }) =>
      researchService.exportResults(resultIds, format),
  });
};

/**
 * Export folder mutation
 */
export const useExportFolder = () => {
  return useMutation({
    mutationFn: ({ folderId, format }: { folderId: string; format: 'pdf' | 'docx' }) =>
      researchService.exportFolder(folderId, format),
  });
};
