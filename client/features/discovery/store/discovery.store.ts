/**
 * Discovery Feature - Zustand Store
 *
 * Global state for discovery platform.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DiscoveryView, DiscoveryFilters } from '../api/discovery.types';

interface DiscoveryState {
  // View state
  view: DiscoveryView;
  contextId: string | null;
  
  // Filters
  filters: DiscoveryFilters;
  
  // Actions
  setView: (view: DiscoveryView) => void;
  setContextId: (id: string | null) => void;
  navigate: (view: DiscoveryView, id?: string) => void;
  setFilters: (filters: Partial<DiscoveryFilters>) => void;
  clearFilters: () => void;
  reset: () => void;
}

const DEFAULT_FILTERS: DiscoveryFilters = {
  search: '',
  status: '',
  type: '',
  caseId: '',
  dateFrom: '',
  dateTo: ''
};

const initialState = {
  view: 'dashboard' as DiscoveryView,
  contextId: null as string | null,
  filters: DEFAULT_FILTERS
};

export const useDiscoveryStore = create<DiscoveryState>()(
  devtools(
    (set) => ({
      ...initialState,

      setView: (view) => set({ view }, false, 'setView'),

      setContextId: (contextId) => set({ contextId }, false, 'setContextId'),

      navigate: (view, id) =>
        set({ view, contextId: id ?? null }, false, 'navigate'),

      setFilters: (newFilters) =>
        set(
          (state) => ({
            filters: { ...state.filters, ...newFilters }
          }),
          false,
          'setFilters'
        ),

      clearFilters: () => set({ filters: DEFAULT_FILTERS }, false, 'clearFilters'),

      reset: () => set(initialState, false, 'reset')
    }),
    { name: 'discovery-store' }
  )
);

export default useDiscoveryStore;
