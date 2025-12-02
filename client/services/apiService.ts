// LexiFlow API Service - Main Entry Point
// Consolidated API client for NestJS backend
// Backend: http://localhost:3001/api/v1

import { getAuthToken } from './config';
export { ApiError, type SemanticSearchResult, type DocumentUploadMetadata } from './api-error';

// Import all service modules
import { authService } from './api/auth.service';
import { casesService } from './api/cases.service';
import { documentsService } from './api/documents.service';
import { usersService } from './api/users.service';
import { workflowService } from './api/workflow.service';
import { evidenceService } from './api/evidence.service';
import { messagesService } from './api/messages.service';
import { searchService } from './api/search.service';
import { motionsService } from './api/motions.service';
import { discoveryService } from './api/discovery.service';
import { billingService } from './api/billing.service';
import { calendarService } from './api/calendar.service';
import { tasksService } from './api/tasks.service';
import { caseOperationsService } from './api/case-operations.service';
import {
  organizationsService,
  clientsService,
  analyticsService,
  complianceService,
  knowledgeService,
  jurisdictionsService,
  clausesService,
  groupsService,
  auditService,
  partiesService,
  userProfilesService,
} from './api/misc.service';

// Legacy imports for backward compatibility
import { User, Case, LegalDocument, EvidenceItem, Motion, DiscoveryRequest, UserProfile, ConflictCheck, EthicalWall, Client, Clause, ResearchSession, CaseMember } from '../types';
import { ApiCase, ApiUser, ApiEvidence } from '../shared-types';
import { transformApiCase, transformApiUser, transformApiEvidence } from '../utils/type-transformers';
import { fetchJson, buildQueryString, postJson, putJson, deleteJson } from './http-client';

