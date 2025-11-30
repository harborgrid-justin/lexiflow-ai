/**
 * Type Transformation Utilities
 * Convert between snake_case (API) and camelCase (Frontend)
 */

import {
  ApiUser,
  ApiCase,
  ApiDocument,
  ApiDocumentVersion,
  ApiEvidence,
  ApiTask,
  ApiMotion,
  ApiDiscoveryRequest,
  ApiClient,
  ApiOrganization,
  ApiParty,
  ApiCaseMember,
} from '../shared-types';

import {
  User,
  Case,
  LegalDocument,
  DocumentVersion,
  EvidenceItem,
  WorkflowTask,
  Motion,
  DiscoveryRequest,
  Client,
  Organization,
  Party,
  CaseMember,
} from '../types';

/**
 * Convert snake_case string to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase string to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Deep convert object keys from snake_case to camelCase
 */
export function objectSnakeToCamel<T = any>(obj: any): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(objectSnakeToCamel) as any;

  const result: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const camelKey = snakeToCamel(key);
      result[camelKey] = objectSnakeToCamel(obj[key]);
    }
  }
  return result;
}

/**
 * Deep convert object keys from camelCase to snake_case
 */
export function objectCamelToSnake<T = any>(obj: any): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(objectCamelToSnake) as any;

  const result: any = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeKey = camelToSnake(key);
      result[snakeKey] = objectCamelToSnake(obj[key]);
    }
  }
  return result;
}

/**
 * Transform ApiUser to frontend User format
 */
export function transformApiUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.role,
    position: apiUser.position,
    office: apiUser.office || apiUser.position,
    barAdmission: apiUser.bar_admission,
    barNumber: apiUser.bar_number,
    phone: apiUser.phone,
    expertise: apiUser.expertise,
    organizationId: apiUser.organization_id,
    orgId: apiUser.organization_id, // Alias for compatibility
    userType: (apiUser.user_type as 'Internal' | 'External') || 'Internal',
    avatar: apiUser.avatar,
    status: apiUser.status as any,
    lastActive: typeof apiUser.last_active === 'string'
      ? apiUser.last_active
      : apiUser.last_active?.toISOString(),
    createdAt: typeof apiUser.created_at === 'string'
      ? apiUser.created_at
      : apiUser.created_at?.toISOString(),
    updatedAt: typeof apiUser.updated_at === 'string'
      ? apiUser.updated_at
      : apiUser.updated_at?.toISOString(),
  };
}

/**
 * Transform ApiParty to frontend Party format
 */
export function transformApiParty(apiParty: ApiParty): Party {
  return {
    id: apiParty.id,
    name: apiParty.name,
    role: apiParty.role,
    contact: apiParty.contact,
    type: apiParty.type,
    counsel: apiParty.counsel,
    caseId: apiParty.case_id,
    linkedOrgId: apiParty.linked_org_id,
    createdAt: typeof apiParty.created_at === 'string'
      ? apiParty.created_at
      : apiParty.created_at?.toISOString(),
    updatedAt: typeof apiParty.updated_at === 'string'
      ? apiParty.updated_at
      : apiParty.updated_at?.toISOString(),
  };
}

/**
 * Transform ApiCaseMember to frontend CaseMember format
 */
export function transformApiCaseMember(apiMember: ApiCaseMember): CaseMember {
  return {
    id: apiMember.id,
    caseId: apiMember.case_id,
    userId: apiMember.user_id,
    role: apiMember.role,
    joinedAt: typeof apiMember.joined_at === 'string'
      ? apiMember.joined_at
      : apiMember.joined_at?.toISOString(),
    user: apiMember.user ? transformApiUser(apiMember.user) : undefined,
    createdAt: typeof apiMember.created_at === 'string'
      ? apiMember.created_at
      : apiMember.created_at?.toISOString(),
    updatedAt: typeof apiMember.updated_at === 'string'
      ? apiMember.updated_at
      : apiMember.updated_at?.toISOString(),
  };
}

/**
 * Transform ApiCase to frontend Case format
 */
export function transformApiCase(apiCase: ApiCase): Case {
  return {
    id: apiCase.id,
    title: apiCase.title,
    client: apiCase.client_name,
    clientName: apiCase.client_name,
    opposingCounsel: apiCase.opposing_counsel,
    status: apiCase.status,
    filingDate: typeof apiCase.filing_date === 'string'
      ? apiCase.filing_date
      : apiCase.filing_date?.toISOString(),
    description: apiCase.description,
    value: apiCase.value,
    matterType: apiCase.matter_type,
    jurisdiction: apiCase.jurisdiction,
    court: apiCase.court,
    billingModel: apiCase.billing_model,
    judge: apiCase.judge,
    ownerOrgId: apiCase.owner_org_id,
    createdBy: apiCase.created_by,
    parties: apiCase.parties?.map(transformApiParty),
    caseMembers: apiCase.case_members?.map(transformApiCaseMember),
    createdAt: typeof apiCase.created_at === 'string'
      ? apiCase.created_at
      : apiCase.created_at?.toISOString(),
    updatedAt: typeof apiCase.updated_at === 'string'
      ? apiCase.updated_at
      : apiCase.updated_at?.toISOString(),
  };
}

