
import { useState, useMemo, useEffect } from 'react';
import { Case } from '../types';
import { ApiService } from '../services/apiService';

export const useCaseList = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  useEffect(() => {
    const loadCases = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getCases();
        setCases(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load cases');
      } finally {
        setLoading(false);
      }
    };
    loadCases();
  }, []);

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
      const createdCase = await ApiService.createCase(newCase);
      setCases([createdCase, ...cases]);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to create case", err);
      setError('Failed to create case');
    }
  };

  return {
    cases,
    loading,
    error,
    isModalOpen,
    setIsModalOpen,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    filteredCases,
    resetFilters,
    addCase
  };
};
