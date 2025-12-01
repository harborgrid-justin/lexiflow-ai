// Discovery Service
import { DiscoveryRequest } from '../../types';
import { fetchJson, postJson, putJson, deleteJson, buildQueryString } from '../http-client';

export const discoveryService = {
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
};
