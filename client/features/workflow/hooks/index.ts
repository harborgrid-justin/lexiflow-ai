/**
 * Workflow Hooks Index
 * 
 * Re-exports workflow hooks from the feature module.
 * Complex hooks re-exported from archive location until full migration.
 * 
 * @module features/workflow/hooks
 */

// Re-export from hooks location
export { useWorkflowEngine } from '../../../hooks/useWorkflowEngine';
export { useWorkflowAnalytics } from '../../../hooks/useWorkflowAnalytics';
