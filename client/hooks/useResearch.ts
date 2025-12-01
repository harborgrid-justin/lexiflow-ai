import React, { useState } from 'react';
import { ApiService } from '../services/apiService';
import { ResearchSession, User } from '../types';
import { useApiRequest, useApiMutation, useLatestCallback, useIsMounted } from '../enzyme';
import { useQueryClient } from '@tanstack/react-query';

export const useResearch = (currentUser?: User) => {
  const [query, setQuery] = useState('');
  const [currentResults, setCurrentResults] = useState<any | null>(null);
  const [jurisdiction, setJurisdiction] = useState('');
  const [searchType, setSearchType] = useState<'comprehensive' | 'case_law' | 'statutes' | 'news'>('comprehensive');
  
  const queryClient = useQueryClient();
  const isMounted = useIsMounted();

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

      if (isMounted()) setCurrentResults(normalizedResults);

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
      alert('Research failed. Please check your Google Custom Search API configuration.');
    }
  });

  const handleFeedback = useLatestCallback(async (id: string, type: 'positive' | 'negative') => {
    try {
      await ApiService.submitResearchFeedback(id, type);
      queryClient.invalidateQueries({ queryKey: ['/api/v1/research/history'] });
    } catch (e) {
      console.error(e);
    }
  });

  return {
    query,
    setQuery,
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