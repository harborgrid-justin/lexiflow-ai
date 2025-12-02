/**
 * Clients Store
 * Zustand store for client-related state management
 */

import { create } from 'zustand';
import type { ClientViewMode, ClientFilters } from '../api/clients.types';

interface ClientsState {
  // View mode
  viewMode: ClientViewMode;
  setViewMode: (mode: ClientViewMode) => void;

  // Filters
  filters: ClientFilters;
  setFilters: (filters: ClientFilters) => void;
  updateFilter: <K extends keyof ClientFilters>(
    key: K,
    value: ClientFilters[K]
  ) => void;
  clearFilters: () => void;
  hasActiveFilters: () => boolean;

  // Selection
  selectedClients: string[];
  toggleClientSelection: (id: string) => void;
  selectAllClients: (ids: string[]) => void;
  clearSelection: () => void;
}

const defaultFilters: ClientFilters = {
  status: 'All',
  industry: undefined,
  search: undefined,
};

export const useClientsStore = create<ClientsState>((set, get) => ({
  // View mode
  viewMode: 'grid',
  setViewMode: (mode) => set({ viewMode: mode }),

  // Filters
  filters: defaultFilters,
  setFilters: (filters) => set({ filters }),
  updateFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  clearFilters: () => set({ filters: defaultFilters }),
  hasActiveFilters: () => {
    const { filters } = get();
    return (
      filters.status !== 'All' ||
      !!filters.industry ||
      !!filters.search ||
      !!filters.minBilled ||
      !!filters.maxBilled
    );
  },

  // Selection
  selectedClients: [],
  toggleClientSelection: (id) =>
    set((state) => ({
      selectedClients: state.selectedClients.includes(id)
        ? state.selectedClients.filter((cid) => cid !== id)
        : [...state.selectedClients, id],
    })),
  selectAllClients: (ids) => set({ selectedClients: ids }),
  clearSelection: () => set({ selectedClients: [] }),
}));
