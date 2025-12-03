/**
 * Knowledge Feature - API Service
 * 
 * Handles all API calls for knowledge base and clause library.
 */

import { enzymeKnowledgeService, enzymeClausesService } from '../../../enzyme/services/misc.service';
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
    return enzymeKnowledgeService.getAll({ category });
  },

  getItem: async (id: string): Promise<KnowledgeItem> => {
    return enzymeKnowledgeService.getById(id);
  },

  createItem: async (data: CreateKnowledgeItemRequest): Promise<KnowledgeItem> => {
    return enzymeKnowledgeService.create(data as any);
  },

  searchItems: async (query: string, category?: string): Promise<KnowledgeItem[]> => {
    return enzymeKnowledgeService.search(query, category);
  },

  // Clause Library
  getClauses: async (): Promise<Clause[]> => {
    return enzymeClausesService.getAll() as unknown as Clause[];
  },

  getClause: async (id: string): Promise<Clause> => {
    return enzymeClausesService.getById(id) as unknown as Clause;
  },

  createClause: async (data: CreateClauseRequest): Promise<Clause> => {
    return enzymeClausesService.create(data) as unknown as Clause;
  },

  updateClause: async ({ id, ...data }: UpdateClauseRequest): Promise<Clause> => {
    return enzymeClausesService.update(id, data) as unknown as Clause;
  },

  deleteClause: async (id: string): Promise<void> => {
    return enzymeClausesService.delete(id);
  },

  getClauseVersions: async (id: string): Promise<Clause['versions']> => {
    return enzymeClausesService.getVersions(id) as Promise<Clause['versions']>;
  }
};

export default KnowledgeApi;
