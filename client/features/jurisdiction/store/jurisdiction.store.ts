/**
 * Jurisdiction Feature - Zustand Store
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { JurisdictionView, JurisdictionFilters } from '../api/jurisdiction.types';

interface JurisdictionState {
  view: JurisdictionView;
  filters: JurisdictionFilters;
  selectedCourtId: string | null;
  
  setView: (view: JurisdictionView) => void;
  setFilters: (filters: Partial<JurisdictionFilters>) => void;
  selectCourt: (id: string | null) => void;
  clearFilters: () => void;
  reset: () => void;
}

const DEFAULT_FILTERS: JurisdictionFilters = {
  search: '',
  type: '',
  circuit: undefined,
  state: undefined
};

const initialState = {
  view: 'federal' as JurisdictionView,
  filters: DEFAULT_FILTERS,
  selectedCourtId: null as string | null
};

export const useJurisdictionStore = create<JurisdictionState>()(
  devtools(
    (set) => ({
      ...initialState,

      setView: (view) => set({ view }, false, 'setView'),

      setFilters: (newFilters) =>
        set(
          (state) => ({
            filters: { ...state.filters, ...newFilters }
          }),
          false,
          'setFilters'
        ),

      selectCourt: (selectedCourtId) => set({ selectedCourtId }, false, 'selectCourt'),

      clearFilters: () => set({ filters: DEFAULT_FILTERS }, false, 'clearFilters'),

      reset: () => set(initialState, false, 'reset')
    }),
    { name: 'jurisdiction-store' }
  )
);

export default useJurisdictionStore;
