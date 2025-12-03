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
import { useApiRequest, useApiMutation } from '@/enzyme';
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
  } = useApiRequest<Clause[]>({
    endpoint: '/clauses',
    options: {
      staleTime
    }
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
  const { mutateAsync: createClause, isLoading: isCreating } = useApiMutation<Clause, CreateClauseRequest>({
    mutationFn: KnowledgeApi.createClause,
    onSuccess: () => refetch()
  });

  // Update mutation
  const { mutateAsync: updateClause, isLoading: isUpdating } = useApiMutation<Clause, UpdateClauseRequest>({
    mutationFn: KnowledgeApi.updateClause,
    onSuccess: () => refetch()
  });

  // Delete mutation
  const { mutateAsync: deleteClause, isLoading: isDeleting } = useApiMutation<void, string>({
    mutationFn: KnowledgeApi.deleteClause,
    onSuccess: () => refetch()
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
    createClause,
    updateClause,
    deleteClause,
    isCreating,
    isUpdating,
    isDeleting,
    refetch
  };
};

export default useClauseLibrary;
