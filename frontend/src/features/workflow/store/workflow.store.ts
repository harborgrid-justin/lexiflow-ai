/**
 * Workflow Store - Zustand State Management
 * Centralized state for task and workflow UI
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  TaskFilters,
  TaskSortOptions,
  TaskViewMode,
  WorkflowStage,
  Task,
} from '../types';

/**
 * Task Management State
 */
interface TaskState {
  // View Mode
  viewMode: TaskViewMode;
  setViewMode: (mode: TaskViewMode) => void;

  // Filters
  filters: TaskFilters;
  setFilters: (filters: Partial<TaskFilters>) => void;
  resetFilters: () => void;

  // Sort
  sort: TaskSortOptions;
  setSort: (sort: TaskSortOptions) => void;

  // Selected Tasks (for bulk actions)
  selectedTaskIds: string[];
  toggleTaskSelection: (taskId: string) => void;
  selectAllTasks: (taskIds: string[]) => void;
  clearSelection: () => void;

  // Detail Panel
  detailTaskId: string | null;
  openTaskDetail: (taskId: string) => void;
  closeTaskDetail: () => void;

  // Quick Add
  showQuickAdd: boolean;
  quickAddCaseId?: string;
  openQuickAdd: (caseId?: string) => void;
  closeQuickAdd: () => void;
}

/**
 * Workflow Builder State
 */
interface WorkflowBuilderState {
  // Canvas State
  stages: WorkflowStage[];
  selectedStageId: string | null;
  isDragging: boolean;
  zoom: number;
  canvasOffset: { x: number; y: number };

  // Actions
  addStage: (stage: Omit<WorkflowStage, 'id'>) => void;
  updateStage: (id: string, updates: Partial<WorkflowStage>) => void;
  removeStage: (id: string) => void;
  selectStage: (id: string | null) => void;
  connectStages: (fromId: string, toId: string) => void;
  disconnectStages: (fromId: string, toId: string) => void;
  setStagePosition: (id: string, position: { x: number; y: number }) => void;
  setIsDragging: (isDragging: boolean) => void;
  setZoom: (zoom: number) => void;
  setCanvasOffset: (offset: { x: number; y: number }) => void;

  // Template Management
  loadTemplate: (stages: WorkflowStage[]) => void;
  clearCanvas: () => void;
  templateMetadata: {
    name: string;
    description: string;
    category: string;
  };
  setTemplateMetadata: (metadata: Partial<WorkflowBuilderState['templateMetadata']>) => void;
}

/**
 * Board State (for Kanban view)
 */
interface BoardState {
  // Column order and visibility
  columnOrder: string[];
  hiddenColumns: string[];
  setColumnOrder: (order: string[]) => void;
  toggleColumnVisibility: (columnId: string) => void;

  // Drag & Drop
  draggingTaskId: string | null;
  setDraggingTask: (taskId: string | null) => void;
}

// Default values
const defaultFilters: TaskFilters = {
  status: undefined,
  priority: undefined,
  assigneeId: undefined,
  caseId: undefined,
  tags: undefined,
  dueDateFrom: undefined,
  dueDateTo: undefined,
  search: undefined,
};

const defaultSort: TaskSortOptions = {
  field: 'dueDate',
  direction: 'asc',
};

const defaultColumnOrder = ['Not Started', 'In Progress', 'Blocked', 'Completed'];

/**
 * Task Management Store
 */
export const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      // View Mode
      viewMode: 'list',
      setViewMode: (mode) => set({ viewMode: mode }),

      // Filters
      filters: defaultFilters,
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      resetFilters: () => set({ filters: defaultFilters }),

      // Sort
      sort: defaultSort,
      setSort: (sort) => set({ sort }),

      // Selection
      selectedTaskIds: [],
      toggleTaskSelection: (taskId) =>
        set((state) => ({
          selectedTaskIds: state.selectedTaskIds.includes(taskId)
            ? state.selectedTaskIds.filter((id) => id !== taskId)
            : [...state.selectedTaskIds, taskId],
        })),
      selectAllTasks: (taskIds) => set({ selectedTaskIds: taskIds }),
      clearSelection: () => set({ selectedTaskIds: [] }),

      // Detail Panel
      detailTaskId: null,
      openTaskDetail: (taskId) => set({ detailTaskId: taskId }),
      closeTaskDetail: () => set({ detailTaskId: null }),

      // Quick Add
      showQuickAdd: false,
      quickAddCaseId: undefined,
      openQuickAdd: (caseId) => set({ showQuickAdd: true, quickAddCaseId: caseId }),
      closeQuickAdd: () => set({ showQuickAdd: false, quickAddCaseId: undefined }),
    }),
    {
      name: 'lexiflow-task-store',
      partialize: (state) => ({
        viewMode: state.viewMode,
        filters: state.filters,
        sort: state.sort,
      }),
    }
  )
);

