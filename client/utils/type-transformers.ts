/**
 * Type Transformation Utilities
 * Convert between snake_case (API) and camelCase (Frontend)
 * 
 * This module re-exports all transformer functions from modular files.
 */

// Export string conversion utilities
export * from './transformers/string-utils';

// Export core entity transformers
export * from './transformers/core-transformers';

// Export document transformers
export * from './transformers/document-transformers';

// Export workflow transformers
export * from './transformers/workflow-transformers';

// Export litigation transformers
export * from './transformers/litigation-transformers';

// Export messaging transformers
export * from './transformers/messaging-transformers';

// Import types for batch transformers
import type {
  ApiUser, ApiCase, ApiDocument, ApiDocumentVersion, ApiEvidence,
  ApiTask, ApiWorkflowStage, ApiMotion, ApiDiscovery,
  ApiParty, ApiCaseMember, ApiOrganization
} from '../shared-types';

import type {
  User, Case, LegalDocument, DocumentVersion, EvidenceItem,
  WorkflowTask, WorkflowStage, Motion, DiscoveryRequest, Client,
  Organization, Party, CaseMember
} from '../types';

import {
  transformApiUser, transformApiCase, transformApiOrganization, transformApiParty,
  transformApiCaseMember
} from './transformers/core-transformers';

import { transformApiDocument, transformApiDocumentVersion, transformApiEvidence } from './transformers/document-transformers';
import { transformApiTask, transformApiWorkflowStage } from './transformers/workflow-transformers';
import { transformApiMotion, transformApiDiscovery } from './transformers/litigation-transformers';
import { transformApiClient } from './transformers/messaging-transformers';

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
  workflowStages: (apiStages: ApiWorkflowStage[]): WorkflowStage[] => apiStages.map(transformApiWorkflowStage),
  motions: (apiMotions: ApiMotion[]): Motion[] => apiMotions.map(transformApiMotion),
  discovery: (apiDiscovery: ApiDiscovery[]): DiscoveryRequest[] => apiDiscovery.map(transformApiDiscovery),
  clients: (apiClients: any[]): Client[] => apiClients.map(transformApiClient),
  organizations: (apiOrgs: ApiOrganization[]): Organization[] => apiOrgs.map(transformApiOrganization),
  parties: (apiParties: ApiParty[]): Party[] => apiParties.map(transformApiParty),
  caseMembers: (apiMembers: ApiCaseMember[]): CaseMember[] => apiMembers.map(transformApiCaseMember),
};
