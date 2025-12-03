// Enzyme Service Index for LexiFlow
// Central export for all Enzyme-based API utilities

// Core client
export { enzymeClient, createScopedClient, isApiError } from './client';
export type { ApiClientConfig, ApiError } from './client';

// React hooks - Custom simplified hooks with enhanced features
export {
  useApiRequest,
  useApiMutation,
  useLazyApiRequest,
  invalidateCache,
  clearCache,
} from './hooks';

// Hook types and interfaces
export type {
  UseApiRequestOptions,
  UseApiRequestResult,
  UseApiMutationOptions,
  UseApiMutationResult,
  UseLazyApiRequestResult,
} from './hooks';

// Re-export Enzyme's built-in hooks for advanced use cases
export {
  useEnzymeApiRequest,
  useEnzymeApiMutation,
  useGet,
  useGetById,
  useGetList,
  usePost,
  usePut,
  usePatch,
  useDelete,
  usePolling,
  usePrefetch,
  useLazyQuery,
  useApiHealth,
  useApiConnectivity,
} from './hooks';

// ============================================================================
// Enzyme Services - Type-safe API services with retry, rate limiting, etc.
// ============================================================================

// Cases Service
export { enzymeCasesService } from './cases.service';

// Documents Service
export { enzymeDocumentsService } from './documents.service';

// Users Service
export { enzymeUsersService } from './users.service';

// Workflow Service
export { enzymeWorkflowService } from './workflow.service';

// Evidence Service
export { enzymeEvidenceService } from './evidence.service';

// Billing Service
export { enzymeBillingService } from './billing.service';

// Discovery Service
export { enzymeDiscoveryService } from './discovery.service';

// Messages Service
export { enzymeMessagesService } from './messages.service';

// Search Service
export { enzymeSearchService } from './search.service';

// Calendar Service
export { enzymeCalendarService } from './calendar.service';

// Motions Service
export { enzymeMotionsService } from './motions.service';

// Tasks Service
export { enzymeTasksService } from './tasks.service';

// Settings Service
export { enzymeSettingsService } from './settings.service';

// Research Service
export { enzymeResearchService } from './research.service';

// Docket Service
export { enzymeDocketService } from './docket.service';

// Argument Service
export { enzymeArgumentService } from './argument.service';

// Defense Service
export { enzymeDefenseService } from './defense.service';

// Game Theory Service
export { enzymeGameTheoryService } from './gametheory.service';

// War Room Service
export { enzymeWarRoomService } from './warroom.service';

// Citation Service
export { enzymeCitationService } from './citation.service';

// Reference Service
export { enzymeReferenceService } from './reference.service';

// Formatting Service
export { enzymeFormattingService } from './formatting.service';

// Linking Service
export { enzymeLinkingService } from './linking.service';

// Auth Service
export { enzymeAuthService } from './auth.service';

// Misc Services (Organizations, Clients, Analytics, etc.)
export {
  enzymeOrganizationsService,
  enzymeClientsService,
  enzymeAnalyticsService,
  enzymeComplianceService,
  enzymeKnowledgeService,
  enzymeJurisdictionsService,
  enzymeClausesService,
  enzymeGroupsService,
  enzymeAuditService,
  enzymePartiesService,
  enzymeUserProfilesService,
} from './misc.service';

// ============================================================================
// Consolidated Enzyme API Service
// ============================================================================

import { enzymeCasesService } from './cases.service';
import { enzymeDocumentsService } from './documents.service';
import { enzymeUsersService } from './users.service';
import { enzymeWorkflowService } from './workflow.service';
import { enzymeEvidenceService } from './evidence.service';
import { enzymeBillingService } from './billing.service';
import { enzymeDiscoveryService } from './discovery.service';
import { enzymeMessagesService } from './messages.service';
import { enzymeSearchService } from './search.service';
import { enzymeCalendarService } from './calendar.service';
import { enzymeMotionsService } from './motions.service';
import { enzymeTasksService } from './tasks.service';
import { enzymeSettingsService } from './settings.service';
import { enzymeResearchService } from './research.service';
import { enzymeAuthService } from './auth.service';
import {
  enzymeOrganizationsService,
  enzymeClientsService,
  enzymeAnalyticsService,
  enzymeComplianceService,
  enzymeKnowledgeService,
  enzymeJurisdictionsService,
  enzymeClausesService,
  enzymeGroupsService,
  enzymeAuditService,
  enzymePartiesService,
  enzymeUserProfilesService,
} from './misc.service';

import { enzymeNotificationsService } from './notifications.service';
import { enzymeDocketService } from './docket.service';
import { enzymeArgumentService } from './argument.service';
import { enzymeDefenseService } from './defense.service';
import { enzymeGameTheoryService } from './gametheory.service';
import { enzymeWarRoomService } from './warroom.service';
import { enzymeCitationService } from './citation.service';
import { enzymeReferenceService } from './reference.service';
import { enzymeFormattingService } from './formatting.service';
import { enzymeLinkingService } from './linking.service';

/**
 * Main Enzyme API Service Object
 * Aggregates all domain-specific services into a single access point.
 *
 * Usage:
 * ```typescript
 * import { EnzymeApiService } from '@/enzyme/services';
 *
 * // Documents
 * const docs = await EnzymeApiService.documents.getAll({ caseId: 'case-123' });
 *
 * // Auth
 * await EnzymeApiService.auth.login('user@example.com', 'password');
 * ```
 */
export const EnzymeApiService = {
  // Core Services
  auth: enzymeAuthService,
  cases: enzymeCasesService,
  documents: enzymeDocumentsService,
  users: enzymeUsersService,
  workflow: enzymeWorkflowService,
  evidence: enzymeEvidenceService,
  messages: enzymeMessagesService,
  notifications: enzymeNotificationsService,
  search: enzymeSearchService,
  motions: enzymeMotionsService,
  discovery: enzymeDiscoveryService,
  billing: enzymeBillingService,
  calendar: enzymeCalendarService,
  tasks: enzymeTasksService,
  settings: enzymeSettingsService,
  research: enzymeResearchService,
  docket: enzymeDocketService,
  argument: enzymeArgumentService,
  defense: enzymeDefenseService,
  gameTheory: enzymeGameTheoryService,
  warRoom: enzymeWarRoomService,
  citation: enzymeCitationService,
  reference: enzymeReferenceService,
  formatting: enzymeFormattingService,
  linking: enzymeLinkingService,

  // Additional Services
  organizations: enzymeOrganizationsService,
  clients: enzymeClientsService,
  analytics: enzymeAnalyticsService,
  compliance: enzymeComplianceService,
  knowledge: enzymeKnowledgeService,
  jurisdictions: enzymeJurisdictionsService,
  clauses: enzymeClausesService,
  groups: enzymeGroupsService,
  audit: enzymeAuditService,
  parties: enzymePartiesService,
  userProfiles: enzymeUserProfilesService,
};

export default EnzymeApiService;