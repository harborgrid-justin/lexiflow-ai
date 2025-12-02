/**
 * Client CRM Types
 * Domain-specific types for client management feature
 */

export interface ClientFilters {
  status?: 'Active' | 'Prospect' | 'Former' | 'All';
  industry?: string;
  search?: string;
  minBilled?: number;
  maxBilled?: number;
}

export interface ClientSummary {
  totalClients: number;
  activeClients: number;
  prospects: number;
  totalRevenue: number;
  avgBilledPerClient: number;
}

export interface ClientMatter {
  id: string;
  caseId: string;
  caseName: string;
  status: 'Active' | 'Closed';
  billedAmount: number;
  openDate: string;
  closeDate?: string;
}

export interface ClientContact {
  id: string;
  name: string;
  title?: string;
  email: string;
  phone?: string;
  isPrimary: boolean;
}

export interface ClientNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export type ClientViewMode = 'grid' | 'list' | 'kanban';
