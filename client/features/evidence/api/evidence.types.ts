/**
 * Evidence Feature - Type Definitions
 *
 * Re-exports and extends types from the core types module.
 */

import type { EvidenceType } from '@/types';

// Re-export core types
export type {
  EvidenceItem,
  EvidenceType,
  AdmissibilityStatus,
  ChainOfCustodyEvent,
  FileChunk
} from '@/types';

// Extended types for forensic data
export interface ForensicData {
  analysisDate?: string;
  analyst?: string;
  methodology?: string;
  findings?: string;
  integrity?: 'Verified' | 'Compromised' | 'Pending';
  hash?: string;
  metadata?: Record<string, unknown>;
}

export type ViewMode = 'dashboard' | 'inventory' | 'custody' | 'intake' | 'detail';
export type DetailTab = 'overview' | 'structure' | 'custody' | 'admissibility' | 'forensics';

export interface EvidenceFilters {
  search: string;
  type: string;
  admissibility: string;
  caseId: string;
  custodian: string;
  dateFrom: string;
  dateTo: string;
  location: string;
  tags: string;
  collectedBy: string;
  hasBlockchain: boolean;
}

export interface CreateEvidenceRequest {
  title: string;
  description: string;
  type: EvidenceType;
  caseId: string;
  collectionDate: string;
  collectedBy: string;
  custodian: string;
  location: string;
  tags?: string[];
  content?: string;
}

export interface UpdateEvidenceRequest extends Partial<CreateEvidenceRequest> {
  id: string;
}

export interface EvidenceStats {
  totalItems: number;
  physicalItems: number;
  digitalItems: number;
  documentItems: number;
  forensicItems: number;
  admissibleCount: number;
  challengedCount: number;
  pendingCount: number;
  blockchainVerifiedCount: number;
}
