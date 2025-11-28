import { Case, User, LegalDocument, WorkflowStage, Motion, DiscoveryRequest, EvidenceItem, TimelineEvent, TimeEntry, WorkflowTask, ConflictCheck, Conversation, AuditLogEntry, Organization, Group, Client, Clause, JudgeProfile, OpposingCounselProfile, EthicalWall, Jurisdiction, KnowledgeItem, ResearchSession, UserProfile, CaseMember } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

async function fetchJson<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

async function postJson<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

async function putJson<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

async function deleteJson(endpoint: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
}

export const ApiService = {
  getCases: () => fetchJson<Case[]>('/cases'),
  getCase: (id: string) => fetchJson<Case>(`/cases/${id}`),
  getUsers: () => fetchJson<User[]>('/users'),
  getUserProfile: (id: string) => fetchJson<UserProfile>(`/users/${id}/profile`),
  updateUserProfile: (id: string, data: Partial<UserProfile>) => putJson<UserProfile>(`/users/${id}/profile`, data),
  
  getDocuments: () => fetchJson<LegalDocument[]>('/documents'),
  getDocument: (id: string) => fetchJson<LegalDocument>(`/documents/${id}`),
  getEvidence: () => fetchJson<EvidenceItem[]>('/evidence'),
  getTasks: () => fetchJson<WorkflowTask[]>('/tasks'),
  getMotions: () => fetchJson<Motion[]>('/motions'),
  getDiscovery: () => fetchJson<DiscoveryRequest[]>('/discovery'),
  getLegalHolds: () => fetchJson<any[]>('/discovery/holds'),
  getPrivilegeLogs: () => fetchJson<any[]>('/discovery/privilege'),
  getConflicts: () => fetchJson<ConflictCheck[]>('/compliance/conflicts'),
  getWalls: () => fetchJson<EthicalWall[]>('/compliance/walls'),
  getDashboard: () => fetchJson<{stats: any[], chartData: any[], alerts: any[]}>('/dashboard'),
  getConversations: () => fetchJson<Conversation[]>('/messages/conversations'),
  getBillingStats: () => fetchJson<{wip: any[], realization: any[]}>('/billing/stats'),
  getAuditLogs: () => fetchJson<AuditLogEntry[]>('/admin/audit-logs'),
  getOrganizations: () => fetchJson<Organization[]>('/admin/orgs'),
  getGroups: () => fetchJson<Group[]>('/admin/groups'),
  getFirmProcesses: () => fetchJson<any[]>('/admin/processes'),
  getClients: () => fetchJson<Client[]>('/clients'),
  getClauses: () => fetchJson<Clause[]>('/clauses'),
  getJurisdictions: (type?: string) => fetchJson<Jurisdiction[]>(`/jurisdictions${type ? `?type=${type}` : ''}`),
  getKnowledgeBase: (category?: string) => fetchJson<KnowledgeItem[]>(`/knowledge-base${category ? `?category=${category}` : ''}`),
  getResearchHistory: () => fetchJson<ResearchSession[]>('/research/history'),
  getJudgeAnalytics: () => fetchJson<{profile: JudgeProfile, stats: any[]}>('/analytics/judge'),
  getCounselAnalytics: () => fetchJson<{profile: OpposingCounselProfile, outcomes: any[]}>('/analytics/counsel'),
  
  getCalendarDeadlines: () => fetchJson<any[]>('/calendar/deadlines'),
  getCalendarHearings: () => fetchJson<any[]>('/calendar/hearings'),
  getCalendarSOL: () => fetchJson<any[]>('/calendar/sol'),
  getCalendarTeam: () => fetchJson<any[]>('/calendar/team'),

  getCaseDocuments: (caseId: string) => fetchJson<LegalDocument[]>(`/cases/${caseId}/documents`),
  getCaseWorkflow: (caseId: string) => fetchJson<WorkflowStage[]>(`/cases/${caseId}/workflow`),
  getCaseMotions: (caseId: string) => fetchJson<Motion[]>(`/cases/${caseId}/motions`),
  getCaseDiscovery: (caseId: string) => fetchJson<DiscoveryRequest[]>(`/cases/${caseId}/discovery`),
  getCaseEvidence: (caseId: string) => fetchJson<EvidenceItem[]>(`/cases/${caseId}/evidence`),
  getCaseTimeline: (caseId: string) => fetchJson<TimelineEvent[]>(`/cases/${caseId}/timeline`),
  getCaseBilling: (caseId: string) => fetchJson<TimeEntry[]>(`/cases/${caseId}/billing`),
  getCaseTeam: (caseId: string) => fetchJson<CaseMember[]>(`/cases/${caseId}/team`),
  addCaseTeamMember: (caseId: string, userId: string, role: string) => postJson<void>(`/cases/${caseId}/team`, { userId, role }),
  removeCaseTeamMember: (caseId: string, userId: string) => deleteJson(`/cases/${caseId}/team/${userId}`),

  // Write operations
  createCase: (data: Partial<Case>) => postJson<Case>('/cases', data),
  updateCase: (id: string, data: Partial<Case>) => putJson<Case>(`/cases/${id}`, data),
  
  createDocument: (data: Partial<LegalDocument>) => postJson<LegalDocument>('/documents', data),
  updateDocument: (id: string, data: Partial<LegalDocument>) => putJson<LegalDocument>(`/documents/${id}`, data),
  deleteDocument: (id: string) => deleteJson(`/documents/${id}`),
  
  createEvidence: (data: Partial<EvidenceItem>) => postJson<EvidenceItem>('/evidence', data),
  updateEvidence: (id: string, data: Partial<EvidenceItem>) => putJson<EvidenceItem>(`/evidence/${id}`, data),
  
  createTask: (data: Partial<WorkflowTask>) => postJson<WorkflowTask>('/tasks', data),
  updateTask: (id: string, data: Partial<WorkflowTask>) => putJson<WorkflowTask>(`/tasks/${id}`, data),
  
  createMotion: (data: Partial<Motion>) => postJson<Motion>('/motions', data),

  sendMessage: (conversationId: string, text: string, senderId?: string) => postJson<void>(`/messages/${conversationId}`, { text, senderId }),
  createConversation: (data: Partial<Conversation>) => postJson<Conversation>('/messages/conversations', data),

  createTimeEntry: (data: Partial<TimeEntry>) => postJson<TimeEntry>('/billing/entries', data),
  updateDiscoveryRequest: (id: string, data: Partial<DiscoveryRequest>) => putJson<DiscoveryRequest>(`/discovery/${id}`, data),

  saveResearchSession: (data: Partial<ResearchSession>) => postJson<ResearchSession>('/research/sessions', data),
  updateResearchFeedback: (id: string, feedback: 'positive' | 'negative') => putJson<void>(`/research/sessions/${id}/feedback`, { feedback }),
};
