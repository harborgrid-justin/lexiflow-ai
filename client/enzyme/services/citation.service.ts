// Citation Service using Enzyme API Client
import { enzymeClient } from './client';
import { Citation } from '../types';

const CITATION_ENDPOINTS = {
  list: '/citations',
  detail: (id: string) => `/citations/${id}`,
  verify: '/citations/verify',
  format: '/citations/format',
  extract: '/citations/extract',
  batchVerify: '/citations/batch-verify',
  shepardize: (citationId: string) => `/citations/${citationId}/shepardize`,
  autoCorrect: '/citations/auto-correct',
  jurisdictionRules: (jurisdiction: string) => `/citations/rules/${jurisdiction}`,
  generateLinks: '/citations/generate-links',
} as const;

export const enzymeCitationService = {
  async getAll(params?: { caseId?: string }): Promise<Citation[]> {
    const response = await enzymeClient.get<Citation[]>(CITATION_ENDPOINTS.list, {
      params: params as Record<string, string | number | boolean>,
    });
    return response.data || [];
  },

  async verify(citation: string): Promise<{ isValid: boolean; corrections?: string[] }> {
    const response = await enzymeClient.post<{ isValid: boolean; corrections?: string[] }>(CITATION_ENDPOINTS.verify, {
      body: { citation },
    });
    return response.data;
  },

  async format(citation: string, style: string): Promise<string> {
    const response = await enzymeClient.post<{ formatted: string }>(CITATION_ENDPOINTS.format, {
      body: { citation, style },
    });
    return response.data.formatted;
  },

  async extractFromText(text: string): Promise<Citation[]> {
    const response = await enzymeClient.post<Citation[]>(CITATION_ENDPOINTS.extract, {
      body: { text },
    });
    return response.data || [];
  },

  async batchVerify(citations: string[]): Promise<any[]> {
    const response = await enzymeClient.post<any[]>(CITATION_ENDPOINTS.batchVerify, {
      body: { citations },
    });
    return response.data || [];
  },

  async shepardize(citationId: string): Promise<any> {
    const response = await enzymeClient.get<any>(CITATION_ENDPOINTS.shepardize(citationId));
    return response.data;
  },

  async autoCorrect(citation: string): Promise<{ corrected: string; confidence: number }> {
    const response = await enzymeClient.post<{ corrected: string; confidence: number }>(CITATION_ENDPOINTS.autoCorrect, {
      body: { citation },
    });
    return response.data;
  },

  async getJurisdictionRules(jurisdiction: string): Promise<any> {
    const response = await enzymeClient.get<any>(CITATION_ENDPOINTS.jurisdictionRules(jurisdiction));
    return response.data;
  },

  async generateLinks(citations: string[], provider: 'westlaw' | 'lexis' | 'bloomberg'): Promise<Record<string, string>> {
    const response = await enzymeClient.post<Record<string, string>>(CITATION_ENDPOINTS.generateLinks, {
      body: { citations, provider },
    });
    return response.data;
  },
};
