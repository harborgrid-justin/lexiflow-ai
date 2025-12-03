// Misc Services using Enzyme API Client
// Provides type-safe operations for organizations, clients, analytics, compliance, etc.

import { enzymeClient } from './client';
import {
  Organization,
  Client,
  Clause,
  Group,
  AuditLogEntry,
  UserProfile,
  ConflictCheck,
  EthicalWall,
  KnowledgeItem,
  Jurisdiction,
  CaseMember,
} from '../../types';

// ============================================================================
// Organizations Service
// ============================================================================

const ORG_ENDPOINTS = {
  list: '/organizations',
  detail: (id: string) => `/organizations/${id}`,
} as const;

export const enzymeOrganizationsService = {
  async getAll(): Promise<Organization[]> {
    const response = await enzymeClient.get<Organization[]>(ORG_ENDPOINTS.list);
    return response.data || [];
  },

  async getById(id: string): Promise<Organization> {
    const response = await enzymeClient.get<Organization>(ORG_ENDPOINTS.detail(id));
    return response.data;
  },

  async create(data: Partial<Organization>): Promise<Organization> {
    const response = await enzymeClient.post<Organization>(ORG_ENDPOINTS.list, {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async update(id: string, data: Partial<Organization>): Promise<Organization> {
    const response = await enzymeClient.put<Organization>(ORG_ENDPOINTS.detail(id), {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await enzymeClient.delete(ORG_ENDPOINTS.detail(id));
  },
};

// ============================================================================
// Clients Service
// ============================================================================

const CLIENT_ENDPOINTS = {
  list: '/clients',
  detail: (id: string) => `/clients/${id}`,
  byName: (name: string) => `/clients/name/${encodeURIComponent(name)}`,
} as const;

export const enzymeClientsService = {
  async getAll(params?: { orgId?: string }): Promise<Client[]> {
    const response = await enzymeClient.get<Client[]>(CLIENT_ENDPOINTS.list, {
      params: params as Record<string, string | number | boolean>,
    });
    return response.data || [];
  },

  async getById(id: string): Promise<Client> {
    const response = await enzymeClient.get<Client>(CLIENT_ENDPOINTS.detail(id));
    return response.data;
  },

  async getByName(name: string): Promise<Client[]> {
    const response = await enzymeClient.get<Client[]>(CLIENT_ENDPOINTS.byName(name));
    return response.data || [];
  },

  async create(data: Partial<Client>): Promise<Client> {
    const response = await enzymeClient.post<Client>(CLIENT_ENDPOINTS.list, {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async update(id: string, data: Partial<Client>): Promise<Client> {
    const response = await enzymeClient.put<Client>(CLIENT_ENDPOINTS.detail(id), {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await enzymeClient.delete(CLIENT_ENDPOINTS.detail(id));
  },
};

// ============================================================================
// Analytics Service
// ============================================================================

const ANALYTICS_ENDPOINTS = {
  list: '/analytics',
  detail: (id: string) => `/analytics/${id}`,
  casePrediction: (caseId: string) => `/analytics/case-prediction/${caseId}`,
  judge: (name: string) => `/analytics/judge/${encodeURIComponent(name)}`,
  counsel: (name: string) => `/analytics/counsel/${encodeURIComponent(name)}`,
  dashboard: '/analytics/dashboard',
  executive: {
    dashboard: '/analytics/executive/dashboard',
    metrics: '/analytics/executive/metrics',
  },
  cases: {
    base: '/analytics/cases',
    byStatus: '/analytics/cases/by-status',
    byPracticeArea: '/analytics/cases/by-practice-area',
    byAttorney: '/analytics/cases/by-attorney',
    byCourt: '/analytics/cases/by-court',
    ageDistribution: '/analytics/cases/age-distribution',
    winLossRatio: '/analytics/cases/win-loss-ratio',
  },
  financial: {
    base: '/analytics/financial',
    revenue: '/analytics/financial/revenue',
    revenueByMonth: '/analytics/financial/revenue/by-month',
    revenueByClient: '/analytics/financial/revenue/by-client',
    revenueByPracticeArea: '/analytics/financial/revenue/by-practice-area',
    revenueByAttorney: '/analytics/financial/revenue/by-attorney',
    billing: '/analytics/financial/billing',
    arAging: '/analytics/financial/ar-aging',
    collections: '/analytics/financial/collections',
  },
  productivity: {
    base: '/analytics/productivity',
    byAttorney: '/analytics/productivity/by-attorney',
    byDepartment: '/analytics/productivity/by-department',
    utilization: '/analytics/productivity/utilization',
    tasks: '/analytics/productivity/tasks',
    documents: '/analytics/productivity/documents',
  },
  clients: {
    base: '/analytics/clients',
    top: '/analytics/clients/top',
    byIndustry: '/analytics/clients/by-industry',
    retention: '/analytics/clients/retention',
  },
  team: {
    base: '/analytics/team',
    performance: '/analytics/team/performance',
    collaboration: '/analytics/team/collaboration',
  },
  reports: {
    list: '/analytics/reports',
    detail: (id: string) => `/analytics/reports/${id}`,
    execute: (id: string) => `/analytics/reports/${id}/execute`,
    schedule: (id: string) => `/analytics/reports/${id}/schedule`,
    data: (type: string) => `/analytics/reports/${type}/data`,
  },
  export: (type: string) => `/analytics/export/${type}`,
} as const;

type DateRange = { start: string; end: string };

export const enzymeAnalyticsService = {
  // Legacy methods
  async getAll(params?: { caseId?: string; metricType?: string }): Promise<unknown[]> {
    const response = await enzymeClient.get<unknown[]>(ANALYTICS_ENDPOINTS.list, {
      params: params as Record<string, string | number | boolean>,
    });
    return response.data || [];
  },

  async getById(id: string): Promise<unknown> {
    const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.detail(id));
    return response.data;
  },

  async getCasePrediction(caseId: string): Promise<unknown[]> {
    const response = await enzymeClient.get<unknown[]>(ANALYTICS_ENDPOINTS.casePrediction(caseId));
    return response.data || [];
  },

  async getJudgeAnalytics(judgeName: string): Promise<unknown[]> {
    const response = await enzymeClient.get<unknown[]>(ANALYTICS_ENDPOINTS.judge(judgeName));
    return response.data || [];
  },

  async getCounselPerformance(counselName: string): Promise<unknown[]> {
    const response = await enzymeClient.get<unknown[]>(ANALYTICS_ENDPOINTS.counsel(counselName));
    return response.data || [];
  },

  async getDashboard(): Promise<{ stats: unknown[]; chartData: unknown[]; alerts: unknown[] }> {
    const response = await enzymeClient.get<{ stats: unknown[]; chartData: unknown[]; alerts: unknown[] }>(
      ANALYTICS_ENDPOINTS.dashboard
    );
    return response.data;
  },

  // Executive Dashboard
  async getExecutiveDashboard(dateRange?: DateRange): Promise<unknown> {
    const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.executive.dashboard, {
      params: dateRange as Record<string, string | number | boolean>,
    });
    return response.data;
  },

  async getDashboardMetrics(dateRange?: DateRange): Promise<unknown> {
    const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.executive.metrics, {
      params: dateRange as Record<string, string | number | boolean>,
    });
    return response.data;
  },

  // Case Analytics
  cases: {
    async getAnalytics(filters?: Record<string, unknown>): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.cases.base, {
        params: filters as Record<string, string | number | boolean>,
      });
      return response.data;
    },

    async getByStatus(): Promise<unknown[]> {
      const response = await enzymeClient.get<unknown[]>(ANALYTICS_ENDPOINTS.cases.byStatus);
      return response.data || [];
    },

    async getByPracticeArea(): Promise<unknown[]> {
      const response = await enzymeClient.get<unknown[]>(ANALYTICS_ENDPOINTS.cases.byPracticeArea);
      return response.data || [];
    },

    async getByAttorney(): Promise<unknown[]> {
      const response = await enzymeClient.get<unknown[]>(ANALYTICS_ENDPOINTS.cases.byAttorney);
      return response.data || [];
    },

    async getByCourt(): Promise<unknown[]> {
      const response = await enzymeClient.get<unknown[]>(ANALYTICS_ENDPOINTS.cases.byCourt);
      return response.data || [];
    },

    async getAgeDistribution(): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.cases.ageDistribution);
      return response.data;
    },

    async getWinLossRatio(): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.cases.winLossRatio);
      return response.data;
    },
  },

  // Financial Analytics
  financial: {
    async getAnalytics(filters?: Record<string, unknown>): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.financial.base, {
        params: filters as Record<string, string | number | boolean>,
      });
      return response.data;
    },

    async getRevenueMetrics(dateRange?: DateRange): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.financial.revenue, {
        params: dateRange as Record<string, string | number | boolean>,
      });
      return response.data;
    },

    async getRevenueByMonth(year?: number): Promise<unknown[]> {
      const response = await enzymeClient.get<unknown[]>(ANALYTICS_ENDPOINTS.financial.revenueByMonth, {
        params: year ? { year } : undefined,
      });
      return response.data || [];
    },

    async getRevenueByClient(topN?: number): Promise<unknown[]> {
      const response = await enzymeClient.get<unknown[]>(ANALYTICS_ENDPOINTS.financial.revenueByClient, {
        params: topN ? { topN } : undefined,
      });
      return response.data || [];
    },

    async getRevenueByPracticeArea(): Promise<unknown[]> {
      const response = await enzymeClient.get<unknown[]>(ANALYTICS_ENDPOINTS.financial.revenueByPracticeArea);
      return response.data || [];
    },

    async getRevenueByAttorney(): Promise<unknown[]> {
      const response = await enzymeClient.get<unknown[]>(ANALYTICS_ENDPOINTS.financial.revenueByAttorney);
      return response.data || [];
    },

    async getBillingMetrics(): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.financial.billing);
      return response.data;
    },

    async getARAgingReport(): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.financial.arAging);
      return response.data;
    },

    async getCollectionMetrics(): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.financial.collections);
      return response.data;
    },
  },

  // Productivity Analytics
  productivity: {
    async getAnalytics(filters?: Record<string, unknown>): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.productivity.base, {
        params: filters as Record<string, string | number | boolean>,
      });
      return response.data;
    },

    async getByAttorney(): Promise<unknown[]> {
      const response = await enzymeClient.get<unknown[]>(ANALYTICS_ENDPOINTS.productivity.byAttorney);
      return response.data || [];
    },

    async getByDepartment(): Promise<unknown[]> {
      const response = await enzymeClient.get<unknown[]>(ANALYTICS_ENDPOINTS.productivity.byDepartment);
      return response.data || [];
    },

    async getUtilizationRates(): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.productivity.utilization);
      return response.data;
    },

    async getTaskMetrics(): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.productivity.tasks);
      return response.data;
    },

    async getDocumentMetrics(): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.productivity.documents);
      return response.data;
    },
  },

  // Client Analytics
  clients: {
    async getAnalytics(filters?: Record<string, unknown>): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.clients.base, {
        params: filters as Record<string, string | number | boolean>,
      });
      return response.data;
    },

    async getTopClients(topN?: number): Promise<unknown[]> {
      const response = await enzymeClient.get<unknown[]>(ANALYTICS_ENDPOINTS.clients.top, {
        params: topN ? { topN } : undefined,
      });
      return response.data || [];
    },

    async getByIndustry(): Promise<unknown[]> {
      const response = await enzymeClient.get<unknown[]>(ANALYTICS_ENDPOINTS.clients.byIndustry);
      return response.data || [];
    },

    async getRetention(): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.clients.retention);
      return response.data;
    },
  },

  // Team Analytics
  team: {
    async getAnalytics(filters?: Record<string, unknown>): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.team.base, {
        params: filters as Record<string, string | number | boolean>,
      });
      return response.data;
    },

    async getPerformance(): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.team.performance);
      return response.data;
    },

    async getCollaboration(): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.team.collaboration);
      return response.data;
    },
  },

  // Reports
  reports: {
    async getAll(): Promise<unknown[]> {
      const response = await enzymeClient.get<unknown[]>(ANALYTICS_ENDPOINTS.reports.list);
      return response.data || [];
    },

    async getById(id: string): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.reports.detail(id));
      return response.data;
    },

    async getData(reportType: string, params?: Record<string, unknown>): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.reports.data(reportType), {
        params: params as Record<string, string | number | boolean>,
      });
      return response.data;
    },

    async create(data: unknown): Promise<unknown> {
      const response = await enzymeClient.post(ANALYTICS_ENDPOINTS.reports.list, {
        body: data as Record<string, unknown>,
      });
      return response.data;
    },

    async update(id: string, data: unknown): Promise<unknown> {
      const response = await enzymeClient.put(ANALYTICS_ENDPOINTS.reports.detail(id), {
        body: data as Record<string, unknown>,
      });
      return response.data;
    },

    async delete(id: string): Promise<void> {
      await enzymeClient.delete(ANALYTICS_ENDPOINTS.reports.detail(id));
    },

    async execute(id: string): Promise<unknown> {
      const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.reports.execute(id));
      return response.data;
    },

    async schedule(id: string, schedule: unknown): Promise<unknown> {
      const response = await enzymeClient.post(ANALYTICS_ENDPOINTS.reports.schedule(id), {
        body: schedule as Record<string, unknown>,
      });
      return response.data;
    },
  },

  // Export
  async exportData(type: string, format: string, params?: Record<string, unknown>): Promise<unknown> {
    const response = await enzymeClient.get(ANALYTICS_ENDPOINTS.export(type), {
      params: { format, ...params } as Record<string, string | number | boolean>,
    });
    return response.data;
  },
};

