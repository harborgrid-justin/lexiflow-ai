/**
 * useJurisdiction Hook
 *
 * Manages jurisdiction data fetching and state.
 */

import { useState } from 'react';
import { useApiRequest, useLatestCallback } from '@/enzyme';
import { JurisdictionApi } from '../api/jurisdiction.api';
import type { JurisdictionView, JurisdictionFilters } from '../api/jurisdiction.types';

const DEFAULT_FILTERS: JurisdictionFilters = {
  search: '',
  type: '',
  circuit: undefined,
  state: undefined
};

export const useJurisdiction = (initialView: JurisdictionView = 'federal') => {
  const [view, setView] = useState<JurisdictionView>(initialView);
  const [filters, setFilters] = useState<JurisdictionFilters>(DEFAULT_FILTERS);

  // Federal courts query
  const { data: federalCourts, isLoading: federalLoading, error: federalError } = useApiRequest({
    endpoint: '/jurisdiction/federal',
    options: {
      enabled: view === 'federal',
      staleTime: 10 * 60 * 1000,
    }
  });

  // State courts query
  const { data: stateCourts, isLoading: stateLoading, error: stateError } = useApiRequest({
    endpoint: '/jurisdiction/state',
    options: {
      enabled: view === 'state',
      params: { state: filters.state },
      staleTime: 10 * 60 * 1000,
    }
  });

  // Regulatory bodies query
  const { data: regulatoryBodies, isLoading: regulatoryLoading, error: regulatoryError } = useApiRequest({
    endpoint: '/jurisdiction/regulatory',
    options: {
      enabled: view === 'regulatory',
      staleTime: 10 * 60 * 1000,
    }
  });

  // Arbitration organizations query
  const { data: arbitrationOrgs, isLoading: arbitrationLoading, error: arbitrationError } = useApiRequest({
    queryFn: JurisdictionApi.getArbitrationOrgs,
    staleTime: 10 * 60 * 1000,
    enabled: view === 'arbitration'
  });

  const handleViewChange = useLatestCallback((newView: JurisdictionView) => {
    setView(newView);
  });

  const handleFiltersChange = useLatestCallback((newFilters: Partial<JurisdictionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  });

  const clearFilters = useLatestCallback(() => {
    setFilters(DEFAULT_FILTERS);
  });

  return {
    view,
    setView: handleViewChange,
    filters,
    setFilters: handleFiltersChange,
    clearFilters,
    federalCourts: federalQuery.data || [],
    stateCourts: stateQuery.data || [],
    regulatoryBodies: regulatoryQuery.data || [],
    arbitrationOrgs: arbitrationQuery.data || [],
    isLoading: 
      federalQuery.isLoading || 
      stateQuery.isLoading || 
      regulatoryQuery.isLoading || 
      arbitrationQuery.isLoading,
    error: 
      federalQuery.error || 
      stateQuery.error || 
      regulatoryQuery.error || 
      arbitrationQuery.error
  };
};

export default useJurisdiction;
