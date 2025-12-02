import { useMemo } from 'react';
import { DocketEntry, TimelineEvent } from '../types';
import { useApiRequest, useLatestCallback, useIsMounted } from '../enzyme';

/**
 * ENZYME MIGRATION: useDocketEntries
 *
 * Migrated from useEffect + ApiService pattern to Enzyme's useApiRequest
 *
 * Benefits:
 * - Automatic caching (3 min stale time) reduces redundant API calls
 * - Built-in loading/error states with proper race condition handling
 * - Conditional fetching when caseId is available
 * - useLatestCallback ensures utility functions always use current data
 * - useIsMounted prevents state updates on unmounted components
 *
 * @see /client/enzyme/MIGRATION_PLAN.md
 */

/**
 * Custom hook for managing PACER docket entries and their integration
 * with motions, documents, calendar events, and timeline
 */
export const useDocketEntries = (caseId: string) => {
  const isMounted = useIsMounted();

  // Use Enzyme's useApiRequest for automatic caching and loading states
  const { data: docketEntries = [], isLoading: loading, error, refetch } = useApiRequest<DocketEntry[]>({
    endpoint: `/api/v1/docket-entries?case_id=${caseId}`,
    options: {
      enabled: !!caseId,
      staleTime: 3 * 60 * 1000, // 3 min cache - docket entries don't change frequently
    }
  });

  /**
   * Convert docket entries to timeline events
   */
  const getDocketTimelineEvents = useLatestCallback((): TimelineEvent[] => {
    return docketEntries.map(entry => ({
      id: `docket-${entry.id}`,
      date: entry.dateFiled,
      title: entry.text.length > 80 ? entry.text.substring(0, 80) + '...' : entry.text,
      type: 'docket' as const,
      description: entry.documentType || undefined,
      relatedId: entry.id,
      docketEntryNumber: entry.entryNumber,
      pacerLink: entry.docLink
    }));
  });

  /**
   * Find docket entries that might be related to a motion
   */
  const findMotionDocketEntries = useLatestCallback((motionTitle: string): DocketEntry[] => {
    const searchTerms = motionTitle.toLowerCase().split(' ').filter(t => t.length > 3);
    return docketEntries.filter(entry => {
      const entryText = entry.text.toLowerCase();
      return searchTerms.some(term => entryText.includes(term)) ||
             (entry.documentType?.toLowerCase().includes('motion'));
    });
  });

  /**
   * Find docket entries that might be related to a hearing
   */
  const findHearingDocketEntries = useLatestCallback((hearingDate?: string): DocketEntry[] => {
    if (!hearingDate) return [];
    return docketEntries.filter(entry => {
      const entryText = entry.text.toLowerCase();
      return entryText.includes('hearing') ||
             entryText.includes('oral argument') ||
             entry.dateFiled === hearingDate;
    });
  });

  /**
   * Find docket entries that reference documents
   */
  const findDocumentDocketEntries = useLatestCallback((): DocketEntry[] => {
    return docketEntries.filter(entry => entry.docLink !== null && entry.docLink !== undefined);
  });

  /**
   * Get statistics about docket entries
   * Memoized for performance since this computes aggregate data
   */
  const statistics = useMemo(() => {
    return {
      total: docketEntries.length,
      withDocuments: docketEntries.filter(e => e.docLink).length,
      byType: docketEntries.reduce((acc, entry) => {
        const type = entry.documentType || 'Other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentEntries: docketEntries
        .sort((a, b) => new Date(b.dateFiled).getTime() - new Date(a.dateFiled).getTime())
        .slice(0, 10)
    };
  }, [docketEntries]);

  const getStatistics = useLatestCallback(() => statistics);

  // Safe refetch that only executes if component is still mounted
  const handleRefetch = useLatestCallback(async () => {
    if (!isMounted()) return;
    await refetch();
  });

  return {
    docketEntries,
    loading,
    error: error ? 'Failed to load docket entries' : null,
    getDocketTimelineEvents,
    findMotionDocketEntries,
    findHearingDocketEntries,
    findDocumentDocketEntries,
    getStatistics,
    refetch: handleRefetch,
  };
};
