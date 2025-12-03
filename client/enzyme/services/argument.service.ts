// Argument Service using Enzyme API Client
import { enzymeClient } from './client';
import { Argument, ArgumentVersion, JudgeAnalytics } from '../types';

const ARGUMENT_ENDPOINTS = {
  list: '/arguments',
  detail: (id: string) => `/arguments/${id}`,
  analyze: '/arguments/analyze',
  generate: '/arguments/generate',
  strengthen: (id: string) => `/arguments/${id}/strengthen`,
  rebuttal: (id: string) => `/arguments/${id}/rebuttal`,
  versions: (id: string) => `/arguments/${id}/versions`,
  sentiment: (id: string) => `/arguments/${id}/sentiment`,
  precedents: (id: string) => `/arguments/${id}/precedents`,
  judgeReception: (id: string) => `/arguments/${id}/judge-reception`,
} as const;

export const enzymeArgumentService = {
  async getAll(params?: { caseId?: string }): Promise<Argument[]> {
    const response = await enzymeClient.get<Argument[]>(ARGUMENT_ENDPOINTS.list, {
      params: params as Record<string, string | number | boolean>,
    });
    return response.data || [];
  },

  async getById(id: string): Promise<Argument> {
    const response = await enzymeClient.get<Argument>(ARGUMENT_ENDPOINTS.detail(id));
    return response.data;
  },

  async create(data: Partial<Argument>): Promise<Argument> {
    const response = await enzymeClient.post<Argument>(ARGUMENT_ENDPOINTS.list, {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async update(id: string, data: Partial<Argument>): Promise<Argument> {
    const response = await enzymeClient.put<Argument>(ARGUMENT_ENDPOINTS.detail(id), {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await enzymeClient.delete(ARGUMENT_ENDPOINTS.detail(id));
  },

  async analyze(content: string): Promise<any> {
    const response = await enzymeClient.post<any>(ARGUMENT_ENDPOINTS.analyze, {
      body: { content },
    });
    return response.data;
  },

  async generate(params: { caseId: string; topic: string; stance: string }): Promise<string> {
    const response = await enzymeClient.post<{ content: string }>(ARGUMENT_ENDPOINTS.generate, {
      body: params as Record<string, unknown>,
    });
    return response.data.content;
  },

  async getRebuttal(id: string): Promise<string> {
    const response = await enzymeClient.get<{ content: string }>(ARGUMENT_ENDPOINTS.rebuttal(id));
    return response.data.content;
  },

  async getVersions(id: string): Promise<ArgumentVersion[]> {
    const response = await enzymeClient.get<ArgumentVersion[]>(ARGUMENT_ENDPOINTS.versions(id));
    return response.data || [];
  },

  async getSentimentAnalysis(id: string): Promise<any> {
    const response = await enzymeClient.get<any>(ARGUMENT_ENDPOINTS.sentiment(id));
    return response.data;
  },

  async getSupportingPrecedents(id: string): Promise<any[]> {
    const response = await enzymeClient.get<any[]>(ARGUMENT_ENDPOINTS.precedents(id));
    return response.data || [];
  },

  async predictJudgeReception(id: string, judgeName: string): Promise<JudgeAnalytics> {
    const response = await enzymeClient.post<JudgeAnalytics>(ARGUMENT_ENDPOINTS.judgeReception(id), {
      body: { judgeName },
    });
    return response.data;
  },
};
