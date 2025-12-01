// Motion and Discovery Types
// API response types for motions, discovery requests, and litigation-related entities

import { ApiCase } from './core-entities';

export interface ApiMotion {
  id: string;
  case_id: string;
  title: string;
  motion_type: string;
  description?: string;
  status: string;
  filed_by: string;
  filed_date?: Date | string;
  response_due?: Date | string;
  hearing_date?: Date | string;
  judge?: string;
  outcome?: string;
  document_path?: string;
  notes?: string;
  created_at: Date | string;
  updated_at: Date | string;
  case?: ApiCase;
}

export interface ApiDiscovery {
  id: string;
  case_id: string;
  discovery_type: string;
  title: string;
  description?: string;
  status: string;
  served_date?: Date | string;
  due_date?: Date | string;
  response_date?: Date | string;
  propounding_party: string;
  responding_party: string;
  request_count?: number;
  response_summary?: string;
  notes?: string;
  created_at: Date | string;
  updated_at: Date | string;
  case?: ApiCase;
}
