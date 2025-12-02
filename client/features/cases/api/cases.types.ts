/**
 * Case Management Types
 * Comprehensive TypeScript interfaces for the Case Management module
 */

import { Case, Party, User, LegalDocument, CaseMember } from '../../../types';

// Extended Case Status with more granular states
export type CaseStatusType =
  | 'Active'
  | 'Pending'
  | 'Discovery'
  | 'Trial'
  | 'Settled'
  | 'Closed'
  | 'Archived'
  | 'Appeal'
  | 'On Hold';

// Practice Areas
export type PracticeArea =
  | 'Litigation'
  | 'M&A'
  | 'IP'
  | 'Real Estate'
  | 'General'
  | 'Commercial Litigation'
  | 'Criminal Defense'
  | 'Family Law'
  | 'Immigration'
  | 'Employment Law'
  | 'Tax Law'
  | 'Bankruptcy'
  | 'Personal Injury';

// Case priority levels
export type CasePriority = 'Low' | 'Medium' | 'High' | 'Urgent';

// Case view modes
export type CaseViewMode = 'table' | 'grid' | 'kanban';

// Filter configurations
export interface CaseFilters {
  status?: CaseStatusType[];
  practiceArea?: PracticeArea[];
  attorney?: string[]; // User IDs
  client?: string[];
  court?: string[];
  jurisdiction?: string[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  priority?: CasePriority[];
}

// Saved filter preset
export interface FilterPreset {
  id: string;
  name: string;
  filters: CaseFilters;
  isDefault?: boolean;
  userId: string;
  createdAt: string;
}

// Case list request parameters
export interface CaseListParams {
  page?: number;
  limit?: number;
  sortBy?: keyof Case;
  sortOrder?: 'asc' | 'desc';
  filters?: CaseFilters;
}

// Case list response
export interface CaseListResponse {
  cases: Case[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  filters?: CaseFilters;
}

// Case timeline event types
export type TimelineEventType =
  | 'created'
  | 'updated'
  | 'status_changed'
  | 'document_added'
  | 'party_added'
  | 'party_removed'
  | 'hearing_scheduled'
  | 'deadline_added'
  | 'note_added'
  | 'task_completed'
  | 'motion_filed'
  | 'discovery_request'
  | 'settlement_offer';

// Timeline event interface
export interface TimelineEvent {
  id: string;
  caseId: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  createdBy: string;
  createdAt: string;
  user?: User;
}

// Case activity feed
export interface CaseActivity {
  id: string;
  caseId: string;
  action: string;
  details: string;
  performedBy: string;
  performedAt: string;
  user?: User;
}

// Key dates for a case
export interface CaseKeyDates {
  filingDate?: string;
  answerDueDate?: string;
  discoveryDeadline?: string;
  motionDeadline?: string;
  trialDate?: string;
  settlementConference?: string;
  statuteOfLimitations?: string;
  appealDeadline?: string;
}

// Case metrics and statistics
export interface CaseMetrics {
  totalDocuments: number;
  totalParties: number;
  totalTasks: number;
  completedTasks: number;
  totalHours: number;
  totalBilled: number;
  totalExpenses: number;
  daysOpen: number;
  upcomingDeadlines: number;
}

// Case summary for list views
export interface CaseSummary extends Case {
  assignedAttorneys?: User[];
  recentActivity?: TimelineEvent[];
  metrics?: Partial<CaseMetrics>;
}

// Extended case detail with all relations
export interface CaseDetail extends Case {
  parties: Party[];
  documents: LegalDocument[];
  caseMembers: CaseMember[];
  timeline: TimelineEvent[];
  keyDates: CaseKeyDates;
  metrics: CaseMetrics;
  assignedAttorneys: User[];
}

// Case creation payload
export interface CreateCasePayload {
  title: string;
  caseNumber?: string;
  client: string;
  matterType: string;
  practiceArea?: PracticeArea;
  description?: string;
  court?: string;
  jurisdiction?: string;
  judge?: string;
  opposingCounsel?: string;
  filingDate?: string;
  status?: CaseStatusType;
  priority?: CasePriority;
  billingModel?: string;
  value?: number;
  assignedAttorneys?: string[]; // User IDs
  parties?: Partial<Party>[];
  ownerOrgId?: string;
}

// Case update payload
export interface UpdateCasePayload extends Partial<CreateCasePayload> {
  id: string;
}

// Bulk operations
export interface BulkCaseOperation {
  caseIds: string[];
  operation: 'archive' | 'delete' | 'update_status' | 'assign_attorney';
  payload?: any;
}

// Export format options
export type ExportFormat = 'csv' | 'xlsx' | 'pdf';

// Case export request
export interface CaseExportRequest {
  caseIds?: string[];
  filters?: CaseFilters;
  format: ExportFormat;
  includeDocuments?: boolean;
  includeTimeline?: boolean;
  includeParties?: boolean;
}

// Case search result
export interface CaseSearchResult {
  case: Case;
  highlights: {
    field: string;
    matches: string[];
  }[];
  score: number;
}

// Advanced search parameters
export interface AdvancedSearchParams {
  query: string;
  fields?: string[]; // Fields to search in
  operator?: 'AND' | 'OR'; // Boolean operator
  fuzzy?: boolean; // Enable fuzzy matching
  filters?: CaseFilters;
}