/**
 * Transform ApiDocumentVersion to frontend DocumentVersion format
 */
export function transformApiDocumentVersion(apiVersion: ApiDocumentVersion): DocumentVersion {
  return {
    id: apiVersion.id,
    documentId: apiVersion.document_id,
    versionNumber: apiVersion.version_number,
    uploadDate: typeof apiVersion.upload_date === 'string'
      ? apiVersion.upload_date
      : apiVersion.upload_date?.toISOString(),
    uploadedBy: apiVersion.uploaded_by,
    summary: apiVersion.summary,
    contentSnapshot: apiVersion.content_snapshot,
    filePath: apiVersion.file_path,
    fileSize: apiVersion.file_size,
    createdAt: typeof apiVersion.created_at === 'string'
      ? apiVersion.created_at
      : apiVersion.created_at?.toISOString(),
    updatedAt: typeof apiVersion.updated_at === 'string'
      ? apiVersion.updated_at
      : apiVersion.updated_at?.toISOString(),
  };
}

/**
 * Transform ApiDocument to frontend LegalDocument format
 */
export function transformApiDocument(apiDoc: ApiDocument): LegalDocument {
  return {
    id: apiDoc.id,
    caseId: apiDoc.case_id,
    title: apiDoc.title,
    filename: apiDoc.filename,
    type: apiDoc.type,
    content: apiDoc.content,
    uploadDate: typeof apiDoc.upload_date === 'string'
      ? apiDoc.upload_date
      : apiDoc.upload_date?.toISOString() || (typeof apiDoc.created_at === 'string'
        ? apiDoc.created_at
        : apiDoc.created_at?.toISOString()),
    summary: apiDoc.summary,
    description: apiDoc.description,
    riskScore: apiDoc.risk_score,
    tags: apiDoc.tags ? apiDoc.tags.split(',').map(t => t.trim()) : [],
    versions: apiDoc.versions?.map(transformApiDocumentVersion),
    lastModified: typeof apiDoc.last_modified === 'string'
      ? apiDoc.last_modified
      : apiDoc.last_modified?.toISOString() || (typeof apiDoc.updated_at === 'string'
        ? apiDoc.updated_at
        : apiDoc.updated_at?.toISOString()),
    filePath: apiDoc.file_path,
    mimeType: apiDoc.mime_type,
    version: apiDoc.version,
    versionNotes: apiDoc.version_notes,
    classification: apiDoc.classification,
    sourceModule: apiDoc.source_module,
    status: apiDoc.status,
    isEncrypted: apiDoc.is_encrypted,
    sharedWithClient: apiDoc.shared_with_client,
    fileSize: apiDoc.file_size,
    uploadedBy: apiDoc.uploaded_by,
    createdBy: apiDoc.created_by,
    modifiedBy: apiDoc.modified_by,
    ownerOrgId: apiDoc.owner_org_id,
    createdAt: typeof apiDoc.created_at === 'string'
      ? apiDoc.created_at
      : apiDoc.created_at?.toISOString(),
    updatedAt: typeof apiDoc.updated_at === 'string'
      ? apiDoc.updated_at
      : apiDoc.updated_at?.toISOString(),
  };
}

/**
 * Transform ApiEvidence to frontend EvidenceItem format
 */
export function transformApiEvidence(apiEvidence: ApiEvidence): EvidenceItem {
  return {
    id: apiEvidence.id,
    trackingUuid: apiEvidence.id, // Use ID as tracking UUID for now
    caseId: apiEvidence.case_id || '',
    title: apiEvidence.title,
    type: apiEvidence.type as any,
    description: apiEvidence.description || '',
    collectionDate: typeof apiEvidence.collected_date === 'string'
      ? apiEvidence.collected_date
      : apiEvidence.collected_date?.toISOString() || '',
    collectedBy: apiEvidence.collected_by || '',
    collectedByUserId: apiEvidence.custodian_id,
    custodian: apiEvidence.collected_by || '',
    location: apiEvidence.location || '',
    admissibility: 'Pending' as any, // Default value
    chainOfCustody: [], // Would need separate API call
    tags: apiEvidence.tags ? apiEvidence.tags.split(',').map(t => t.trim()) : [],
  };
}

/**
 * Transform ApiTask to frontend WorkflowTask format
 */