// ============================================================================
// Compliance Service
// ============================================================================

const COMPLIANCE_ENDPOINTS = {
  list: '/compliance',
  detail: (id: string) => `/compliance/${id}`,
  byRiskLevel: (level: string) => `/compliance/risk-level/${encodeURIComponent(level)}`,
  conflicts: '/compliance/conflicts',
  walls: '/compliance/walls',
} as const;

export const enzymeComplianceService = {
  async getAll(params?: { orgId?: string }): Promise<unknown[]> {
    const response = await enzymeClient.get<unknown[]>(COMPLIANCE_ENDPOINTS.list, {
      params: params as Record<string, string | number | boolean>,
    });
    return response.data || [];
  },

  async getById(id: string): Promise<unknown> {
    const response = await enzymeClient.get(COMPLIANCE_ENDPOINTS.detail(id));
    return response.data;
  },

  async getByRiskLevel(riskLevel: string): Promise<unknown[]> {
    const response = await enzymeClient.get<unknown[]>(COMPLIANCE_ENDPOINTS.byRiskLevel(riskLevel));
    return response.data || [];
  },

  async getConflicts(): Promise<ConflictCheck[]> {
    const response = await enzymeClient.get<ConflictCheck[]>(COMPLIANCE_ENDPOINTS.conflicts);
    return response.data || [];
  },

  async getWalls(): Promise<EthicalWall[]> {
    const response = await enzymeClient.get<EthicalWall[]>(COMPLIANCE_ENDPOINTS.walls);
    return response.data || [];
  },

  async createConflictCheck(data: Partial<ConflictCheck>): Promise<ConflictCheck> {
    const response = await enzymeClient.post<ConflictCheck>(COMPLIANCE_ENDPOINTS.conflicts, {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async createEthicalWall(data: Partial<EthicalWall>): Promise<EthicalWall> {
    const response = await enzymeClient.post<EthicalWall>(COMPLIANCE_ENDPOINTS.walls, {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async create(data: unknown): Promise<unknown> {
    const response = await enzymeClient.post(COMPLIANCE_ENDPOINTS.list, {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async update(id: string, data: unknown): Promise<unknown> {
    const response = await enzymeClient.put(COMPLIANCE_ENDPOINTS.detail(id), {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },
};

// ============================================================================
// Knowledge Service
// ============================================================================

const KNOWLEDGE_ENDPOINTS = {
  list: '/knowledge',
  detail: (id: string) => `/knowledge/${id}`,
  search: '/knowledge/search',
} as const;

export const enzymeKnowledgeService = {
  async getAll(params?: { category?: string }): Promise<KnowledgeItem[]> {
    const response = await enzymeClient.get<KnowledgeItem[]>(KNOWLEDGE_ENDPOINTS.list, {
      params: params as Record<string, string | number | boolean>,
    });
    return response.data || [];
  },

  async getById(id: string): Promise<KnowledgeItem> {
    const response = await enzymeClient.get<KnowledgeItem>(KNOWLEDGE_ENDPOINTS.detail(id));
    return response.data;
  },

  async search(query: string, category?: string): Promise<KnowledgeItem[]> {
    const params: Record<string, string> = { q: query };
    if (category) params.category = category;
    
    const response = await enzymeClient.get<KnowledgeItem[]>(KNOWLEDGE_ENDPOINTS.search, {
      params,
    });
    return response.data || [];
  },

  async create(data: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    const response = await enzymeClient.post<KnowledgeItem>(KNOWLEDGE_ENDPOINTS.list, {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async update(id: string, data: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    const response = await enzymeClient.put<KnowledgeItem>(KNOWLEDGE_ENDPOINTS.detail(id), {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },
};

// ============================================================================
// Jurisdictions Service
// ============================================================================

const JURISDICTION_ENDPOINTS = {
  list: '/jurisdiction', // Changed to singular to match API
  detail: (id: string) => `/jurisdiction/${id}`,
  byCode: (code: string) => `/jurisdiction/code/${encodeURIComponent(code)}`,
  federal: '/jurisdiction/federal',
  state: '/jurisdiction/state',
  regulatory: '/jurisdiction/regulatory',
  arbitration: '/jurisdiction/arbitration',
  localRules: (courtId: string) => `/jurisdiction/courts/${courtId}/local-rules`,
  search: '/jurisdiction/search',
} as const;

export const enzymeJurisdictionsService = {
  async getAll(params?: { country?: string }): Promise<Jurisdiction[]> {
    const response = await enzymeClient.get<Jurisdiction[]>(JURISDICTION_ENDPOINTS.list, {
      params: params as Record<string, string | number | boolean>,
    });
    return response.data || [];
  },

  async getById(id: string): Promise<Jurisdiction> {
    const response = await enzymeClient.get<Jurisdiction>(JURISDICTION_ENDPOINTS.detail(id));
    return response.data;
  },

  async getByCode(code: string): Promise<Jurisdiction> {
    const response = await enzymeClient.get<Jurisdiction>(JURISDICTION_ENDPOINTS.byCode(code));
    return response.data;
  },

  async getFederalCourts(): Promise<unknown[]> {
    const response = await enzymeClient.get<unknown[]>(JURISDICTION_ENDPOINTS.federal);
    return response.data || [];
  },

  async getStateCourts(state?: string): Promise<unknown[]> {
    const response = await enzymeClient.get<unknown[]>(JURISDICTION_ENDPOINTS.state, {
      params: state ? { state } : undefined,
    });
    return response.data || [];
  },

  async getRegulatoryBodies(): Promise<unknown[]> {
    const response = await enzymeClient.get<unknown[]>(JURISDICTION_ENDPOINTS.regulatory);
    return response.data || [];
  },

  async getArbitrationOrgs(): Promise<unknown[]> {
    const response = await enzymeClient.get<unknown[]>(JURISDICTION_ENDPOINTS.arbitration);
    return response.data || [];
  },

  async getLocalRules(courtId: string): Promise<unknown[]> {
    const response = await enzymeClient.get<unknown[]>(JURISDICTION_ENDPOINTS.localRules(courtId));
    return response.data || [];
  },

  async search(query: string): Promise<unknown[]> {
    const response = await enzymeClient.get<unknown[]>(JURISDICTION_ENDPOINTS.search, {
      params: { q: query },
    });
    return response.data || [];
  },

  async create(data: Partial<Jurisdiction>): Promise<Jurisdiction> {
    const response = await enzymeClient.post<Jurisdiction>(JURISDICTION_ENDPOINTS.list, {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async update(id: string, data: Partial<Jurisdiction>): Promise<Jurisdiction> {
    const response = await enzymeClient.put<Jurisdiction>(JURISDICTION_ENDPOINTS.detail(id), {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },
};

// ============================================================================
// Clauses Service
// ============================================================================

const CLAUSE_ENDPOINTS = {
  list: '/clauses',
  detail: (id: string) => `/clauses/${id}`,
  search: '/clauses/search',
} as const;

export const enzymeClausesService = {
  async getAll(params?: { category?: string; type?: string }): Promise<Clause[]> {
    const response = await enzymeClient.get<Clause[]>(CLAUSE_ENDPOINTS.list, {
      params: params as Record<string, string | number | boolean>,
    });
    return response.data || [];
  },

  async getById(id: string): Promise<Clause> {
    const response = await enzymeClient.get<Clause>(CLAUSE_ENDPOINTS.detail(id));
    return response.data;
  },

  async search(query: string): Promise<Clause[]> {
    const response = await enzymeClient.get<Clause[]>(CLAUSE_ENDPOINTS.search, {
      params: { q: query },
    });
    return response.data || [];
  },

  async create(data: Partial<Clause>): Promise<Clause> {
    const response = await enzymeClient.post<Clause>(CLAUSE_ENDPOINTS.list, {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async update(id: string, data: Partial<Clause>): Promise<Clause> {
    const response = await enzymeClient.put<Clause>(CLAUSE_ENDPOINTS.detail(id), {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await enzymeClient.delete(CLAUSE_ENDPOINTS.detail(id));
  },

  async getVersions(id: string): Promise<unknown[]> {
    const response = await enzymeClient.get<unknown[]>(`${CLAUSE_ENDPOINTS.detail(id)}/versions`);
    return response.data || [];
  },
};

// ============================================================================
// Groups Service
// ============================================================================

const GROUP_ENDPOINTS = {
  list: '/groups',
} as const;

export const enzymeGroupsService = {
  async getAll(): Promise<Group[]> {
    const response = await enzymeClient.get<Group[]>(GROUP_ENDPOINTS.list);
    return response.data || [];
  },

  async create(data: Partial<Group>): Promise<Group> {
    const response = await enzymeClient.post<Group>(GROUP_ENDPOINTS.list, {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },
};

// ============================================================================
// Audit Service
// ============================================================================

const AUDIT_ENDPOINTS = {
  list: '/audit',
} as const;

export const enzymeAuditService = {
  async getLogs(): Promise<AuditLogEntry[]> {
    const response = await enzymeClient.get<AuditLogEntry[]>(AUDIT_ENDPOINTS.list);
    return response.data || [];
  },
};

// ============================================================================
// Parties Service
// ============================================================================

const PARTY_ENDPOINTS = {
  list: '/parties',
  detail: (id: string) => `/parties/${id}`,
  byCase: (caseId: string) => `/parties/case/${caseId}`,
  removeMember: (caseId: string, userId: string) => `/parties/case/${caseId}/user/${userId}`,
} as const;

export const enzymePartiesService = {
  async getAll(params?: { caseId?: string }): Promise<unknown[]> {
    const response = await enzymeClient.get<unknown[]>(PARTY_ENDPOINTS.list, {
      params: params as Record<string, string | number | boolean>,
    });
    return response.data || [];
  },

  async getByCaseId(caseId: string): Promise<CaseMember[]> {
    const response = await enzymeClient.get<CaseMember[]>(PARTY_ENDPOINTS.byCase(caseId));
    return response.data || [];
  },

  async create(data: unknown): Promise<unknown> {
    const response = await enzymeClient.post(PARTY_ENDPOINTS.list, {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async update(id: string, data: unknown): Promise<unknown> {
    const response = await enzymeClient.put(PARTY_ENDPOINTS.detail(id), {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await enzymeClient.delete(PARTY_ENDPOINTS.detail(id));
  },

  async removeMember(caseId: string, userId: string): Promise<void> {
    await enzymeClient.delete(PARTY_ENDPOINTS.removeMember(caseId, userId));
  },
};

// ============================================================================
// Users Service
// ============================================================================

const USER_ENDPOINTS = {
  list: '/users',
  detail: (id: string) => `/users/${id}`,
} as const;

export const enzymeUsersService = {
  async getAll(): Promise<unknown[]> {
    const response = await enzymeClient.get<unknown[]>(USER_ENDPOINTS.list);
    return response.data || [];
  },

  async getById(id: string): Promise<unknown> {
    const response = await enzymeClient.get(USER_ENDPOINTS.detail(id));
    return response.data;
  },

  async update(id: string, data: unknown): Promise<unknown> {
    const response = await enzymeClient.put(USER_ENDPOINTS.detail(id), {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await enzymeClient.delete(USER_ENDPOINTS.detail(id));
  },
};

// ============================================================================
// User Profiles Service
// ============================================================================

const USER_PROFILE_ENDPOINTS = {
  list: '/user-profiles',
  byUser: (userId: string) => `/user-profiles/user/${userId}`,
  lastActive: (userId: string) => `/user-profiles/user/${userId}/last-active`,
} as const;

export const enzymeUserProfilesService = {
  async get(userId: string): Promise<UserProfile> {
    const response = await enzymeClient.get<UserProfile>(USER_PROFILE_ENDPOINTS.byUser(userId));
    return response.data;
  },

  async create(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await enzymeClient.post<UserProfile>(USER_PROFILE_ENDPOINTS.list, {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async update(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await enzymeClient.put<UserProfile>(USER_PROFILE_ENDPOINTS.byUser(userId), {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async updateLastActive(userId: string): Promise<void> {
    await enzymeClient.put(USER_PROFILE_ENDPOINTS.lastActive(userId), {
      body: {},
    });
  },
};
