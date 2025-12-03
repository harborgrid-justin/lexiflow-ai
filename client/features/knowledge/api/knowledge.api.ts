/**
 * Knowledge Feature - API Service
 * 
 * Handles all API calls for knowledge base and clause library.
 */

import { enzymeClient } from '@/enzyme';
import { ApiService } from '@/services/apiService';
import type {
  KnowledgeItem,
  Clause,
  CreateClauseRequest,
  UpdateClauseRequest,
  CreateKnowledgeItemRequest
} from './knowledge.types';

export const KnowledgeApi = {
  // Knowledge Base
  getItems: async (category?: string): Promise<KnowledgeItem[]> => {
    return ApiService.getKnowledgeBase(category);
  },

  getItem: async (id: string): Promise<KnowledgeItem> => {
    const { data } = await enzymeClient.get<KnowledgeItem>(`/knowledge/${id}`);
    return data;
  },

  createItem: async (data: CreateKnowledgeItemRequest): Promise<KnowledgeItem> => {
    const { data: response } = await enzymeClient.post<KnowledgeItem>('/knowledge', data);
    return response;
  },

  searchItems: async (query: string, category?: string): Promise<KnowledgeItem[]> => {
    const params = new URLSearchParams({ query });
    if (category) params.append('category', category);
    
    const { data } = await enzymeClient.get<KnowledgeItem[]>(`/knowledge/search?${params}`);
    return data;
  },

  // Clause Library
  getClauses: async (): Promise<Clause[]> => {
    const { data } = await enzymeClient.get<Clause[]>('/clauses');
    return data;
  },

  getClause: async (id: string): Promise<Clause> => {
    const { data } = await enzymeClient.get<Clause>(`/clauses/${id}`);
    return data;
  },

  createClause: async (data: CreateClauseRequest): Promise<Clause> => {
    const { data: response } = await enzymeClient.post<Clause>('/clauses', data);
    return response;
  },

  updateClause: async ({ id, ...data }: UpdateClauseRequest): Promise<Clause> => {
    const { data: response } = await enzymeClient.patch<Clause>(`/clauses/${id}`, data);
    return response;
  },

  deleteClause: async (id: string): Promise<void> => {
    await enzymeClient.delete(`/clauses/${id}`);
  },

  getClauseVersions: async (id: string): Promise<Clause['versions']> => {
    const { data } = await enzymeClient.get<Clause['versions']>(`/clauses/${id}/versions`);
    return data;
  }
};

export default KnowledgeApi;
