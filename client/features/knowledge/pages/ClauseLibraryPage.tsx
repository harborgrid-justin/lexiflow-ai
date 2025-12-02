/**
 * ClauseLibraryPage - Clause Library Page Component
 *
 * Manages standard clauses, track versions, and monitor usage statistics.
 *
 * Features:
 * - Clause grid with lazy hydration
 * - Search and filtering
 * - Version history modal
 * - Analytics tracking
 */

import React, { useState, Suspense } from 'react';
import { Search } from 'lucide-react';
import { PageHeader, Card } from '@/components/common';
import {
  useLatestCallback,
  useTrackEvent,
  usePageView,
  useIsMounted,
  LazyHydration
} from '@/enzyme';
import { useClauseLibrary } from '../hooks/useClauseLibrary';
import { ClauseCard } from '../components/ClauseCard';
import { ClauseHistoryModal } from '../components/ClauseHistoryModal';
import type { Clause } from '../api/knowledge.types';

const ABOVE_FOLD_COUNT = 3;

export const ClauseLibraryPage: React.FC = () => {
  const [selectedClause, setSelectedClause] = useState<Clause | null>(null);
  const { searchTerm, setSearchTerm, filtered, loading } = useClauseLibrary();
  const isMounted = useIsMounted();

  // Analytics
  const trackEvent = useTrackEvent();
  usePageView('clause_library');

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
    if (value.length > 2) {
      trackEvent('clause_search', { searchTerm: value, resultCount: filtered.length });
    }
  });

  return (
    <div className="space-y-6">
      {/* Version History Modal */}
      {selectedClause && (
        <ClauseHistoryModal clause={selectedClause} onClose={handleCloseModal} />
      )}

      {/* Header */}
      <PageHeader 
        title="Clause Library"
        subtitle="Manage standard clauses, track versions, and monitor usage statistics."
      />

      {/* Search */}
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

      {/* Clause Grid */}
      {loading ? (
        <div className="p-8 text-center text-slate-500">Loading clauses...</div>
      ) : (
        <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading...</div>}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((clause, index) => {
              const isAboveFold = index < ABOVE_FOLD_COUNT;

              if (isAboveFold) {
                return (
                  <ClauseCard 
                    key={clause.id} 
                    clause={clause} 
                    onViewHistory={handleSelectClause} 
                  />
                );
              }

              return (
                <LazyHydration
                  key={clause.id}
                  trigger="visible"
                  priority="low"
                  fallback={<div className="animate-pulse bg-slate-100 rounded-lg h-64" />}
                >
                  <ClauseCard 
                    clause={clause} 
                    onViewHistory={handleSelectClause} 
                  />
                </LazyHydration>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500">
                No clauses found matching your search.
              </div>
            )}
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default ClauseLibraryPage;
