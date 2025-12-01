/**
 * ResearchTool - AI-Powered Legal Research Component
 *
 * Provides comprehensive legal research capabilities including case law,
 * statutes, and legal articles search powered by Google Custom Search API.
 *
 * ENZYME MIGRATION:
 * - Uses useResearch hook with useApiRequest/useApiMutation (already migrated)
 * - Added useLatestCallback for stable event handler wrappers with tracking
 * - Added useTrackEvent for analytics on search and feedback actions
 * - Added usePageView for page tracking
 * - Added HydrationBoundary for progressive hydration of search results
 * - Added LazyHydration for deferred loading of history list
 */

import React from 'react';
import { PageHeader } from './common';
import { ResearchSearchForm } from './research/ResearchSearchForm';
import { ResearchResults } from './research/ResearchResults';
import { ResearchHistoryList } from './research/ResearchHistoryList';
import { useResearch } from '../hooks/useResearch';
import { User } from '../types';
import {
  useLatestCallback,
  useTrackEvent,
  usePageView,
  useIsMounted,
  HydrationBoundary,
  LazyHydration
} from '../enzyme';

interface ResearchToolProps {
  currentUser?: User;
}

export const ResearchTool: React.FC<ResearchToolProps> = ({ currentUser }) => {
  const {
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
  } = useResearch(currentUser);

  // ENZYME: Analytics tracking
  const trackEvent = useTrackEvent();
  usePageView('research_tool');
  const isMounted = useIsMounted();

  // ENZYME: Wrapped search handler with analytics tracking
  const handleSearchWithTracking = useLatestCallback(async (e: React.FormEvent) => {
    // Track search initiation
    trackEvent('research_search_initiated', {
      query: query.substring(0, 50), // Truncate for privacy
      searchType,
      jurisdiction: jurisdiction || 'all',
      queryLength: query.length
    });

    await handleSearch(e);

    // Track search completion (results will be available after handleSearch)
    if (isMounted()) {
      trackEvent('research_search_completed', {
        searchType,
        hasResults: !!currentResults
      });
    }
  });

  // ENZYME: Wrapped feedback handler with analytics tracking
  const handleFeedbackWithTracking = useLatestCallback(async (id: string, type: 'positive' | 'negative') => {
    trackEvent('research_feedback_submitted', {
      sessionId: id,
      feedbackType: type
    });

    await handleFeedback(id, type);
  });

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in">
      <PageHeader
        title="AI Legal Research"
        subtitle="Powered by Google Custom Search API - Search case law, statutes, and legal articles."
      />

      {/* Search form is critical - render immediately */}
      <HydrationBoundary id="research-search-form" priority="critical" trigger="immediate">
        <ResearchSearchForm
          query={query}
          jurisdiction={jurisdiction}
          searchType={searchType}
          isLoading={isLoading}
          onQueryChange={setQuery}
          onJurisdictionChange={setJurisdiction}
          onSearchTypeChange={setSearchType}
          onSubmit={handleSearchWithTracking}
        />
      </HydrationBoundary>

      {/* Current Results - high priority, visible trigger */}
      <HydrationBoundary id="research-results" priority="high" trigger="visible">
        <ResearchResults data={currentResults} />
      </HydrationBoundary>

      {/* History list - lower priority, can be deferred */}
      <LazyHydration priority="normal" trigger="visible">
        <ResearchHistoryList
          history={history}
          onFeedback={handleFeedbackWithTracking}
          showEmptyState={!currentResults}
        />
      </LazyHydration>
    </div>
  );
};
