import { Case, User, LegalDocument, WorkflowStage, Motion, DiscoveryRequest, EvidenceItem, TimelineEvent, TimeEntry, WorkflowTask, ConflictCheck, Conversation, AuditLogEntry, Organization, Group, Client, Clause, JudgeProfile, OpposingCounselProfile, EthicalWall, Jurisdiction, KnowledgeItem, ResearchSession, UserProfile, CaseMember } from '../types';

<<<<<<< HEAD
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';
=======
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';
>>>>>>> b4d0bc2f20729f0cae80795919d7732bb666bd98

// Get auth token from localStorage or session storage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

// Get auth headers
const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};
<<<<<<< HEAD

// API Error class for better error handling
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = 'ApiError';
  }
}

// Handle API response errors
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    // Handle unauthorized
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
      throw new ApiError(401, 'Unauthorized');
    }

    // Try to parse error message from response
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }

    throw new ApiError(
      response.status,
      errorData.message || response.statusText,
      errorData
    );
  }

  // Handle empty responses (DELETE operations)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }

  try {
    return await response.json();
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    throw new ApiError(500, 'Invalid JSON response');
  }
};

// Retry logic for network failures
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    const response = await fetch(url, options);
    return await handleResponse<T>(response);
  } catch (error) {
    if (retries > 0 && (error as ApiError).status >= 500) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry<T>(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}

async function fetchJson<T>(endpoint: string): Promise<T> {
  return fetchWithRetry<T>(`${API_BASE_URL}${endpoint}`, {
    headers: getAuthHeaders(),
  });
=======

async function fetchJson<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
>>>>>>> b4d0bc2f20729f0cae80795919d7732bb666bd98
}

async function postJson<T>(endpoint: string, data: any): Promise<T> {
  return fetchWithRetry<T>(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
<<<<<<< HEAD
}

async function putJson<T>(endpoint: string, data: any): Promise<T> {
  return fetchWithRetry<T>(`${API_BASE_URL}${endpoint}`, {
=======
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

async function putJson<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
>>>>>>> b4d0bc2f20729f0cae80795919d7732bb666bd98
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
<<<<<<< HEAD
=======
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
>>>>>>> b4d0bc2f20729f0cae80795919d7732bb666bd98
}

async function deleteJson(endpoint: string): Promise<void> {
  return fetchWithRetry<void>(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
<<<<<<< HEAD
=======
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    throw new Error(`API Error: ${response.statusText}`);
  }
>>>>>>> b4d0bc2f20729f0cae80795919d7732bb666bd98
}

/**
 * Build query string from parameters
 */
function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * LexiFlow API Service
 * Production-ready API client for NestJS backend
 * Backend: http://localhost:3001/api/v1
 */
export const ApiService = {
<<<<<<< HEAD
  // ===========================
  // Authentication
  // ===========================
  auth: {
    login: (email: string, password: string) =>
      postJson<{ access_token: string; user: User }>('/auth/login', { email, password }),

    register: (userData: { email: string; password: string; name: string; role?: string }) =>
      postJson<User>('/auth/register', userData),

    getCurrentUser: () => fetchJson<User>('/auth/me'),
  },

  // ===========================
  // Cases
  // ===========================
  cases: {
    getAll: (orgId?: string) =>
      fetchJson<Case[]>(`/cases${buildQueryString({ orgId })}`),

    getById: (id: string) =>
      fetchJson<Case>(`/cases/${id}`),

    getByClient: (clientName: string) =>
      fetchJson<Case[]>(`/cases/client/${encodeURIComponent(clientName)}`),

    getByStatus: (status: string) =>
      fetchJson<Case[]>(`/cases/status/${encodeURIComponent(status)}`),

    create: (data: Partial<Case>) =>
      postJson<Case>('/cases', data),

    update: (id: string, data: Partial<Case>) =>
      putJson<Case>(`/cases/${id}`, data),

    delete: (id: string) =>
      deleteJson(`/cases/${id}`),
  },

  // ===========================
  // Documents
  // ===========================
  documents: {
    getAll: (caseId?: string, orgId?: string) =>
      fetchJson<LegalDocument[]>(`/documents${buildQueryString({ caseId, orgId })}`),

    getById: (id: string) =>
      fetchJson<LegalDocument>(`/documents/${id}`),

    getByType: (type: string) =>
      fetchJson<LegalDocument[]>(`/documents/type/${encodeURIComponent(type)}`),

    create: (data: Partial<LegalDocument>) =>
      postJson<LegalDocument>('/documents', data),

    update: (id: string, data: Partial<LegalDocument>) =>
      putJson<LegalDocument>(`/documents/${id}`, data),

    delete: (id: string) =>
      deleteJson(`/documents/${id}`),
  },

  // ===========================
  // Evidence
  // ===========================
  evidence: {
    getAll: (caseId?: string) =>
      fetchJson<EvidenceItem[]>(`/evidence${buildQueryString({ caseId })}`),

    getById: (id: string) =>
      fetchJson<EvidenceItem>(`/evidence/${id}`),

    create: (data: Partial<EvidenceItem>) =>
      postJson<EvidenceItem>('/evidence', data),

    update: (id: string, data: Partial<EvidenceItem>) =>
      putJson<EvidenceItem>(`/evidence/${id}`, data),

    delete: (id: string) =>
      deleteJson(`/evidence/${id}`),
  },

  // ===========================
  // Messages & Conversations
  // ===========================
  messages: {
    conversations: {
      getAll: (caseId?: string, userId?: string) =>
        fetchJson<Conversation[]>(`/messages/conversations${buildQueryString({ caseId, userId })}`),

      getById: (id: string) =>
        fetchJson<Conversation>(`/messages/conversations/${id}`),

      create: (data: Partial<Conversation>) =>
        postJson<Conversation>('/messages/conversations', data),

      update: (id: string, data: Partial<Conversation>) =>
        putJson<Conversation>(`/messages/conversations/${id}`, data),

      getMessages: (conversationId: string) =>
        fetchJson<any[]>(`/messages/conversations/${conversationId}/messages`),
    },

    create: (data: any) =>
      postJson<any>('/messages', data),

    getById: (id: string) =>
      fetchJson<any>(`/messages/${id}`),

    update: (id: string, data: any) =>
      putJson<any>(`/messages/${id}`, data),
  },

  // ===========================
  // Workflow
  // ===========================
  workflow: {
    stages: {
      getAll: (caseId?: string) =>
        fetchJson<WorkflowStage[]>(`/workflow/stages${buildQueryString({ caseId })}`),

      getById: (id: string) =>
        fetchJson<WorkflowStage>(`/workflow/stages/${id}`),

      create: (data: Partial<WorkflowStage>) =>
        postJson<WorkflowStage>('/workflow/stages', data),

      update: (id: string, data: Partial<WorkflowStage>) =>
        putJson<WorkflowStage>(`/workflow/stages/${id}`, data),
    },

    tasks: {
      getAll: (stageId?: string, assigneeId?: string) =>
        fetchJson<WorkflowTask[]>(`/workflow/tasks${buildQueryString({ stageId, assigneeId })}`),

      getById: (id: string) =>
        fetchJson<WorkflowTask>(`/workflow/tasks/${id}`),

      create: (data: Partial<WorkflowTask>) =>
        postJson<WorkflowTask>('/workflow/tasks', data),

      update: (id: string, data: Partial<WorkflowTask>) =>
        putJson<WorkflowTask>(`/workflow/tasks/${id}`, data),
    },
  },

  // ===========================
  // Motions
  // ===========================
  motions: {
    getAll: (caseId?: string) =>
      fetchJson<Motion[]>(`/motions${buildQueryString({ caseId })}`),

    getById: (id: string) =>
      fetchJson<Motion>(`/motions/${id}`),

    getByStatus: (status: string) =>
      fetchJson<Motion[]>(`/motions/status/${encodeURIComponent(status)}`),

    create: (data: Partial<Motion>) =>
      postJson<Motion>('/motions', data),

    update: (id: string, data: Partial<Motion>) =>
      putJson<Motion>(`/motions/${id}`, data),

    delete: (id: string) =>
      deleteJson(`/motions/${id}`),
  },

  // ===========================
  // Discovery
  // ===========================
  discovery: {
    getAll: (caseId?: string) =>
      fetchJson<DiscoveryRequest[]>(`/discovery${buildQueryString({ caseId })}`),

    getById: (id: string) =>
      fetchJson<DiscoveryRequest>(`/discovery/${id}`),

    create: (data: Partial<DiscoveryRequest>) =>
      postJson<DiscoveryRequest>('/discovery', data),

    update: (id: string, data: Partial<DiscoveryRequest>) =>
      putJson<DiscoveryRequest>(`/discovery/${id}`, data),

    delete: (id: string) =>
      deleteJson(`/discovery/${id}`),
  },

  // ===========================
  // Billing
  // ===========================
  billing: {
    timeEntries: {
      getAll: (caseId?: string, userId?: string) =>
        fetchJson<TimeEntry[]>(`/billing/time-entries${buildQueryString({ caseId, userId })}`),

      getById: (id: string) =>
        fetchJson<TimeEntry>(`/billing/time-entries/${id}`),

      create: (data: Partial<TimeEntry>) =>
        postJson<TimeEntry>('/billing/time-entries', data),

      update: (id: string, data: Partial<TimeEntry>) =>
        putJson<TimeEntry>(`/billing/time-entries/${id}`, data),

      delete: (id: string) =>
        deleteJson(`/billing/time-entries/${id}`),
    },

    getStats: (caseId?: string, startDate?: string, endDate?: string) =>
      fetchJson<any>(`/billing/stats${buildQueryString({ caseId, startDate, endDate })}`),
  },

  // ===========================
  // Calendar
  // ===========================
  calendar: {
    getAll: (caseId?: string, startDate?: string, endDate?: string) =>
      fetchJson<any[]>(`/calendar${buildQueryString({ caseId, startDate, endDate })}`),

    getById: (id: string) =>
      fetchJson<any>(`/calendar/${id}`),

    getUpcoming: (days?: number) =>
      fetchJson<any[]>(`/calendar/upcoming${buildQueryString({ days })}`),

    getByType: (type: string) =>
      fetchJson<any[]>(`/calendar/type/${encodeURIComponent(type)}`),

    create: (data: any) =>
      postJson<any>('/calendar', data),

    update: (id: string, data: any) =>
      putJson<any>(`/calendar/${id}`, data),
  },

  // ===========================
  // Tasks
  // ===========================
  tasks: {
    getAll: (caseId?: string, assigneeId?: string) =>
      fetchJson<WorkflowTask[]>(`/tasks${buildQueryString({ caseId, assigneeId })}`),

    getById: (id: string) =>
      fetchJson<WorkflowTask>(`/tasks/${id}`),

    getByStatus: (status: string) =>
      fetchJson<WorkflowTask[]>(`/tasks/status/${encodeURIComponent(status)}`),

    create: (data: Partial<WorkflowTask>) =>
      postJson<WorkflowTask>('/tasks', data),

    update: (id: string, data: Partial<WorkflowTask>) =>
      putJson<WorkflowTask>(`/tasks/${id}`, data),

    delete: (id: string) =>
      deleteJson(`/tasks/${id}`),
  },

  // ===========================
  // Users
  // ===========================
  users: {
    getAll: (orgId?: string) =>
      fetchJson<User[]>(`/users${buildQueryString({ orgId })}`),

    getById: (id: string) =>
      fetchJson<User>(`/users/${id}`),

    getByEmail: (email: string) =>
      fetchJson<User>(`/users/email/${encodeURIComponent(email)}`),

    update: (id: string, data: Partial<User>) =>
      putJson<User>(`/users/${id}`, data),

    delete: (id: string) =>
      deleteJson(`/users/${id}`),
  },

  // ===========================
  // Organizations
  // ===========================
  organizations: {
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
  },

  // ===========================
  // Clients
  // ===========================
  clients: {
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
  },

  // ===========================
  // Analytics
  // ===========================
  analytics: {
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

    create: (data: any) =>
      postJson<any>('/analytics', data),
  },

  // ===========================
  // Compliance
  // ===========================
  compliance: {
    getAll: (orgId?: string) =>
      fetchJson<any[]>(`/compliance${buildQueryString({ orgId })}`),

    getById: (id: string) =>
      fetchJson<any>(`/compliance/${id}`),

    getByRiskLevel: (riskLevel: string) =>
      fetchJson<any[]>(`/compliance/risk-level/${encodeURIComponent(riskLevel)}`),

    create: (data: any) =>
      postJson<any>('/compliance', data),

    update: (id: string, data: any) =>
      putJson<any>(`/compliance/${id}`, data),
  },

  // ===========================
  // Knowledge Base
  // ===========================
  knowledge: {
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
  },

  // ===========================
  // Jurisdictions
  // ===========================
  jurisdictions: {
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
  },

  // ===========================
  // Clauses
  // ===========================
  clauses: {
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
  },

  // ===========================
  // Search (Advanced)
  // ===========================
  search: {
    semantic: (query: string, limit?: number, threshold?: number) =>
      postJson<any>('/search/semantic', { query, limit, threshold }),

    hybrid: (query: string, limit?: number, semanticWeight?: number) =>
      postJson<any>('/search/hybrid', { query, limit, semanticWeight }),

    findSimilarDocuments: (documentId: string, limit?: number) =>
      fetchJson<any>(`/search/similar-documents/${documentId}${buildQueryString({ limit })}`),

    extractLegalCitations: (text: string, documentId?: string) =>
      postJson<any>('/search/legal-citations', { text, documentId }),

    getQueryHistory: (limit?: number) =>
      fetchJson<any>(`/search/query-history${buildQueryString({ limit })}`),
  },

  // ===========================
  // Utility Methods
  // ===========================

  /**
   * Set authentication token in local storage
   */
  setAuthToken: (token: string, remember: boolean = true) => {
    if (remember) {
      localStorage.setItem('authToken', token);
    } else {
      sessionStorage.setItem('authToken', token);
    }
  },

  /**
   * Clear authentication token from storage
   */
=======
  // Authentication
  login: (email: string, password: string) => postJson<{access_token: string, user: User}>('/auth/login', { email, password }),
  register: (userData: Partial<User>) => postJson<{access_token: string, user: User}>('/auth/register', userData),
  logout: () => postJson<void>('/auth/logout', {}),
  getCurrentUser: () => fetchJson<User>('/auth/me'),

  // Cases
  getCases: () => fetchJson<Case[]>('/cases'),
  getCase: (id: string) => fetchJson<Case>(`/cases/${id}`),
  createCase: (data: Partial<Case>) => postJson<Case>('/cases', data),
  updateCase: (id: string, data: Partial<Case>) => putJson<Case>(`/cases/${id}`, data),
  deleteCase: (id: string) => deleteJson(`/cases/${id}`),

  // Users
  getUsers: () => fetchJson<User[]>('/users'),
  getUser: (id: string) => fetchJson<User>(`/users/${id}`),
  createUser: (data: Partial<User>) => postJson<User>('/users', data),
  updateUser: (id: string, data: Partial<User>) => putJson<User>(`/users/${id}`, data),
  deleteUser: (id: string) => deleteJson(`/users/${id}`),

  // User Profiles
  getUserProfile: (userId: string) => fetchJson<UserProfile>(`/user-profiles/user/${userId}`),
  createUserProfile: (data: Partial<UserProfile>) => postJson<UserProfile>('/user-profiles', data),
  updateUserProfile: (userId: string, data: Partial<UserProfile>) => putJson<UserProfile>(`/user-profiles/user/${userId}`, data),
  updateUserLastActive: (userId: string) => putJson<void>(`/user-profiles/user/${userId}/last-active`, {}),

  // Documents
  getDocuments: () => fetchJson<LegalDocument[]>('/documents'),
  getDocument: (id: string) => fetchJson<LegalDocument>(`/documents/${id}`),
  createDocument: (data: Partial<LegalDocument>) => postJson<LegalDocument>('/documents', data),
  updateDocument: (id: string, data: Partial<LegalDocument>) => putJson<LegalDocument>(`/documents/${id}`, data),
  deleteDocument: (id: string) => deleteJson(`/documents/${id}`),

  // Evidence
  getEvidence: () => fetchJson<EvidenceItem[]>('/evidence'),
  getEvidenceItem: (id: string) => fetchJson<EvidenceItem>(`/evidence/${id}`),
  createEvidence: (data: Partial<EvidenceItem>) => postJson<EvidenceItem>('/evidence', data),
  updateEvidence: (id: string, data: Partial<EvidenceItem>) => putJson<EvidenceItem>(`/evidence/${id}`, data),
  deleteEvidence: (id: string) => deleteJson(`/evidence/${id}`),

  // Tasks
  getTasks: () => fetchJson<WorkflowTask[]>('/tasks'),
  getTask: (id: string) => fetchJson<WorkflowTask>(`/tasks/${id}`),
  createTask: (data: Partial<WorkflowTask>) => postJson<WorkflowTask>('/tasks', data),
  updateTask: (id: string, data: Partial<WorkflowTask>) => putJson<WorkflowTask>(`/tasks/${id}`, data),
  deleteTask: (id: string) => deleteJson(`/tasks/${id}`),

  // Motions
  getMotions: () => fetchJson<Motion[]>('/motions'),
  getMotion: (id: string) => fetchJson<Motion>(`/motions/${id}`),
  createMotion: (data: Partial<Motion>) => postJson<Motion>('/motions', data),
  updateMotion: (id: string, data: Partial<Motion>) => putJson<Motion>(`/motions/${id}`, data),
  deleteMotion: (id: string) => deleteJson(`/motions/${id}`),

  // Discovery
  getDiscovery: () => fetchJson<DiscoveryRequest[]>('/discovery'),
  getDiscoveryRequest: (id: string) => fetchJson<DiscoveryRequest>(`/discovery/${id}`),
  createDiscoveryRequest: (data: Partial<DiscoveryRequest>) => postJson<DiscoveryRequest>('/discovery', data),
  updateDiscoveryRequest: (id: string, data: Partial<DiscoveryRequest>) => putJson<DiscoveryRequest>(`/discovery/${id}`, data),
  deleteDiscoveryRequest: (id: string) => deleteJson(`/discovery/${id}`),

  // Workflow
  getWorkflowStages: () => fetchJson<WorkflowStage[]>('/workflow/stages'),
  getWorkflowTasks: () => fetchJson<WorkflowTask[]>('/workflow/tasks'),
  createWorkflowStage: (data: Partial<WorkflowStage>) => postJson<WorkflowStage>('/workflow/stages', data),
  updateWorkflowStage: (id: string, data: Partial<WorkflowStage>) => putJson<WorkflowStage>(`/workflow/stages/${id}`, data),

  // Billing
  getTimeEntries: () => fetchJson<TimeEntry[]>('/billing'),
  getTimeEntry: (id: string) => fetchJson<TimeEntry>(`/billing/${id}`),
  createTimeEntry: (data: Partial<TimeEntry>) => postJson<TimeEntry>('/billing', data),
  updateTimeEntry: (id: string, data: Partial<TimeEntry>) => putJson<TimeEntry>(`/billing/${id}`, data),
  deleteTimeEntry: (id: string) => deleteJson(`/billing/${id}`),
  getBillingStats: () => fetchJson<{wip: any[], realization: any[]}>('/billing/stats'),

  // Calendar
  getCalendarEvents: () => fetchJson<any[]>('/calendar'),
  getCalendarDeadlines: () => fetchJson<any[]>('/calendar/deadlines'),
  getCalendarHearings: () => fetchJson<any[]>('/calendar/hearings'),
  getCalendarSOL: () => fetchJson<any[]>('/calendar/sol'),
  getCalendarTeam: () => fetchJson<any[]>('/calendar/team'),

  // Organizations
  getOrganizations: () => fetchJson<Organization[]>('/organizations'),
  getOrganization: (id: string) => fetchJson<Organization>(`/organizations/${id}`),
  createOrganization: (data: Partial<Organization>) => postJson<Organization>('/organizations', data),
  updateOrganization: (id: string, data: Partial<Organization>) => putJson<Organization>(`/organizations/${id}`, data),

  // Clients
  getClients: () => fetchJson<Client[]>('/clients'),
  getClient: (id: string) => fetchJson<Client>(`/clients/${id}`),
  createClient: (data: Partial<Client>) => postJson<Client>('/clients', data),
  updateClient: (id: string, data: Partial<Client>) => putJson<Client>(`/clients/${id}`, data),

  // Jurisdictions
  getJurisdictions: (type?: string) => fetchJson<Jurisdiction[]>(`/jurisdictions${type ? `?type=${type}` : ''}`),
  getJurisdiction: (id: string) => fetchJson<Jurisdiction>(`/jurisdictions/${id}`),

  // Knowledge Base
  getKnowledgeBase: (category?: string) => fetchJson<KnowledgeItem[]>(`/knowledge${category ? `?category=${category}` : ''}`),
  getKnowledgeItem: (id: string) => fetchJson<KnowledgeItem>(`/knowledge/${id}`),

  // Parties
  getParties: (caseId?: string) => fetchJson<any[]>(`/parties${caseId ? `?caseId=${caseId}` : ''}`),
  createParty: (data: any) => postJson<any>('/parties', data),
  updateParty: (id: string, data: any) => putJson<any>(`/parties/${id}`, data),
  deleteParty: (id: string) => deleteJson(`/parties/${id}`),

  // Compliance
  getConflicts: () => fetchJson<ConflictCheck[]>('/compliance/conflicts'),
  getWalls: () => fetchJson<EthicalWall[]>('/compliance/walls'),
  createConflictCheck: (data: Partial<ConflictCheck>) => postJson<ConflictCheck>('/compliance/conflicts', data),
  createEthicalWall: (data: Partial<EthicalWall>) => postJson<EthicalWall>('/compliance/walls', data),

  // Analytics
  getJudgeAnalytics: () => fetchJson<{profile: JudgeProfile, stats: any[]}>('/analytics/judge'),
  getCounselAnalytics: () => fetchJson<{profile: OpposingCounselProfile, outcomes: any[]}>('/analytics/counsel'),
  getDashboard: () => fetchJson<{stats: any[], chartData: any[], alerts: any[]}>('/analytics/dashboard'),

  // Messages
  getConversations: () => fetchJson<Conversation[]>('/messages'),
  createConversation: (data: Partial<Conversation>) => postJson<Conversation>('/messages', data),
  sendMessage: (conversationId: string, text: string, senderId?: string) => postJson<void>(`/messages/${conversationId}/send`, { text, senderId }),

  // Admin/Audit
  getAuditLogs: () => fetchJson<AuditLogEntry[]>('/audit'),
  getGroups: () => fetchJson<Group[]>('/groups'),
  createGroup: (data: Partial<Group>) => postJson<Group>('/groups', data),

  // Case-specific operations
  getCaseDocuments: (caseId: string) => fetchJson<LegalDocument[]>(`/cases/${caseId}/documents`),
  getCaseWorkflow: (caseId: string) => fetchJson<WorkflowStage[]>(`/cases/${caseId}/workflow`),
  getCaseMotions: (caseId: string) => fetchJson<Motion[]>(`/cases/${caseId}/motions`),
  getCaseDiscovery: (caseId: string) => fetchJson<DiscoveryRequest[]>(`/cases/${caseId}/discovery`),
  getCaseEvidence: (caseId: string) => fetchJson<EvidenceItem[]>(`/cases/${caseId}/evidence`),
  getCaseTimeline: (caseId: string) => fetchJson<TimelineEvent[]>(`/cases/${caseId}/timeline`),
  getCaseBilling: (caseId: string) => fetchJson<TimeEntry[]>(`/cases/${caseId}/billing`),
  getCaseTeam: (caseId: string) => fetchJson<CaseMember[]>(`/parties/case/${caseId}`),
  addCaseTeamMember: (caseId: string, userId: string, role: string) => postJson<void>(`/parties`, { case_id: caseId, user_id: userId, role }),
  removeCaseTeamMember: (caseId: string, userId: string) => deleteJson(`/parties/case/${caseId}/user/${userId}`),

  // Clauses
  getClauses: () => fetchJson<Clause[]>('/clauses'),
  getClause: (id: string) => fetchJson<Clause>(`/clauses/${id}`),
  createClause: (data: Partial<Clause>) => postJson<Clause>('/clauses', data),
  updateClause: (id: string, data: Partial<Clause>) => putJson<Clause>(`/clauses/${id}`, data),
  deleteClause: (id: string) => deleteJson(`/clauses/${id}`),

  // Research/Search
  getResearchHistory: () => fetchJson<ResearchSession[]>('/search/history'),
  saveResearchSession: (data: Partial<ResearchSession>) => postJson<ResearchSession>('/search/sessions', data),
  updateResearchFeedback: (id: string, feedback: 'positive' | 'negative') => putJson<void>(`/search/sessions/${id}/feedback`, { feedback }),
  performSearch: (query: string) => postJson<any>('/search', { query }),

  // Utility functions
  setAuthToken: (token: string) => {
    localStorage.setItem('authToken', token);
  },
>>>>>>> b4d0bc2f20729f0cae80795919d7732bb666bd98
  clearAuthToken: () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  },
<<<<<<< HEAD

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return getAuthToken() !== null;
  },

  /**
   * Get current auth token
   */
  getToken: (): string | null => {
    return getAuthToken();
  },
=======
>>>>>>> b4d0bc2f20729f0cae80795919d7732bb666bd98
};