export function transformApiTask(apiTask: ApiTask): WorkflowTask {
  return {
    id: apiTask.id,
    title: apiTask.title,
    status: apiTask.status as any,
    assignee: '', // Would need to resolve from assignee_id
    dueDate: typeof apiTask.due_date === 'string' ? apiTask.due_date : apiTask.due_date?.toISOString() || '',
    priority: apiTask.priority as any,
    caseId: apiTask.case_id,
    description: apiTask.description,
    createdBy: apiTask.created_by,
  };
}

/**
 * Transform ApiMotion to frontend Motion format
 */
export function transformApiMotion(apiMotion: ApiMotion): Motion {
  return {
    id: apiMotion.id,
    caseId: apiMotion.case_id,
    title: apiMotion.title,
    type: apiMotion.motion_type as any,
    status: apiMotion.status as any,
    filingDate: typeof apiMotion.filed_date === 'string' ? apiMotion.filed_date : apiMotion.filed_date?.toISOString(),
    hearingDate: typeof apiMotion.hearing_date === 'string' ? apiMotion.hearing_date : apiMotion.hearing_date?.toISOString(),
    outcome: apiMotion.outcome,
    assignedAttorney: apiMotion.filed_by,
    createdBy: apiMotion.filed_by,
  };
}

/**
 * Transform ApiDiscoveryRequest to frontend DiscoveryRequest format
 */
export function transformApiDiscovery(apiDiscovery: ApiDiscoveryRequest): DiscoveryRequest {
  return {
    id: apiDiscovery.id,
    caseId: apiDiscovery.case_id,
    type: apiDiscovery.request_type as any,
    propoundingParty: 'Us', // Default - would need more context
    respondingParty: apiDiscovery.recipient,
    serviceDate: typeof apiDiscovery.served_date === 'string' ? apiDiscovery.served_date : apiDiscovery.served_date?.toISOString() || '',
    dueDate: typeof apiDiscovery.due_date === 'string' ? apiDiscovery.due_date : apiDiscovery.due_date?.toISOString() || '',
    status: apiDiscovery.status as any,
    title: apiDiscovery.title,
    description: apiDiscovery.description || '',
    responsePreview: apiDiscovery.response_notes,
  };
}

/**
 * Transform ApiClient to frontend Client format
 */
export function transformApiClient(apiClient: ApiClient): Client {
  return {
    id: apiClient.id,
    name: apiClient.name,
    industry: apiClient.industry || '',
    status: apiClient.status as any,
    totalBilled: 0, // Not in API response
    matters: [], // Not in API response
  };
}

/**
 * Transform ApiOrganization to frontend Organization format
 */
export function transformApiOrganization(apiOrg: ApiOrganization): Organization {
  return {
    id: apiOrg.id,
    name: apiOrg.name,
    type: apiOrg.type as any,
    domain: apiOrg.domain || apiOrg.website,
    logo: apiOrg.logo,
    status: apiOrg.status as any,
    address: apiOrg.address,
    phone: apiOrg.phone,
    email: apiOrg.email,
    website: apiOrg.website,
    subscriptionTier: apiOrg.subscription_tier,
    practiceAreas: apiOrg.practice_areas,
    taxId: apiOrg.tax_id,
    createdAt: typeof apiOrg.created_at === 'string'
      ? apiOrg.created_at
      : apiOrg.created_at?.toISOString(),
    updatedAt: typeof apiOrg.updated_at === 'string'
      ? apiOrg.updated_at
      : apiOrg.updated_at?.toISOString(),
  };
}

/**
 * Batch transformation utilities
 */
export const transformers = {
  users: (apiUsers: ApiUser[]): User[] => apiUsers.map(transformApiUser),
  cases: (apiCases: ApiCase[]): Case[] => apiCases.map(transformApiCase),
  documents: (apiDocs: ApiDocument[]): LegalDocument[] => apiDocs.map(transformApiDocument),
  documentVersions: (apiVersions: ApiDocumentVersion[]): DocumentVersion[] => apiVersions.map(transformApiDocumentVersion),
  evidence: (apiEvidence: ApiEvidence[]): EvidenceItem[] => apiEvidence.map(transformApiEvidence),
  tasks: (apiTasks: ApiTask[]): WorkflowTask[] => apiTasks.map(transformApiTask),
  motions: (apiMotions: ApiMotion[]): Motion[] => apiMotions.map(transformApiMotion),
  discovery: (apiDiscovery: ApiDiscoveryRequest[]): DiscoveryRequest[] => apiDiscovery.map(transformApiDiscovery),
  clients: (apiClients: ApiClient[]): Client[] => apiClients.map(transformApiClient),
  organizations: (apiOrgs: ApiOrganization[]): Organization[] => apiOrgs.map(transformApiOrganization),
  parties: (apiParties: ApiParty[]): Party[] => apiParties.map(transformApiParty),
  caseMembers: (apiMembers: ApiCaseMember[]): CaseMember[] => apiMembers.map(transformApiCaseMember),
};
