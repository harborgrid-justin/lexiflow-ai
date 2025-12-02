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
  // Legacy methods
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

  // Enhanced Analytics API
  // Executive Dashboard
  getExecutiveDashboard: (dateRange?: { start: string; end: string }) =>
    fetchJson<any>(`/analytics/executive/dashboard${buildQueryString(dateRange)}`),

  getDashboardMetrics: (dateRange?: { start: string; end: string }) =>
    fetchJson<any>(`/analytics/executive/metrics${buildQueryString(dateRange)}`),

  // Case Analytics
  getCaseAnalytics: (filters?: any) =>
    fetchJson<any>(`/analytics/cases${buildQueryString(filters)}`),

  getCasesByStatus: () =>
    fetchJson<any[]>('/analytics/cases/by-status'),

  getCasesByPracticeArea: () =>
    fetchJson<any[]>('/analytics/cases/by-practice-area'),

  getCasesByAttorney: () =>
    fetchJson<any[]>('/analytics/cases/by-attorney'),

  getCasesByCourt: () =>
    fetchJson<any[]>('/analytics/cases/by-court'),

  getCaseAgeDistribution: () =>
    fetchJson<any>('/analytics/cases/age-distribution'),

  getWinLossRatio: () =>
    fetchJson<any>('/analytics/cases/win-loss-ratio'),

  // Financial Analytics
  getFinancialAnalytics: (filters?: any) =>
    fetchJson<any>(`/analytics/financial${buildQueryString(filters)}`),

  getRevenueMetrics: (dateRange?: { start: string; end: string }) =>
    fetchJson<any>(`/analytics/financial/revenue${buildQueryString(dateRange)}`),

  getRevenueByMonth: (year?: number) =>
    fetchJson<any[]>(`/analytics/financial/revenue/by-month${buildQueryString({ year })}`),

  getRevenueByClient: (topN?: number) =>
    fetchJson<any[]>(`/analytics/financial/revenue/by-client${buildQueryString({ topN })}`),

  getRevenueByPracticeArea: () =>
    fetchJson<any[]>('/analytics/financial/revenue/by-practice-area'),

  getRevenueByAttorney: () =>
    fetchJson<any[]>('/analytics/financial/revenue/by-attorney'),

  getBillingMetrics: () =>
    fetchJson<any>('/analytics/financial/billing'),

  getARAgingReport: () =>
    fetchJson<any>('/analytics/financial/ar-aging'),

  getCollectionMetrics: () =>
    fetchJson<any>('/analytics/financial/collections'),

  // Productivity Analytics
  getProductivityAnalytics: (filters?: any) =>
    fetchJson<any>(`/analytics/productivity${buildQueryString(filters)}`),

  getProductivityByAttorney: () =>
    fetchJson<any[]>('/analytics/productivity/by-attorney'),

  getProductivityByDepartment: () =>
    fetchJson<any[]>('/analytics/productivity/by-department'),

  getUtilizationRates: () =>
    fetchJson<any>('/analytics/productivity/utilization'),

  getTaskMetrics: () =>
    fetchJson<any>('/analytics/productivity/tasks'),

  getDocumentMetrics: () =>
    fetchJson<any>('/analytics/productivity/documents'),

  // Client Analytics
  getClientAnalytics: (filters?: any) =>
    fetchJson<any>(`/analytics/clients${buildQueryString(filters)}`),

  getTopClients: (topN?: number) =>
    fetchJson<any[]>(`/analytics/clients/top${buildQueryString({ topN })}`),

  getClientsByIndustry: () =>
    fetchJson<any[]>('/analytics/clients/by-industry'),

  getClientRetention: () =>
    fetchJson<any>('/analytics/clients/retention'),

  // Team Analytics
  getTeamAnalytics: (filters?: any) =>
    fetchJson<any>(`/analytics/team${buildQueryString(filters)}`),

  getTeamPerformance: () =>
    fetchJson<any>('/analytics/team/performance'),

  getTeamCollaboration: () =>
    fetchJson<any>('/analytics/team/collaboration'),

  // Reports
  getReports: () =>
    fetchJson<any[]>('/analytics/reports'),

  getReport: (id: string) =>
    fetchJson<any>(`/analytics/reports/${id}`),

  getReportData: (reportType: string, params?: any) =>
    fetchJson<any>(`/analytics/reports/${reportType}/data${buildQueryString(params)}`),

  createReport: (data: any) =>
    postJson<any>('/analytics/reports', data),

  updateReport: (id: string, data: any) =>
    putJson<any>(`/analytics/reports/${id}`, data),

  deleteReport: (id: string) =>
    deleteJson(`/analytics/reports/${id}`),

  executeReport: (id: string) =>
    fetchJson<any>(`/analytics/reports/${id}/execute`),

  scheduleReport: (id: string, schedule: any) =>
    postJson<any>(`/analytics/reports/${id}/schedule`, schedule),

  // Export
  exportData: (type: string, format: string, params?: any) =>
    fetchJson<any>(`/analytics/export/${type}${buildQueryString({ format, ...params })}`),
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
