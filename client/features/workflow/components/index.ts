/**
 * Workflow Components Exports
 * 
 * Re-exports workflow components from the shared components folder.
 * These are specialized workflow UI components used across the workflow feature.
 */

// Core Workflow Components
export { CaseWorkflowList } from '@/components/workflow/CaseWorkflowList';
export { FirmProcessList } from '@/components/workflow/FirmProcessList';
export { WorkflowConfig } from '@/components/workflow/WorkflowConfig';
export { WorkflowTemplateBuilder } from '@/components/workflow/WorkflowTemplateBuilder';
export { NotificationCenter } from '@/components/workflow/NotificationCenter';
export { SLAMonitor } from '@/components/workflow/SLAMonitor';

// Analytics Components
export { WorkflowMetricGrid } from '@/components/workflow/analytics/WorkflowMetricGrid';
export { EnterpriseCapabilitiesSection } from '@/components/workflow/analytics/EnterpriseCapabilitiesSection';
export { StageProgressSection } from '@/components/workflow/analytics/StageProgressSection';
export { BottleneckInsights } from '@/components/workflow/analytics/BottleneckInsights';
export { TaskDistributionSection } from '@/components/workflow/analytics/TaskDistributionSection';
export { SLABreachAlert } from '@/components/workflow/analytics/SLABreachAlert';

// Advanced Components
export { ApprovalWorkflow } from '@/components/workflow/ApprovalWorkflow';
export { AuditTrailViewer } from '@/components/workflow/AuditTrailViewer';
export { EnhancedWorkflowPanel } from '@/components/workflow/EnhancedWorkflowPanel';
export { ParallelTasksManager } from '@/components/workflow/ParallelTasksManager';
export { StageEditor } from '@/components/workflow/StageEditor';
export { TaskDependencyManager } from '@/components/workflow/TaskDependencyManager';
export { TaskReassignmentPanel } from '@/components/workflow/TaskReassignmentPanel';
export { TaskWorkflowBadges } from '@/components/workflow/TaskWorkflowBadges';
export { TemplateActions } from '@/components/workflow/TemplateActions';
export { TemplatePreview } from '@/components/workflow/TemplatePreview';
export { TimeTrackingPanel } from '@/components/workflow/TimeTrackingPanel';
export { WorkflowAnalyticsDashboard } from '@/components/workflow/WorkflowAnalyticsDashboard';
export { WorkflowQuickActions } from '@/components/workflow/WorkflowQuickActions';
