/**
 * Shared Types for LexiFlow AI
 * This file defines the API contracts between frontend and backend
 *
 * IMPORTANT: Backend uses snake_case for database fields
 * Frontend may use camelCase for component props
 * This file documents the actual API response format
 */

// ==================== ENUMS & CONSTANTS ====================

export enum CaseStatus {
  Active = 'active',
  Discovery = 'discovery',
  Trial = 'trial',
  Settled = 'settled',
  Closed = 'closed',
  Appeal = 'appeal'
}

export type UserRole = 'Attorney' | 'Partner' | 'Associate' | 'Paralegal' | 'Administrator' | 'Client';
export type MatterType = 'Litigation' | 'M&A' | 'IP' | 'Real Estate' | 'General' | 'Commercial Litigation';
export type BillingModel = 'Hourly' | 'Fixed' | 'Contingency' | 'Hybrid';
export type OrganizationType = 'Law Firm' | 'Corporate' | 'Government' | 'Court' | 'Vendor';

export type MotionType = 'Dismiss' | 'Summary Judgment' | 'Compel Discovery' | 'In Limine' | 'Continuance' | 'Sanctions' | 'summary_judgment' | 'dismiss' | 'compel_discovery';
export type MotionStatus = 'Draft' | 'Filed' | 'Opposition Served' | 'Reply Served' | 'Hearing Set' | 'Submitted' | 'Decided' | 'draft' | 'filed' | 'decided';

export type DiscoveryType = 'Production' | 'Interrogatory' | 'Admission' | 'Deposition' | 'document_request';
export type DiscoveryStatus = 'Draft' | 'Served' | 'Responded' | 'Overdue' | 'Closed' | 'draft' | 'served' | 'responded';

export type EvidenceType = 'Physical' | 'Digital' | 'Document' | 'Testimony' | 'Forensic' | 'Email';
export type AdmissibilityStatus = 'Admissible' | 'Challenged' | 'Inadmissible' | 'Pending';

export type DocumentStatus = 'Draft' | 'Final' | 'Signed' | 'Pending OCR' | 'draft' | 'final' | 'signed';
export type TaskStatus = 'Pending' | 'In Progress' | 'Review' | 'Done' | 'Completed' | 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'High' | 'Medium' | 'Low' | 'high' | 'medium' | 'low';

// ==================== API RESPONSE TYPES (Backend Format) ====================

/**
 * Organization entity as returned by the API
 * Uses snake_case to match backend database schema
 */
export interface ApiOrganization {
  id: string;
  name: string;
  type?: string;
  domain?: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  subscription_tier?: string;
  status: string;
  practice_areas?: string;
  tax_id?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

/**
 * User entity as returned by the API
 * Uses snake_case to match backend database schema
 */
export interface ApiUser {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  role: string;
  position?: string;
  bar_admission?: string;
  bar_number?: string;
  phone?: string;
  expertise?: string;
  office?: string;
  user_type?: string;
  avatar?: string;
  last_active?: Date | string;
  status: string;
  organization_id: string;
  created_at: Date | string;
  updated_at: Date | string;
  // Optional hydrated relations
  organization?: ApiOrganization;
}

/**
 * Party entity as returned by the API
 */
export interface ApiParty {
  id: string;
  name: string;
  role: string;
  contact: string;
  type: string;
  counsel?: string;
  case_id: string;
  linked_org_id?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

/**
 * Case Member entity as returned by the API
 */
export interface ApiCaseMember {
  id: string;
  case_id: string;
  user_id: string;
  role: string;
  joined_at: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
  user?: ApiUser;
}

/**
 * Case entity as returned by the API
 * Uses snake_case to match backend database schema
 */
export interface ApiCase {
  id: string;
  title: string;
  client_name: string;
  opposing_counsel?: string;
  status: string;
  filing_date?: Date | string;
  description?: string;
  value?: number;
  matter_type?: string;
  jurisdiction?: string;
  court?: string;
  billing_model?: string;
  judge?: string;
  owner_org_id?: string;
  created_by?: string;
  created_at: Date | string;
  updated_at: Date | string;
  // Optional hydrated relations
  organization?: ApiOrganization;
  parties?: ApiParty[];
  case_members?: ApiCaseMember[];
}

/**
 * Document Version entity as returned by the API
 */
export interface ApiDocumentVersion {
  id: string;
  document_id: string;
  version_number: number;
  upload_date: Date | string;
  uploaded_by: string;
  summary?: string;
  content_snapshot?: string;
  file_path?: string;
  file_size?: number;
  created_at: Date | string;
  updated_at: Date | string;
}

/**
 * Document entity as returned by the API
 * Uses snake_case to match backend database schema
 */
export interface ApiDocument {
  id: string;
  filename: string;
  title: string;
  type: string;
  status: string;
  file_path: string;
  mime_type?: string;
  file_size?: number;
  version: number;
  version_notes?: string;
  description?: string;
  content?: string;
  summary?: string;
  risk_score?: number;
  source_module?: string;
  is_encrypted?: boolean;
  shared_with_client?: boolean;
  uploaded_by?: string;
  tags?: string;
  upload_date?: Date | string;
  last_modified?: Date | string;
  classification?: string;
  case_id?: string;
  created_by?: string;
  modified_by?: string;
  owner_org_id?: string;
  created_at: Date | string;
  updated_at: Date | string;
  // Optional hydrated relations
  case?: ApiCase;
  creator?: ApiUser;
  modifier?: ApiUser;
  organization?: ApiOrganization;
  versions?: ApiDocumentVersion[];
}

/**
 * Evidence entity as returned by the API
 * Uses snake_case to match backend database schema
 */
export interface ApiEvidence {
  id: string;
  title: string;
  type: string;
  status: string;
  description?: string;
  location?: string;
  collected_by?: string;
  collected_date?: Date | string;
  collection_notes?: string;
  tags?: string;
  classification?: string;
  case_id?: string;
  custodian_id?: string;
  owner_org_id?: string;
  created_at: Date | string;
  updated_at: Date | string;
  // Optional hydrated relations
  case?: ApiCase;
  custodian?: ApiUser;
  organization?: ApiOrganization;
}

/**
 * Task entity as returned by the API
 * Uses snake_case to match backend database schema
 */
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
  // Optional hydrated relations
  case?: ApiCase;
  assignee?: ApiUser;
  creator?: ApiUser;
  organization?: ApiOrganization;
}

/**
 * Motion entity as returned by the API
 * Uses snake_case to match backend database schema
 */
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
  // Optional hydrated relations
  case?: ApiCase;
  filer?: ApiUser;
}

