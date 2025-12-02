/**
 * Knowledge Feature - Zustand Store
 *
 * Global state for knowledge base and clause library.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { KnowledgeTab, ClauseFilters } from '../api/knowledge.types';

interface KnowledgeState {
  // Knowledge Base
  activeTab: KnowledgeTab;
  searchTerm: string;
  
  // Clause Library
  clauseFilters: ClauseFilters;
  selectedClauseId: string | null;
  
  // UI State
  isHistoryModalOpen: boolean;
  
  // Actions
  setActiveTab: (tab: KnowledgeTab) => void;
  setSearchTerm: (term: string) => void;
  setClauseFilters: (filters: Partial<ClauseFilters>) => void;
  selectClause: (id: string | null) => void;
  openHistoryModal: (clauseId: string) => void;
  closeHistoryModal: () => void;
  reset: () => void;
}

const initialState = {
  activeTab: 'wiki' as KnowledgeTab,
  searchTerm: '',
  clauseFilters: { searchTerm: '' },
  selectedClauseId: null,
  isHistoryModalOpen: false,
};

export const useKnowledgeStore = create<KnowledgeState>()(
  devtools(
    (set) => ({
      ...initialState,

      setActiveTab: (tab) => set({ activeTab: tab }, false, 'setActiveTab'),

      setSearchTerm: (term) => set({ searchTerm: term }, false, 'setSearchTerm'),

      setClauseFilters: (filters) =>
        set(
          (state) => ({
            clauseFilters: { ...state.clauseFilters, ...filters }
          }),
          false,
          'setClauseFilters'
        ),

      selectClause: (id) => set({ selectedClauseId: id }, false, 'selectClause'),

      openHistoryModal: (clauseId) =>
        set(
          { selectedClauseId: clauseId, isHistoryModalOpen: true },
          false,
          'openHistoryModal'
        ),

      closeHistoryModal: () =>
        set(
          { isHistoryModalOpen: false },
          false,
          'closeHistoryModal'
        ),

      reset: () => set(initialState, false, 'reset'),
    }),
    { name: 'knowledge-store' }
  )
);

export default useKnowledgeStore;
