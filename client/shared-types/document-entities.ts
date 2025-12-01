// Document and Evidence Types
// API response types for documents, evidence, and related entities

import { ApiCase, ApiUser, ApiOrganization } from './core-entities';

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
  case?: ApiCase;
  creator?: ApiUser;
  modifier?: ApiUser;
  organization?: ApiOrganization;
  versions?: ApiDocumentVersion[];
}

export interface ApiEvidence {
  id: string;
  tracking_uuid?: string;
  blockchain_hash?: string;
  title: string;
  type: string;
  status: string;
  description?: string;
  file_type?: string;
  file_size?: string;
  admissibility_status?: string;
  location?: string;
  collected_by?: string;
  collected_by_user_id?: string;
  collected_date?: Date | string;
  collection_notes?: string;
  tags?: string;
  classification?: string;
  case_id?: string;
  custodian_id?: string;
  owner_org_id?: string;
  created_at: Date | string;
  updated_at: Date | string;
  case?: ApiCase;
  custodian?: ApiUser;
  organization?: ApiOrganization;
  chainOfCustody?: Array<{
    id: string;
    action: string;
    actor: string;
    timestamp: Date | string;
    notes?: string;
  }>;
}
