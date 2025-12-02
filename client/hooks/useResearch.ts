/**
 * ENZYME MIGRATION: Enhanced with Enzyme framework features
 *
 * This hook manages legal research functionality with comprehensive Enzyme optimizations:
 * - useApiRequest/useApiMutation: Type-safe API operations
 * - useSafeState: Async-safe state management preventing memory leaks
 * - useDebouncedValue: Optimized query input to reduce unnecessary API calls
 * - useLatestCallback: Stable callback references with latest closure values
 * - useIsMounted: Safe async operations with mount checks
 * - useTrackEvent: Analytics tracking for search operations and user feedback
 * - useErrorToast: User-friendly error notifications
 *
 * @see /workspaces/lexiflow-ai/client/enzyme/MIGRATION_PLAN.md
 */

import React from 'react';
import { ApiService } from '../services/apiService';
import { ResearchSession, User } from '../types';
import {
  useApiRequest,
  useApiMutation,
  useLatestCallback,
  useIsMounted,
  useSafeState,
  useDebouncedValue,
  useTrackEvent,
  useErrorToast
} from '../enzyme';
import { useQueryClient } from '@tanstack/react-query';

export const useResearch = (currentUser?: User) => {
  // Enzyme: useSafeState for async-safe state management
  const [query, setQuery] = useSafeState('');
  const [currentResults, setCurrentResults] = useSafeState<any | null>(null);
  const [jurisdiction, setJurisdiction] = useSafeState('');
  const [searchType, setSearchType] = useSafeState<'comprehensive' | 'case_law' | 'statutes' | 'news'>('comprehensive');

  const queryClient = useQueryClient();
  const isMounted = useIsMounted();

  // Enzyme: Analytics tracking
  const trackEvent = useTrackEvent();

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

    // Enzyme: Track search initiation with analytics
    trackEvent('research_search', {
      searchType,
      jurisdiction: jurisdiction || 'all',
      queryLength: query.length
    });

    if (isMounted()) setCurrentResults(null);

    try {
      let normalizedResults: any | null = null;

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

        // Enzyme: Track search results with analytics
        trackEvent('research_results', {
          resultCount: normalizedResults?.totalResults || 0,
          searchType
        });
      }

      // Save to history using Enzyme mutation
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
      // Enzyme: User-friendly error notification instead of alert()
      showErrorToast('Research failed. Please check your Google Custom Search API configuration.');
    }
  });

  const handleFeedback = useLatestCallback(async (id: string, type: 'positive' | 'negative') => {
    try {
      // Enzyme: Track feedback with analytics
      trackEvent('research_feedback', {
        id,
        type
      });

      await ApiService.submitResearchFeedback(id, type);
      queryClient.invalidateQueries({ queryKey: ['/api/v1/research/history'] });
    } catch (e) {
      console.error(e);
      // Enzyme: Show error toast for feedback failures
      showErrorToast('Failed to submit feedback. Please try again.');
    }
  });

  return {
    query,
    setQuery,
    debouncedQuery, // Enzyme: Expose debounced query for components that need it
    isLoading,
    history,
    currentResults,
    jurisdiction,
    setJurisdiction,
    searchType,
    setSearchType,
    handleSearch,
    handleFeedback
  };
};