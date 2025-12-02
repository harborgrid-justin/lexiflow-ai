/**
 * Enterprise Workflow & Task Management Types
 * Comprehensive type definitions for legal practice management
 */

// Task Priority Levels
export type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';

// Task Status
export type TaskStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Blocked' | 'On Hold' | 'Cancelled';

// Task View Modes
export type TaskViewMode = 'list' | 'board' | 'calendar' | 'timeline';

// Workflow Stage Status
export type StageStatus = 'Pending' | 'Active' | 'Completed' | 'Skipped';

// Assignee Rules
export type AssigneeRuleType = 'specific_user' | 'role_based' | 'round_robin' | 'case_attorney' | 'manual';

// Due Date Rules
export type DueDateRuleType = 'fixed_date' | 'days_from_start' | 'days_from_previous' | 'business_days';

/**
 * Core Task Interface
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;

  // Assignments
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  createdById: string;
  createdByName?: string;

  // Dates
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  dueTime?: string;
  completedAt?: string;
  startedAt?: string;

  // Relationships
  caseId?: string;
  caseName?: string;
  caseNumber?: string;
  workflowId?: string;
  workflowStageId?: string;
  parentTaskId?: string;

  // Task Details
  tags?: string[];
  attachments?: TaskAttachment[];
  checklist?: ChecklistItem[];
  dependencies?: string[]; // Task IDs this task depends on
  blockedBy?: string[]; // Task IDs blocking this task

  // Time Tracking
  estimatedHours?: number;
  actualHours?: number;
  billableHours?: number;
  timeEntries?: TimeEntry[];

  // Metadata
  isRecurring?: boolean;
  recurrenceRule?: string;
  customFields?: Record<string, any>;
}

/**
 * Task Attachment
 */
export interface TaskAttachment {
  id: string;
  taskId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

/**
 * Checklist Item (Subtask)
 */
export interface ChecklistItem {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  assigneeId?: string;
  dueDate?: string;
  order: number;
  createdAt: string;
  completedAt?: string;
}

/**
 * Time Entry
 */
export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  userName?: string;
  hours: number;
  date: string;
  description?: string;
  billable: boolean;
  rate?: number;
  createdAt: string;
}

/**
 * Task Comment
 */
export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  mentions?: string[];
  attachments?: TaskAttachment[];
  createdAt: string;
  updatedAt: string;
  isInternal?: boolean;
}

/**
 * Task Activity Log Entry
 */
export interface TaskActivity {
  id: string;
  taskId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: string;
  field?: string;
  oldValue?: string;
  newValue?: string;
  description: string;
  timestamp: string;
}

/**
 * Workflow Template
 */
export interface WorkflowTemplate {
  id: string;
  name: string;
  description?: string;
  category?: string;
  icon?: string;
  stages: WorkflowStage[];
  isActive: boolean;
  isPublic: boolean;
  createdBy: string;
  createdByName?: string;
  createdAt: string;
  updatedAt: string;
  usageCount?: number;
  tags?: string[];
}

/**
 * Workflow Stage (Node in workflow)
 */
export interface WorkflowStage {
  id: string;
  workflowId: string;
  name: string;
  description?: string;
  order: number;

  // Visual position on canvas
  position?: {
    x: number;
    y: number;
  };

  // Stage Configuration
  assigneeRule: AssigneeRuleConfig;
  dueDateRule: DueDateRuleConfig;
  requiredFields?: string[];

  // Approval & Branching
  requiresApproval?: boolean;
  approvalChain?: string[]; // User IDs
  conditionalBranching?: ConditionalRule[];

  // Stage Status
  status?: StageStatus;
  completedAt?: string;

  // Connections
  nextStages?: string[]; // Stage IDs
  previousStages?: string[];
}

/**
 * Assignee Rule Configuration
 */
