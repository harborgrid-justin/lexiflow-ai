/**
 * Admin Panel Hook - SOA Migration
 * 
 * Migrated from /client/hooks/useAdminPanel.ts
 * Enhanced with Enzyme framework features for admin functionality.
 */

import { useState, useMemo } from 'react';
import {
  useApiRequest,
  useLatestCallback,
  useDebouncedValue,
  useTrackEvent,
  usePageView,
} from '@/enzyme';
import { AuditLogEntry } from '@/types';

export type AdminTab = 'logs' | 'users' | 'settings' | 'security' | 'hierarchy' | 'data' | 'integrations';

/**
 * Main admin panel hook for audit logs and admin functionality
 */
export const useAdminPanel = (activeTab: AdminTab = 'logs') => {
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  // Enzyme hooks
  const debouncedSearch = useDebouncedValue(searchTerm, 300);
  const trackEvent = useTrackEvent();
  
  // Track page view
  usePageView('admin_panel', { tab: activeTab });

  // Fetch audit logs with Enzyme - only when logs tab is active
  const { data: logs = [], isLoading, refetch } = useApiRequest<AuditLogEntry[]>({
    endpoint: '/api/v1/audit/logs',
    options: {
      staleTime: 2 * 60 * 1000, // 2 min cache
      enabled: activeTab === 'logs'
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

  // Pagination metadata
  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Stable refresh handler with analytics
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
    setCurrentPage(1);
  });

  // Page navigation handlers
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
