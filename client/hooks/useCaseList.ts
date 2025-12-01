
import { useState, useMemo } from 'react';
import { Case } from '../types';
import { ApiService, ApiError } from '../services/apiService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLatestCallback, useIsMounted } from '@missionfabric-js/enzyme/hooks';

export const useCaseList = () => {
  // TanStack Query - automatic caching, refetching, and loading states
  const { 
    data: cases = [], 
    isLoading: loading, 
    error: queryError,
    refetch 
  } = useQuery({
    queryKey: ['/api/v1/cases'],
    queryFn: () => ApiService.cases.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });

  const queryClient = useQueryClient();
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

  // TanStack Query mutations for create/delete/update
  const createCaseMutation = useMutation({
    mutationFn: (newCase: Partial<Case>) => ApiService.cases.create(newCase),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/cases'] });
      if (isMounted()) {
        setIsModalOpen(false);
      }
    },
  });

  // Delete mutation
  const deleteCaseMutation = useMutation({
    mutationFn: (id: string) => ApiService.cases.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/cases'] });
    },
  });

  // Update mutation
  const updateCaseMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Case> }) => ApiService.cases.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/cases'] });
    },
  });

  const addCase = useLatestCallback(async (newCase: Partial<Case>) => {
    try {
      const createdCase = await createCaseMutation.mutateAsync(newCase);
      return createdCase;
    } catch (err) {
      console.error('Failed to create case:', err);
      throw err;
    }
  });

  const deleteCase = useLatestCallback(async (caseId: string) => {
    try {
      await deleteCaseMutation.mutateAsync(caseId);
    } catch (err) {
      console.error('Failed to delete case:', err);
      throw err;
    }
  });

  const updateCase = useLatestCallback(async (caseId: string, updates: Partial<Case>) => {
    try {
      const updatedCase = await updateCaseMutation.mutateAsync({ id: caseId, updates });
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
    refreshing: false, // Enzyme handles this internally
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
    refresh
  };
};
