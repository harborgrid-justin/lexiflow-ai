import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/apiService';
import { ResearchSession, User } from '../types';

export const useResearch = (currentUser?: User) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<ResearchSession[]>([]);
  const [currentResults, setCurrentResults] = useState<any | null>(null);
  const [jurisdiction, setJurisdiction] = useState('');
  const [searchType, setSearchType] = useState<'comprehensive' | 'case_law' | 'statutes' | 'news'>('comprehensive');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const sessions = await ApiService.getResearchHistory();
        setHistory(sessions || []);
      } catch (error) {
        console.error('Failed to fetch research history:', error);
        setHistory([]);
      }
    };
    fetchHistory();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setCurrentResults(null);

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

      setCurrentResults(normalizedResults);

      // Save to history
      const newSession: ResearchSession = {
        id: Date.now().toString(),
        query,
        response: `Found ${normalizedResults?.totalResults || 0} results`,
        sources: [],
        timestamp: new Date().toISOString(),
        userId: currentUser?.id,
      };

      const savedSession = await ApiService.saveResearchSession(newSession);
      setHistory((prev) => [savedSession, ...prev]);
    } catch (error) {
      console.error('Research failed:', error);
      alert('Research failed. Please check your Google Custom Search API configuration.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (id: string, type: 'positive' | 'negative') => {
    try {
      await ApiService.submitResearchFeedback(id, type);
      setHistory((prev) => prev.map(session =>
        session.id === id ? { ...session, feedback: type } : session
      ));
    } catch (e) {
      console.error(e);
    }
  };

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