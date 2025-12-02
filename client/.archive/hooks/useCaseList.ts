
import { useState, useMemo, useCallback } from 'react';
import { Case } from '../types';
import { useApiRequest } from '../enzyme';
import { useLatestCallback } from '@missionfabric-js/enzyme/hooks';

export const useCaseList = () => {
  // ✅ ENZYME: useApiRequest - automatic caching, refetching, and loading states
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

  // TODO: Fix Enzyme mutations - temporarily disabled
  // const createCaseMutation = useApiMutation({
  //   endpoint: '/api/v1/cases',
  //   method: 'POST',
  //   onSuccess: () => {
  //     refetch();
  //     if (isMounted()) {
  //       setIsModalOpen(false);
  //     }
  //   },
  // });

  // const deleteCaseMutation = useApiMutation({
  //   endpoint: '/api/v1/cases/:id',
  //   method: 'DELETE',
  //   onSuccess: () => {
  //     refetch();
  //   },
  // });

  // const updateCaseMutation = useApiMutation({
  //   endpoint: '/api/v1/cases/:id',
  //   method: 'PUT',
  //   onSuccess: () => {
  //     refetch();
  //   },
  // });

  const addCase = useLatestCallback(async (newCase: Partial<Case>) => {
    try {
      // Use regular API service instead of broken Enzyme mutation
      const { ApiService } = await import('../services/apiService');
      const createdCase = await ApiService.cases.create(newCase);
      await refetch(); // Refresh the list
      return createdCase;
    } catch (err) {
      console.error('Failed to create case:', err);
      throw err;
    }
  });

  const deleteCase = useLatestCallback(async (caseId: string) => {
    try {
      // Use regular API service instead of broken Enzyme mutation
      const { ApiService } = await import('../services/apiService');
      await ApiService.cases.delete(caseId);
      await refetch(); // Refresh the list
    } catch (err) {
      console.error('Failed to delete case:', err);
      throw err;
    }
  });

  const updateCase = useLatestCallback(async (caseId: string, updates: Partial<Case>) => {
    try {
      // Use regular API service instead of broken Enzyme mutation
      const { ApiService } = await import('../services/apiService');
      const updatedCase = await ApiService.cases.update(caseId, updates);
      await refetch(); // Refresh the list
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
