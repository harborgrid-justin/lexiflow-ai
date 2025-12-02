/**
 * Evidence Feature - Zustand Store
 *
 * Global state for evidence vault feature.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { ViewMode, DetailTab, EvidenceFilters } from '../api/evidence.types';

interface EvidenceState {
  // View state
  view: ViewMode;
  activeTab: DetailTab;
  selectedItemId: string | null;
  
  // Filters
  filters: EvidenceFilters;
  
  // Actions
  setView: (view: ViewMode) => void;
  setActiveTab: (tab: DetailTab) => void;
  setSelectedItem: (id: string | null) => void;
  setFilters: (filters: Partial<EvidenceFilters>) => void;
  clearFilters: () => void;
  reset: () => void;
}

const DEFAULT_FILTERS: EvidenceFilters = {
  search: '',
  type: '',
  admissibility: '',
  caseId: '',
  custodian: '',
  dateFrom: '',
  dateTo: '',
  location: '',
  tags: '',
  collectedBy: '',
  hasBlockchain: false
};

const initialState = {
  view: 'inventory' as ViewMode,
  activeTab: 'overview' as DetailTab,
  selectedItemId: null as string | null,
  filters: DEFAULT_FILTERS
};

export const useEvidenceStore = create<EvidenceState>()(
  devtools(
    (set) => ({
      ...initialState,

      setView: (view) => set({ view }, false, 'setView'),

      setActiveTab: (activeTab) => set({ activeTab }, false, 'setActiveTab'),

      setSelectedItem: (selectedItemId) => set({ selectedItemId }, false, 'setSelectedItem'),

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
    { name: 'evidence-store' }
  )
);

export default useEvidenceStore;
