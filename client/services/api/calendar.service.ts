// Calendar Service
import { fetchJson, postJson, putJson, buildQueryString } from '../http-client';

export const calendarService = {
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
};
