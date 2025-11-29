import { Case, User, LegalDocument, WorkflowStage, Motion, DiscoveryRequest, EvidenceItem, TimelineEvent, TimeEntry, WorkflowTask, ConflictCheck, Conversation, AuditLogEntry, Organization, Group, Client, Clause, JudgeProfile, OpposingCounselProfile, EthicalWall, Jurisdiction, KnowledgeItem, ResearchSession, UserProfile, CaseMember } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

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
}

async function postJson<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
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
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
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

async function deleteJson(endpoint: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    throw new Error(`API Error: ${response.statusText}`);
  }
}

export const ApiService = {
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
  clearAuthToken: () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  },
};
