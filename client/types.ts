/**
 * IMPORTANT: FRONTEND TYPES vs API TYPES
 * ========================================
 *
 * These types represent the FRONTEND/UI data structures (camelCase).
 * The backend API returns snake_case field names.
 *
 * For API communication:
 * - Use types from '../shared-types/index.ts' (ApiUser, ApiCase, etc.)
 * - Use transformers from '../utils/type-transformers.ts' to convert API responses
 *
 * Example:
 *   const apiUser = await ApiService.getUser(id);  // Returns ApiUser (snake_case)
 *   const user = transformApiUser(apiUser);        // Converts to User (camelCase)
 *
 * Key differences:
 * - Backend: user.first_name, case.client_name, document.file_path
 * - Frontend: user.name, case.client, document.uploadDate
 */

export enum CaseStatus {
  Discovery = 'Discovery',
  Trial = 'Trial',
  Settled = 'Settled',
  Closed = 'Closed',
  Appeal = 'Appeal'
}

export type UserRole = 'Senior Partner' | 'Associate' | 'Paralegal' | 'Administrator' | 'Client User' | 'Guest' | 'Attorney' | 'Partner';
export type MatterType = 'Litigation' | 'M&A' | 'IP' | 'Real Estate' | 'General' | 'Commercial Litigation';
export type BillingModel = 'Hourly' | 'Fixed' | 'Contingency' | 'Hybrid';
export type OrganizationType = 'LawFirm' | 'Corporate' | 'Government' | 'Court' | 'Vendor' | 'Law Firm';

