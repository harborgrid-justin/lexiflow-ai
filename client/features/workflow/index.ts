/**
 * Workflow Feature Module
 */

// API Hooks
export {
  workflowKeys,
  useWorkflowStages,
  useWorkflowTasks,
  useWorkflowTask,
  useWorkflowTemplates,
  useCreateTask,
  useUpdateTask,
  useUpdateTaskStatus,
  useDeleteTask,
  useApplyTemplate,
} from './api/workflow.api';

// Feature Hooks (Enzyme-based)
export * from './hooks';

// Types
export type {
  WorkflowTemplate,
  WorkflowStageTemplate,
  TaskTemplate,
  WorkflowInstance,
  WorkflowStageInstance,
  TaskInstance,
  TaskComment,
  WorkflowFilters,
  TaskFilters,
  WorkflowViewMode,
} from './api/workflow.types';

// Store
export { useWorkflowStore } from './store/workflow.store';

// Pages
export { WorkflowPage } from './pages/WorkflowPage';
