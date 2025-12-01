// Organizations, Clients, Analytics, and Other Services
import { Organization, Client, Clause, Group, AuditLogEntry, UserProfile, ConflictCheck, EthicalWall, KnowledgeItem, Jurisdiction, CaseMember } from '../../types';
import { fetchJson, postJson, putJson, deleteJson, buildQueryString } from '../http-client';

export const organizationsService = {
  getAll: () =>
    fetchJson<Organization[]>('/organizations'),

  getById: (id: string) =>
    fetchJson<Organization>(`/organizations/${id}`),

  create: (data: Partial<Organization>) =>
    postJson<Organization>('/organizations', data),

  update: (id: string, data: Partial<Organization>) =>
    putJson<Organization>(`/organizations/${id}`, data),

  delete: (id: string) =>
    deleteJson(`/organizations/${id}`),
};

export const clientsService = {
  getAll: (orgId?: string) =>
    fetchJson<Client[]>(`/clients${buildQueryString({ orgId })}`),

  getById: (id: string) =>
    fetchJson<Client>(`/clients/${id}`),

  getByName: (name: string) =>
    fetchJson<Client[]>(`/clients/name/${encodeURIComponent(name)}`),

  create: (data: Partial<Client>) =>
    postJson<Client>('/clients', data),

  update: (id: string, data: Partial<Client>) =>
    putJson<Client>(`/clients/${id}`, data),

  delete: (id: string) =>
    deleteJson(`/clients/${id}`),
};

export const analyticsService = {
  getAll: (caseId?: string, metricType?: string) =>
    fetchJson<any[]>(`/analytics${buildQueryString({ caseId, metricType })}`),

  getById: (id: string) =>
    fetchJson<any>(`/analytics/${id}`),

  getCasePrediction: (caseId: string) =>
    fetchJson<any[]>(`/analytics/case-prediction/${caseId}`),

  getJudgeAnalytics: (judgeName: string) =>
    fetchJson<any[]>(`/analytics/judge/${encodeURIComponent(judgeName)}`),

  getCounselPerformance: (counselName: string) =>
    fetchJson<any[]>(`/analytics/counsel/${encodeURIComponent(counselName)}`),

  getDashboard: () =>
    fetchJson<{ stats: any[]; chartData: any[]; alerts: any[] }>('/analytics/dashboard'),

  create: (data: any) =>
    postJson<any>('/analytics', data),
};

export const complianceService = {
  getAll: async (orgId?: string) => {
    const items = await fetchJson<any[]>(`/compliance${buildQueryString({ orgId })}`);
    return items || [];
  },

  getById: (id: string) =>
    fetchJson<any>(`/compliance/${id}`),

  getByRiskLevel: (riskLevel: string) =>
    fetchJson<any[]>(`/compliance/risk-level/${encodeURIComponent(riskLevel)}`),

  getConflicts: async () => {
    const conflicts = await fetchJson<ConflictCheck[]>('/compliance/conflicts');
    return conflicts || [];
  },

  getWalls: () =>
    fetchJson<EthicalWall[]>('/compliance/walls'),

  createConflictCheck: (data: Partial<ConflictCheck>) =>
    postJson<ConflictCheck>('/compliance/conflicts', data),

  createEthicalWall: (data: Partial<EthicalWall>) =>
    postJson<EthicalWall>('/compliance/walls', data),

  create: (data: any) =>
    postJson<any>('/compliance', data),

  update: (id: string, data: any) =>
    putJson<any>(`/compliance/${id}`, data),
};

export const knowledgeService = {
  getAll: (category?: string) =>
    fetchJson<KnowledgeItem[]>(`/knowledge${buildQueryString({ category })}`),

  getById: (id: string) =>
    fetchJson<KnowledgeItem>(`/knowledge/${id}`),

  search: (query: string) =>
    fetchJson<KnowledgeItem[]>(`/knowledge/search${buildQueryString({ q: query })}`),

  create: (data: Partial<KnowledgeItem>) =>
    postJson<KnowledgeItem>('/knowledge', data),

  update: (id: string, data: Partial<KnowledgeItem>) =>
    putJson<KnowledgeItem>(`/knowledge/${id}`, data),
};

export const jurisdictionsService = {
  getAll: (country?: string) =>
    fetchJson<Jurisdiction[]>(`/jurisdictions${buildQueryString({ country })}`),

  getById: (id: string) =>
    fetchJson<Jurisdiction>(`/jurisdictions/${id}`),

  getByCode: (code: string) =>
    fetchJson<Jurisdiction>(`/jurisdictions/code/${encodeURIComponent(code)}`),

  create: (data: Partial<Jurisdiction>) =>
    postJson<Jurisdiction>('/jurisdictions', data),

  update: (id: string, data: Partial<Jurisdiction>) =>
    putJson<Jurisdiction>(`/jurisdictions/${id}`, data),
};

export const clausesService = {
  getAll: (category?: string, type?: string) =>
    fetchJson<Clause[]>(`/clauses${buildQueryString({ category, type })}`),

  getById: (id: string) =>
    fetchJson<Clause>(`/clauses/${id}`),

  search: (query: string) =>
    fetchJson<Clause[]>(`/clauses/search${buildQueryString({ q: query })}`),

  create: (data: Partial<Clause>) =>
    postJson<Clause>('/clauses', data),

  update: (id: string, data: Partial<Clause>) =>
    putJson<Clause>(`/clauses/${id}`, data),

  delete: (id: string) =>
    deleteJson(`/clauses/${id}`),
};

export const groupsService = {
  getAll: () =>
    fetchJson<Group[]>('/groups'),

  create: (data: Partial<Group>) =>
    postJson<Group>('/groups', data),
};

export const auditService = {
  getLogs: () =>
    fetchJson<AuditLogEntry[]>('/audit'),
};

export const partiesService = {
  getAll: (caseId?: string) =>
    fetchJson<any[]>(`/parties${buildQueryString({ caseId })}`),

  create: (data: any) =>
    postJson<any>('/parties', data),

  update: (id: string, data: any) =>
    putJson<any>(`/parties/${id}`, data),

  delete: (id: string) =>
    deleteJson(`/parties/${id}`),

  getByCaseId: (caseId: string) =>
    fetchJson<CaseMember[]>(`/parties/case/${caseId}`),
};

export const userProfilesService = {
  get: (userId: string) =>
    fetchJson<UserProfile>(`/user-profiles/user/${userId}`),

  create: (data: Partial<UserProfile>) =>
    postJson<UserProfile>('/user-profiles', data),

  update: (userId: string, data: Partial<UserProfile>) =>
    putJson<UserProfile>(`/user-profiles/user/${userId}`, data),

  updateLastActive: (userId: string) =>
    putJson<void>(`/user-profiles/user/${userId}/last-active`, {}),
};
