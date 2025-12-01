// Shared Enums and Type Aliases
// Common status and type definitions used across the application

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