export interface Organization {
  id: string;
  name: string;
  type?: OrganizationType;
  domain?: string;
  logo?: string;
  status: 'Active' | 'Inactive' | 'active' | 'inactive';
  // Additional fields from backend
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  subscriptionTier?: string;
  practiceAreas?: string;
  taxId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Group {
  id: string;
  orgId: string;
  name: string;
  description?: string;
  // Backend stores permissions as comma-separated string; frontend may use array
  permissions?: string[] | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  // Backend returns first_name, last_name, and name
  firstName?: string;
  lastName?: string;
  name: string;
  email: string;
  role: UserRole | string;
  // Position/title - backend uses 'position', frontend historically used 'office'
  position?: string;
  office?: string;
  // Legal professional fields
  barAdmission?: string;
  barNumber?: string;
  phone?: string;
  expertise?: string;
  // Hierarchy Links
  organizationId?: string;
  orgId?: string; // Alias for compatibility
  groupIds?: string[];
  userType?: 'Internal' | 'External';
  avatar?: string;
  status?: 'active' | 'inactive' | 'Active' | 'Inactive';
  lastActive?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  id?: string;
  userId: string;
  bio?: string;
  phone?: string;
  // Backend stores skills as comma-separated string
  skills?: string[] | string;
  // Notification settings - backend uses flat structure
  notifications?: {
    email: boolean;
    push: boolean;
    digest: 'daily' | 'weekly' | 'never';
  };
  notificationsEmail?: boolean;
  notificationsPush?: boolean;
  notificationsDigest?: 'daily' | 'weekly' | 'never' | string;
  themePreference?: 'light' | 'dark' | 'system';
  lastActive?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CaseMember {
  id?: string;
  caseId: string;
  userId: string;
  role: 'Lead' | 'Associate' | 'Paralegal' | 'Observer' | string;
  joinedAt: string;
  user?: User; // Hydrated user object
  createdAt?: string;
  updatedAt?: string;
}

export interface Party {
  id: string;
  name: string;
  role: string;
  contact: string;
  type: 'Individual' | 'Corporation' | 'Government' | string;
  counsel?: string;
  // Backend relation fields
  caseId?: string;
  // Link party to an organization record if they are a client/entity in the system
  linkedOrgId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  status: 'Active' | 'Prospect' | 'Former';
  totalBilled: number;
  matters: string[];
  riskScore?: number;
  orgId?: string; // Link CRM client to Organization entity
}

export interface TimeEntry {
  id: string;
  caseId: string;
  date: string;
  duration: number; // minutes
  description: string;
  rate: number;
  total: number;
  status: 'Unbilled' | 'Billed';
  userId?: string;
}

export interface ClauseVersion {
  id: string;
  version: number;
  content: string;
  author: string;
  date: string;
}

export interface Clause {
  id: string; 
  name: string; 
  category: string; 
  content: string;
  version: number; 
  usageCount: number; 
  lastUpdated: string; 
  riskRating: 'Low'|'Medium'|'High';
  versions: ClauseVersion[];
}

export interface Case {
  id: string;
  title: string;
  // Backend uses 'client_name', frontend uses 'client' for display
  client?: string;
  clientName?: string;
  opposingCounsel?: string;
  status: CaseStatus | string;
  filingDate?: string;
  description?: string;
  value?: number;
  matterType?: MatterType | string;
  jurisdiction?: string;
  court?: string;
  parties?: Party[];
  billingModel?: BillingModel | string;
  judge?: string;
  // Hierarchy Links
  ownerOrgId?: string;
  assignedGroupIds?: string[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  // Hydrated relations
  organization?: Organization;
  caseMembers?: CaseMember[];
}

export interface DocumentVersion {
  id: string;
  documentId?: string;
  versionNumber: number;
  uploadDate: string;
  uploadedBy: string;
  summary?: string;
  contentSnapshot?: string;
  filePath?: string;
  fileSize?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LegalDocument {
  id: string;
  caseId?: string;
  title: string;
  // Backend uses 'filename', frontend may also need it
  filename?: string;
  type: string;
  content?: string;
  uploadDate?: string;
  summary?: string;
  description?: string;
  riskScore?: number;
  // Backend stores tags as comma-separated string; frontend may use array
  tags?: string[] | string;
  versions?: DocumentVersion[];
  lastModified?: string;
  // Backend specific fields
  filePath?: string;
  mimeType?: string;
  version?: number;
  versionNotes?: string;
  classification?: string;
  // Enterprise Features
  sourceModule?: 'Evidence' | 'Discovery' | 'Billing' | 'General' | string;
  status?: 'Draft' | 'Final' | 'Signed' | 'Pending OCR' | 'draft' | 'final' | 'signed' | string;
  isEncrypted?: boolean;
  sharedWithClient?: boolean;
  // File size - backend uses number (bytes), frontend may format as string
  fileSize?: string | number;
  uploadedBy?: string;
  createdBy?: string;
  modifiedBy?: string;
  ownerOrgId?: string;
  createdAt?: string;
  updatedAt?: string;
  // Hydrated relations
  case?: Case;
  creator?: User;
  modifier?: User;
  organization?: Organization;
}

export interface WorkflowTask {
  id: string; 
  title: string; 
  status: 'Pending'|'In Progress'|'Review'|'Done';
  assignee: string; 
  dueDate: string; 
  priority: 'High'|'Medium'|'Low'; 
  caseId?: string;
  slaWarning?: boolean; 
  automatedTrigger?: string;
  // New Module Linking
  relatedModule?: 'Documents' | 'Billing' | 'Discovery' | 'Motions' | 'Evidence';
  actionLabel?: string;
  description?: string;
  createdBy?: string;
}

export interface WorkflowStage {
  id: string; title: string; status: 'Pending'|'Active'|'Completed'; tasks: WorkflowTask[];
}

export interface SearchResult { title: string; url: string; snippet: string; }

export interface ResearchSession {
  id: string; query: string; response: string; sources: SearchResult[];
  timestamp: string; feedback?: 'positive'|'negative';
  userId?: string;
}

export interface TimelineEvent {
  id: string; date: string; title: string;
  type: 'document' | 'task' | 'billing' | 'milestone' | 'system' | 'motion' | 'hearing';
  description?: string; user?: string;
  relatedId?: string;
}

// --- NEW ENTERPRISE TYPES ---

export interface JudgeProfile {
  id: string; name: string; court: string;
  grantRateDismiss: number; // %
  grantRateSummary: number; // %
  avgCaseDuration: number; // days
  tendencies: string[];
}

export interface OpposingCounselProfile {
  name: string; firm: string;
  settlementRate: number; // %
  trialRate: number; // %
  avgSettlementVariance: number; // % vs expected
}

export interface ConflictCheck {
  id: string; entityName: string; date: string; status: 'Cleared' | 'Flagged' | 'Review';
  foundIn: string[]; checkedBy: string;
}

export interface EthicalWall {
  id: string; caseId: string; title: string;
  restrictedGroups: string[]; authorizedUsers: string[];
  status: 'Active' | 'Archived';
}

export interface AuditLogEntry {
  id: string; timestamp: string; user: string; action: string; resource: string; ip: string;
}

export interface Playbook {
  id: string; name: string; jurisdiction: string; matterType: MatterType;
  stages: WorkflowStage[];
}

// --- MOTIONS & DOCKET ---

export type MotionType = 'Dismiss' | 'Summary Judgment' | 'Compel Discovery' | 'In Limine' | 'Continuance' | 'Sanctions';
export type MotionStatus = 'Draft' | 'Filed' | 'Opposition Served' | 'Reply Served' | 'Hearing Set' | 'Submitted' | 'Decided';

export interface Motion {
  id: string;
  caseId: string;
  title: string;
  type: MotionType;
  status: MotionStatus;
  filingDate?: string;
  hearingDate?: string;
  outcome?: string;
  documents?: string[]; // IDs of linked docs
  assignedAttorney?: string;
  oppositionDueDate?: string;
  replyDueDate?: string;
  createdBy?: string;
}

// --- DISCOVERY & EVIDENCE ---

export type DiscoveryType = 'Production' | 'Interrogatory' | 'Admission' | 'Deposition';
export type DiscoveryStatus = 'Draft' | 'Served' | 'Responded' | 'Overdue' | 'Closed';

export interface DiscoveryRequest {
  id: string;
  caseId: string;
  type: DiscoveryType;
  propoundingParty: string; // Who asked
  respondingParty: string; // Who answers
  serviceDate: string;
  dueDate: string;
  status: DiscoveryStatus;
  title: string;
  description: string;
  responsePreview?: string;
}

export type EvidenceType = 'Physical' | 'Digital' | 'Document' | 'Testimony' | 'Forensic';
export type AdmissibilityStatus = 'Admissible' | 'Challenged' | 'Inadmissible' | 'Pending';

export interface ChainOfCustodyEvent {
  id: string;
  date: string;
  action: string;
  actor: string;
  notes?: string;
}

export interface FileChunk {
  id: string;
  pageNumber: number;
  contentPreview: string;
  hash: string;
}

export interface EvidenceItem {
  id: string;
  trackingUuid: string; // New: Unique Lifecycle ID
  blockchainHash?: string; // New: Immutable Record
  caseId: string;
  title: string;
  type: EvidenceType;
  fileType?: string; // pdf, docx, etc.
  fileSize?: string;
  description: string;
  collectionDate: string;
  collectedBy: string;
  collectedByUserId?: string;
  custodian: string;
  location: string;
  admissibility: AdmissibilityStatus;
  chainOfCustody: ChainOfCustodyEvent[];
  tags: string[];
  chunks?: FileChunk[]; // New: Split documents
}

// --- MESSAGING ---

export interface Attachment {
  name: string;
  type: 'doc' | 'image';
  size: string;
  sender?: string;
  date?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: Attachment[];
  isPrivileged?: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  role: string;
  isExternal: boolean;
  unread: number;
  status: 'online' | 'offline' | 'away';
  draft?: string;
  messages: Message[];
}

export interface Jurisdiction {
  id: string;
  name: string;
  type: 'Federal' | 'State' | 'Regulatory';
  parentId?: string;
  metadata: any;
}

export interface KnowledgeItem {
  id: string;
  title: string;
  category: 'Playbook' | 'Q&A' | 'Precedent';
  summary: string;
  content: string;
  tags: string[];
  author: string;
  lastUpdated: string;
  metadata: any;
}

export interface ResearchSession {
  id: string;
  query: string;
  response: string;
  sources: { title: string; url: string; snippet: string }[];
  timestamp: string;
  feedback?: 'positive' | 'negative';
}

