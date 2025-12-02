import type {
  User,
  AuthTokens,
  LoginCredentials,
  RegisterData,
  Case,
  Document,
  ResearchQuery,
  ResearchResult,
  BillingRecord,
} from '@types/index';

// Auth API Types
export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RegisterResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

// Cases API Types
export interface GetCasesParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface CreateCaseData {
  title: string;
  caseNumber: string;
  description: string;
  clientId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
}

export interface UpdateCaseData extends Partial<CreateCaseData> {
  status?: 'active' | 'pending' | 'closed' | 'archived';
}

// Documents API Types
export interface GetDocumentsParams {
  page?: number;
  limit?: number;
  caseId?: string;
  type?: string;
  search?: string;
}

export interface UploadDocumentData {
  file: File;
  title: string;
  type: Document['type'];
  caseId?: string;
  tags?: string[];
}

// Research API Types
export interface CreateResearchQueryData {
  query: string;
  jurisdiction?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface GetResearchResultsParams {
  queryId: string;
  page?: number;
  limit?: number;
}

// Billing API Types
export interface GetBillingRecordsParams {
  page?: number;
  limit?: number;
  caseId?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateBillingRecordData {
  caseId: string;
  hours: number;
  rate: number;
  date: string;
  description: string;
  billable: boolean;
}