/**
 * Workflow Builder Store
 */
export const useWorkflowBuilderStore = create<WorkflowBuilderState>((set) => ({
  // Canvas State
  stages: [],
  selectedStageId: null,
  isDragging: false,
  zoom: 1,
  canvasOffset: { x: 0, y: 0 },

  // Stage Actions
  addStage: (stageData) =>
    set((state) => {
      const newStage: WorkflowStage = {
        ...stageData,
        id: `stage-${Date.now()}`,
        order: state.stages.length,
      } as WorkflowStage;
      return { stages: [...state.stages, newStage] };
    }),

  updateStage: (id, updates) =>
    set((state) => ({
      stages: state.stages.map((stage) =>
        stage.id === id ? { ...stage, ...updates } : stage
      ),
    })),

  removeStage: (id) =>
    set((state) => ({
      stages: state.stages.filter((stage) => stage.id !== id),
      selectedStageId: state.selectedStageId === id ? null : state.selectedStageId,
    })),

  selectStage: (id) => set({ selectedStageId: id }),

  connectStages: (fromId, toId) =>
    set((state) => ({
      stages: state.stages.map((stage) =>
        stage.id === fromId
          ? {
              ...stage,
              nextStages: [...(stage.nextStages || []), toId],
            }
          : stage.id === toId
          ? {
              ...stage,
              previousStages: [...(stage.previousStages || []), fromId],
            }
          : stage
      ),
    })),

  disconnectStages: (fromId, toId) =>
    set((state) => ({
      stages: state.stages.map((stage) =>
        stage.id === fromId
          ? {
              ...stage,
              nextStages: (stage.nextStages || []).filter((id) => id !== toId),
            }
          : stage.id === toId
          ? {
              ...stage,
              previousStages: (stage.previousStages || []).filter((id) => id !== fromId),
            }
          : stage
      ),
    })),

  setStagePosition: (id, position) =>
    set((state) => ({
      stages: state.stages.map((stage) =>
        stage.id === id ? { ...stage, position } : stage
      ),
    })),

  setIsDragging: (isDragging) => set({ isDragging }),
  setZoom: (zoom) => set({ zoom: Math.max(0.5, Math.min(2, zoom)) }),
  setCanvasOffset: (offset) => set({ canvasOffset: offset }),

  // Template Management
  loadTemplate: (stages) => set({ stages, selectedStageId: null }),
  clearCanvas: () =>
    set({
      stages: [],
      selectedStageId: null,
      zoom: 1,
      canvasOffset: { x: 0, y: 0 },
    }),

  templateMetadata: {
    name: '',
    description: '',
    category: '',
  },
  setTemplateMetadata: (metadata) =>
    set((state) => ({
      templateMetadata: { ...state.templateMetadata, ...metadata },
    })),
}));

/**
 * Board State Store (for Kanban view)
 */
export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      columnOrder: defaultColumnOrder,
      hiddenColumns: [],
      setColumnOrder: (order) => set({ columnOrder: order }),
      toggleColumnVisibility: (columnId) =>
        set((state) => ({
          hiddenColumns: state.hiddenColumns.includes(columnId)
            ? state.hiddenColumns.filter((id) => id !== columnId)
            : [...state.hiddenColumns, columnId],
        })),

      draggingTaskId: null,
      setDraggingTask: (taskId) => set({ draggingTaskId: taskId }),
    }),
    {
      name: 'lexiflow-board-store',
      partialize: (state) => ({
        columnOrder: state.columnOrder,
        hiddenColumns: state.hiddenColumns,
      }),
    }
  )
);

/**
 * Computed selectors
 */
export const selectActiveFilters = (state: TaskState) => {
  const filters = state.filters;
  return Object.entries(filters).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value) && value.length > 0) {
        acc[key] = value;
      } else if (!Array.isArray(value)) {
        acc[key] = value;
      }
    }
    return acc;
  }, {} as Record<string, any>);
};

export const selectHasActiveFilters = (state: TaskState) => {
  return Object.keys(selectActiveFilters(state)).length > 0;
};
