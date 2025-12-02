/**
 * Knowledge Feature - Type Definitions
 * 
 * Types for knowledge base, clause library, and related entities.
 */

export interface KnowledgeItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Playbook' | 'Precedent' | 'Q&A' | string;
  tags: string[];
  metadata: {
    icon?: 'Book' | 'Lightbulb' | 'FileText' | 'MessageCircle';
    color?: 'purple' | 'amber' | 'blue' | 'green';
    similarity?: number;
    topAnswer?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ClauseVersion {
  id: string;
  version: string;
  content: string;
  author: string;
  date: string;
  changes?: string;
}

export interface Clause {
  id: string;
  name: string;
  category: string;
  content: string;
  version: string;
  riskRating: 'Low' | 'Medium' | 'High';
  usageCount: number;
  lastUpdated: string;
  versions?: ClauseVersion[];
  tags?: string[];
}

export type KnowledgeTab = 'wiki' | 'precedents' | 'qa';

export interface KnowledgeFilters {
  tab: KnowledgeTab;
  searchTerm: string;
  category?: string;
}

export interface ClauseFilters {
  searchTerm: string;
  category?: string;
  riskRating?: 'Low' | 'Medium' | 'High';
}

export interface CreateClauseRequest {
  name: string;
  category: string;
  content: string;
  riskRating: 'Low' | 'Medium' | 'High';
  tags?: string[];
}

export interface UpdateClauseRequest extends Partial<CreateClauseRequest> {
  id: string;
}

export interface CreateKnowledgeItemRequest {
  title: string;
  summary: string;
  content: string;
  category: string;
  tags?: string[];
  metadata?: KnowledgeItem['metadata'];
}
