
import React from 'react';
import { PageHeader } from './common';
import { ResearchSearchForm } from './research/ResearchSearchForm';
import { ResearchResults } from './research/ResearchResults';
import { ResearchHistoryList } from './research/ResearchHistoryList';
import { useResearch } from '../hooks/useResearch';

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

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in">
      <PageHeader 
        title="AI Legal Research" 
        subtitle="Powered by Google Custom Search API - Search case law, statutes, and legal articles."
      />

      <ResearchSearchForm
        query={query}
        jurisdiction={jurisdiction}
        searchType={searchType}
        isLoading={isLoading}
        onQueryChange={setQuery}
        onJurisdictionChange={setJurisdiction}
        onSearchTypeChange={setSearchType}
        onSubmit={handleSearch}
      />

      {/* Current Results */}
      <ResearchResults data={currentResults} />

      <ResearchHistoryList
        history={history}
        onFeedback={handleFeedback}
        showEmptyState={!currentResults}
      />
    </div>
  );
};
