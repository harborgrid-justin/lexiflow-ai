/**
 * useWorkflowEngine Hook - Enterprise Workflow Engine
 *
 * Provides access to all 10 enterprise workflow capabilities:
 * 1. Task Dependencies
 * 2. SLA Management
 * 3. Approval Workflows
 * 4. Conditional Branching
 * 5. Time Tracking Integration
 * 6. Notification System
 * 7. Audit Trail
 * 8. Parallel Tasks
 * 9. Task Reassignment
 * 10. Workflow Analytics
 *
 * @see /client/enzyme/ENZYME_COMPLETE_GUIDE.md
 */

import { enzymeClient } from '../services/client';
import { useIsMounted, useLatestCallback } from '@missionfabric-js/enzyme/hooks';
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
} from '../../types/workflow-engine';

const ENGINE_BASE = '/workflow/engine';

export const useWorkflowEngine = () => {
  const isMounted = useIsMounted();

  // ==================== 1. TASK DEPENDENCIES ====================

  const setTaskDependencies = useLatestCallback(async (
    taskId: string,
    dependsOn: string[],
    type: 'blocking' | 'informational' = 'blocking'
  ): Promise<TaskDependency | null> => {
    try {
      const response = await enzymeClient.post<TaskDependency>(
        `${ENGINE_BASE}/dependencies/${taskId}`,
        { body: { dependsOn, type } }
      );
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to set task dependencies:', err);
      return null;
    }
  });

  const getTaskDependencies = useLatestCallback(async (taskId: string): Promise<TaskDependency | null> => {
    try {
      const response = await enzymeClient.get<TaskDependency>(`${ENGINE_BASE}/dependencies/${taskId}`);
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to get task dependencies:', err);
      return null;
    }
  });

  const canStartTask = useLatestCallback(async (taskId: string): Promise<DependencyCheckResult | null> => {
    try {
      const response = await enzymeClient.get<DependencyCheckResult>(`${ENGINE_BASE}/dependencies/${taskId}/can-start`);
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to check if task can start:', err);
      return null;
    }
  });

  // ==================== 2. SLA MANAGEMENT ====================

  const setSLARule = useLatestCallback(async (rule: SLARule): Promise<SLARule | null> => {
    try {
      const response = await enzymeClient.post<SLARule>(`${ENGINE_BASE}/sla/rules`, { body: rule });
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to set SLA rule:', err);
      return null;
    }
  });

  const getTaskSLAStatus = useLatestCallback(async (taskId: string): Promise<TaskSLAStatus | null> => {
    try {
      const response = await enzymeClient.get<TaskSLAStatus>(`${ENGINE_BASE}/sla/status/${taskId}`);
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to get task SLA status:', err);
      return null;
    }
  });

  const checkSLABreaches = useLatestCallback(async (caseId?: string): Promise<SLABreachReport | null> => {
    try {
      const endpoint = caseId ? `${ENGINE_BASE}/sla/breaches?caseId=${caseId}` : `${ENGINE_BASE}/sla/breaches`;
      const response = await enzymeClient.get<SLABreachReport>(endpoint);
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to check SLA breaches:', err);
      return null;
    }
  });

  // ==================== 3. APPROVAL WORKFLOWS ====================

  const createApprovalChain = useLatestCallback(async (
    taskId: string,
    approverIds: string[]
  ): Promise<ApprovalChain | null> => {
    try {
      const response = await enzymeClient.post<ApprovalChain>(
        `${ENGINE_BASE}/approvals/${taskId}`,
        { body: { approverIds } }
      );
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to create approval chain:', err);
      return null;
    }
  });

  const processApproval = useLatestCallback(async (
    taskId: string,
    approverId: string,
    action: 'approve' | 'reject',
    comments?: string
  ): Promise<ApprovalChain | null> => {
    try {
      const response = await enzymeClient.post<ApprovalChain>(
        `${ENGINE_BASE}/approvals/${taskId}/process`,
        { body: { approverId, action, comments } }
      );
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to process approval:', err);
      return null;
    }
  });

  const getApprovalChain = useLatestCallback(async (taskId: string): Promise<ApprovalChain | null> => {
    try {
      const response = await enzymeClient.get<ApprovalChain>(`${ENGINE_BASE}/approvals/${taskId}`);
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to get approval chain:', err);
      return null;
    }
  });

  // ==================== 4. CONDITIONAL BRANCHING ====================

  const addConditionalRule = useLatestCallback(async (rule: ConditionalRule): Promise<ConditionalRule | null> => {
    try {
      const response = await enzymeClient.post<ConditionalRule>(`${ENGINE_BASE}/conditions`, { body: rule });
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to add conditional rule:', err);
      return null;
    }
  });

  const evaluateConditions = useLatestCallback(async (
    stageId: string,
    context: Record<string, any>
  ): Promise<ConditionEvaluationResult | null> => {
    try {
      const response = await enzymeClient.post<ConditionEvaluationResult>(
        `${ENGINE_BASE}/conditions/${stageId}/evaluate`,
        { body: context }
      );
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to evaluate conditions:', err);
      return null;
    }
  });

  // ==================== 5. TIME TRACKING ====================

  const startTimeTracking = useLatestCallback(async (
    taskId: string,
    userId: string
  ): Promise<TaskTimeEntry | null> => {
    try {
      const response = await enzymeClient.post<TaskTimeEntry>(
        `${ENGINE_BASE}/time/${taskId}/start`,
        { body: { userId } }
      );
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to start time tracking:', err);
      return null;
    }
  });

  const stopTimeTracking = useLatestCallback(async (
    taskId: string,
    userId: string,
    description?: string
  ): Promise<TaskTimeEntry | null> => {
    try {
      const response = await enzymeClient.post<TaskTimeEntry>(
        `${ENGINE_BASE}/time/${taskId}/stop`,
        { body: { userId, description } }
      );
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to stop time tracking:', err);
      return null;
    }
  });

  const getTimeEntries = useLatestCallback(async (taskId: string): Promise<TaskTimeEntry[] | null> => {
    try {
      const response = await enzymeClient.get<TaskTimeEntry[]>(`${ENGINE_BASE}/time/${taskId}`);
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to get time entries:', err);
      return null;
    }
  });

  // ==================== 6. NOTIFICATIONS ====================

  const getNotifications = useLatestCallback(async (
    userId: string,
    unreadOnly = false
  ): Promise<NotificationEvent[] | null> => {
    try {
      const endpoint = `${ENGINE_BASE}/notifications/${userId}${unreadOnly ? '?unreadOnly=true' : ''}`;
      const response = await enzymeClient.get<NotificationEvent[]>(endpoint);
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to get notifications:', err);
      return null;
    }
  });

  const markNotificationRead = useLatestCallback(async (notificationId: string): Promise<boolean> => {
    try {
      const response = await enzymeClient.patch<{ success: boolean }>(
        `${ENGINE_BASE}/notifications/${notificationId}/read`
      );
      return isMounted() ? (response.data?.success || false) : false;
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      return false;
    }
  });

  // ==================== 7. AUDIT TRAIL ====================

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
      const response = await enzymeClient.get<AuditLogEntry[]>(`${ENGINE_BASE}/audit${query}`);
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to get audit log:', err);
      return null;
    }
  });

  const getCaseAuditLog = useLatestCallback(async (caseId: string): Promise<AuditLogEntry[] | null> => {
    try {
      const response = await enzymeClient.get<AuditLogEntry[]>(`${ENGINE_BASE}/audit/case/${caseId}`);
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to get case audit log:', err);
      return null;
    }
  });

  // ==================== 8. PARALLEL TASKS ====================

  const createParallelGroup = useLatestCallback(async (
    stageId: string,
    taskIds: string[],
    completionRule: 'all' | 'any' | 'percentage' = 'all',
    completionThreshold?: number
  ): Promise<ParallelTaskGroup | null> => {
    try {
      const response = await enzymeClient.post<ParallelTaskGroup>(
        `${ENGINE_BASE}/parallel`,
        { body: { stageId, taskIds, completionRule, completionThreshold } }
      );
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to create parallel group:', err);
      return null;
    }
  });

  const checkParallelGroupCompletion = useLatestCallback(async (
    groupId: string
  ): Promise<ParallelGroupStatus | null> => {
    try {
      const response = await enzymeClient.get<ParallelGroupStatus>(`${ENGINE_BASE}/parallel/${groupId}/status`);
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to check parallel group completion:', err);
      return null;
    }
  });

  const getParallelGroups = useLatestCallback(async (stageId: string): Promise<ParallelTaskGroup[] | null> => {
    try {
      const response = await enzymeClient.get<ParallelTaskGroup[]>(`${ENGINE_BASE}/parallel/stage/${stageId}`);
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to get parallel groups:', err);
      return null;
    }
  });

  // ==================== 9. TASK REASSIGNMENT ====================

  const reassignTask = useLatestCallback(async (
    taskId: string,
    newAssigneeId: string,
    reassignedBy: string
  ): Promise<any | null> => {
    try {
      const response = await enzymeClient.post<any>(
        `${ENGINE_BASE}/reassign/${taskId}`,
        { body: { newAssigneeId, reassignedBy } }
      );
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to reassign task:', err);
      return null;
    }
  });

  const bulkReassignTasks = useLatestCallback(async (
    taskIds: string[],
    newAssigneeId: string,
    reassignedBy: string
  ): Promise<ReassignmentResult | null> => {
    try {
      const response = await enzymeClient.post<ReassignmentResult>(
        `${ENGINE_BASE}/reassign/bulk`,
        { body: { taskIds, newAssigneeId, reassignedBy } }
      );
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to bulk reassign tasks:', err);
      return null;
    }
  });

  const reassignAllFromUser = useLatestCallback(async (
    fromUserId: string,
    toUserId: string,
    caseId?: string,
    reassignedBy?: string
  ): Promise<{ reassignedCount: number } | null> => {
    try {
      const response = await enzymeClient.post<{ reassignedCount: number }>(
        `${ENGINE_BASE}/reassign/user`,
        { body: { fromUserId, toUserId, caseId, reassignedBy } }
      );
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to reassign all from user:', err);
      return null;
    }
  });

  // ==================== 10. WORKFLOW ANALYTICS ====================

  const getWorkflowMetrics = useLatestCallback(async (caseId?: string): Promise<WorkflowMetrics | null> => {
    try {
      const endpoint = caseId
        ? `${ENGINE_BASE}/analytics/metrics?caseId=${caseId}`
        : `${ENGINE_BASE}/analytics/metrics`;
      const response = await enzymeClient.get<WorkflowMetrics>(endpoint);
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to get workflow metrics:', err);
      return null;
    }
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
      const response = await enzymeClient.get<TaskVelocity>(`${ENGINE_BASE}/analytics/velocity${query}`);
      return isMounted() ? response.data : null;
    } catch (err) {
      console.error('Failed to get task velocity:', err);
      return null;
    }
  });

  const getBottlenecks = useLatestCallback(async (caseId?: string): Promise<BottleneckAnalysis | null> => {
    try {
      const endpoint = caseId
        ? `${ENGINE_BASE}/analytics/bottlenecks?caseId=${caseId}`
        : `${ENGINE_BASE}/analytics/bottlenecks`;
      const response = await enzymeClient.get<BottleneckAnalysis>(endpoint);
      return isMounted() ? response.data : null;
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
