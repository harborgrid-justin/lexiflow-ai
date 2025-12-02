/**
 * Workflow Hooks Index
 * 
 * Re-exports workflow hooks from the feature module.
 * Complex hooks re-exported from archive location until full migration.
 * 
 * @module features/workflow/hooks
 */

// Re-export from archive location (complex hooks, need careful migration)
export { useWorkflowEngine } from '@//.archive/hooks/useWorkflowEngine';
export { useWorkflowAnalytics } from '@//.archive/hooks/useWorkflowAnalytics';