export interface AssigneeRuleConfig {
  type: AssigneeRuleType;
  userId?: string; // For specific_user
  role?: string; // For role_based
  fallbackUserId?: string;
}

/**
 * Due Date Rule Configuration
 */
export interface DueDateRuleConfig {
  type: DueDateRuleType;
  fixedDate?: string; // For fixed_date
  daysOffset?: number; // For days_from_start, days_from_previous
  businessDaysOnly?: boolean;
}

/**
 * Conditional Branching Rule
 */
export interface ConditionalRule {
  id: string;
  condition: string;
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
  nextStageId: string;
  priority: number;
}

/**
 * Workflow Instance (Running workflow)
 */
export interface WorkflowInstance {
  id: string;
  templateId: string;
  templateName?: string;
  caseId: string;
  caseName?: string;

  // Status
  status: 'Active' | 'Paused' | 'Completed' | 'Cancelled';
  currentStageId?: string;
  currentStageName?: string;

  // Progress
  completedStages: number;
  totalStages: number;
  percentComplete: number;

  // Dates
  startedAt: string;
  completedAt?: string;
  dueDate?: string;

  // Participants
  ownerId: string;
  ownerName?: string;
  assignees?: string[];

  // Metadata
  variables?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

/**
 * Task Filters
 */
export interface TaskFilters {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assigneeId?: string[];
  caseId?: string;
  tags?: string[];
  dueDateFrom?: string;
  dueDateTo?: string;
  search?: string;
  workflowId?: string;
  isOverdue?: boolean;
  hasAttachments?: boolean;
  hasComments?: boolean;
}

/**
 * Task Sort Options
 */
export interface TaskSortOptions {
  field: 'title' | 'priority' | 'dueDate' | 'status' | 'assignee' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}

/**
 * Task Statistics
 */
export interface TaskStatistics {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<TaskPriority, number>;
  overdue: number;
  dueToday: number;
  dueThisWeek: number;
  completed: number;
  completionRate: number;
  averageCompletionTime?: number; // in hours
}

/**
 * User Assignment
 */
export interface UserAssignment {
  userId: string;
  userName: string;
  userAvatar?: string;
  role?: string;
  taskCount: number;
  overdueCount: number;
  completionRate: number;
}

/**
 * Workflow Analytics
 */
export interface WorkflowAnalytics {
  instanceId: string;
  avgStageTime: Record<string, number>;
  bottlenecks: string[];
  onTimeCompletion: number;
  delayedStages: string[];
  totalDuration: number;
  estimatedCompletion?: string;
}

/**
 * Task Creation Input
 */
export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
  dueTime?: string;
  caseId?: string;
  tags?: string[];
  checklist?: Omit<ChecklistItem, 'id' | 'taskId' | 'createdAt'>[];
  estimatedHours?: number;
  workflowId?: string;
  workflowStageId?: string;
  parentTaskId?: string;
}

/**
 * Task Update Input
 */
export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
  dueTime?: string;
  tags?: string[];
  estimatedHours?: number;
}

/**
 * Bulk Task Action
 */
export interface BulkTaskAction {
  taskIds: string[];
  action: 'complete' | 'delete' | 'assign' | 'update_priority' | 'update_status' | 'add_tag';
  data?: any;
}

/**
 * Task Board Column (for Kanban view)
 */
export interface TaskBoardColumn {
  id: string;
  title: string;
  status: TaskStatus;
  tasks: Task[];
  taskCount: number;
  color?: string;
}

/**
 * Calendar Task Event
 */
export interface CalendarTaskEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  task: Task;
  color?: string;
  allDay?: boolean;
}

/**
 * Timeline Task Item
 */
export interface TimelineTask {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  dependencies?: string[];
  assignee?: string;
  task: Task;
}

/**
 * Quick Add Task Form
 */
export interface QuickAddTaskForm {
  title: string;
  assigneeId?: string;
  dueDate?: string;
  priority?: TaskPriority;
  caseId?: string;
}
