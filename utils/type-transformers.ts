/**
 * Type Transformation Utilities
 * Convert between snake_case (API) and camelCase (Frontend)
 */

import {
  ApiUser,
  ApiCase,
  ApiDocument,
  ApiEvidence,
  ApiTask,
  ApiMotion,
  ApiDiscoveryRequest,
  ApiClient,
  ApiOrganization,
} from '../shared-types';

import {
  User,
  Case,
  LegalDocument,
  EvidenceItem,
  WorkflowTask,
  Motion,
  DiscoveryRequest,
  Client,
  Organization,
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
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.role as any, // Type assertion - backend role strings may differ
    office: apiUser.position,
    orgId: apiUser.organization_id,
    userType: 'Internal', // Default value
    avatar: undefined, // Not in API response
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
    opposingCounsel: apiCase.opposing_counsel || '',
    status: apiCase.status as any,
    filingDate: typeof apiCase.filing_date === 'string' ? apiCase.filing_date : apiCase.filing_date?.toISOString() || '',
    description: apiCase.description || '',
    value: apiCase.value || 0,
    matterType: apiCase.matter_type as any,
    jurisdiction: apiCase.jurisdiction,
    court: apiCase.court,
    billingModel: apiCase.billing_model as any,
    judge: apiCase.judge,
    ownerOrgId: apiCase.owner_org_id,
  };
}

/**
 * Transform ApiDocument to frontend LegalDocument format
 */
export function transformApiDocument(apiDoc: ApiDocument): LegalDocument {
  return {
    id: apiDoc.id,
    caseId: apiDoc.case_id || '',
    title: apiDoc.title,
    type: apiDoc.type,
    content: '', // Content not returned in list responses
    uploadDate: typeof apiDoc.created_at === 'string' ? apiDoc.created_at : apiDoc.created_at?.toISOString() || '',
    summary: apiDoc.description,
    riskScore: undefined, // Not in API response
    tags: apiDoc.tags ? apiDoc.tags.split(',').map(t => t.trim()) : [],
    versions: [], // Would need separate API call
    lastModified: typeof apiDoc.updated_at === 'string' ? apiDoc.updated_at : apiDoc.updated_at?.toISOString() || '',
    status: apiDoc.status as any,
    fileSize: apiDoc.file_size ? `${Math.round(apiDoc.file_size / 1024)} KB` : undefined,
    uploadedBy: apiDoc.created_by,
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
    domain: apiOrg.website || '',
    status: apiOrg.status as any,
    logo: undefined, // Not in API response
  };
}

/**
 * Batch transformation utilities
 */
export const transformers = {
  users: (apiUsers: ApiUser[]): User[] => apiUsers.map(transformApiUser),
  cases: (apiCases: ApiCase[]): Case[] => apiCases.map(transformApiCase),
  documents: (apiDocs: ApiDocument[]): LegalDocument[] => apiDocs.map(transformApiDocument),
  evidence: (apiEvidence: ApiEvidence[]): EvidenceItem[] => apiEvidence.map(transformApiEvidence),
  tasks: (apiTasks: ApiTask[]): WorkflowTask[] => apiTasks.map(transformApiTask),
  motions: (apiMotions: ApiMotion[]): Motion[] => apiMotions.map(transformApiMotion),
  discovery: (apiDiscovery: ApiDiscoveryRequest[]): DiscoveryRequest[] => apiDiscovery.map(transformApiDiscovery),
  clients: (apiClients: ApiClient[]): Client[] => apiClients.map(transformApiClient),
  organizations: (apiOrgs: ApiOrganization[]): Organization[] => apiOrgs.map(transformApiOrganization),
};
