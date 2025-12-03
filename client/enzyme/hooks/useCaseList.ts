/**
 * useCaseList Hook - Case List Management
 *
 * Manages case list with filtering, CRUD operations, and pagination.
 *
 * @see /client/enzyme/ENZYME_COMPLETE_GUIDE.md
 */

import { useState, useMemo, useCallback } from 'react';
import { Case } from '../../types';
import { useApiRequest } from '../services/hooks';
import { enzymeClient } from '../services/client';
import { useLatestCallback } from '@missionfabric-js/enzyme/hooks';

export const useCaseList = () => {
  // Automatic caching, refetching, and loading states
  const {
    data: response,
    isLoading: loading,
    error: queryError,
    refetch: rawRefetch
  } = useApiRequest<{ cases: Case[]; total: number; page: number; limit: number; totalPages: number }>({
    endpoint: '/cases',
    options: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
    }
  });

  const cases = response?.cases || [];
  const _pagination = response ? {
    total: response.total,
    page: response.page,
    limit: response.limit,
    totalPages: response.totalPages,
  } : null;

  // Wrap refetch to maintain the same interface
  const refetch = useCallback(async () => {
    await rawRefetch();
  }, [rawRefetch]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const error = queryError ? 'Failed to load cases. Please check your connection.' : null;

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesType = typeFilter === 'All' || c.matterType === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [cases, statusFilter, typeFilter]);

  const resetFilters = useLatestCallback(() => {
    setStatusFilter('All');
    setTypeFilter('All');
  });

  const addCase = useLatestCallback(async (newCase: Partial<Case>) => {
    try {
      const { data: createdCase } = await enzymeClient.post<Case>('/cases', newCase);
      await refetch();
      return createdCase;
    } catch (err) {
      console.error('Failed to create case:', err);
      throw err;
    }
  });

  const deleteCase = useLatestCallback(async (caseId: string) => {
    try {
      await enzymeClient.delete(`/cases/${caseId}`);
      await refetch();
    } catch (err) {
      console.error('Failed to delete case:', err);
      throw err;
    }
  });

  const updateCase = useLatestCallback(async (caseId: string, updates: Partial<Case>) => {
    try {
      const { data: updatedCase } = await enzymeClient.put<Case>(`/cases/${caseId}`, updates);
      await refetch();
      return updatedCase;
    } catch (err) {
      console.error('Failed to update case:', err);
      throw err;
    }
  });

  const refresh = useLatestCallback(() => {
    return refetch();
  });

  return {
    cases,
    loading,
    error,
    refreshing: false,
    isModalOpen,
    setIsModalOpen,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    filteredCases,
    resetFilters,
    addCase,
    deleteCase,
    updateCase,
    refresh,
    isLoading: loading
  };
};
