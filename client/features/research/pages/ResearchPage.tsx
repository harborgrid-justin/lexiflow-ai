/**
 * Legal Research Dashboard
 * Command-center style interface for legal research
 */

import React, { useState } from 'react';
import {
  Clock,
  Bookmark,
  Folder,
  Bell,
  Sparkles,
  TrendingUp,
  FileText,
  Scale,
  BookOpen,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { useResearchHistory, useSavedSearches, useResearchFolders, useSearchTemplates } from '../api';
import type { SearchTemplate } from '../api/research.types';

export const ResearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: history = [], isLoading: loadingHistory } = useResearchHistory(10);
  const { data: savedSearches = [], isLoading: loadingSaved } = useSavedSearches();
  const { data: folders = [], isLoading: loadingFolders } = useResearchFolders();
  const { data: templates = [], isLoading: loadingTemplates } = useSearchTemplates();

  const handleSearch = (query: string) => {
    // Navigate to search results page with query
    navigate(`/research/search?q=${encodeURIComponent(query)}`);
  };

  const handleTemplateSelect = (template: SearchTemplate) => {
    setSearchQuery(template.template);
  };

  const handleSavedSearchClick = (searchId: string) => {
    const search = savedSearches.find(s => s.id === searchId);
    if (search) {
      navigate(`/research/search?q=${encodeURIComponent(search.query.query)}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Legal Research</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">LexiFlow Research</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Search millions of cases, statutes, and legal resources with the power of AI
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
              placeholder="Search case law, statutes, regulations, and more..."
              enableAI={true}
              showSuggestions={true}
              autoFocus={true}
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <Scale className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">50M+</div>
              <div className="text-sm text-blue-100">Cases</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <BookOpen className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">10M+</div>
              <div className="text-sm text-blue-100">Statutes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <FileText className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">5M+</div>
              <div className="text-sm text-blue-100">Articles</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
              <Sparkles className="w-6 h-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">AI</div>
              <div className="text-sm text-blue-100">Powered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Templates & Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Search Templates */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Search Templates</h2>
                <p className="text-sm text-gray-600">Pre-built queries for common legal research</p>
              </div>
              <div className="p-6">
                {loadingTemplates ? (
                  <div className="text-center py-8 text-gray-500">Loading templates...</div>
                ) : templates.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3">
                    {templates.slice(0, 6).map(template => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                      >
                        <div className="font-medium text-gray-900 group-hover:text-blue-600 mb-1">
                          {template.name}
                        </div>
                        <div className="text-xs text-gray-600 line-clamp-2">
                          {template.description}
                        </div>
                        <div className="mt-2 text-xs text-gray-500 capitalize">
                          {template.category}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No templates available</div>
                )}
              </div>
            </div>

            {/* Recent Searches */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Searches</h2>
                  <p className="text-sm text-gray-600">Your latest research activity</p>
                </div>
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                {loadingHistory ? (
                  <div className="px-6 py-8 text-center text-gray-500">Loading history...</div>
                ) : history.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {history.map(item => (
                      <button
                        key={item.id}
                        onClick={() => handleSearch(item.query)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 mb-1 line-clamp-1">
                              {item.query}
                            </div>
                            <div className="text-sm text-gray-600">
                              {item.resultCount} results
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(item.timestamp)}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No recent searches
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Saved & Folders */}
          <div className="space-y-8">
            {/* Saved Searches */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">Saved Searches</h2>
                  <p className="text-sm text-gray-600">{savedSearches.length} saved</p>
                </div>
                <Bookmark className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                {loadingSaved ? (
                  <div className="px-6 py-8 text-center text-gray-500">Loading...</div>
                ) : savedSearches.length > 0 ? (
                  <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                    {savedSearches.slice(0, 10).map(search => (
                      <button
                        key={search.id}
                        onClick={() => handleSavedSearchClick(search.id)}
                        className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium text-gray-900 mb-1 line-clamp-1">
                          {search.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {search.alertsEnabled && (
                            <span className="inline-flex items-center gap-1 mr-2">
                              <Bell className="w-3 h-3" />
                              Alerts on
                            </span>
                          )}
                          {search.resultCount && `${search.resultCount} results`}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No saved searches
                  </div>
                )}
              </div>
            </div>

            {/* Research Folders */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-900">Research Folders</h2>
                  <p className="text-sm text-gray-600">{folders.length} folders</p>
                </div>
                <Folder className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                {loadingFolders ? (
                  <div className="px-6 py-8 text-center text-gray-500">Loading...</div>
                ) : folders.length > 0 ? (
                  <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                    {folders.slice(0, 10).map(folder => (
                      <button
                        key={folder.id}
                        onClick={() => navigate(`/research/folders/${folder.id}`)}
                        className="w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Folder className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 line-clamp-1">
                              {folder.name}
                            </div>
                            <div className="text-xs text-gray-600">
                              {folder.cases.length} cases
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-8 text-center text-gray-500">
                    No folders yet
                  </div>
                )}
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Trending Topics</h3>
              </div>
              <div className="space-y-2">
                {['Employment Law Updates', 'AI & Privacy Regulations', 'Contract Disputes', 'IP Litigation'].map(topic => (
                  <button
                    key={topic}
                    onClick={() => handleSearch(topic)}
                    className="w-full px-3 py-2 bg-white rounded-lg hover:shadow-md transition-all text-left text-sm font-medium text-gray-700"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
