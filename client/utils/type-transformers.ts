/**
 * Type Transformation Utilities
 * Convert between snake_case (API) and camelCase (Frontend)
 */

/**
 * Safely convert tags to array format
 * Handles: undefined, null, string, array
 */
export function ensureTagsArray(tags: unknown): string[] {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter(t => typeof t === 'string');
  if (typeof tags === 'string') return tags.split(',').map(t => t.trim()).filter(Boolean);
  return [];
}

/**
 * Safely convert a value to a number
 * Handles: undefined, null, string (DECIMAL from PostgreSQL), number
 */
export function toNumber(val: unknown): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return parseFloat(val) || 0;
  return 0;
}

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
  ApiMessage,
  ApiConversation,
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
  Message,
  Conversation,
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
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
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
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
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
    tags: ensureTagsArray(apiDoc.tags),
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
 * Handles the case where custodian is a hydrated User object from Sequelize associations
 */
export function transformApiEvidence(apiEvidence: ApiEvidence): EvidenceItem {
  // Extract custodian name - handle both string and User object cases
  let custodianName = '';
  if (apiEvidence.custodian && typeof apiEvidence.custodian === 'object') {
    // Custodian is a hydrated User object
    custodianName = apiEvidence.custodian.name ||
      `${apiEvidence.custodian.first_name || ''} ${apiEvidence.custodian.last_name || ''}`.trim();
  } else if (typeof apiEvidence.collected_by === 'string') {
    custodianName = apiEvidence.collected_by;
  }

  // Extract collectedBy - prefer the string field, fallback to custodian name
  const collectedBy = apiEvidence.collected_by || custodianName;

  return {
    id: apiEvidence.id,
    trackingUuid: apiEvidence.tracking_uuid || apiEvidence.id,
    blockchainHash: apiEvidence.blockchain_hash,
    caseId: apiEvidence.case_id || '',
    title: apiEvidence.title,
    type: apiEvidence.type as any,
    fileType: apiEvidence.file_type,
    fileSize: apiEvidence.file_size,
    description: apiEvidence.description || '',
    collectionDate: typeof apiEvidence.collected_date === 'string'
      ? apiEvidence.collected_date
      : apiEvidence.collected_date?.toISOString() || '',
    collectedBy: collectedBy,
    collectedByUserId: apiEvidence.collected_by_user_id || apiEvidence.custodian_id,
    custodian: custodianName,
    location: apiEvidence.location || '',
    admissibility: (apiEvidence.admissibility_status as any) || 'Pending',
    chainOfCustody: (apiEvidence.chainOfCustody || []).map(event => ({
      id: event.id,
      date: typeof event.timestamp === 'string' ? event.timestamp : event.timestamp?.toISOString() || '',
      action: event.action,
      actor: event.actor,
      notes: event.notes,
    })),
    tags: ensureTagsArray(apiEvidence.tags),
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
 * Transform ApiMessage to frontend Message format
 */
export function transformApiMessage(apiMessage: ApiMessage): Message {
  return {
    id: apiMessage.id,
    senderId: apiMessage.sender_id,
    text: apiMessage.content,
    timestamp: typeof apiMessage.created_at === 'string'
      ? apiMessage.created_at
      : apiMessage.created_at?.toISOString() || new Date().toISOString(),
    status: apiMessage.status as 'sent' | 'delivered' | 'read',
    attachments: apiMessage.attachments,
    isPrivileged: false, // Default - not in API
  };
}

/**
 * Transform ApiConversation to frontend Conversation format
 * Fetches messages separately if needed
 */
export function transformApiConversation(
  apiConv: ApiConversation,
  messages: ApiMessage[] = []
): Conversation {
  return {
    id: apiConv.id,
    name: apiConv.title || 'Untitled Conversation',
    role: apiConv.type || 'Case Discussion',
    isExternal: apiConv.type === 'external',
    unread: 0, // Would need to be calculated
    status: apiConv.status === 'active' ? 'online' : 'offline',
    messages: messages.map(transformApiMessage),
    draft: undefined,
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
