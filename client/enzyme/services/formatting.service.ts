// Formatting Service using Enzyme API Client
import { enzymeClient } from './client';
import { FormattingTemplate } from '../types';

const FORMATTING_ENDPOINTS = {
  apply: '/formatting/apply',
  templates: '/formatting/templates',
  rules: '/formatting/rules',
  tableOfAuthorities: '/formatting/table-of-authorities',
  pleadingPaper: '/formatting/pleading-paper',
  redact: '/formatting/redact',
  convert: '/formatting/convert',
  validate: '/formatting/validate',
} as const;

export const enzymeFormattingService = {
  async applyFormat(content: string, templateId: string): Promise<string> {
    const response = await enzymeClient.post<{ content: string }>(FORMATTING_ENDPOINTS.apply, {
      body: { content, templateId },
    });
    return response.data.content;
  },

  async getTemplates(): Promise<FormattingTemplate[]> {
    const response = await enzymeClient.get<FormattingTemplate[]>(FORMATTING_ENDPOINTS.templates);
    return response.data || [];
  },

  async getRules(jurisdiction: string): Promise<any> {
    const response = await enzymeClient.get<any>(FORMATTING_ENDPOINTS.rules, {
      params: { jurisdiction },
    });
    return response.data;
  },

  async generateTableOfAuthorities(documentId: string): Promise<string> {
    const response = await enzymeClient.post<{ content: string }>(FORMATTING_ENDPOINTS.tableOfAuthorities, {
      body: { documentId },
    });
    return response.data.content;
  },

  async generatePleadingPaper(caseId: string, content: string): Promise<string> {
    const response = await enzymeClient.post<{ content: string }>(FORMATTING_ENDPOINTS.pleadingPaper, {
      body: { caseId, content },
    });
    return response.data.content;
  },

  async redactDocument(documentId: string, terms: string[]): Promise<string> {
    const response = await enzymeClient.post<{ url: string }>(FORMATTING_ENDPOINTS.redact, {
      body: { documentId, terms },
    });
    return response.data.url;
  },

  async convertDocument(documentId: string, format: 'pdf' | 'docx' | 'txt'): Promise<string> {
    const response = await enzymeClient.post<{ url: string }>(FORMATTING_ENDPOINTS.convert, {
      body: { documentId, format },
    });
    return response.data.url;
  },

  async validateFormatting(content: string, ruleset: string): Promise<{ valid: boolean; errors: string[] }> {
    const response = await enzymeClient.post<{ valid: boolean; errors: string[] }>(FORMATTING_ENDPOINTS.validate, {
      body: { content, ruleset },
    });
    return response.data;
  },
};
