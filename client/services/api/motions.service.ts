// Motions Service
import { Motion } from '../../types';
import { fetchJson, postJson, putJson, deleteJson, buildQueryString } from '../http-client';

export const motionsService = {
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
};
