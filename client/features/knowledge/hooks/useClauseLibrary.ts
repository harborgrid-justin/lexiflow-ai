/**
 * useClauseLibrary Hook
 *
 * Manages clause library data, search, and CRUD operations.
 *
 * Features:
 * - TanStack Query for data fetching with caching
 * - Mutations for create/update/delete operations
 * - Optimistic updates for better UX
 */

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { KnowledgeApi } from '../api';
import type { Clause, CreateClauseRequest, UpdateClauseRequest, ClauseFilters } from '../api/knowledge.types';

interface UseClauseLibraryOptions {
  staleTime?: number;
}

interface UseClauseLibraryReturn {
  clauses: Clause[];
  filtered: Clause[];
  loading: boolean;
  error: Error | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: ClauseFilters;
  setFilters: (filters: Partial<ClauseFilters>) => void;
  createClause: (data: CreateClauseRequest) => Promise<Clause>;
  updateClause: (data: UpdateClauseRequest) => Promise<Clause>;
  deleteClause: (id: string) => Promise<void>;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  refetch: () => void;
}

export const useClauseLibrary = (options?: UseClauseLibraryOptions): UseClauseLibraryReturn => {
  const { staleTime = 10 * 60 * 1000 } = options ?? {};
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFiltersState] = useState<ClauseFilters>({ searchTerm: '' });

  const setFilters = (newFilters: Partial<ClauseFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  // Fetch clauses
  const { 
    data: clauses = [], 
    isLoading: loading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['clauses'],
    queryFn: KnowledgeApi.getClauses,
    staleTime
  });

  // Filter clauses based on search term and filters
  const filtered = useMemo(() => {
    return clauses.filter(clause => {
      const matchesSearch = 
        (clause.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (clause.category || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !filters.category || clause.category === filters.category;
      const matchesRisk = !filters.riskRating || clause.riskRating === filters.riskRating;

      return matchesSearch && matchesCategory && matchesRisk;
    });
  }, [clauses, searchTerm, filters.category, filters.riskRating]);

  // Create mutation
  const createMutation = useMutation({
    mutationFn: KnowledgeApi.createClause,
    onSuccess: (newClause) => {
      queryClient.setQueryData<Clause[]>(['clauses'], (old = []) => [...old, newClause]);
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: KnowledgeApi.updateClause,
    onSuccess: (updatedClause) => {
      queryClient.setQueryData<Clause[]>(['clauses'], (old = []) =>
        old.map(c => c.id === updatedClause.id ? updatedClause : c)
      );
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: KnowledgeApi.deleteClause,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Clause[]>(['clauses'], (old = []) =>
        old.filter(c => c.id !== deletedId)
      );
    }
  });

  return {
    clauses,
    filtered,
    loading,
    error: error as Error | null,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    createClause: createMutation.mutateAsync,
    updateClause: updateMutation.mutateAsync,
    deleteClause: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    refetch
  };
};

export default useClauseLibrary;
