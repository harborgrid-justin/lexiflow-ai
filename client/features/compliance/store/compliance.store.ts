/**
 * Compliance Store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ComplianceViewMode } from '../api/compliance.types';

interface ComplianceState {
  // View state
  viewMode: ComplianceViewMode;
  setViewMode: (mode: ComplianceViewMode) => void;

  // Conflict check modal
  isConflictModalOpen: boolean;
  openConflictModal: () => void;
  closeConflictModal: () => void;

  // Ethical wall modal
  isWallModalOpen: boolean;
  editingWallId: string | null;
  openWallModal: (wallId?: string) => void;
  closeWallModal: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useComplianceStore = create<ComplianceState>()(
  persist(
    (set) => ({
      // View state
      viewMode: 'dashboard',
      setViewMode: (mode) => set({ viewMode: mode }),

      // Conflict check modal
      isConflictModalOpen: false,
      openConflictModal: () => set({ isConflictModalOpen: true }),
      closeConflictModal: () => set({ isConflictModalOpen: false }),

      // Ethical wall modal
      isWallModalOpen: false,
      editingWallId: null,
      openWallModal: (wallId) =>
        set({ isWallModalOpen: true, editingWallId: wallId ?? null }),
      closeWallModal: () =>
        set({ isWallModalOpen: false, editingWallId: null }),

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: 'lexiflow-compliance-store',
      partialize: (state) => ({
        viewMode: state.viewMode,
      }),
    }
  )
);
