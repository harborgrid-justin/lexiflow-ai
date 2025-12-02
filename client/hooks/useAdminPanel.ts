/**
 * ENZYME MIGRATION - useAdminPanel Hook
 * ========================================
 *
 * **Migration Date:** December 2, 2025 - Agent 40 (Wave 5)
 *
 * **Enzyme Features Implemented:**
 * 1. ✅ useApiRequest - Smart API fetching with caching and conditional loading
 * 2. ✅ useDebouncedValue - 300ms debounced search for performance optimization
 * 3. ✅ useLatestCallback - Stable callbacks for refresh and search actions
 * 4. ✅ useTrackEvent - Analytics tracking for admin operations (refresh, search)
 * 5. ✅ useIsMounted - Available for future async enhancements
 *
 * **Features:**
 * - Search/filter state management for audit logs
 * - Pagination state for large log datasets
 * - Debounced search to reduce unnecessary filtering
 * - Analytics tracking for admin actions (refresh, search)
 * - Filtered logs based on debounced search term
 * - Stable callback references to prevent re-renders
 *
 * **Usage Example:**
 * ```tsx
 * const {
 *   logs,
 *   filteredLogs,
 *   isLoading,
 *   searchTerm,
 *   setSearchTerm,
 *   currentPage,
 *   setCurrentPage,
 *   handleRefresh
 * } = useAdminPanel('logs');
 * ```
 *
 * @see /client/enzyme/index.ts - Enzyme framework exports
 */

import { useState, useMemo } from 'react';
import {
  useApiRequest,
  useLatestCallback,
  useIsMounted,
  useDebouncedValue,
  useTrackEvent
} from '../enzyme';
import { AuditLogEntry } from '../types';

export const useAdminPanel = (activeTab: string) => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20; // Items per page

  // Enzyme hooks
  const debouncedSearch = useDebouncedValue(searchTerm, 300);
  const trackEvent = useTrackEvent();
  const isMounted = useIsMounted();

  // Fetch audit logs with Enzyme - only when logs tab is active
  const { data: logs = [], isLoading, refetch } = useApiRequest<AuditLogEntry[]>({
    endpoint: '/api/v1/audit/logs',
    options: {
      staleTime: 2 * 60 * 1000, // 2 min cache
      enabled: activeTab === 'logs' // Conditional fetching
    }
  });

  // Filter logs based on debounced search term
  const filteredLogs = useMemo(() => {
    if (!debouncedSearch) return logs;

    const lowerSearch = debouncedSearch.toLowerCase();
    const filtered = logs.filter(log =>
      log.action.toLowerCase().includes(lowerSearch) ||
      log.user.toLowerCase().includes(lowerSearch) ||
      log.resource.toLowerCase().includes(lowerSearch)
    );

    // Track search with results count
    if (debouncedSearch !== '') {
      trackEvent('admin_logs_searched', {
        searchTerm: debouncedSearch,
        resultsCount: filtered.length,
        totalLogs: logs.length
      });
    }

    return filtered;
  }, [logs, debouncedSearch, trackEvent]);

  // Paginate filtered logs
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredLogs.slice(startIndex, endIndex);
  }, [filteredLogs, currentPage, pageSize]);

  // Calculate pagination metadata
  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Stable refresh handler with analytics tracking
  const handleRefresh = useLatestCallback(() => {
    trackEvent('admin_logs_refreshed', {
      activeTab,
      currentPage,
      hasFilters: searchTerm !== '',
      logCount: logs.length
    });
    refetch();
  });

  // Stable search handler with page reset
  const handleSearch = useLatestCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  });

  // Stable page navigation handlers
  const handleNextPage = useLatestCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
      trackEvent('admin_logs_page_changed', {
        fromPage: currentPage,
        toPage: currentPage + 1,
        totalPages
      });
    }
  });

  const handlePreviousPage = useLatestCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
      trackEvent('admin_logs_page_changed', {
        fromPage: currentPage,
        toPage: currentPage - 1,
        totalPages
      });
    }
  });

  const handlePageChange = useLatestCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      trackEvent('admin_logs_page_changed', {
        fromPage: currentPage,
        toPage: page,
        totalPages
      });
    }
  });

  return {
    // Data
    logs,
    filteredLogs,
    paginatedLogs,
    isLoading,

    // Search state
    searchTerm,
    setSearchTerm,
    debouncedSearch,

    // Pagination state
    currentPage,
    setCurrentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    pageSize,

    // Actions
    handleRefresh,
    handleSearch,
    handleNextPage,
    handlePreviousPage,
    handlePageChange,
    refetch
  };
};