export const ApiService = {
  // Core Services
  auth: authService,
  cases: casesService,
  documents: documentsService,
  users: usersService,
  workflow: workflowService,
  evidence: evidenceService,
  messages: messagesService,
  search: searchService,
  motions: motionsService,
  discovery: discoveryService,
  billing: billingService,
  calendar: calendarService,
  tasks: tasksService,
  caseOperations: caseOperationsService,

  // Additional Services
  organizations: organizationsService,
  clients: clientsService,
  analytics: analyticsService,
  compliance: complianceService,
  knowledge: knowledgeService,
  jurisdictions: jurisdictionsService,
  clauses: clausesService,
  groups: groupsService,
  audit: auditService,
  parties: partiesService,
  userProfiles: userProfilesService,

  // PACER Import Services
  getDocketEntries: async (caseId: string) => {
    return fetchJson(`/docket-entries?case_id=${caseId}`);
  },

  getConsolidatedCases: async (caseId: string) => {
    return fetchJson(`/consolidated-cases?case_id=${caseId}`);
  },

  getAttorneys: async (partyId: string) => {
    return fetchJson(`/attorneys?party_id=${partyId}`);
  },

  createDocketEntry: async (data: any) => {
    return postJson('/docket-entries', data);
  },

  createConsolidatedCase: async (data: any) => {
    return postJson('/consolidated-cases', data);
  },

  createAttorney: async (data: any) => {
    return postJson('/attorneys', data);
  },

  updateAttorney: async (id: string, data: any) => {
    return putJson(`/attorneys/${id}`, data);
  },

  deleteAttorney: async (id: string) => {
    return deleteJson(`/attorneys/${id}`);
  },

  // Utility Methods
  setAuthToken: (token: string, remember: boolean = true) => {
    console.log('setAuthToken: storing token, remember=', remember);
    if (remember) {
      localStorage.setItem('authToken', token);
      console.log('setAuthToken: stored in localStorage');
    } else {
      sessionStorage.setItem('authToken', token);
      console.log('setAuthToken: stored in sessionStorage');
    }
  },

  clearAuthToken: () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  },

  isAuthenticated: (): boolean => {
    return getAuthToken() !== null;
  },

  getToken: (): string | null => {
    return getAuthToken();
  },

  // Legacy Compatibility Methods (Deprecated)
  /** @deprecated Use ApiService.cases.getAll() instead */
  getCases: () => fetchJson<Case[]>('/cases'),

  /** @deprecated Use ApiService.cases.getById() instead */
  getCase: (id: string) => fetchJson<Case>(`/cases/${id}`),

  /** @deprecated Use ApiService.users.getAll() instead */
  getUsers: async (orgId?: string): Promise<User[]> => {
    const apiUsers = await fetchJson<ApiUser[]>(`/users${buildQueryString({ orgId })}`);
    return apiUsers.map(transformApiUser);
  },

  /** @deprecated Use ApiService.users.getById() instead */
  getUser: async (id: string): Promise<User> => {
    const apiUser = await fetchJson<ApiUser>(`/users/${id}`);
    return transformApiUser(apiUser);
  },

  /** @deprecated Use ApiService.documents.getAll() instead */
  getDocuments: (caseId?: string) => fetchJson<LegalDocument[]>(`/documents${buildQueryString({ caseId })}`),

  /** @deprecated Use ApiService.auth.login() instead */
  login: (email: string, password: string) =>
    postJson<{ access_token: string; user: User }>('/auth/login', { email, password }),

  /** @deprecated Use ApiService.auth.getCurrentUser() instead */
  getCurrentUser: () => fetchJson<User>('/auth/me'),

  /** @deprecated Use ApiService.users.update() instead */
  updateUser: (id: string, data: Partial<User>) =>
    putJson<User>(`/users/${id}`, data),

  /** @deprecated Use ApiService.userProfiles.update() instead */
  updateUserProfile: (userId: string, data: Partial<UserProfile>) =>
    putJson<UserProfile>(`/user-profiles/user/${userId}`, data),

  /** @deprecated Use ApiService.userProfiles.updateLastActive() instead */
  updateUserLastActive: (userId: string) =>
    putJson<void>(`/user-profiles/user/${userId}/last-active`, {}),

  /** @deprecated Use ApiService.evidence.getAll() instead */
  getEvidence: async (caseId?: string): Promise<EvidenceItem[]> => {
    const apiEvidence = await fetchJson<ApiEvidence[]>(`/evidence${buildQueryString({ caseId })}`);
    return apiEvidence.map(transformApiEvidence);
  },

  /** @deprecated Use ApiService.motions.getAll() instead */
  getMotions: (caseId?: string) =>
    fetchJson<Motion[]>(`/motions${buildQueryString({ caseId })}`),

  /** @deprecated Use ApiService.discovery.getAll() instead */
  getDiscovery: (caseId?: string) =>
    fetchJson<DiscoveryRequest[]>(`/discovery${buildQueryString({ caseId })}`),

  /** @deprecated Use ApiService.discovery.update() instead */
  updateDiscoveryRequest: (id: string, data: Partial<DiscoveryRequest>) =>
    putJson<DiscoveryRequest>(`/discovery/${id}`, data),

  /** @deprecated Use ApiService.audit.getLogs() instead */
  getAuditLogs: () => fetchJson<any[]>('/audit'),

  /** @deprecated Use ApiService.analytics.getJudgeAnalytics() instead */
  getJudgeAnalytics: () =>
    fetchJson<any>('/analytics/judge'),

  /** @deprecated Use ApiService.analytics.getCounselPerformance() instead */
  getCounselAnalytics: () =>
    fetchJson<any>('/analytics/counsel'),

  /** @deprecated Use ApiService.billing.getStats() instead */
  getBillingStats: () =>
    fetchJson<any>('/billing/stats'),

  /** @deprecated Use ApiService.clients.getAll() instead */
  getClients: (orgId?: string) =>
    fetchJson<Client[]>(`/clients${buildQueryString({ orgId })}`),

  /** @deprecated Use ApiService.clauses.getAll() instead */
  getClauses: (category?: string) =>
    fetchJson<Clause[]>(`/clauses${buildQueryString({ category })}`),

  /** @deprecated Use ApiService.compliance.getConflicts() instead */
  getConflicts: () => fetchJson<ConflictCheck[]>('/compliance/conflicts'),

  /** @deprecated Use ApiService.compliance.getWalls() instead */
  getWalls: () => fetchJson<EthicalWall[]>('/compliance/walls'),

  /** @deprecated Use ApiService.analytics.getDashboard() instead */
  getDashboard: () =>
    fetchJson<any>('/analytics/dashboard'),

  /** @deprecated Use ApiService.knowledge.getAll() instead */
  getKnowledgeBase: async (category?: string) => {
    const items = await fetchJson<any[]>(`/knowledge${buildQueryString({ category })}`);
    return items || [];
  },

  /** @deprecated Use ApiService.search.getResearchHistory() instead */
  getResearchHistory: async () => {
    const history = await fetchJson<ResearchSession[]>('/search/history');
    return history || [];
  },

  /** @deprecated Use ApiService.search.saveResearchSession() instead */
  saveResearchSession: (data: Partial<ResearchSession>) =>
    postJson<ResearchSession>('/search/sessions', data),

  /** @deprecated Use ApiService.search.updateResearchFeedback() instead */
  submitResearchFeedback: (id: string, feedback: 'positive' | 'negative') =>
    putJson<void>(`/search/sessions/${id}/feedback`, { feedback }),

  /** @deprecated Use ApiService.organizations.getAll() instead */
  getOrganizations: () => fetchJson<any[]>('/organizations'),

  /** @deprecated Use ApiService.groups.getAll() instead */
  getGroups: () => fetchJson<any[]>('/groups'),

  /** @deprecated Use ApiService.calendar.getByType('deadline') instead */
  getCalendarDeadlines: () => fetchJson<any[]>('/calendar/type/deadline'),

  /** @deprecated Use ApiService.calendar.getByType('hearing') instead */
  getCalendarHearings: () => fetchJson<any[]>('/calendar/type/hearing'),

  /** @deprecated Use ApiService.calendar.getByType('statute-of-limitations') instead */
  getCalendarSOL: () => fetchJson<any[]>('/calendar/type/statute-of-limitations'),

  /** @deprecated Use ApiService.calendar.getByType('team') instead */
  getCalendarTeam: () => fetchJson<any[]>('/calendar/type/team'),

  /** @deprecated Use ApiService.caseOperations.getDiscovery() instead */
  getCaseDiscovery: (caseId: string) =>
    fetchJson<DiscoveryRequest[]>(`/cases/${caseId}/discovery`),

  /** @deprecated Use ApiService.caseOperations.getEvidence() instead */
  getCaseEvidence: async (caseId: string): Promise<EvidenceItem[]> => {
    const apiEvidence = await fetchJson<ApiEvidence[]>(`/cases/${caseId}/evidence`);
    return apiEvidence.map(transformApiEvidence);
  },

  /** @deprecated Use ApiService.caseOperations.getMotions() instead */
  getCaseMotions: (caseId: string) =>
    fetchJson<Motion[]>(`/cases/${caseId}/motions`),

  /** @deprecated Use ApiService.caseOperations.getTeam() instead */
  getCaseTeam: (caseId: string) =>
    fetchJson<CaseMember[]>(`/parties/case/${caseId}`),

  /** @deprecated Use ApiService.caseOperations.addTeamMember() instead */
  addCaseTeamMember: (caseId: string, userId: string, role: string) =>
    postJson<void>('/parties', { case_id: caseId, user_id: userId, role }),

  /** @deprecated Use ApiService.caseOperations.removeTeamMember() instead */
  removeCaseTeamMember: (caseId: string, userId: string) =>
    deleteJson(`/parties/case/${caseId}/user/${userId}`),

  /** @deprecated Use ApiService.documents.create() instead */
  createDocument: (data: Partial<LegalDocument>) =>
    postJson<LegalDocument>('/documents', data),

  /** @deprecated Use ApiService.motions.create() instead */
  createMotion: (data: Partial<Motion>) =>
    postJson<Motion>('/motions', data),

  /** @deprecated Use ApiService.userProfiles.get() instead */
  getUserProfile: (userId: string) =>
    fetchJson<UserProfile>(`/user-profiles/user/${userId}`),

  getFirmProcesses: () => Promise.resolve([]),
  getLegalHolds: () => Promise.resolve([]),
  getPrivilegeLogs: () => Promise.resolve([]),

  /** @deprecated Use ApiService.cases.create() instead */
  createCase: async (data: Partial<Case>): Promise<Case> => {
    const apiRequest = {
      title: data.title,
      client_name: data.client,
      opposing_counsel: data.opposingCounsel,
      status: data.status,
      filing_date: data.filingDate,
      description: data.description,
      value: data.value,
      matter_type: data.matterType,
      jurisdiction: data.jurisdiction,
      court: data.court,
      billing_model: data.billingModel,
      judge: data.judge,
      owner_org_id: data.ownerOrgId,
    };
    const cleanRequest = Object.fromEntries(Object.entries(apiRequest).filter(([_, v]) => v !== undefined));
    const apiCase = await postJson<ApiCase>('/cases', cleanRequest);
    return transformApiCase(apiCase);
  },

  /** @deprecated Use ApiService.cases.update() instead */
  updateCase: async (id: string, data: Partial<Case>): Promise<Case> => {
    const apiRequest = {
      title: data.title,
      client_name: data.client,
      opposing_counsel: data.opposingCounsel,
      status: data.status,
      filing_date: data.filingDate,
      description: data.description,
      value: data.value,
      matter_type: data.matterType,
      jurisdiction: data.jurisdiction,
      court: data.court,
      billing_model: data.billingModel,
      judge: data.judge,
      owner_org_id: data.ownerOrgId,
    };
    const cleanRequest = Object.fromEntries(Object.entries(apiRequest).filter(([_, v]) => v !== undefined));
    const apiCase = await putJson<ApiCase>(`/cases/${id}`, cleanRequest);
    return transformApiCase(apiCase);
  },

  /** @deprecated Use ApiService.cases.delete() instead */
  deleteCase: (id: string) => deleteJson(`/cases/${id}`),

  /** @deprecated Use ApiService.caseOperations.getDocuments() instead */
  getCaseDocuments: (caseId: string) =>
    fetchJson<LegalDocument[]>(`/cases/${caseId}/documents`),

  /** @deprecated Use ApiService.documents.getById() instead */
  getDocument: (id: string) =>
    fetchJson<LegalDocument>(`/documents/${id}`),

  /** @deprecated Use ApiService.jurisdictions.getAll() instead */
  getJurisdictions: (type?: string) =>
    fetchJson<any[]>(`/jurisdictions${type ? `?type=${type}` : ''}`),
};
