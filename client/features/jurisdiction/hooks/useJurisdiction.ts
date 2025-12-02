/**
 * useJurisdiction Hook
 *
 * Manages jurisdiction data fetching and state.
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLatestCallback } from '@/enzyme';
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
  const federalQuery = useQuery({
    queryKey: ['jurisdiction', 'federal'],
    queryFn: JurisdictionApi.getFederalCourts,
    staleTime: 10 * 60 * 1000,
    enabled: view === 'federal'
  });

  // State courts query
  const stateQuery = useQuery({
    queryKey: ['jurisdiction', 'state', filters.state],
    queryFn: () => JurisdictionApi.getStateCourts(filters.state),
    staleTime: 10 * 60 * 1000,
    enabled: view === 'state'
  });

  // Regulatory bodies query
  const regulatoryQuery = useQuery({
    queryKey: ['jurisdiction', 'regulatory'],
    queryFn: JurisdictionApi.getRegulatoryBodies,
    staleTime: 10 * 60 * 1000,
    enabled: view === 'regulatory'
  });

  // Arbitration organizations query
  const arbitrationQuery = useQuery({
    queryKey: ['jurisdiction', 'arbitration'],
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