/**
 * Discovery Request entity as returned by the API
 * Uses snake_case to match backend database schema
 */
export interface ApiDiscoveryRequest {
  id: string;
  case_id: string;
  title: string;
  request_type: string;
  description?: string;
  status: string;
  created_by: string;
  served_date?: Date | string;
  due_date?: Date | string;
  response_date?: Date | string;
  recipient: string;
  priority: string;
  response_notes?: string;
  created_at: Date | string;
  updated_at: Date | string;
  // Optional hydrated relations
  case?: ApiCase;
  creator?: ApiUser;
}

/**
 * Client entity as returned by the API
 * Uses snake_case to match backend database schema
 */
export interface ApiClient {
  id: string;
  name: string;
  type: string;
  email?: string;
  phone?: string;
  address?: string;
  status: string;
  primary_contact?: string;
  industry?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

// ==================== AUTH TYPES ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  organization_id?: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    organization_id: string;
  };
}

// ==================== REQUEST DTOs ====================

export interface CreateCaseRequest {
  title: string;
  client_name: string;
  opposing_counsel?: string;
  status?: string;
  filing_date?: string;
  description?: string;
  value?: number;
  matter_type?: string;
  jurisdiction?: string;
  court?: string;
  billing_model?: string;
  judge?: string;
  owner_org_id?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateCaseRequest extends Partial<CreateCaseRequest> {}

export interface CreateDocumentRequest {
  filename: string;
  title: string;
  type: string;
  status?: string;
  file_path: string;
  mime_type?: string;
  file_size?: number;
  description?: string;
  tags?: string;
  classification?: string;
  case_id?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateDocumentRequest extends Partial<CreateDocumentRequest> {}

export interface CreateEvidenceRequest {
  title: string;
  type: string;
  status?: string;
  description?: string;
  location?: string;
  collected_by?: string;
  collected_date?: string;
  collection_notes?: string;
  tags?: string;
  classification?: string;
  case_id?: string;
  custodian_id?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateEvidenceRequest extends Partial<CreateEvidenceRequest> {}

export interface CreateTaskRequest {
  title: string;
  type: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
  start_date?: string;
  estimated_hours?: number;
  case_id?: string;
  assignee_id?: string;
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  completed_date?: string;
  actual_hours?: number;
  progress?: number;
  notes?: string;
}

export interface CreateMotionRequest {
  case_id: string;
  title: string;
  motion_type: string;
  description?: string;
  status?: string;
  filed_by: string;
  filed_date?: string;
  response_due?: string;
  hearing_date?: string;
  judge?: string;
}

export interface UpdateMotionRequest extends Partial<CreateMotionRequest> {
  outcome?: string;
  notes?: string;
}

export interface CreateDiscoveryRequest {
  case_id: string;
  title: string;
  request_type: string;
  description?: string;
  status?: string;
  served_date?: string;
  due_date?: string;
  recipient: string;
  priority?: string;
}

export interface UpdateDiscoveryRequestDto extends Partial<CreateDiscoveryRequest> {
  response_date?: string;
  response_notes?: string;
}

export interface CreateUserRequest {
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  position?: string;
  bar_admission?: string;
  bar_number?: string;
  phone?: string;
  expertise?: string;
  organization_id: string;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  status?: string;
}

// ==================== TYPE HELPERS ====================

/**
 * Utility type to convert API responses (snake_case) to frontend format (camelCase)
 * This is for documentation - actual conversion happens at runtime
 */
export type CamelCase<T> = T; // Placeholder - implement transformation as needed

/**
 * Common API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * API Error response
 */
export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path: string;
}
