
export enum CaseStatus {
  Discovery = 'Discovery',
  Trial = 'Trial',
  Settled = 'Settled',
  Closed = 'Closed',
  Appeal = 'Appeal'
}

export type UserRole = 'Senior Partner' | 'Associate' | 'Paralegal' | 'Administrator';
export type MatterType = 'Litigation' | 'M&A' | 'IP' | 'Real Estate' | 'General';
export type BillingModel = 'Hourly' | 'Fixed' | 'Contingency' | 'Hybrid';

export interface User { id: string; name: string; role: UserRole; office?: string; }

export interface Party { 
  id: string; 
  name: string; 
  role: string; 
  contact: string; 
  type: 'Individual' | 'Corporation' | 'Government';
  counsel?: string;
}

export interface Client {
  id: string;
  name: string;
  industry: string;
  status: 'Active' | 'Prospect' | 'Former';
  totalBilled: number;
  matters: string[];
  riskScore?: number;
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
  id: string; title: string; client: string; opposingCounsel: string;
  status: CaseStatus; filingDate: string; description: string; value: number;
  matterType?: MatterType; jurisdiction?: string; court?: string; parties?: Party[];
  billingModel?: BillingModel; judge?: string;
}

export interface DocumentVersion {
  id: string; versionNumber: number; uploadDate: string; uploadedBy: string;
  summary?: string; contentSnapshot?: string; 
}

export interface LegalDocument {
  id: string; 
  caseId: string; 
  title: string; 
  type: string; 
  content: string; 
  uploadDate: string; 
  summary?: string; 
  riskScore?: number; 
  tags: string[];
  versions: DocumentVersion[]; 
  lastModified: string;
  // New Enterprise Features
  sourceModule?: 'Evidence' | 'Discovery' | 'Billing' | 'General';
  status?: 'Draft' | 'Final' | 'Signed' | 'Pending OCR';
  isEncrypted?: boolean;
  sharedWithClient?: boolean;
  fileSize?: string;
}

export interface WorkflowTask {
  id: string; title: string; status: 'Pending'|'In Progress'|'Review'|'Done';
  assignee: string; dueDate: string; priority: 'High'|'Medium'|'Low'; caseId?: string;
  slaWarning?: boolean; automatedTrigger?: string;
}

export interface WorkflowStage {
  id: string; title: string; status: 'Pending'|'Active'|'Completed'; tasks: WorkflowTask[];
}

export interface SearchResult { title: string; url: string; snippet: string; }

export interface ResearchSession {
  id: string; query: string; response: string; sources: SearchResult[];
  timestamp: string; feedback?: 'positive'|'negative';
}

export interface TimelineEvent {
  id: string; date: string; title: string;
  type: 'document' | 'task' | 'billing' | 'milestone' | 'system';
  description?: string; user?: string;
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
  custodian: string;
  location: string;
  admissibility: AdmissibilityStatus;
  chainOfCustody: ChainOfCustodyEvent[];
  tags: string[];
  chunks?: FileChunk[]; // New: Split documents
}
