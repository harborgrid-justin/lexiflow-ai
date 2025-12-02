/**
 * Admin Store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminFilters, AdminViewMode } from '../api/admin.types';

interface AdminState {
  // View state
  viewMode: AdminViewMode;
  setViewMode: (mode: AdminViewMode) => void;

  // Filters
  filters: AdminFilters;
  setFilters: (filters: AdminFilters) => void;
  updateFilter: <K extends keyof AdminFilters>(key: K, value: AdminFilters[K]) => void;
  clearFilters: () => void;

  // Selection
  selectedItems: string[];
  toggleSelection: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;

  // Modal state
  isUserModalOpen: boolean;
  editingUserId: string | null;
  openUserModal: (userId?: string) => void;
  closeUserModal: () => void;

  isOrgModalOpen: boolean;
  editingOrgId: string | null;
  openOrgModal: (orgId?: string) => void;
  closeOrgModal: () => void;
}

const defaultFilters: AdminFilters = {
  status: 'all',
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      // View state
      viewMode: 'users',
      setViewMode: (mode) => set({ viewMode: mode }),

      // Filters
      filters: defaultFilters,
      setFilters: (filters) => set({ filters }),
      updateFilter: (key, value) =>
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        })),
      clearFilters: () => set({ filters: defaultFilters }),

      // Selection
      selectedItems: [],
      toggleSelection: (id) =>
        set((state) => ({
          selectedItems: state.selectedItems.includes(id)
            ? state.selectedItems.filter((itemId) => itemId !== id)
            : [...state.selectedItems, id],
        })),
      selectAll: (ids) => set({ selectedItems: ids }),
      clearSelection: () => set({ selectedItems: [] }),

      // User modal
      isUserModalOpen: false,
      editingUserId: null,
      openUserModal: (userId) =>
        set({ isUserModalOpen: true, editingUserId: userId ?? null }),
      closeUserModal: () =>
        set({ isUserModalOpen: false, editingUserId: null }),

      // Organization modal
      isOrgModalOpen: false,
      editingOrgId: null,
      openOrgModal: (orgId) =>
        set({ isOrgModalOpen: true, editingOrgId: orgId ?? null }),
      closeOrgModal: () =>
        set({ isOrgModalOpen: false, editingOrgId: null }),
    }),
    {
      name: 'lexiflow-admin-store',
      partialize: (state) => ({
        viewMode: state.viewMode,
      }),
    }
  )
);
