/**
 * Discovery Feature - Type Definitions
 *
 * Re-exports and extends types from the core types module.
 */

// Re-export core types
export type { DiscoveryRequest } from '@/types';

export type DiscoveryView = 
  | 'dashboard' 
  | 'requests' 
  | 'privilege' 
  | 'holds' 
  | 'plan' 
  | 'doc_viewer' 
  | 'response' 
  | 'production';

export type DiscoveryRequestStatus = 
  | 'Pending' 
  | 'InProgress' 
  | 'Responded' 
  | 'Objected' 
  | 'Produced';

export type DiscoveryRequestType = 
  | 'Interrogatory' 
  | 'RFP' 
  | 'RFA' 
  | 'Subpoena' 
  | 'Deposition';

export interface DiscoveryFilters {
  search: string;
  status: string;
  type: string;
  caseId: string;
  dateFrom: string;
  dateTo: string;
}

export interface PrivilegeLogEntry {
  id: string;
  documentId: string;
  documentTitle: string;
  privilegeType: 'Attorney-Client' | 'Work Product' | 'Joint Defense' | 'Other';
  basis: string;
  reviewer: string;
  reviewDate: string;
  status: 'Claimed' | 'Waived' | 'Disputed';
}

export interface LegalHold {
  id: string;
  caseId: string;
  caseName: string;
  status: 'Active' | 'Released' | 'Pending';
  issuedDate: string;
  custodians: string[];
  description: string;
  scope: string;
  lastReminder?: string;
  acknowledgments: {
    custodian: string;
    acknowledged: boolean;
    date?: string;
  }[];
}

export interface DiscoveryProduction {
  id: string;
  requestId: string;
  productionDate: string;
  documentCount: number;
  batesStart: string;
  batesEnd: string;
  format: 'Native' | 'TIFF' | 'PDF';
  deliveryMethod: 'USB' | 'Cloud' | 'FTP';
  status: 'Pending' | 'InProgress' | 'Complete';
}

export interface CreateDiscoveryRequestInput {
  caseId: string;
  type: DiscoveryRequestType;
  title: string;
  description: string;
  dueDate: string;
  sender: string;
}

export interface UpdateDiscoveryRequestInput {
  status?: DiscoveryRequestStatus;
  responsePreview?: string;
  notes?: string;
}
