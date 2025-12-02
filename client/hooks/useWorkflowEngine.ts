/**
 * useWorkflowEngine Hook - ENZYME MIGRATION
 *
 * This hook has been migrated to use Enzyme's Virtual DOM and advanced API layer.
 *
 * Migration Changes:
 * - Replaced manual fetch() calls with useApiMutation from Enzyme
 * - Added useIsMounted for safe state updates
 * - Wrapped callbacks with useLatestCallback for stable references
 * - Removed manual loading/error state management (handled by mutations)
 *
 * Enzyme Features:
 * - useApiMutation: Declarative mutations for all 30+ API methods
 * - useIsMounted: Safe async operations
 * - useLatestCallback: Stable callback references
 *
 * Original Pattern:
 * const apiCall = async () => fetch(...).then(r => r.json())
 *
 * New Pattern:
 * const { mutateAsync } = useApiMutation({ method: 'POST', endpoint: '/api/v1/...' })
 *
 * @see /client/enzyme/index.ts for available hooks
 */

import { useApiMutation, useIsMounted, useLatestCallback } from '../enzyme';
import type {
  TaskDependency,
  DependencyCheckResult,
  SLARule,
  TaskSLAStatus,
  SLABreachReport,
  ApprovalChain,
  ConditionalRule,
  ConditionEvaluationResult,
  TaskTimeEntry,
  NotificationEvent,
  AuditLogEntry,
  ParallelTaskGroup,
  ParallelGroupStatus,
  ReassignmentResult,
  WorkflowMetrics,
  TaskVelocity,
  BottleneckAnalysis,
} from '../types/workflow-engine';

const ENGINE_BASE = '/workflow/engine';

// Enterprise Workflow Engine Hook
// Provides access to all 10 enterprise capabilities with full backward compatibility

