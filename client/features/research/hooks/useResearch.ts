/**
 * Research Hooks - SOA Migration
 * 
 * Migrated from /client/hooks/useResearch.ts
 * Enhanced with Enzyme framework features for legal research functionality.
 */

import React from 'react';
import { ApiService } from '@/services/apiService';
import { ResearchSession, User } from '@/types';
import {
  useApiRequest,
  useApiMutation,
  useLatestCallback,
  useIsMounted,
  useSafeState,
  useDebouncedValue,
  useTrackEvent,
  useErrorToast,
  usePageView,
} from '@/enzyme';
import { useQueryClient } from '@tanstack/react-query';

export type SearchType = 'comprehensive' | 'case_law' | 'statutes' | 'news';

export interface ResearchResults {
  results: {
    caseLaw?: any[];
    statutes?: any[];
    news?: any[];
    articles?: any[];
  };
  totalResults: number;
}

/**
 * Main research hook for legal research functionality
 */
export const useResearch = (currentUser?: User) => {
  // Enzyme: useSafeState for async-safe state management
  const [query, setQuery] = useSafeState('');
  const [currentResults, setCurrentResults] = useSafeState<ResearchResults | null>(null);
  const [jurisdiction, setJurisdiction] = useSafeState('');
  const [searchType, setSearchType] = useSafeState<SearchType>('comprehensive');

  const queryClient = useQueryClient();
  const isMounted = useIsMounted();

  // Enzyme: Analytics tracking
  const trackEvent = useTrackEvent();

  // Enzyme: Page view tracking
  usePageView('legal_research');

  // Enzyme: Error notifications
  const showErrorToast = useErrorToast();

  // Enzyme: Debounced query for optimized API calls (300ms delay)
  const debouncedQuery = useDebouncedValue(query, 300);

  // Fetch research history with Enzyme
  const { data: history = [], isLoading: isLoadingHistory } = useApiRequest<ResearchSession[]>({
    endpoint: '/api/v1/research/history',
    options: { staleTime: 2 * 60 * 1000 } // 2 min cache
  });

  // Mutation for saving research sessions
  const { mutateAsync: saveSession, isPending: isLoading } = useApiMutation<ResearchSession, ResearchSession>({
    method: 'POST',
    endpoint: '/api/v1/research/sessions',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/research/history'] });
    }
  });

  const handleSearch = useLatestCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Track search initiation
    trackEvent('research_search', {
      searchType,
      jurisdiction: jurisdiction || 'all',
      queryLength: query.length
    });

    if (isMounted()) setCurrentResults(null);

    try {
      let normalizedResults: ResearchResults | null = null;

      if (searchType === 'comprehensive') {
        normalizedResults = await ApiService.search.legalResearch({
          query,
          jurisdiction: jurisdiction || undefined,
          includeCaseLaw: true,
          includeStatutes: true,
          includeArticles: true,
          includeNews: false,
        });
      } else if (searchType === 'case_law') {
        const caseLawResults = await ApiService.search.searchCaseLaw(query, jurisdiction || undefined);
        normalizedResults = {
          results: { caseLaw: caseLawResults },
          totalResults: caseLawResults.length,
        };
      } else if (searchType === 'statutes') {
        const statuteResults = await ApiService.search.searchStatutes(query, jurisdiction || undefined);
        normalizedResults = {
          results: { statutes: statuteResults },
          totalResults: statuteResults.length,
        };
      } else if (searchType === 'news') {
        const newsResults = await ApiService.search.searchLegalNews(query, 30);
        normalizedResults = {
          results: { news: newsResults },
          totalResults: newsResults.length,
        };
      }

      if (isMounted()) {
        setCurrentResults(normalizedResults);

        // Track search results
        trackEvent('research_results', {
          resultCount: normalizedResults?.totalResults || 0,
          searchType
        });
      }

      // Save to history
      const newSession: ResearchSession = {
        id: Date.now().toString(),
        query,
        response: `Found ${normalizedResults?.totalResults || 0} results`,
        sources: [],
        timestamp: new Date().toISOString(),
        userId: currentUser?.id,
      };

      await saveSession({ data: newSession });
    } catch (error) {
      console.error('Research failed:', error);
      showErrorToast('Research failed. Please check your Google Custom Search API configuration.');
    }
  });

  const handleFeedback = useLatestCallback(async (id: string, type: 'positive' | 'negative') => {
    try {
      trackEvent('research_feedback', { id, type });
      await ApiService.submitResearchFeedback(id, type);
      queryClient.invalidateQueries({ queryKey: ['/api/v1/research/history'] });
    } catch (e) {
      console.error(e);
      showErrorToast('Failed to submit feedback. Please try again.');
    }
  });

  const clearResults = useLatestCallback(() => {
    setCurrentResults(null);
    setQuery('');
  });

  return {
    // Query state
    query,
    setQuery,
    debouncedQuery,
    
    // Filter state
    jurisdiction,
    setJurisdiction,
    searchType,
    setSearchType,
    
    // Results
    currentResults,
    history,
    
    // Loading states
    isLoading,
    isLoadingHistory,
    
    // Actions
    handleSearch,
    handleFeedback,
    clearResults,
  };
};
