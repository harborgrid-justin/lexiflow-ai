// Billing Service
import { TimeEntry } from '../../types';
import { fetchJson, postJson, putJson, deleteJson, buildQueryString } from '../http-client';

export const billingService = {
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
};
