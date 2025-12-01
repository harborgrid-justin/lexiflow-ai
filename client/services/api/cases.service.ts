// Cases Service
import { Case } from '../../types';
import { ApiCase } from '../../shared-types';
import { transformApiCase } from '../../utils/type-transformers';
import { fetchJson, postJson, putJson, deleteJson, buildQueryString } from '../http-client';

export const casesService = {
  getAll: async (orgId?: string): Promise<Case[]> => {
    const apiCases = await fetchJson<ApiCase[]>(`/cases${buildQueryString({ orgId })}`);
    return (apiCases || []).map(transformApiCase);
  },

  getById: async (id: string): Promise<Case> => {
    const apiCase = await fetchJson<ApiCase>(`/cases/${id}`);
    return transformApiCase(apiCase);
  },

  getByClient: async (clientName: string): Promise<Case[]> => {
    const apiCases = await fetchJson<ApiCase[]>(`/cases/client/${encodeURIComponent(clientName)}`);
    return (apiCases || []).map(transformApiCase);
  },

  getByStatus: async (status: string): Promise<Case[]> => {
    const apiCases = await fetchJson<ApiCase[]>(`/cases/status/${encodeURIComponent(status)}`);
    return (apiCases || []).map(transformApiCase);
  },

  create: async (data: Partial<Case>): Promise<Case> => {
    const apiRequest = {
      title: data.title,
      client_name: data.client,
      opposing_counsel: data.opposingCounsel,
      status: data.status,
      filing_date: data.filingDate,
      description: data.description,
      value: data.value,
      matter_type: data.matterType,
      jurisdiction: data.jurisdiction,
      court: data.court,
      billing_model: data.billingModel,
      judge: data.judge,
      owner_org_id: data.ownerOrgId,
    };
    const cleanRequest = Object.fromEntries(
      Object.entries(apiRequest).filter(([_, v]) => v !== undefined)
    );
    const apiCase = await postJson<ApiCase>('/cases', cleanRequest);
    return transformApiCase(apiCase);
  },

  update: async (id: string, data: Partial<Case>): Promise<Case> => {
    const apiRequest = {
      title: data.title,
      client_name: data.client,
      opposing_counsel: data.opposingCounsel,
      status: data.status,
      filing_date: data.filingDate,
      description: data.description,
      value: data.value,
      matter_type: data.matterType,
      jurisdiction: data.jurisdiction,
      court: data.court,
      billing_model: data.billingModel,
      judge: data.judge,
      owner_org_id: data.ownerOrgId,
    };
    const cleanRequest = Object.fromEntries(
      Object.entries(apiRequest).filter(([_, v]) => v !== undefined)
    );
    const apiCase = await putJson<ApiCase>(`/cases/${id}`, cleanRequest);
    return transformApiCase(apiCase);
  },

  delete: (id: string) => deleteJson(`/cases/${id}`),

  parsePacerDocket: async (docketText: string): Promise<any> => {
    return postJson<any>('/cases/parse-pacer', { docketText });
  },

  importPacer: async (parsedData: any): Promise<{ 
    case: Case; 
    parties: any[]; 
    motions: any[]; 
    documents: any[];
    workflow: {
      stages: any[];
      tasks: any[];
    };
  }> => {
    const response = await postJson<{ 
      case: ApiCase; 
      parties: any[]; 
      motions: any[]; 
      documents: any[];
      workflow: {
        stages: any[];
        tasks: any[];
      };
    }>('/cases/import-pacer', parsedData);
    return {
      case: transformApiCase(response.case),
      parties: response.parties || [],
      motions: response.motions || [],
      documents: response.documents || [],
      workflow: response.workflow || { stages: [], tasks: [] },
    };
  },
};
