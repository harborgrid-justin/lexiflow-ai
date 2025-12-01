// Workflow Engine Types
// Core type definitions for the enterprise workflow engine

export type { WorkflowTask } from '../../../models/workflow.model';

// ==================== TASK DEPENDENCIES ====================

export interface TaskDependency {
  taskId: string;
  dependsOn: string[];
  type: 'blocking' | 'informational';
}

// ==================== SLA MANAGEMENT ====================

export interface SLARule {
  id: string;
  name: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  warningHours: number;
  breachHours: number;
  escalateTo?: string;
  autoNotify: boolean;
}

export interface SLAStatus {
  status: 'ok' | 'warning' | 'breached';
  rule?: SLARule;
  hoursRemaining?: number;
  hoursOverdue?: number;
}

// ==================== APPROVAL WORKFLOWS ====================

export interface ApprovalStep {
  id: string;
  order: number;
  approverId: string;
  approverRole?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: Date;
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

// ==================== AUDIT TRAIL ====================

export type AuditEntityType = 'task' | 'stage' | 'workflow';

export interface AuditLogEntry {
  id: string;
  timestamp: Date;
  entityType: AuditEntityType;
  entityId: string;
  action: string;
  previousValue?: any;
  newValue?: any;
  userId: string;
  userName?: string;
  metadata?: Record<string, any>;
}

// ==================== TIME TRACKING ====================

export interface TaskTimeEntry {
  taskId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
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
  | 'stage_completed'
  | 'escalation';

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
  createdAt: Date;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
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

// ==================== WORKFLOW METRICS ====================

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
  averageCompletionTime: number;
  slaBreaches: number;
  tasksByPriority: Record<string, number>;
  tasksByStatus: Record<string, number>;
  tasksByAssignee: Record<string, number>;
  stageProgress: StageProgress[];
  timelineData: TimelineDataPoint[];
}

// ==================== NEW: TASK ESCALATION ====================

export interface EscalationRule {
  id: string;
  name: string;
  triggerHoursOverdue: number;
  escalateToRole: string;
  escalateToUserId?: string;
  notifyOriginalAssignee: boolean;
  autoReassign: boolean;
  maxEscalationLevel: number;
}

export interface EscalationEvent {
  id: string;
  taskId: string;
  level: number;
  escalatedAt: Date;
  escalatedTo: string;
  reason: string;
  resolved: boolean;
}

// ==================== NEW: EXTERNAL INTEGRATIONS ====================

export type IntegrationType = 'webhook' | 'email' | 'slack' | 'teams' | 'zapier';

export interface ExternalIntegration {
  id: string;
  name: string;
  type: IntegrationType;
  config: Record<string, any>;
  enabled: boolean;
  triggers: string[];
  lastTriggered?: Date;
  errorCount: number;
}

export interface IntegrationPayload {
  event: string;
  timestamp: Date;
  data: Record<string, any>;
  source: string;
}

// ==================== NEW: CUSTOM FIELDS ====================

export type CustomFieldType = 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox' | 'url';

export interface CustomFieldDefinition {
  id: string;
  name: string;
  type: CustomFieldType;
  required: boolean;
  options?: string[];
  defaultValue?: any;
  validationRule?: string;
  appliesTo: 'task' | 'stage' | 'both';
}

export interface CustomFieldValue {
  fieldId: string;
  entityType: 'task' | 'stage';
  entityId: string;
  value: any;
  updatedAt: Date;
  updatedBy: string;
}

// ==================== NEW: RECURRING WORKFLOWS ====================

export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';

export interface RecurringWorkflow {
  id: string;
  templateId: string;
  name: string;
  pattern: RecurrencePattern;
  cronExpression?: string;
  nextRun: Date;
  lastRun?: Date;
  enabled: boolean;
  assigneeStrategy: 'fixed' | 'round-robin' | 'least-loaded';
  fixedAssignees?: string[];
}

// ==================== NEW: WORKFLOW VERSIONING ====================

export interface WorkflowVersion {
  id: string;
  templateId: string;
  version: number;
  name: string;
  description?: string;
  stages: any[];
  createdAt: Date;
  createdBy: string;
  isActive: boolean;
  changelog?: string;
}

// ==================== REASSIGNMENT ====================

export interface ReassignmentRule {
  id: string;
  taskType?: string;
  allowedAssignees?: string[];
  blockedAssignees?: string[];
  maxReassignments?: number;
}

export interface ReassignmentHistory {
  id: string;
  taskId: string;
  fromUserId?: string;
  toUserId: string;
  reason: string;
  reassignedBy: string;
  timestamp: Date;
}

// ==================== TIME TRACKING (enhanced) ====================

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  durationMinutes: number;
  description?: string;
  billable: boolean;
  createdAt: Date;
}

export interface TimeTrackingConfig {
  taskId: string;
  autoTrack: boolean;
  requireDescription?: boolean;
  minDurationMinutes?: number;
}

// ==================== CONDITIONAL RULES (enhanced) ====================

export enum RuleOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  IN = 'in',
  NOT_IN = 'not_in',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty',
}

export interface RuleCondition {
  field: string;
  operator: RuleOperator;
  value: unknown;
}

export interface ConditionalRuleV2 {
  id: string;
  taskId: string;
  conditions: RuleCondition[];
  priority?: number;
  thenTaskId?: string;
  thenAction?: string;
  elseTaskId?: string;
  elseAction?: string;
}

// ==================== PARALLEL TASKS (enhanced) ====================

export enum ParallelCompletionRuleV2 {
  ALL = 'all',
  ANY = 'any',
  N_OF_M = 'n_of_m',
}

export interface ParallelTaskGroupV2 {
  id: string;
  name: string;
  taskIds: string[];
  completionRule: ParallelCompletionRuleV2;
  requiredCount?: number;
  nextTaskId?: string;
  completedTaskIds: string[];
  status: 'pending' | 'active' | 'completed';
}
