/**
 * Billing Store
 * Zustand store for billing feature state management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BillingFilters, BillingViewMode } from '../api/billing.types';

interface BillingState {
  // View state
  viewMode: BillingViewMode;
  setViewMode: (mode: BillingViewMode) => void;

  // Filters
  filters: BillingFilters;
  setFilters: (filters: BillingFilters) => void;
  updateFilter: <K extends keyof BillingFilters>(key: K, value: BillingFilters[K]) => void;
  clearFilters: () => void;
  hasActiveFilters: () => boolean;

  // Selection
  selectedEntries: string[];
  toggleEntrySelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;

  // Time entry modal
  isTimeEntryModalOpen: boolean;
  editingEntryId: string | null;
  openTimeEntryModal: (entryId?: string) => void;
  closeTimeEntryModal: () => void;

  // Invoice modal
  isInvoiceModalOpen: boolean;
  editingInvoiceId: string | null;
  openInvoiceModal: (invoiceId?: string) => void;
  closeInvoiceModal: () => void;
}

const defaultFilters: BillingFilters = {
  status: 'All',
};

export const useBillingStore = create<BillingState>()(
  persist(
    (set, get) => ({
      // View state
      viewMode: 'list',
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
        return Object.entries(filters).some(
          ([key, value]) => value !== undefined && value !== defaultFilters[key as keyof BillingFilters]
        );
      },

      // Selection
      selectedEntries: [],
      toggleEntrySelection: (id) =>
        set((state) => ({
          selectedEntries: state.selectedEntries.includes(id)
            ? state.selectedEntries.filter((entryId) => entryId !== id)
            : [...state.selectedEntries, id],
        })),
      selectAll: (ids) => set({ selectedEntries: ids }),
      clearSelection: () => set({ selectedEntries: [] }),

      // Time entry modal
      isTimeEntryModalOpen: false,
      editingEntryId: null,
      openTimeEntryModal: (entryId) =>
        set({ isTimeEntryModalOpen: true, editingEntryId: entryId ?? null }),
      closeTimeEntryModal: () =>
        set({ isTimeEntryModalOpen: false, editingEntryId: null }),

      // Invoice modal
      isInvoiceModalOpen: false,
      editingInvoiceId: null,
      openInvoiceModal: (invoiceId) =>
        set({ isInvoiceModalOpen: true, editingInvoiceId: invoiceId ?? null }),
      closeInvoiceModal: () =>
        set({ isInvoiceModalOpen: false, editingInvoiceId: null }),
    }),
    {
      name: 'lexiflow-billing-store',
      partialize: (state) => ({
        viewMode: state.viewMode,
        filters: state.filters,
      }),
    }
  )
);
