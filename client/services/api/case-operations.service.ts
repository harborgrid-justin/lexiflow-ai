// Case Operations Service
import { LegalDocument, WorkflowStage, Motion, DiscoveryRequest, EvidenceItem, TimelineEvent, TimeEntry, CaseMember } from '../../types';
import { ApiEvidence } from '../../shared-types';
import { transformApiEvidence } from '../../utils/type-transformers';
import { fetchJson, postJson, deleteJson } from '../http-client';

export const caseOperationsService = {
  getDocuments: (caseId: string) =>
    fetchJson<LegalDocument[]>(`/cases/${caseId}/documents`),

  getWorkflow: (caseId: string) =>
    fetchJson<WorkflowStage[]>(`/cases/${caseId}/workflow`),

  getMotions: (caseId: string) =>
    fetchJson<Motion[]>(`/cases/${caseId}/motions`),

  getDiscovery: (caseId: string) =>
    fetchJson<DiscoveryRequest[]>(`/cases/${caseId}/discovery`),

  getEvidence: async (caseId: string): Promise<EvidenceItem[]> => {
    const apiEvidence = await fetchJson<ApiEvidence[]>(`/cases/${caseId}/evidence`);
    return apiEvidence.map(transformApiEvidence);
  },

  getTimeline: (caseId: string) =>
    fetchJson<TimelineEvent[]>(`/cases/${caseId}/timeline`),

  getBilling: (caseId: string) =>
    fetchJson<TimeEntry[]>(`/cases/${caseId}/billing`),

  getTeam: (caseId: string) =>
    fetchJson<CaseMember[]>(`/parties/case/${caseId}`),

  addTeamMember: (caseId: string, userId: string, role: string) =>
    postJson<void>('/parties', { case_id: caseId, user_id: userId, role }),

  removeTeamMember: (caseId: string, userId: string) =>
    deleteJson(`/parties/case/${caseId}/user/${userId}`),
};
