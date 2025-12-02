/**
 * Workflow Store
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WorkflowViewMode, TaskFilters } from '../api/workflow.types';

interface WorkflowState {
  // View state
  viewMode: WorkflowViewMode;
  setViewMode: (mode: WorkflowViewMode) => void;

  // Filters
  filters: TaskFilters;
  setFilters: (filters: TaskFilters) => void;
  updateFilter: <K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) => void;
  clearFilters: () => void;
  hasActiveFilters: () => boolean;

  // Selection
  selectedTaskId: string | null;
  selectTask: (id: string | null) => void;

  // Drag and drop
  draggedTaskId: string | null;
  setDraggedTask: (id: string | null) => void;

  // Task modal
  isTaskModalOpen: boolean;
  editingTaskId: string | null;
  openTaskModal: (taskId?: string) => void;
  closeTaskModal: () => void;

  // Template modal
  isTemplateModalOpen: boolean;
  openTemplateModal: () => void;
  closeTemplateModal: () => void;
}

const defaultFilters: TaskFilters = {
  status: 'all',
  priority: 'all',
};

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      // View state
      viewMode: 'kanban',
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
          ([key, value]) => value !== undefined && value !== defaultFilters[key as keyof TaskFilters]
        );
      },

      // Selection
      selectedTaskId: null,
      selectTask: (id) => set({ selectedTaskId: id }),

      // Drag and drop
      draggedTaskId: null,
      setDraggedTask: (id) => set({ draggedTaskId: id }),

      // Task modal
      isTaskModalOpen: false,
      editingTaskId: null,
      openTaskModal: (taskId) =>
        set({ isTaskModalOpen: true, editingTaskId: taskId ?? null }),
      closeTaskModal: () =>
        set({ isTaskModalOpen: false, editingTaskId: null }),

      // Template modal
      isTemplateModalOpen: false,
      openTemplateModal: () => set({ isTemplateModalOpen: true }),
      closeTemplateModal: () => set({ isTemplateModalOpen: false }),
    }),
    {
      name: 'lexiflow-workflow-store',
      partialize: (state) => ({
        viewMode: state.viewMode,
        filters: state.filters,
      }),
    }
  )
);
