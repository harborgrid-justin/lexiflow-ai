/**
 * ClauseLibrary - Clause Library Management Component
 *
 * Manages standard clauses, tracks versions, and monitors usage statistics.
 *
 * ENZYME MIGRATION:
 * - Uses useClauseLibrary hook with useApiRequest/useApiMutation
 * - Added useLatestCallback for stable event handlers
 * - Added useTrackEvent for analytics
 * - Added usePageView for page tracking
 * - Added LazyHydration for progressive hydration of clause cards below fold
 */

import React, { useState } from 'react';
import { Clause } from '../types';
import { Search, BarChart2, ShieldAlert, FileText, History } from 'lucide-react';
import { ClauseHistoryModal } from './ClauseHistoryModal';
import { PageHeader, Card } from './common';
import { useClauseLibrary } from '../hooks/useClauseLibrary';
import {
  useLatestCallback,
  useTrackEvent,
  usePageView,
  useIsMounted,
  LazyHydration
} from '../enzyme';

export const ClauseLibrary: React.FC = () => {
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const { searchTerm, setSearchTerm, filtered } = useClauseLibrary();
  const isMounted = useIsMounted();

  // ENZYME: Analytics tracking
  const trackEvent = useTrackEvent();
  usePageView('clause_library');

  // ENZYME: Stable callbacks with useLatestCallback
  const handleSelectClause = useLatestCallback((clause: Clause) => {
    setSelectedClause(clause);
    trackEvent('clause_view_history', {
      clauseId: clause.id,
      clauseName: clause.name,
      category: clause.category
    });
  });

  const handleCloseModal = useLatestCallback(() => {
    if (isMounted()) {
      setSelectedClause(null);
      trackEvent('clause_modal_closed');
    }
  });

  const handleSearchChange = useLatestCallback((value: string) => {
    setSearchTerm(value);
    // Track search after user stops typing (debounced in hook would be ideal)
    if (value.length > 2) {
      trackEvent('clause_search', { searchTerm: value, resultCount: filtered.length });
    }
  });

  // Determine which cards are "above the fold" (first 3 items)
  const ABOVE_FOLD_COUNT = 3;

  return (
    <div className="space-y-6">
      {selectedClause && (
        <ClauseHistoryModal clause={selectedClause} onClose={handleCloseModal} />
      )}

      <PageHeader 
        title="Clause Library"
        subtitle="Manage standard clauses, track versions, and monitor usage statistics."
      />

      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            value={searchTerm}
            onChange={e => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Search clauses by name or category..."
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((clause, index) => {
          // ENZYME: Render above-fold items immediately, lazy hydrate below-fold items
          const isAboveFold = index < ABOVE_FOLD_COUNT;

          const clauseCard = (
            <Card key={clause.id} noPadding className="flex flex-col hover:shadow-md transition-shadow">
              <div className="p-4 border-b border-slate-100 flex justify-between items-start bg-slate-50 rounded-t-lg">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{clause.category}</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{clause.name}</h3>
                </div>
                {clause.riskRating === 'High' && (
                  <div title="High Risk">
                    <ShieldAlert className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              <div className="p-4 flex-1">
                <p className="text-sm text-slate-600 line-clamp-3 font-serif bg-slate-50 p-3 rounded italic border border-slate-100 mb-4">
                  "{clause.content}"
                </p>
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                  <div className="flex items-center"><FileText className="h-3 w-3 mr-1"/> Ver: {clause.version}</div>
                  <div className="flex items-center"><BarChart2 className="h-3 w-3 mr-1"/> Used: {clause.usageCount}x</div>
                  <div className="col-span-2">Updated: {clause.lastUpdated}</div>
                </div>
              </div>
              <div className="p-3 border-t border-slate-100 bg-slate-50 rounded-b-lg flex justify-end">
                <button
                  onClick={() => handleSelectClause(clause)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <History className="h-3 w-3 mr-1"/> View History
                </button>
              </div>
            </Card>
          );

          // ENZYME: Wrap below-fold items in LazyHydration for progressive loading
          if (isAboveFold) {
            return <React.Fragment key={clause.id}>{clauseCard}</React.Fragment>;
          }

          return (
            <LazyHydration
              key={clause.id}
              trigger="visible"
              priority="low"
              fallback={
                <div className="animate-pulse bg-slate-100 rounded-lg h-64" />
              }
            >
              {clauseCard}
            </LazyHydration>
          );
        })}
      </div>
    </div>
  );
};