export const useWorkflowEngine = () => {
  const isMounted = useIsMounted();

  // ==================== 1. TASK DEPENDENCIES ====================

  // Set task dependencies (POST)
  const { mutateAsync: setTaskDependenciesMutation } = useApiMutation<TaskDependency>({
    method: 'POST',
    endpoint: `/api/v1${ENGINE_BASE}/dependencies/:taskId`,
  });

  const setTaskDependencies = useLatestCallback(async (
    taskId: string,
    dependsOn: string[],
    type: 'blocking' | 'informational' = 'blocking'
  ): Promise<TaskDependency | null> => {
    try {
      const result = await setTaskDependenciesMutation({
        endpoint: `/api/v1${ENGINE_BASE}/dependencies/${taskId}`,
        body: { dependsOn, type }
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to set task dependencies:', err);
      return null;
    }
  });

  // Get task dependencies (GET)
  const { mutateAsync: getTaskDependenciesMutation } = useApiMutation<TaskDependency>({
    method: 'GET',
    endpoint: `/api/v1${ENGINE_BASE}/dependencies/:taskId`,
  });

  const getTaskDependencies = useLatestCallback(async (taskId: string): Promise<TaskDependency | null> => {
    try {
      const result = await getTaskDependenciesMutation({
        endpoint: `/api/v1${ENGINE_BASE}/dependencies/${taskId}`,
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to get task dependencies:', err);
      return null;
    }
  });

  // Check if task can start (GET)
  const { mutateAsync: canStartTaskMutation } = useApiMutation<DependencyCheckResult>({
    method: 'GET',
    endpoint: `/api/v1${ENGINE_BASE}/dependencies/:taskId/can-start`,
  });

  const canStartTask = useLatestCallback(async (taskId: string): Promise<DependencyCheckResult | null> => {
    try {
      const result = await canStartTaskMutation({
        endpoint: `/api/v1${ENGINE_BASE}/dependencies/${taskId}/can-start`,
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to check if task can start:', err);
      return null;
    }
  });

  // ==================== 2. SLA MANAGEMENT ====================

  // Set SLA rule (POST)
  const { mutateAsync: setSLARuleMutation } = useApiMutation<SLARule>({
    method: 'POST',
    endpoint: `/api/v1${ENGINE_BASE}/sla/rules`,
  });

  const setSLARule = useLatestCallback(async (rule: SLARule): Promise<SLARule | null> => {
    try {
      const result = await setSLARuleMutation({ body: rule });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to set SLA rule:', err);
      return null;
    }
  });

  // Get task SLA status (GET)
  const { mutateAsync: getTaskSLAStatusMutation } = useApiMutation<TaskSLAStatus>({
    method: 'GET',
    endpoint: `/api/v1${ENGINE_BASE}/sla/status/:taskId`,
  });

  const getTaskSLAStatus = useLatestCallback(async (taskId: string): Promise<TaskSLAStatus | null> => {
    try {
      const result = await getTaskSLAStatusMutation({
        endpoint: `/api/v1${ENGINE_BASE}/sla/status/${taskId}`,
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to get task SLA status:', err);
      return null;
    }
  });

  // Check SLA breaches (GET)
  const { mutateAsync: checkSLABreachesMutation } = useApiMutation<SLABreachReport>({
    method: 'GET',
    endpoint: `/api/v1${ENGINE_BASE}/sla/breaches`,
  });

  const checkSLABreaches = useLatestCallback(async (caseId?: string): Promise<SLABreachReport | null> => {
    try {
      const endpoint = caseId
        ? `/api/v1${ENGINE_BASE}/sla/breaches?caseId=${caseId}`
        : `/api/v1${ENGINE_BASE}/sla/breaches`;
      const result = await checkSLABreachesMutation({ endpoint });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to check SLA breaches:', err);
      return null;
    }
  });

  // ==================== 3. APPROVAL WORKFLOWS ====================

  // Create approval chain (POST)
  const { mutateAsync: createApprovalChainMutation } = useApiMutation<ApprovalChain>({
    method: 'POST',
    endpoint: `/api/v1${ENGINE_BASE}/approvals/:taskId`,
  });

  const createApprovalChain = useLatestCallback(async (
    taskId: string,
    approverIds: string[]
  ): Promise<ApprovalChain | null> => {
    try {
      const result = await createApprovalChainMutation({
        endpoint: `/api/v1${ENGINE_BASE}/approvals/${taskId}`,
        body: { approverIds }
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to create approval chain:', err);
      return null;
    }
  });

  // Process approval (POST)
  const { mutateAsync: processApprovalMutation } = useApiMutation<ApprovalChain>({
    method: 'POST',
    endpoint: `/api/v1${ENGINE_BASE}/approvals/:taskId/process`,
  });

  const processApproval = useLatestCallback(async (
    taskId: string,
    approverId: string,
    action: 'approve' | 'reject',
    comments?: string
  ): Promise<ApprovalChain | null> => {
    try {
      const result = await processApprovalMutation({
        endpoint: `/api/v1${ENGINE_BASE}/approvals/${taskId}/process`,
        body: { approverId, action, comments }
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to process approval:', err);
      return null;
    }
  });

  // Get approval chain (GET)
  const { mutateAsync: getApprovalChainMutation } = useApiMutation<ApprovalChain>({
    method: 'GET',
    endpoint: `/api/v1${ENGINE_BASE}/approvals/:taskId`,
  });

  const getApprovalChain = useLatestCallback(async (taskId: string): Promise<ApprovalChain | null> => {
    try {
      const result = await getApprovalChainMutation({
        endpoint: `/api/v1${ENGINE_BASE}/approvals/${taskId}`,
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to get approval chain:', err);
      return null;
    }
  });

  // ==================== 4. CONDITIONAL BRANCHING ====================

  // Add conditional rule (POST)
  const { mutateAsync: addConditionalRuleMutation } = useApiMutation<ConditionalRule>({
    method: 'POST',
    endpoint: `/api/v1${ENGINE_BASE}/conditions`,
  });

  const addConditionalRule = useLatestCallback(async (rule: ConditionalRule): Promise<ConditionalRule | null> => {
    try {
      const result = await addConditionalRuleMutation({ body: rule });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to add conditional rule:', err);
      return null;
    }
  });

  // Evaluate conditions (POST)
  const { mutateAsync: evaluateConditionsMutation } = useApiMutation<ConditionEvaluationResult>({
    method: 'POST',
    endpoint: `/api/v1${ENGINE_BASE}/conditions/:stageId/evaluate`,
  });

  const evaluateConditions = useLatestCallback(async (
    stageId: string,
    context: Record<string, any>
  ): Promise<ConditionEvaluationResult | null> => {
    try {
      const result = await evaluateConditionsMutation({
        endpoint: `/api/v1${ENGINE_BASE}/conditions/${stageId}/evaluate`,
        body: context
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to evaluate conditions:', err);
      return null;
    }
  });

  // ==================== 5. TIME TRACKING ====================

  // Start time tracking (POST)
  const { mutateAsync: startTimeTrackingMutation } = useApiMutation<TaskTimeEntry>({
    method: 'POST',
    endpoint: `/api/v1${ENGINE_BASE}/time/:taskId/start`,
  });

  const startTimeTracking = useLatestCallback(async (
    taskId: string,
    userId: string
  ): Promise<TaskTimeEntry | null> => {
    try {
      const result = await startTimeTrackingMutation({
        endpoint: `/api/v1${ENGINE_BASE}/time/${taskId}/start`,
        body: { userId }
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to start time tracking:', err);
      return null;
    }
  });

  // Stop time tracking (POST)
  const { mutateAsync: stopTimeTrackingMutation } = useApiMutation<TaskTimeEntry>({
    method: 'POST',
    endpoint: `/api/v1${ENGINE_BASE}/time/:taskId/stop`,
  });

  const stopTimeTracking = useLatestCallback(async (
    taskId: string,
    userId: string,
    description?: string
  ): Promise<TaskTimeEntry | null> => {
    try {
      const result = await stopTimeTrackingMutation({
        endpoint: `/api/v1${ENGINE_BASE}/time/${taskId}/stop`,
        body: { userId, description }
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to stop time tracking:', err);
      return null;
    }
  });

  // Get time entries (GET)
  const { mutateAsync: getTimeEntriesMutation } = useApiMutation<TaskTimeEntry[]>({
    method: 'GET',
    endpoint: `/api/v1${ENGINE_BASE}/time/:taskId`,
  });

  const getTimeEntries = useLatestCallback(async (taskId: string): Promise<TaskTimeEntry[] | null> => {
    try {
      const result = await getTimeEntriesMutation({
        endpoint: `/api/v1${ENGINE_BASE}/time/${taskId}`,
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to get time entries:', err);
      return null;
    }
  });

  // ==================== 6. NOTIFICATIONS ====================

  // Get notifications (GET)
  const { mutateAsync: getNotificationsMutation } = useApiMutation<NotificationEvent[]>({
    method: 'GET',
    endpoint: `/api/v1${ENGINE_BASE}/notifications/:userId`,
  });

  const getNotifications = useLatestCallback(async (
    userId: string,
    unreadOnly = false
  ): Promise<NotificationEvent[] | null> => {
    try {
      const endpoint = `/api/v1${ENGINE_BASE}/notifications/${userId}${unreadOnly ? '?unreadOnly=true' : ''}`;
      const result = await getNotificationsMutation({ endpoint });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to get notifications:', err);
      return null;
    }
  });

  // Mark notification as read (PATCH)
  const { mutateAsync: markNotificationReadMutation } = useApiMutation<{ success: boolean }>({
    method: 'PATCH',
    endpoint: `/api/v1${ENGINE_BASE}/notifications/:notificationId/read`,
  });

  const markNotificationRead = useLatestCallback(async (notificationId: string): Promise<boolean> => {
    try {
      const result = await markNotificationReadMutation({
        endpoint: `/api/v1${ENGINE_BASE}/notifications/${notificationId}/read`,
      });
      return isMounted() ? (result?.success || false) : false;
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      return false;
    }
  });

  // ==================== 7. AUDIT TRAIL ====================

  // Get audit log (GET)
  const { mutateAsync: getAuditLogMutation } = useApiMutation<AuditLogEntry[]>({
    method: 'GET',
    endpoint: `/api/v1${ENGINE_BASE}/audit`,
  });

  const getAuditLog = useLatestCallback(async (
    entityType?: string,
    entityId?: string,
    limit?: number
  ): Promise<AuditLogEntry[] | null> => {
    try {
      const params = new URLSearchParams();
      if (entityType) params.append('entityType', entityType);
      if (entityId) params.append('entityId', entityId);
      if (limit) params.append('limit', limit.toString());
      const query = params.toString() ? `?${params.toString()}` : '';
      const result = await getAuditLogMutation({
        endpoint: `/api/v1${ENGINE_BASE}/audit${query}`,
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to get audit log:', err);
      return null;
    }
  });

  // Get case audit log (GET)
  const { mutateAsync: getCaseAuditLogMutation } = useApiMutation<AuditLogEntry[]>({
    method: 'GET',
    endpoint: `/api/v1${ENGINE_BASE}/audit/case/:caseId`,
  });

  const getCaseAuditLog = useLatestCallback(async (caseId: string): Promise<AuditLogEntry[] | null> => {
    try {
      const result = await getCaseAuditLogMutation({
        endpoint: `/api/v1${ENGINE_BASE}/audit/case/${caseId}`,
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to get case audit log:', err);
      return null;
    }
  });

  // ==================== 8. PARALLEL TASKS ====================

  // Create parallel group (POST)
  const { mutateAsync: createParallelGroupMutation } = useApiMutation<ParallelTaskGroup>({
    method: 'POST',
    endpoint: `/api/v1${ENGINE_BASE}/parallel`,
  });

  const createParallelGroup = useLatestCallback(async (
    stageId: string,
    taskIds: string[],
    completionRule: 'all' | 'any' | 'percentage' = 'all',
    completionThreshold?: number
  ): Promise<ParallelTaskGroup | null> => {
    try {
      const result = await createParallelGroupMutation({
        body: { stageId, taskIds, completionRule, completionThreshold }
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to create parallel group:', err);
      return null;
    }
  });

  // Check parallel group completion (GET)
  const { mutateAsync: checkParallelGroupCompletionMutation } = useApiMutation<ParallelGroupStatus>({
    method: 'GET',
    endpoint: `/api/v1${ENGINE_BASE}/parallel/:groupId/status`,
  });

  const checkParallelGroupCompletion = useLatestCallback(async (
    groupId: string
  ): Promise<ParallelGroupStatus | null> => {
    try {
      const result = await checkParallelGroupCompletionMutation({
        endpoint: `/api/v1${ENGINE_BASE}/parallel/${groupId}/status`,
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to check parallel group completion:', err);
      return null;
    }
  });

  // Get parallel groups (GET)
  const { mutateAsync: getParallelGroupsMutation } = useApiMutation<ParallelTaskGroup[]>({
    method: 'GET',
    endpoint: `/api/v1${ENGINE_BASE}/parallel/stage/:stageId`,
  });

  const getParallelGroups = useLatestCallback(async (stageId: string): Promise<ParallelTaskGroup[] | null> => {
    try {
      const result = await getParallelGroupsMutation({
        endpoint: `/api/v1${ENGINE_BASE}/parallel/stage/${stageId}`,
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to get parallel groups:', err);
      return null;
    }
  });

  // ==================== 9. TASK REASSIGNMENT ====================

  // Reassign task (POST)
  const { mutateAsync: reassignTaskMutation } = useApiMutation<any>({
    method: 'POST',
    endpoint: `/api/v1${ENGINE_BASE}/reassign/:taskId`,
  });

  const reassignTask = useLatestCallback(async (
    taskId: string,
    newAssigneeId: string,
    reassignedBy: string
  ): Promise<any | null> => {
    try {
      const result = await reassignTaskMutation({
        endpoint: `/api/v1${ENGINE_BASE}/reassign/${taskId}`,
        body: { newAssigneeId, reassignedBy }
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to reassign task:', err);
      return null;
    }
  });

  // Bulk reassign tasks (POST)
  const { mutateAsync: bulkReassignTasksMutation } = useApiMutation<ReassignmentResult>({
    method: 'POST',
    endpoint: `/api/v1${ENGINE_BASE}/reassign/bulk`,
  });

  const bulkReassignTasks = useLatestCallback(async (
    taskIds: string[],
    newAssigneeId: string,
    reassignedBy: string
  ): Promise<ReassignmentResult | null> => {
    try {
      const result = await bulkReassignTasksMutation({
        body: { taskIds, newAssigneeId, reassignedBy }
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to bulk reassign tasks:', err);
      return null;
    }
  });

  // Reassign all tasks from user (POST)
  const { mutateAsync: reassignAllFromUserMutation } = useApiMutation<{ reassignedCount: number }>({
    method: 'POST',
    endpoint: `/api/v1${ENGINE_BASE}/reassign/user`,
  });

  const reassignAllFromUser = useLatestCallback(async (
    fromUserId: string,
    toUserId: string,
    caseId?: string,
    reassignedBy?: string
  ): Promise<{ reassignedCount: number } | null> => {
    try {
      const result = await reassignAllFromUserMutation({
        body: { fromUserId, toUserId, caseId, reassignedBy }
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to reassign all from user:', err);
      return null;
    }
  });

  // ==================== 10. WORKFLOW ANALYTICS ====================

  // Get workflow metrics (GET)
  const { mutateAsync: getWorkflowMetricsMutation } = useApiMutation<WorkflowMetrics>({
    method: 'GET',
    endpoint: `/api/v1${ENGINE_BASE}/analytics/metrics`,
  });

  const getWorkflowMetrics = useLatestCallback(async (caseId?: string): Promise<WorkflowMetrics | null> => {
    try {
      const endpoint = caseId
        ? `/api/v1${ENGINE_BASE}/analytics/metrics?caseId=${caseId}`
        : `/api/v1${ENGINE_BASE}/analytics/metrics`;
      const result = await getWorkflowMetricsMutation({ endpoint });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to get workflow metrics:', err);
      return null;
    }
  });

  // Get task velocity (GET)
  const { mutateAsync: getTaskVelocityMutation } = useApiMutation<TaskVelocity>({
    method: 'GET',
    endpoint: `/api/v1${ENGINE_BASE}/analytics/velocity`,
  });

  const getTaskVelocity = useLatestCallback(async (
    caseId?: string,
    days?: number
  ): Promise<TaskVelocity | null> => {
    try {
      const params = new URLSearchParams();
      if (caseId) params.append('caseId', caseId);
      if (days) params.append('days', days.toString());
      const query = params.toString() ? `?${params.toString()}` : '';
      const result = await getTaskVelocityMutation({
        endpoint: `/api/v1${ENGINE_BASE}/analytics/velocity${query}`,
      });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to get task velocity:', err);
      return null;
    }
  });

  // Get bottlenecks (GET)
  const { mutateAsync: getBottlenecksMutation } = useApiMutation<BottleneckAnalysis>({
    method: 'GET',
    endpoint: `/api/v1${ENGINE_BASE}/analytics/bottlenecks`,
  });

  const getBottlenecks = useLatestCallback(async (caseId?: string): Promise<BottleneckAnalysis | null> => {
    try {
      const endpoint = caseId
        ? `/api/v1${ENGINE_BASE}/analytics/bottlenecks?caseId=${caseId}`
        : `/api/v1${ENGINE_BASE}/analytics/bottlenecks`;
      const result = await getBottlenecksMutation({ endpoint });
      return isMounted() ? result : null;
    } catch (err) {
      console.error('Failed to get bottlenecks:', err);
      return null;
    }
  });

  return {
    // 1. Task Dependencies
    setTaskDependencies,
    getTaskDependencies,
    canStartTask,

    // 2. SLA Management
    setSLARule,
    getTaskSLAStatus,
    checkSLABreaches,

    // 3. Approval Workflows
    createApprovalChain,
    processApproval,
    getApprovalChain,

    // 4. Conditional Branching
    addConditionalRule,
    evaluateConditions,

    // 5. Time Tracking
    startTimeTracking,
    stopTimeTracking,
    getTimeEntries,

    // 6. Notifications
    getNotifications,
    markNotificationRead,

    // 7. Audit Trail
    getAuditLog,
    getCaseAuditLog,

    // 8. Parallel Tasks
    createParallelGroup,
    checkParallelGroupCompletion,
    getParallelGroups,

    // 9. Task Reassignment
    reassignTask,
    bulkReassignTasks,
    reassignAllFromUser,

    // 10. Workflow Analytics
    getWorkflowMetrics,
    getTaskVelocity,
    getBottlenecks,
  };
};

export default useWorkflowEngine;
