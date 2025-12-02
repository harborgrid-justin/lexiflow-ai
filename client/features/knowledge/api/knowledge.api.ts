/**
 * Knowledge Feature - API Service
 * 
 * Handles all API calls for knowledge base and clause library.
 */

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
    const response = await fetch(`/api/v1/knowledge/${id}`, {
      headers: ApiService['getHeaders']?.() || { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch knowledge item');
    return response.json();
  },

  createItem: async (data: CreateKnowledgeItemRequest): Promise<KnowledgeItem> => {
    const response = await fetch('/api/v1/knowledge', {
      method: 'POST',
      headers: ApiService['getHeaders']?.() || { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create knowledge item');
    return response.json();
  },

  searchItems: async (query: string, category?: string): Promise<KnowledgeItem[]> => {
    const params = new URLSearchParams({ query });
    if (category) params.append('category', category);
    
    const response = await fetch(`/api/v1/knowledge/search?${params}`, {
      headers: ApiService['getHeaders']?.() || { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to search knowledge items');
    return response.json();
  },

  // Clause Library
  getClauses: async (): Promise<Clause[]> => {
    const response = await fetch('/api/v1/clauses', {
      headers: ApiService['getHeaders']?.() || { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch clauses');
    return response.json();
  },

  getClause: async (id: string): Promise<Clause> => {
    const response = await fetch(`/api/v1/clauses/${id}`, {
      headers: ApiService['getHeaders']?.() || { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch clause');
    return response.json();
  },

  createClause: async (data: CreateClauseRequest): Promise<Clause> => {
    const response = await fetch('/api/v1/clauses', {
      method: 'POST',
      headers: ApiService['getHeaders']?.() || { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create clause');
    return response.json();
  },

  updateClause: async ({ id, ...data }: UpdateClauseRequest): Promise<Clause> => {
    const response = await fetch(`/api/v1/clauses/${id}`, {
      method: 'PATCH',
      headers: ApiService['getHeaders']?.() || { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update clause');
    return response.json();
  },

  deleteClause: async (id: string): Promise<void> => {
    const response = await fetch(`/api/v1/clauses/${id}`, {
      method: 'DELETE',
      headers: ApiService['getHeaders']?.() || { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to delete clause');
  },

  getClauseVersions: async (id: string): Promise<Clause['versions']> => {
    const response = await fetch(`/api/v1/clauses/${id}/versions`, {
      headers: ApiService['getHeaders']?.() || { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch clause versions');
    return response.json();
  }
};

export default KnowledgeApi;
