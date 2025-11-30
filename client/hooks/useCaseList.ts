
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Case } from '../types';
import { ApiService, ApiError } from '../services/apiService';

export const useCaseList = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [refreshing, setRefreshing] = useState(false);

  const loadCases = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const data = await ApiService.cases.getAll();
      setCases(data);
    } catch (err) {
      console.error('Failed to load cases:', err);

      if (err instanceof ApiError) {
        setError(`Failed to load cases: ${err.statusText}`);
      } else {
        setError('Failed to load cases. Please check your connection.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCases();
  }, [loadCases]);

  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesType = typeFilter === 'All' || c.matterType === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [cases, statusFilter, typeFilter]);

  const resetFilters = () => {
    setStatusFilter('All');
    setTypeFilter('All');
  };

  const addCase = async (newCase: Partial<Case>) => {
    try {
      setError(null);
      const createdCase = await ApiService.cases.create(newCase);
      setCases([createdCase, ...cases]);
      setIsModalOpen(false);
      return createdCase;
    } catch (err) {
      console.error('Failed to create case:', err);

      if (err instanceof ApiError) {
        setError(`Failed to create case: ${err.statusText}`);
      } else {
        setError('Failed to create case. Please try again.');
      }
      throw err;
    }
  };

  const deleteCase = async (caseId: string) => {
    try {
      setError(null);
      await ApiService.cases.delete(caseId);
      setCases(cases.filter(c => c.id !== caseId));
    } catch (err) {
      console.error('Failed to delete case:', err);

      if (err instanceof ApiError) {
        setError(`Failed to delete case: ${err.statusText}`);
      } else {
        setError('Failed to delete case. Please try again.');
      }
      throw err;
    }
  };

  const updateCase = async (caseId: string, updates: Partial<Case>) => {
    try {
      setError(null);
      const updatedCase = await ApiService.cases.update(caseId, updates);
      setCases(cases.map(c => c.id === caseId ? updatedCase : c));
      return updatedCase;
    } catch (err) {
      console.error('Failed to update case:', err);

      if (err instanceof ApiError) {
        setError(`Failed to update case: ${err.statusText}`);
      } else {
        setError('Failed to update case. Please try again.');
      }
      throw err;
    }
  };

  const refresh = useCallback(() => {
    return loadCases(true);
  }, [loadCases]);

  return {
    cases,
    loading,
    error,
    refreshing,
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
