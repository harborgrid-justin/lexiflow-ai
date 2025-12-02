/**
 * Search Results Page
 * Display search results with faceted filters and AI features
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  SlidersHorizontal,
  Download,
  BookmarkPlus,
  FolderPlus,
  Sparkles,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { SearchFilters } from '../components/SearchFilters';
import { ResultCard } from '../components/ResultCard';
import { AIInsightCard } from '../components/AIInsightCard';
import { useSearch } from '../api';
import { useResearchStore } from '../store/research.store';
import type { SearchFilters as SearchFiltersType, SearchQuery } from '../api/research.types';

export const SearchResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(true);
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());

  const {
    currentQuery,
    setCurrentQuery,
    filters,
    setFilters,
    savedResultIds,
    addSavedResult,
    removeSavedResult,
  } = useResearchStore();

  // Initialize query from URL params
  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam && queryParam !== currentQuery) {
      setCurrentQuery(queryParam);
    }
  }, [searchParams, currentQuery, setCurrentQuery]);

  const searchQuery: SearchQuery = {
    query: currentQuery,
    filters,
    page: 1,
    limit: 20,
  };

  const { data: searchResults, isLoading, error } = useSearch(searchQuery, {
    enabled: !!currentQuery,
  });

  const handleSearch = (query: string) => {
    setCurrentQuery(query);
    setSearchParams({ q: query });
  };

  const handleFiltersChange = (newFilters: SearchFiltersType) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  const handleSaveResult = (resultId: string) => {
    if (savedResultIds.has(resultId)) {
      removeSavedResult(resultId);
    } else {
      addSavedResult(resultId);
    }
  };

  const handleAddToFolder = (resultId: string) => {
    // This would open a modal to select/create folder
    console.log('Add to folder:', resultId);
  };

  const handleViewCase = (resultId: string) => {
    navigate(`/research/cases/${resultId}`);
  };

  const toggleResultSelection = (resultId: string) => {
    setSelectedResults(prev => {
      const next = new Set(prev);
      if (next.has(resultId)) {
        next.delete(resultId);
      } else {
        next.add(resultId);
      }
      return next;
    });
  };

  const handleExportSelected = () => {
    console.log('Export selected:', Array.from(selectedResults));
  };

  // Generate AI insights from search results
  const aiInsights = searchResults?.suggestions?.map((suggestion, index) => ({
    id: `suggestion-${index}`,
    type: 'key_point' as const,
    title: 'Related Search',
    content: suggestion,
    confidence: 0.85,
  })) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/research')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <SearchBar
                value={currentQuery}
                onChange={setCurrentQuery}
                onSearch={handleSearch}
                placeholder="Refine your search..."
                enableAI={true}
                showSuggestions={true}
              />
            </div>
          </div>

          {/* Results Header */}
          {searchResults && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {searchResults.totalResults.toLocaleString()} results
                </h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors
                    ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                  `}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span className="text-sm font-medium">Filters</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                {selectedResults.size > 0 && (
                  <>
                    <span className="text-sm text-gray-600">
                      {selectedResults.size} selected
                    </span>
                    <button
                      onClick={handleExportSelected}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm font-medium">Export</span>
                    </button>
                  </>
                )}
                <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <BookmarkPlus className="w-4 h-4" />
                  <span className="text-sm font-medium">Save Search</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <aside className="w-80 flex-shrink-0">
              <div className="sticky top-24">
                <SearchFilters
                  filters={filters}
                  onChange={handleFiltersChange}
                  facets={searchResults?.facets}
                  onReset={handleResetFilters}
                />
              </div>
            </aside>
          )}

          {/* Results */}
          <main className="flex-1 min-w-0 space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-lg font-medium text-gray-700">Searching legal databases...</p>
                <p className="text-sm text-gray-500">Analyzing millions of cases with AI</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <p className="text-red-700 font-medium mb-2">Search Error</p>
                <p className="text-red-600 text-sm">
                  {error instanceof Error ? error.message : 'An error occurred while searching'}
                </p>
              </div>
            ) : !searchResults || searchResults.results.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search terms or filters
                </p>
                <div className="space-y-2 text-sm text-gray-600 text-left max-w-md mx-auto">
                  <p><strong>Tips:</strong></p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Use more general terms</li>
                    <li>Check your spelling</li>
                    <li>Try Boolean operators (AND, OR, NOT)</li>
                    <li>Remove some filters</li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                {/* AI Insights */}
                {aiInsights.length > 0 && (
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
                    </div>
                    <div className="space-y-3">
                      {aiInsights.slice(0, 3).map(insight => (
                        <AIInsightCard
                          key={insight.id}
                          insight={insight}
                          collapsible={false}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Results List */}
                <div className="space-y-4">
                  {searchResults.results.map(result => (
                    <div key={result.id} className="relative">
                      <input
                        type="checkbox"
                        checked={selectedResults.has(result.id)}
                        onChange={() => toggleResultSelection(result.id)}
                        className="absolute top-6 left-2 w-5 h-5 text-blue-600 rounded z-10"
                      />
                      <div className="pl-10">
                        <ResultCard
                          result={result}
                          searchQuery={currentQuery}
                          onSave={handleSaveResult}
                          onAddToFolder={handleAddToFolder}
                          onViewCase={handleViewCase}
                          isSaved={savedResultIds.has(result.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {searchResults.totalResults > searchResults.limit && (
                  <div className="flex items-center justify-center gap-2 pt-6">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(page => (
                        <button
                          key={page}
                          className={`
                            w-10 h-10 rounded-lg transition-colors
                            ${page === 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100 text-gray-700'}
                          `}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
