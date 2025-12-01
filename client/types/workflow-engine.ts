// Enterprise Workflow Engine Types
// 
// These types support the 10 enterprise capabilities:
// 1. Task Dependencies
// 2. SLA Management
// 3. Approval Workflows
// 4. Conditional Branching
// 5. Time Tracking Integration
// 6. Notification System
// 7. Audit Trail
// 8. Parallel Tasks
// 9. Task Reassignment
// 10. Workflow Analytics

// ==================== TASK DEPENDENCIES ====================

export interface TaskDependency {
  taskId: string;
  dependsOn: string[];
  type: 'blocking' | 'informational';
}

export interface DependencyCheckResult {
  canStart: boolean;
  blockedBy: string[];
}

// ==================== SLA MANAGEMENT ====================

export type SLAPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface SLARule {
  id: string;
  name: string;
  priority: SLAPriority;
  warningHours: number;
  breachHours: number;
  escalateTo?: string;
  autoNotify: boolean;
}

export type SLAStatus = 'ok' | 'warning' | 'breached';

export interface TaskSLAStatus {
  status: SLAStatus;
  rule?: SLARule;
  hoursRemaining?: number;
  hoursOverdue?: number;
}

export interface SLABreachReport {
  warnings: any[]; // WorkflowTask[]
  breaches: any[]; // WorkflowTask[]
}

// ==================== APPROVAL WORKFLOWS ====================

export type ApprovalStepStatus = 'pending' | 'approved' | 'rejected';

export interface ApprovalStep {
  id: string;
  order: number;
  approverId: string;
  approverRole?: string;
  status: ApprovalStepStatus;
  approvedAt?: string;
  comments?: string;
}

export interface ApprovalChain {
  taskId: string;
  steps: ApprovalStep[];
  currentStep: number;
  status: 'pending' | 'approved' | 'rejected';
}

// ==================== CONDITIONAL BRANCHING ====================

export type ConditionOperator = 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'isEmpty' | 'isNotEmpty';
export type ConditionalAction = 'skipStage' | 'addTask' | 'assignTo' | 'setPriority' | 'notify';

export interface ConditionalRule {
  id: string;
  stageId: string;
  condition: {
    field: string;
    operator: ConditionOperator;
    value: any;
  };
  thenAction: ConditionalAction;
  thenValue: any;
}

export interface ConditionEvaluationResult {
  actionsTriggered: { rule: ConditionalRule; executed: boolean }[];
}

// ==================== TIME TRACKING ====================

export interface TaskTimeEntry {
  taskId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration?: number; // minutes
  description?: string;
  billable: boolean;
}

// ==================== NOTIFICATIONS ====================

export type NotificationType = 
  | 'task_assigned' 
  | 'task_due_soon' 
  | 'task_overdue' 
  | 'sla_warning' 
  | 'sla_breach' 
  | 'approval_required' 
  | 'stage_completed';

export interface NotificationEvent {
  id: string;
  type: NotificationType;
  recipientId: string;
  recipientEmail?: string;
  title: string;
  message: string;
  caseId?: string;
  taskId?: string;
  read: boolean;
  createdAt: string;
}

// ==================== AUDIT TRAIL ====================

export type AuditEntityType = 'task' | 'stage' | 'workflow';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  entityType: AuditEntityType;
  entityId: string;
  action: string;
  previousValue?: any;
  newValue?: any;
  userId: string;
  userName?: string;
  metadata?: Record<string, any>;
}

// ==================== PARALLEL TASKS ====================

export type ParallelCompletionRule = 'all' | 'any' | 'percentage';

export interface ParallelTaskGroup {
  id: string;
  stageId: string;
  tasks: string[];
  completionRule: ParallelCompletionRule;
  completionThreshold?: number;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface ParallelGroupStatus {
  isComplete: boolean;
  completedCount: number;
  totalCount: number;
}

// ==================== TASK REASSIGNMENT ====================

export interface ReassignmentResult {
  success: string[];
  failed: string[];
}

// ==================== WORKFLOW ANALYTICS ====================

export interface StageProgress {
  stageId: string;
  stageName: string;
  progress: number;
}

export interface TimelineDataPoint {
  date: string;
  completed: number;
  created: number;
}

export interface WorkflowMetrics {
  caseId?: string;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  averageCompletionTime: number; // hours
  slaBreaches: number;
  tasksByPriority: Record<string, number>;
  tasksByStatus: Record<string, number>;
  tasksByAssignee: Record<string, number>;
  stageProgress: StageProgress[];
  timelineData: TimelineDataPoint[];
}

export interface TaskVelocity {
  velocity: number;
  unit: string;
}

export interface BottleneckAnalysis {
  slowestStages: { stageId: string; name: string; avgDays: number }[];
  blockedTasks: { taskId: string; title: string; blockedBy: string[] }[];
  overloadedUsers: { userId: string; taskCount: number }[];
}

// ==================== EXTENDED WORKFLOW TASK ====================

/**
 * Extended workflow task with enterprise features
 */
export interface EnterpriseWorkflowTask {
  id: string;
  title: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignee: string;
  assigneeId?: string;
  dueDate: string;
  createdAt?: string;
  completedAt?: string;
  // Enterprise features
  dependencies?: TaskDependency;
  slaStatus?: TaskSLAStatus;
  approvalChain?: ApprovalChain;
  timeEntries?: TaskTimeEntry[];
  parallelGroupId?: string;
  relatedModule?: 'Documents' | 'Billing' | 'Discovery' | 'Motions' | 'Evidence';
  actionLabel?: string;
  estimatedHours?: number;
  actualHours?: number;
  automatedTrigger?: string;
}

/**
 * Extended workflow stage with enterprise features
 */
export interface EnterpriseWorkflowStage {
  id: string;
  title: string;
  description?: string;
  status: 'Pending' | 'Active' | 'Completed';
  order: number;
  tasks: EnterpriseWorkflowTask[];
  // Enterprise features
  conditionalRules?: ConditionalRule[];
  parallelGroups?: ParallelTaskGroup[];
  progress?: number;
  startDate?: string;
  dueDate?: string;
  completedDate?: string;
}

// ==================== API REQUEST/RESPONSE TYPES ====================

export interface SetDependenciesRequest {
  dependsOn: string[];
  type?: 'blocking' | 'informational';
}

export interface CreateApprovalChainRequest {
  approverIds: string[];
}

export interface ProcessApprovalRequest {
  approverId: string;
  action: 'approve' | 'reject';
  comments?: string;
}

export interface StartTimeTrackingRequest {
  userId: string;
}

export interface StopTimeTrackingRequest {
  userId: string;
  description?: string;
}

export interface CreateParallelGroupRequest {
  stageId: string;
  taskIds: string[];
  completionRule?: ParallelCompletionRule;
  completionThreshold?: number;
}

export interface ReassignTaskRequest {
  newAssigneeId: string;
  reassignedBy: string;
}

export interface BulkReassignRequest {
  taskIds: string[];
  newAssigneeId: string;
  reassignedBy: string;
}

export interface ReassignUserTasksRequest {
  fromUserId: string;
  toUserId: string;
  caseId?: string;
  reassignedBy?: string;
}
