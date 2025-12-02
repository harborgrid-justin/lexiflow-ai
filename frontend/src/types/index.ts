// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'attorney' | 'paralegal' | 'client';
  organizationId: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  organizationName?: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Case Types
export interface Case {
  id: string;
  title: string;
  caseNumber: string;
  status: 'active' | 'pending' | 'closed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  clientId: string;
  clientName: string;
  assignedAttorneys: string[];
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

// Document Types
export interface Document {
  id: string;
  title: string;
  type: 'contract' | 'brief' | 'motion' | 'pleading' | 'evidence' | 'other';
  caseId?: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize: number;
  mimeType: string;
  url: string;
  status: 'processing' | 'ready' | 'error';
  tags: string[];
}

// Research Types
export interface ResearchQuery {
  id: string;
  query: string;
  jurisdiction?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  createdAt: string;
  userId: string;
}

export interface ResearchResult {
  id: string;
  queryId: string;
  title: string;
  citation: string;
  summary: string;
  relevanceScore: number;
  url: string;
  type: 'case_law' | 'statute' | 'regulation' | 'secondary_source';
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// UI State Types
export type Theme = 'light' | 'dark';
export type SidebarState = 'expanded' | 'collapsed';

// Billing Types
export interface BillingRecord {
  id: string;
  caseId: string;
  caseName: string;
  attorney: string;
  hours: number;
  rate: number;
  total: number;
  date: string;
  description: string;
  billable: boolean;
}
