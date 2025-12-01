import { useState, useEffect } from 'react';
import { DocketEntry, TimelineEvent } from '../types';
import { ApiService } from '../services/apiService';

/**
 * Custom hook for managing PACER docket entries and their integration
 * with motions, documents, calendar events, and timeline
 */
export const useDocketEntries = (caseId: string) => {
  const [docketEntries, setDocketEntries] = useState<DocketEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;

    const fetchDocketEntries = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await ApiService.getDocketEntries(caseId);
        setDocketEntries(data || []);
      } catch (err) {
        console.error('Failed to fetch docket entries:', err);
        setError('Failed to load docket entries');
        setDocketEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocketEntries();
  }, [caseId]);

  /**
   * Convert docket entries to timeline events
   */
  const getDocketTimelineEvents = (): TimelineEvent[] => {
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
  };

  /**
   * Find docket entries that might be related to a motion
   */
  const findMotionDocketEntries = (motionTitle: string): DocketEntry[] => {
    const searchTerms = motionTitle.toLowerCase().split(' ').filter(t => t.length > 3);
    return docketEntries.filter(entry => {
      const entryText = entry.text.toLowerCase();
      return searchTerms.some(term => entryText.includes(term)) ||
             (entry.documentType?.toLowerCase().includes('motion'));
    });
  };

  /**
   * Find docket entries that might be related to a hearing
   */
  const findHearingDocketEntries = (hearingDate?: string): DocketEntry[] => {
    if (!hearingDate) return [];
    return docketEntries.filter(entry => {
      const entryText = entry.text.toLowerCase();
      return entryText.includes('hearing') || 
             entryText.includes('oral argument') ||
             entry.dateFiled === hearingDate;
    });
  };

  /**
   * Find docket entries that reference documents
   */
  const findDocumentDocketEntries = (): DocketEntry[] => {
    return docketEntries.filter(entry => entry.docLink !== null && entry.docLink !== undefined);
  };

  /**
   * Get statistics about docket entries
   */
  const getStatistics = () => {
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
  };

  return {
    docketEntries,
    loading,
    error,
    getDocketTimelineEvents,
    findMotionDocketEntries,
    findHearingDocketEntries,
    findDocumentDocketEntries,
    getStatistics,
    refetch: () => {
      setLoading(true);
      ApiService.getDocketEntries(caseId)
        .then(data => setDocketEntries(data || []))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  };
};
