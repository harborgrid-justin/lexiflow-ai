/**
 * Case List Hook - SOA Migration
 * 
 * Migrated from /client/hooks/useCaseList.ts
 * Manages case list with filtering and CRUD operations.
 */

import { useState, useMemo, useCallback } from 'react';
import { Case } from '@/types';
import { useApiRequest, useLatestCallback, usePageView, useTrackEvent } from '@/enzyme';
import { ApiService } from '@/services/apiService';

export interface CaseListFilters {
  status: string;
  type: string;
}

/**
 * Hook for managing case list with filtering and CRUD
 */
export const useCaseList = () => {
  // Track page view
  usePageView('case_list');
  const trackEvent = useTrackEvent();

  // API request with Enzyme
  const {
    data: response,
    isLoading: loading,
    error: queryError,
    refetch: rawRefetch
  } = useApiRequest<{ cases: Case[]; total: number; page: number; limit: number; totalPages: number }>({
    endpoint: '/api/v1/cases',
    options: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
    }
  });

  const cases = useMemo(() => response?.cases || [], [response?.cases]);
  const pagination = useMemo(() => response ? {
    total: response.total,
    page: response.page,
    limit: response.limit,
    totalPages: response.totalPages,
  } : null, [response]);

  // Wrap refetch to maintain consistent interface
  const refetch = useCallback(async () => {
    await rawRefetch();
  }, [rawRefetch]);
  
  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const error = queryError ? 'Failed to load cases. Please check your connection.' : null;

  // Filtered cases
  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesType = typeFilter === 'All' || c.matterType === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [cases, statusFilter, typeFilter]);

  // Reset filters
  const resetFilters = useLatestCallback(() => {
    setStatusFilter('All');
    setTypeFilter('All');
    trackEvent('case_filters_reset');
  });

  // Add case
  const addCase = useLatestCallback(async (newCase: Partial<Case>) => {
    try {
      trackEvent('case_create_started');
      const createdCase = await ApiService.cases.create(newCase);
      await refetch();
      trackEvent('case_created', { caseId: createdCase.id });
      return createdCase;
    } catch (err) {
      console.error('Failed to create case:', err);
      throw err;
    }
  });

  // Delete case
  const deleteCase = useLatestCallback(async (caseId: string) => {
    try {
      trackEvent('case_delete_started', { caseId });
      await ApiService.cases.delete(caseId);
      await refetch();
      trackEvent('case_deleted', { caseId });
    } catch (err) {
      console.error('Failed to delete case:', err);
      throw err;
    }
  });

  // Update case
  const updateCase = useLatestCallback(async (caseId: string, updates: Partial<Case>) => {
    try {
      trackEvent('case_update_started', { caseId });
      const updatedCase = await ApiService.cases.update(caseId, updates);
      await refetch();
      trackEvent('case_updated', { caseId });
      return updatedCase;
    } catch (err) {
      console.error('Failed to update case:', err);
      throw err;
    }
  });

  // Refresh
  const refresh = useLatestCallback(() => {
    trackEvent('case_list_refreshed');
    return refetch();
  });

  return {
    // Data
    cases,
    filteredCases,
    pagination,
    
    // Loading/Error
    loading,
    error,
    refreshing: false,
    isLoading: loading,
    
    // Modal state
    isModalOpen,
    setIsModalOpen,
    
    // Filters
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    resetFilters,
    
    // Actions
    addCase,
    deleteCase,
    updateCase,
    refresh,
  };
};
