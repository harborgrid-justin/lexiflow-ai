/**
 * Workflow Module Types
 */

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  matterType: string;
  jurisdiction?: string;
  stages: WorkflowStageTemplate[];
  estimatedDuration: number; // days
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface WorkflowStageTemplate {
  id: string;
  title: string;
  order: number;
  tasks: TaskTemplate[];
  dependencies?: string[]; // stage IDs that must be completed first
  estimatedDuration: number; // days
}

export interface TaskTemplate {
  id: string;
  title: string;
  description?: string;
  assigneeRole?: string;
  priority: 'High' | 'Medium' | 'Low';
  estimatedHours?: number;
  slaHours?: number;
  automatedTrigger?: string;
  dependencies?: string[]; // task IDs that must be completed first
}

export interface WorkflowInstance {
  id: string;
  templateId?: string;
  caseId: string;
  status: 'Active' | 'Paused' | 'Completed' | 'Cancelled';
  currentStage: string;
  progress: number; // 0-100
  startDate: string;
  estimatedEndDate: string;
  actualEndDate?: string;
  stages: WorkflowStageInstance[];
}

export interface WorkflowStageInstance {
  id: string;
  templateStageId?: string;
  title: string;
  status: 'Pending' | 'Active' | 'Completed';
  order: number;
  startDate?: string;
  endDate?: string;
  tasks: TaskInstance[];
}

export interface TaskInstance {
  id: string;
  templateTaskId?: string;
  title: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'Review' | 'Done';
  assignee: string;
  assigneeId?: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  startDate?: string;
  completedDate?: string;
  slaWarning?: boolean;
  slaBreached?: boolean;
  automatedTrigger?: string;
  relatedModule?: 'Documents' | 'Billing' | 'Discovery' | 'Motions' | 'Evidence';
  comments?: TaskComment[];
}

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface WorkflowFilters {
  status?: WorkflowInstance['status'] | 'all';
  caseId?: string;
  templateId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface TaskFilters {
  status?: TaskInstance['status'] | 'all';
  priority?: TaskInstance['priority'] | 'all';
  assigneeId?: string;
  caseId?: string;
  overdue?: boolean;
  slaWarning?: boolean;
}

export type WorkflowViewMode = 'kanban' | 'list' | 'timeline' | 'calendar';
