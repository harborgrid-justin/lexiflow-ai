
import { useState, useMemo } from 'react';
import { MOCK_CASES } from '../data/mockCases';

export const useCaseList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');

  const filteredCases = useMemo(() => {
    return MOCK_CASES.filter(c => {
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesType = typeFilter === 'All' || c.matterType === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [statusFilter, typeFilter]);

  const resetFilters = () => {
    setStatusFilter('All');
    setTypeFilter('All');
  };

  return {
    isModalOpen,
    setIsModalOpen,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    filteredCases,
    resetFilters
  };
};
