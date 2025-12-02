/**
 * KnowledgeBase - Firm-wide Intelligence & Precedents Component
 *
 * Provides access to internal wiki, precedent library, and Q&A knowledge base.
 *
 * ENZYME MIGRATION:
 * - Uses useKnowledgeBase hook with useDebouncedValue (already migrated)
 * - Added usePageView for page tracking
 * - Added useTrackEvent for analytics on tab changes and searches
 * - Added useLatestCallback for stable event handlers with tracking
 * - Added HydrationBoundary for progressive hydration of search and results
 * - Added LazyHydration for deferred loading of result cards
 */

import React, { useState } from 'react';
import { Search, Book, FileText, Lightbulb, MessageCircle } from 'lucide-react';
import { PageHeader, Tabs, Card, Badge } from './common';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase';
import { ensureTagsArray } from '../utils/type-transformers';
import {
  usePageView,
  useTrackEvent,
  useLatestCallback,
  HydrationBoundary,
  LazyHydration
} from '../enzyme';

export const KnowledgeBase: React.FC = () => {
  const [tab, setTab] = useState<'wiki'|'precedents'|'qa'>('wiki');
  const { items, loading, searchTerm, setSearchTerm, filteredItems } = useKnowledgeBase(tab);

  // ENZYME: Analytics tracking
  usePageView('knowledge_base');
  const trackEvent = useTrackEvent();

  // ENZYME: Wrapped tab change handler with analytics
  const handleTabChange = useLatestCallback((newTab: string) => {
    setTab(newTab as 'wiki'|'precedents'|'qa');

    trackEvent('knowledge_base_tab_changed', {
      from: tab,
      to: newTab
    });
  });

  // ENZYME: Wrapped search handler with analytics
  const handleSearchChange = useLatestCallback((value: string) => {
    setSearchTerm(value);

    if (value.length > 2) {
      trackEvent('knowledge_base_search', {
        tab,
        queryLength: value.length
      });
    }
  });

  return (
    <div className="space-y-6 animate-fade-in">
        {/* Header and tabs - critical for navigation */}
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

        {/* Search input - high priority for immediate user interaction */}
        <HydrationBoundary id="knowledge-base-search" priority="high" trigger="immediate">
          <Card>
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5"/>
                  <input
                      className="w-full pl-10 p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                      placeholder={`Search ${tab === 'wiki' ? 'articles, playbooks...' : tab === 'precedents' ? 'past matters, winning strategies...' : 'internal questions...'}`}
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                  />
              </div>
          </Card>
        </HydrationBoundary>

        {loading ? (
            <div className="p-8 text-center text-slate-500">Loading knowledge base...</div>
        ) : (
            /* Results grid - use LazyHydration for deferred loading when visible */
            <LazyHydration priority="normal" trigger="visible">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tab === 'wiki' && filteredItems.map(item => (
                       <Card key={item.id} className="hover:border-blue-300 cursor-pointer group transition-all">
                          <div className="flex items-center justify-between mb-2">
                              {item.metadata.icon === 'Book' ? <Book className="h-5 w-5 text-purple-500"/> : <Lightbulb className="h-5 w-5 text-amber-500"/>}
                              <Badge variant={item.metadata.color === 'purple' ? 'category-purple' : 'category-amber'} size="sm">
                                {item.category}
                              </Badge>
                          </div>
                          <h3 className="font-bold text-slate-900 group-hover:text-blue-600">{item.title}</h3>
                          <p className="text-sm text-slate-500 mt-2">{item.summary}</p>
                       </Card>
                  ))}

                  {tab === 'precedents' && filteredItems.map(item => (
                       <Card key={item.id} className="hover:border-blue-300 cursor-pointer transition-all">
                          <div className="flex items-center justify-between mb-2"><FileText className="h-5 w-5 text-blue-500"/><span className="text-xs text-slate-500">{item.metadata.similarity}% Similarity</span></div>
                          <h3 className="font-bold text-slate-900">{item.title}</h3>
                          <p className="text-sm text-slate-500 mt-2">{item.summary}</p>
                          <div className="mt-3 flex gap-2">
                              {ensureTagsArray(item.tags).map(tag => (
                                  <span key={tag} className="text-xs bg-slate-100 px-2 py-1 rounded">{tag}</span>
                              ))}
                          </div>
                       </Card>
                  ))}

                  {tab === 'qa' && (
                      <div className="col-span-1 md:col-span-2 space-y-4">
                          {filteredItems.map(item => (
                              <Card key={item.id} className="p-4">
                                  <div className="flex gap-3">
                                      <div className="mt-1"><MessageCircle className="h-5 w-5 text-slate-400"/></div>
                                      <div>
                                          <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
                                          <p className="text-xs text-slate-500 mt-1">{item.summary}</p>
                                          <div className="mt-3 bg-green-50 p-3 rounded text-sm text-slate-700 border border-green-100">
                                              <span className="font-bold text-green-700 block mb-1">Top Answer (Partner Verified)</span>
                                              {item.metadata.topAnswer || item.content}
                                          </div>
                                      </div>
                                  </div>
                              </Card>
                          ))}
                      </div>
                  )}
              </div>
            </LazyHydration>
        )}
    </div>
  );
};
