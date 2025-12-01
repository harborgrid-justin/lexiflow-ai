import { useState, useCallback } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper for API calls
  const apiCall = useCallback(async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== 1. TASK DEPENDENCIES ====================

  const setTaskDependencies = useCallback(async (
    taskId: string,
    dependsOn: string[],
    type: 'blocking' | 'informational' = 'blocking'
  ): Promise<TaskDependency | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/dependencies/${taskId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dependsOn, type })
      }).then(r => r.json())
    );
  }, [apiCall]);

  const getTaskDependencies = useCallback(async (taskId: string): Promise<TaskDependency | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/dependencies/${taskId}`).then(r => r.json())
    );
  }, [apiCall]);

  const canStartTask = useCallback(async (taskId: string): Promise<DependencyCheckResult | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/dependencies/${taskId}/can-start`).then(r => r.json())
    );
  }, [apiCall]);

  // ==================== 2. SLA MANAGEMENT ====================

  const setSLARule = useCallback(async (rule: SLARule): Promise<SLARule | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/sla/rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule)
      }).then(r => r.json())
    );
  }, [apiCall]);

  const getTaskSLAStatus = useCallback(async (taskId: string): Promise<TaskSLAStatus | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/sla/status/${taskId}`).then(r => r.json())
    );
  }, [apiCall]);

  const checkSLABreaches = useCallback(async (caseId?: string): Promise<SLABreachReport | null> => {
    const url = caseId 
      ? `/api/v1${ENGINE_BASE}/sla/breaches?caseId=${caseId}`
      : `/api/v1${ENGINE_BASE}/sla/breaches`;
    return apiCall(() => fetch(url).then(r => r.json()));
  }, [apiCall]);

  // ==================== 3. APPROVAL WORKFLOWS ====================

  const createApprovalChain = useCallback(async (
    taskId: string,
    approverIds: string[]
  ): Promise<ApprovalChain | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/approvals/${taskId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approverIds })
      }).then(r => r.json())
    );
  }, [apiCall]);

  const processApproval = useCallback(async (
    taskId: string,
    approverId: string,
    action: 'approve' | 'reject',
    comments?: string
  ): Promise<ApprovalChain | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/approvals/${taskId}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approverId, action, comments })
      }).then(r => r.json())
    );
  }, [apiCall]);

  const getApprovalChain = useCallback(async (taskId: string): Promise<ApprovalChain | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/approvals/${taskId}`).then(r => r.json())
    );
  }, [apiCall]);

  // ==================== 4. CONDITIONAL BRANCHING ====================

  const addConditionalRule = useCallback(async (rule: ConditionalRule): Promise<ConditionalRule | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/conditions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule)
      }).then(r => r.json())
    );
  }, [apiCall]);

  const evaluateConditions = useCallback(async (
    stageId: string,
    context: Record<string, any>
  ): Promise<ConditionEvaluationResult | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/conditions/${stageId}/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context)
      }).then(r => r.json())
    );
  }, [apiCall]);

  // ==================== 5. TIME TRACKING ====================

  const startTimeTracking = useCallback(async (
    taskId: string,
    userId: string
  ): Promise<TaskTimeEntry | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/time/${taskId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      }).then(r => r.json())
    );
  }, [apiCall]);

  const stopTimeTracking = useCallback(async (
    taskId: string,
    userId: string,
    description?: string
  ): Promise<TaskTimeEntry | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/time/${taskId}/stop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, description })
      }).then(r => r.json())
    );
  }, [apiCall]);

  const getTimeEntries = useCallback(async (taskId: string): Promise<TaskTimeEntry[] | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/time/${taskId}`).then(r => r.json())
    );
  }, [apiCall]);

  // ==================== 6. NOTIFICATIONS ====================

  const getNotifications = useCallback(async (
    userId: string,
    unreadOnly = false
  ): Promise<NotificationEvent[] | null> => {
    const url = `/api/v1${ENGINE_BASE}/notifications/${userId}${unreadOnly ? '?unreadOnly=true' : ''}`;
    return apiCall(() => fetch(url).then(r => r.json()));
  }, [apiCall]);

  const markNotificationRead = useCallback(async (notificationId: string): Promise<boolean> => {
    const result = await apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/notifications/${notificationId}/read`, {
        method: 'PATCH'
      }).then(r => r.json())
    );
    return result?.success || false;
  }, [apiCall]);

  // ==================== 7. AUDIT TRAIL ====================

  const getAuditLog = useCallback(async (
    entityType?: string,
    entityId?: string,
    limit?: number
  ): Promise<AuditLogEntry[] | null> => {
    const params = new URLSearchParams();
    if (entityType) params.append('entityType', entityType);
    if (entityId) params.append('entityId', entityId);
    if (limit) params.append('limit', limit.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiCall(() => fetch(`/api/v1${ENGINE_BASE}/audit${query}`).then(r => r.json()));
  }, [apiCall]);

  const getCaseAuditLog = useCallback(async (caseId: string): Promise<AuditLogEntry[] | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/audit/case/${caseId}`).then(r => r.json())
    );
  }, [apiCall]);

  // ==================== 8. PARALLEL TASKS ====================

  const createParallelGroup = useCallback(async (
    stageId: string,
    taskIds: string[],
    completionRule: 'all' | 'any' | 'percentage' = 'all',
    completionThreshold?: number
  ): Promise<ParallelTaskGroup | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/parallel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stageId, taskIds, completionRule, completionThreshold })
      }).then(r => r.json())
    );
  }, [apiCall]);

  const checkParallelGroupCompletion = useCallback(async (
    groupId: string
  ): Promise<ParallelGroupStatus | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/parallel/${groupId}/status`).then(r => r.json())
    );
  }, [apiCall]);

  const getParallelGroups = useCallback(async (stageId: string): Promise<ParallelTaskGroup[] | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/parallel/stage/${stageId}`).then(r => r.json())
    );
  }, [apiCall]);

  // ==================== 9. TASK REASSIGNMENT ====================

  const reassignTask = useCallback(async (
    taskId: string,
    newAssigneeId: string,
    reassignedBy: string
  ): Promise<any | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/reassign/${taskId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newAssigneeId, reassignedBy })
      }).then(r => r.json())
    );
  }, [apiCall]);

  const bulkReassignTasks = useCallback(async (
    taskIds: string[],
    newAssigneeId: string,
    reassignedBy: string
  ): Promise<ReassignmentResult | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/reassign/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskIds, newAssigneeId, reassignedBy })
      }).then(r => r.json())
    );
  }, [apiCall]);

  const reassignAllFromUser = useCallback(async (
    fromUserId: string,
    toUserId: string,
    caseId?: string,
    reassignedBy?: string
  ): Promise<{ reassignedCount: number } | null> => {
    return apiCall(() => 
      fetch(`/api/v1${ENGINE_BASE}/reassign/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromUserId, toUserId, caseId, reassignedBy })
      }).then(r => r.json())
    );
  }, [apiCall]);

  // ==================== 10. WORKFLOW ANALYTICS ====================

  const getWorkflowMetrics = useCallback(async (caseId?: string): Promise<WorkflowMetrics | null> => {
    const url = caseId 
      ? `/api/v1${ENGINE_BASE}/analytics/metrics?caseId=${caseId}`
      : `/api/v1${ENGINE_BASE}/analytics/metrics`;
    return apiCall(() => fetch(url).then(r => r.json()));
  }, [apiCall]);

  const getTaskVelocity = useCallback(async (
    caseId?: string,
    days?: number
  ): Promise<TaskVelocity | null> => {
    const params = new URLSearchParams();
    if (caseId) params.append('caseId', caseId);
    if (days) params.append('days', days.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiCall(() => fetch(`/api/v1${ENGINE_BASE}/analytics/velocity${query}`).then(r => r.json()));
  }, [apiCall]);

  const getBottlenecks = useCallback(async (caseId?: string): Promise<BottleneckAnalysis | null> => {
    const url = caseId 
      ? `/api/v1${ENGINE_BASE}/analytics/bottlenecks?caseId=${caseId}`
      : `/api/v1${ENGINE_BASE}/analytics/bottlenecks`;
    return apiCall(() => fetch(url).then(r => r.json()));
  }, [apiCall]);

  return {
    loading,
    error,
    
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
