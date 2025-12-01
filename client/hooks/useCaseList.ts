
import { useState, useMemo } from 'react';
import { Case } from '../types';
import { useApiRequest, useApiMutation } from '../enzyme';
import { useLatestCallback, useIsMounted } from '@missionfabric-js/enzyme/hooks';

export const useCaseList = () => {
  // ✅ ENZYME: useApiRequest - automatic caching, refetching, and loading states
  const { 
    data: cases = [], 
    isLoading: loading, 
    error: queryError,
    refetch 
  } = useApiRequest<Case[]>({
    endpoint: '/api/v1/cases',
    options: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
    }
  });

  const isMounted = useIsMounted();
  
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

  // ✅ ENZYME: useApiMutation - automatic invalidation and refetching
  const createCaseMutation = useApiMutation({
    endpoint: '/api/v1/cases',
    method: 'POST',
    onSuccess: () => {
      refetch();
      if (isMounted()) {
        setIsModalOpen(false);
      }
    },
  });

  const deleteCaseMutation = useApiMutation({
    endpoint: '/api/v1/cases/:id',
    method: 'DELETE',
    onSuccess: () => {
      refetch();
    },
  });

  const updateCaseMutation = useApiMutation({
    endpoint: '/api/v1/cases/:id',
    method: 'PUT',
    onSuccess: () => {
      refetch();
    },
  });

  const addCase = useLatestCallback(async (newCase: Partial<Case>) => {
    try {
      const createdCase = await createCaseMutation.mutate(newCase);
      return createdCase;
    } catch (err) {
      console.error('Failed to create case:', err);
      throw err;
    }
  });

  const deleteCase = useLatestCallback(async (caseId: string) => {
    try {
      await deleteCaseMutation.mutate({ id: caseId });
    } catch (err) {
      console.error('Failed to delete case:', err);
      throw err;
    }
  });

  const updateCase = useLatestCallback(async (caseId: string, updates: Partial<Case>) => {
    try {
      const updatedCase = await updateCaseMutation.mutate({ id: caseId, ...updates });
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
