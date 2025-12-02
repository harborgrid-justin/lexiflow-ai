/**
 * KnowledgeBasePage - Knowledge Base Page Component
 *
 * Main page for accessing firm-wide intelligence, precedents, and internal wiki.
 *
 * Features:
 * - Tabbed navigation (Wiki, Precedents, Q&A)
 * - Progressive hydration for optimal performance
 * - Search with debounced filtering
 * - Analytics tracking
 */

import React, { Suspense } from 'react';
import { Search } from 'lucide-react';
import { PageHeader, Tabs, Card } from '@/components/common';
import {
  usePageView,
  useTrackEvent,
  useLatestCallback,
  HydrationBoundary,
  LazyHydration
} from '@/enzyme';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase';
import { KnowledgeItemCard } from '../components/KnowledgeItemCard';
import type { KnowledgeTab } from '../api/knowledge.types';

export const KnowledgeBasePage: React.FC = () => {
  const {
    filteredItems,
    loading,
    searchTerm,
    setSearchTerm,
    tab,
    setTab
  } = useKnowledgeBase({ initialTab: 'wiki' });

  // Analytics
  usePageView('knowledge_base');
  const trackEvent = useTrackEvent();

  const handleTabChange = useLatestCallback((newTab: string) => {
    setTab(newTab as KnowledgeTab);
    trackEvent('knowledge_base_tab_changed', {
      from: tab,
      to: newTab
    });
  });

  const handleSearchChange = useLatestCallback((value: string) => {
    setSearchTerm(value);
    if (value.length > 2) {
      trackEvent('knowledge_base_search', {
        tab,
        queryLength: value.length
      });
    }
  });

  const getPlaceholder = () => {
    switch (tab) {
      case 'wiki':
        return 'Search articles, playbooks...';
      case 'precedents':
        return 'Search past matters, winning strategies...';
      case 'qa':
        return 'Search internal questions...';
      default:
        return 'Search...';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and tabs */}
      <HydrationBoundary id="knowledge-base-header" priority="high" trigger="immediate">
        <PageHeader
          title="Knowledge Base"
          subtitle="Firm-wide intelligence, precedents, and internal wiki."
          actions={
            <Tabs
              tabs={['wiki', 'precedents', 'qa']}
              activeTab={tab}
              onChange={handleTabChange}
            />
          }
        />
      </HydrationBoundary>

      {/* Search input */}
      <HydrationBoundary id="knowledge-base-search" priority="high" trigger="immediate">
        <Card>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              className="w-full pl-10 p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
              placeholder={getPlaceholder()}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </Card>
      </HydrationBoundary>

      {/* Results */}
      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading knowledge base...</div>
      ) : (
        <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading...</div>}>
          <LazyHydration priority="normal" trigger="visible">
            <div className={`grid gap-6 ${tab === 'qa' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              {filteredItems.map(item => (
                <KnowledgeItemCard 
                  key={item.id} 
                  item={item} 
                  type={tab}
                />
              ))}
              {filteredItems.length === 0 && (
                <div className="col-span-full text-center py-12 text-slate-500">
                  No items found matching your search.
                </div>
              )}
            </div>
          </LazyHydration>
        </Suspense>
      )}
    </div>
  );
};

export default KnowledgeBasePage;
