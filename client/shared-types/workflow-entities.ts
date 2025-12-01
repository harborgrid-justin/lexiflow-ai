// Workflow and Task Types
// API response types for workflow stages, tasks, and related entities

import { ApiCase, ApiUser, ApiOrganization } from './core-entities';

export interface ApiTask {
  id: string;
  title: string;
  type: string;
  description?: string;
  status: string;
  priority: string;
  due_date?: Date | string;
  start_date?: Date | string;
  completed_date?: Date | string;
  estimated_hours?: number;
  actual_hours?: number;
  progress: number;
  notes?: string;
  case_id?: string;
  assignee_id?: string;
  created_by?: string;
  owner_org_id?: string;
  created_at: Date | string;
  updated_at: Date | string;
  case?: ApiCase;
  assignee?: ApiUser;
  creator?: ApiUser;
  organization?: ApiOrganization;
}

export interface ApiWorkflowStage {
  id: string;
  case_id: string;
  name: string;
  stage_type?: string;
  status: string;
  order_index: number;
  start_date?: Date | string;
  expected_completion?: Date | string;
  actual_completion?: Date | string;
  progress: number;
  notes?: string;
  is_milestone?: boolean;
  predecessor_stage_id?: string;
  owner_org_id?: string;
  created_at: Date | string;
  updated_at: Date | string;
  case?: ApiCase;
  organization?: ApiOrganization;
  tasks?: ApiTask[];
}

export interface ApiWorkflowTemplate {
  id: string;
  name: string;
  description?: string;
  matter_type: string;
  stages: Array<{
    name: string;
    order_index: number;
    expected_duration_days?: number;
    is_milestone?: boolean;
    tasks?: Array<{
      title: string;
      type: string;
      estimated_hours?: number;
    }>;
  }>;
  is_active?: boolean;
  owner_org_id?: string;
  created_at: Date | string;
  updated_at: Date | string;
}
