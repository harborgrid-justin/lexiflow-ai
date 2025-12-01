// Evidence Service
import { EvidenceItem } from '../../types';
import { ApiEvidence } from '../../shared-types';
import { transformApiEvidence } from '../../utils/type-transformers';
import { fetchJson, postJson, putJson, deleteJson, buildQueryString } from '../http-client';

export const evidenceService = {
  getAll: async (caseId?: string): Promise<EvidenceItem[]> => {
    const apiEvidence = await fetchJson<ApiEvidence[]>(`/evidence${buildQueryString({ caseId })}`);
    return (apiEvidence || []).map(transformApiEvidence);
  },

  getById: async (id: string): Promise<EvidenceItem> => {
    const apiEvidence = await fetchJson<ApiEvidence>(`/evidence/${id}`);
    return transformApiEvidence(apiEvidence);
  },

  create: async (data: Partial<EvidenceItem>): Promise<EvidenceItem> => {
    const apiEvidence = await postJson<ApiEvidence>('/evidence', data);
    return transformApiEvidence(apiEvidence);
  },

  update: async (id: string, data: Partial<EvidenceItem>): Promise<EvidenceItem> => {
    const apiEvidence = await putJson<ApiEvidence>(`/evidence/${id}`, data);
    return transformApiEvidence(apiEvidence);
  },

  delete: (id: string) =>
    deleteJson(`/evidence/${id}`),
};
