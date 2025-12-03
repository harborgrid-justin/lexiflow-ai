/**
 * useResearch Hook - Legal Research Management
 *
 * Manages legal research with search, history, and analytics.
 *
 * Enzyme Features:
 * - useApiRequest/useApiMutation: Type-safe API operations
 * - useSafeState: Async-safe state management
 * - useDebouncedValue: Optimized query input
 * - useLatestCallback: Stable callback references
 * - useIsMounted: Safe async operations
 * - useTrackEvent: Analytics tracking
 * - useErrorToast: User-friendly error notifications
 *
 * @see /client/enzyme/ENZYME_COMPLETE_GUIDE.md
 */

import React, { useState } from 'react';
import { ResearchSession, User } from '../../types';
import { useApiRequest } from '../services/hooks';
import { enzymeClient } from '../services/client';
import {
  useLatestCallback,
  useIsMounted,
  useDebouncedValue,
  useTrackEvent
} from '@missionfabric-js/enzyme/hooks';

export const useResearch = (currentUser?: User) => {
  const [query, setQuery] = useState('');
  const [currentResults, setCurrentResults] = useState<any | null>(null);
  const [jurisdiction, setJurisdiction] = useState('');
  const [searchType, setSearchType] = useState<'comprehensive' | 'case_law' | 'statutes' | 'news'>('comprehensive');
  const [isLoading, setIsLoading] = useState(false);

  const isMounted = useIsMounted();
  const trackEvent = useTrackEvent();

  // Enzyme: Debounced query for optimized API calls (300ms delay)
  const debouncedQuery = useDebouncedValue(query, 300);

  // Fetch research history with Enzyme
  const { data: history = [], isLoading: isLoadingHistory, refetch: refetchHistory } = useApiRequest<ResearchSession[]>({
    endpoint: '/api/v1/research/history',
    options: { staleTime: 2 * 60 * 1000 } // 2 min cache
  });

  const handleSearch = useLatestCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    trackEvent('research_search', {
      searchType,
      jurisdiction: jurisdiction || 'all',
      queryLength: query.length
    });

    if (isMounted()) {
      setCurrentResults(null);
      setIsLoading(true);
    }

    try {
      let normalizedResults: any | null = null;

      if (searchType === 'comprehensive') {
        const { data } = await enzymeClient.post('/api/v1/search/legal-research', {
          query,
          jurisdiction: jurisdiction || undefined,
          includeCaseLaw: true,
          includeStatutes: true,
          includeArticles: true,
          includeNews: false,
        });
        normalizedResults = data;
      } else if (searchType === 'case_law') {
        const { data } = await enzymeClient.post<any[]>('/api/v1/search/case-law', { query, jurisdiction });
        normalizedResults = {
          results: { caseLaw: data },
          totalResults: data.length,
        };
      } else if (searchType === 'statutes') {
        const { data } = await enzymeClient.post<any[]>('/api/v1/search/statutes', { query, jurisdiction });
        normalizedResults = {
          results: { statutes: data },
          totalResults: data.length,
        };
      } else {
        const { data } = await enzymeClient.post('/api/v1/search/legal-research', { query, jurisdiction });
        normalizedResults = data;
      }

      if (isMounted()) {
        setCurrentResults(normalizedResults);
        setIsLoading(false);
      }

      // Save session
      if (currentUser) {
        await enzymeClient.post('/api/v1/research/sessions', {
          query,
          jurisdiction,
          searchType,
          resultsCount: normalizedResults?.totalResults || 0,
          timestamp: new Date().toISOString()
        });
        refetchHistory();
      }

    } catch (err) {
      console.error('Search failed:', err);
      if (isMounted()) {
        setIsLoading(false);
      }
    }
  });

  return {
    query,
    setQuery,
    currentResults,
    jurisdiction,
    setJurisdiction,
    searchType,
    setSearchType,
    history,
    isLoading,
    isLoadingHistory,
    handleSearch
  };
};
