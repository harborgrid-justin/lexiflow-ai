import { Case, User, LegalDocument, WorkflowStage, Motion, DiscoveryRequest, EvidenceItem, TimelineEvent, TimeEntry, WorkflowTask, ConflictCheck, Conversation, AuditLogEntry, Organization, Group, Client, Clause, JudgeProfile, OpposingCounselProfile, EthicalWall, Jurisdiction, KnowledgeItem, ResearchSession, UserProfile, CaseMember } from '../types';
import { ApiCase } from '../shared-types';
import { transformApiCase } from '../utils/type-transformers';

// API Base URL configuration
// In development with Vite proxy, use relative path '/api/v1'
// In production or when running standalone, use the full URL
const getApiBaseUrl = (): string => {
  // Check for Vite environment variable first
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) {
    return `${(import.meta as any).env.VITE_API_URL}/api/v1`;
  }
  // Fallback to process.env for non-Vite builds
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // Default: use proxy in development, full URL otherwise
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return '/api/v1'; // Use Vite proxy
  }
  return 'http://localhost:3001/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Semantic search result type matching backend VectorSearchResult
 */
export interface SemanticSearchResult {
  id: string;
  content: string;
  similarity: number;
  document_id: string;
  metadata?: Record<string, unknown>;
}

// Get auth token from localStorage or session storage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
};

// Get auth headers
const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Get auth headers without Content-Type (for multipart/form-data)
const getAuthHeadersWithoutContentType = (): Record<string, string> => {
  const token = getAuthToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Represents a field-level validation error from the backend
 */
export interface ValidationFieldError {
  field: string;
  errors: string[];
}

/**
 * Backend error response structure from HttpExceptionFilter
 */
export interface BackendErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  error: string;
  message: string | string[];
  /** Present for validation errors (422) */
  errors?: ValidationFieldError[];
}

/**
 * API Error class for structured error handling
 * Provides typed access to backend error responses
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: BackendErrorResponse
  ) {
    // Use the message from backend if available, otherwise use statusText
    const errorMessage = data?.message
      ? (Array.isArray(data.message) ? data.message.join(', ') : data.message)
      : statusText;
    super(`API Error ${status}: ${errorMessage}`);
    this.name = 'ApiError';
  }

  /**
   * Check if this is a validation error (422)
   */
  isValidationError(): boolean {
    return this.status === 422;
  }

  /**
   * Check if this is an unauthorized error (401)
   */
  isUnauthorized(): boolean {
    return this.status === 401;
  }

  /**
   * Check if this is a not found error (404)
   */
  isNotFound(): boolean {
    return this.status === 404;
  }

  /**
   * Check if this is a bad request error (400)
   */
  isBadRequest(): boolean {
    return this.status === 400;
  }

  /**
   * Check if this is a server error (5xx)
   */
  isServerError(): boolean {
    return this.status >= 500 && this.status < 600;
  }

  /**
   * Get validation errors as a map of field -> errors
   * Returns empty object if not a validation error
   */
  getValidationErrors(): Record<string, string[]> {
    if (!this.isValidationError() || !this.data?.errors) {
      return {};
    }
    return this.data.errors.reduce((acc, { field, errors }) => {
      acc[field] = errors;
      return acc;
    }, {} as Record<string, string[]>);
  }

  /**
   * Get all validation error messages as a flat array
   */
  getValidationMessages(): string[] {
    if (!this.isValidationError() || !this.data?.errors) {
      return [];
    }
    return this.data.errors.flatMap(({ errors }) => errors);
  }

  /**
   * Get a user-friendly error message suitable for display
   */
  getUserMessage(): string {
    if (this.isValidationError()) {
      const messages = this.getValidationMessages();
      return messages.length > 0 ? messages.join('. ') : 'Validation failed';
    }
    if (this.isUnauthorized()) {
      return 'Your session has expired. Please log in again.';
    }
    if (this.isNotFound()) {
      return 'The requested resource was not found.';
    }
    if (this.isBadRequest()) {
      return this.data?.message
        ? (Array.isArray(this.data.message) ? this.data.message.join('. ') : this.data.message)
        : 'Invalid request. Please check your input.';
    }
    if (this.isServerError()) {
      return 'A server error occurred. Please try again later.';
    }
    return this.data?.message
      ? (Array.isArray(this.data.message) ? this.data.message.join('. ') : this.data.message)
      : 'An unexpected error occurred.';
  }
}


// Handle API response errors
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    // Try to parse error response body first
    let errorData: BackendErrorResponse | undefined;
    try {
      errorData = await response.json();
    } catch {
      // Response body is not JSON or empty
      errorData = undefined;
    }

    // Handle unauthorized - clear tokens and redirect to login
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      // Only redirect if not already on login page to avoid redirect loops
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      throw new ApiError(401, 'Unauthorized', errorData);
    }

    // Create ApiError with structured error data
    const errorMessage = errorData?.message
      ? (Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message)
      : response.statusText;

    throw new ApiError(response.status, errorMessage, errorData);
  }

  // Handle empty responses (DELETE operations)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return undefined as T;
  }

  try {
    return await response.json();
  } catch (error) {
    console.error('Failed to parse JSON response:', error);
    throw new ApiError(500, 'Invalid JSON response');
  }
};

// Retry logic for network failures
async function fetchWithRetry<T>(
  url: string,
  options: RequestInit,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    const response = await fetch(url, options);
    return await handleResponse<T>(response);
  } catch (error) {
    if (retries > 0 && (error as ApiError).status >= 500) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry<T>(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}

async function fetchJson<T>(endpoint: string): Promise<T> {
  return fetchWithRetry<T>(`${API_BASE_URL}${endpoint}`, {
    headers: getAuthHeaders(),
  });
}

async function postJson<T>(endpoint: string, data: any): Promise<T> {
  return fetchWithRetry<T>(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

/**
 * HTTP PATCH request for updates
 * Note: Named putJson for historical reasons but uses PATCH method
 * which aligns with NestJS @Patch() decorators on backend controllers
 */
async function putJson<T>(endpoint: string, data: unknown): Promise<T> {
  return fetchWithRetry<T>(`${API_BASE_URL}${endpoint}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
}

async function deleteJson(endpoint: string): Promise<void> {
  return fetchWithRetry<void>(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
}

/**
 * Build query string from parameters
 */
function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Upload file with multipart/form-data
 * @param endpoint - API endpoint for upload
 * @param file - File object to upload
 * @param metadata - Additional metadata to include in the form data
 */
async function uploadFile<T>(endpoint: string, file: File, metadata?: Record<string, any>): Promise<T> {
  const formData = new FormData();
  formData.append('file', file);

  if (metadata) {
    Object.entries(metadata).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value));
      }
    });
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeadersWithoutContentType(),
    body: formData,
  });

  return handleResponse<T>(response);
}

/**
 * Download file as blob
 * @param endpoint - API endpoint for download
 * @returns Object containing blob, filename, and contentType
 */
async function downloadFile(endpoint: string): Promise<{ blob: Blob; filename: string; contentType: string }> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: getAuthHeadersWithoutContentType(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      window.location.href = '/login';
      throw new ApiError(401, 'Unauthorized');
    }
    throw new ApiError(response.status, response.statusText);
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get('Content-Disposition');
  const contentType = response.headers.get('Content-Type') || 'application/octet-stream';

  // Extract filename from Content-Disposition header
  let filename = 'download';
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1].replace(/['"]/g, '');
    }
  }

  return { blob, filename, contentType };
}

/**
 * Document upload metadata interface
 */
export interface DocumentUploadMetadata {
  title?: string;
  type?: string;
  caseId?: string;
  description?: string;
  tags?: string[];
  classification?: string;
}

/**
 * LexiFlow API Service
 * Production-ready API client for NestJS backend
 * Backend: http://localhost:3001/api/v1
 */
export const ApiService = {
  // ===========================
  // Authentication
  // ===========================
  auth: {
    login: (email: string, password: string) =>
      postJson<{ access_token: string; user: User }>('/auth/login', { email, password }),

    /**
     * Register a new user
     * @param userData - User registration data matching backend RegisterDto
     */
    register: (userData: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      organization_id?: string;
    }) => postJson<User>('/auth/register', userData),

    getCurrentUser: () => fetchJson<User>('/auth/me'),

    logout: () => postJson<void>('/auth/logout', {}),
  },

  // ===========================
  // Cases - with type transformation (snake_case API <-> camelCase Frontend)
  // ===========================
  cases: {
    getAll: async (orgId?: string): Promise<Case[]> => {
      const apiCases = await fetchJson<ApiCase[]>(`/cases${buildQueryString({ orgId })}`);
      return apiCases.map(transformApiCase);
    },

    getById: async (id: string): Promise<Case> => {
      const apiCase = await fetchJson<ApiCase>(`/cases/${id}`);
      return transformApiCase(apiCase);
    },

    getByClient: async (clientName: string): Promise<Case[]> => {
      const apiCases = await fetchJson<ApiCase[]>(`/cases/client/${encodeURIComponent(clientName)}`);
      return apiCases.map(transformApiCase);
    },

    getByStatus: async (status: string): Promise<Case[]> => {
      const apiCases = await fetchJson<ApiCase[]>(`/cases/status/${encodeURIComponent(status)}`);
      return apiCases.map(transformApiCase);
    },

    create: async (data: Partial<Case>): Promise<Case> => {
      // Convert frontend camelCase to backend snake_case
      const apiRequest = {
        title: data.title,
        client_name: data.client,
        opposing_counsel: data.opposingCounsel,
        status: data.status,
        filing_date: data.filingDate,
        description: data.description,
        value: data.value,
        matter_type: data.matterType,
        jurisdiction: data.jurisdiction,
        court: data.court,
        billing_model: data.billingModel,
        judge: data.judge,
        owner_org_id: data.ownerOrgId,
      };
      // Remove undefined values
      const cleanRequest = Object.fromEntries(
        Object.entries(apiRequest).filter(([_, v]) => v !== undefined)
      );
      const apiCase = await postJson<ApiCase>('/cases', cleanRequest);
      return transformApiCase(apiCase);
    },

    update: async (id: string, data: Partial<Case>): Promise<Case> => {
      // Convert frontend camelCase to backend snake_case
      const apiRequest = {
        title: data.title,
        client_name: data.client,
        opposing_counsel: data.opposingCounsel,
        status: data.status,
        filing_date: data.filingDate,
        description: data.description,
        value: data.value,
        matter_type: data.matterType,
        jurisdiction: data.jurisdiction,
        court: data.court,
        billing_model: data.billingModel,
        judge: data.judge,
        owner_org_id: data.ownerOrgId,
      };
      // Remove undefined values
      const cleanRequest = Object.fromEntries(
        Object.entries(apiRequest).filter(([_, v]) => v !== undefined)
      );
      const apiCase = await putJson<ApiCase>(`/cases/${id}`, cleanRequest);
      return transformApiCase(apiCase);
    },

    delete: (id: string) =>
      deleteJson(`/cases/${id}`),
  },

  // ===========================
  // Documents
  // ===========================
  documents: {
    getAll: (caseId?: string, orgId?: string) =>
      fetchJson<LegalDocument[]>(`/documents${buildQueryString({ caseId, orgId })}`),

    getById: (id: string) =>
      fetchJson<LegalDocument>(`/documents/${id}`),

    getByType: (type: string) =>
      fetchJson<LegalDocument[]>(`/documents/type/${encodeURIComponent(type)}`),

    create: (data: Partial<LegalDocument>) =>
      postJson<LegalDocument>('/documents', data),

    update: (id: string, data: Partial<LegalDocument>) =>
      putJson<LegalDocument>(`/documents/${id}`, data),

    delete: (id: string) =>
      deleteJson(`/documents/${id}`),

    /**
     * Upload a document file with metadata
     * @param file - The file to upload
     * @param metadata - Document metadata (title, type, caseId, tags, etc.)
     * @returns The created document record
     */
    upload: (file: File, metadata?: DocumentUploadMetadata): Promise<LegalDocument> =>
      uploadFile<LegalDocument>('/documents/upload', file, {
        title: metadata?.title || file.name,
        type: metadata?.type || 'General',
        case_id: metadata?.caseId,
        description: metadata?.description,
        tags: metadata?.tags?.join(','),
        classification: metadata?.classification,
      }),

    /**
     * Download a document file
     * @param id - Document ID
     * Triggers browser download of the file
     */
    download: async (id: string): Promise<void> => {
      const { blob, filename } = await downloadFile(`/documents/${id}/download`);

      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },

    /**
     * Get download URL for a document (for direct links/embedding)
     * @param id - Document ID
     * @returns URL string for direct download
     */
    getDownloadUrl: (id: string): string => {
      const token = getAuthToken();
      return `${API_BASE_URL}/documents/${id}/download${token ? `?token=${token}` : ''}`;
    },

    /**
     * Get document content/preview
     * @param id - Document ID
     * @returns Document content and MIME type
     */
    getContent: (id: string) =>
      fetchJson<{ content: string; mimeType: string }>(`/documents/${id}/content`),
  },

  // ===========================
  // Evidence
  // ===========================
  evidence: {
    getAll: (caseId?: string) =>
      fetchJson<EvidenceItem[]>(`/evidence${buildQueryString({ caseId })}`),

    getById: (id: string) =>
      fetchJson<EvidenceItem>(`/evidence/${id}`),

    create: (data: Partial<EvidenceItem>) =>
      postJson<EvidenceItem>('/evidence', data),

    update: (id: string, data: Partial<EvidenceItem>) =>
      putJson<EvidenceItem>(`/evidence/${id}`, data),

    delete: (id: string) =>
      deleteJson(`/evidence/${id}`),
  },

  // ===========================
  // Messages & Conversations
  // ===========================
  messages: {
    conversations: {
      getAll: (caseId?: string, userId?: string) =>
        fetchJson<Conversation[]>(`/messages/conversations${buildQueryString({ caseId, userId })}`),

      getById: (id: string) =>
        fetchJson<Conversation>(`/messages/conversations/${id}`),

      create: (data: Partial<Conversation>) =>
        postJson<Conversation>('/messages/conversations', data),

      update: (id: string, data: Partial<Conversation>) =>
        putJson<Conversation>(`/messages/conversations/${id}`, data),

      getMessages: (conversationId: string) =>
        fetchJson<any[]>(`/messages/conversations/${conversationId}/messages`),
    },

    create: (data: any) =>
      postJson<any>('/messages', data),

    getById: (id: string) =>
      fetchJson<any>(`/messages/${id}`),

    update: (id: string, data: any) =>
      putJson<any>(`/messages/${id}`, data),

    sendMessage: (conversationId: string, text: string, senderId?: string) =>
      postJson<void>(`/messages/${conversationId}/send`, { text, senderId }),

    getConversations: () => fetchJson<Conversation[]>('/messages'),
  },

  // ===========================
  // Workflow
  // ===========================
  workflow: {
    stages: {
      getAll: (caseId?: string) =>
        fetchJson<WorkflowStage[]>(`/workflow/stages${buildQueryString({ caseId })}`),

      getById: (id: string) =>
        fetchJson<WorkflowStage>(`/workflow/stages/${id}`),

      create: (data: Partial<WorkflowStage>) =>
        postJson<WorkflowStage>('/workflow/stages', data),

      update: (id: string, data: Partial<WorkflowStage>) =>
        putJson<WorkflowStage>(`/workflow/stages/${id}`, data),
    },

    tasks: {
      getAll: (stageId?: string, assigneeId?: string) =>
        fetchJson<WorkflowTask[]>(`/workflow/tasks${buildQueryString({ stageId, assigneeId })}`),

      getById: (id: string) =>
        fetchJson<WorkflowTask>(`/workflow/tasks/${id}`),

      create: (data: Partial<WorkflowTask>) =>
        postJson<WorkflowTask>('/workflow/tasks', data),

      update: (id: string, data: Partial<WorkflowTask>) =>
        putJson<WorkflowTask>(`/workflow/tasks/${id}`, data),
    },
  },

  // ===========================
  // Motions
  // ===========================
  motions: {
    getAll: (caseId?: string) =>
      fetchJson<Motion[]>(`/motions${buildQueryString({ caseId })}`),

    getById: (id: string) =>
      fetchJson<Motion>(`/motions/${id}`),

    getByStatus: (status: string) =>
      fetchJson<Motion[]>(`/motions/status/${encodeURIComponent(status)}`),

    create: (data: Partial<Motion>) =>
      postJson<Motion>('/motions', data),

    update: (id: string, data: Partial<Motion>) =>
      putJson<Motion>(`/motions/${id}`, data),

    delete: (id: string) =>
      deleteJson(`/motions/${id}`),
  },

  // ===========================
  // Discovery
  // ===========================
  discovery: {
    getAll: (caseId?: string) =>
      fetchJson<DiscoveryRequest[]>(`/discovery${buildQueryString({ caseId })}`),

    getById: (id: string) =>
      fetchJson<DiscoveryRequest>(`/discovery/${id}`),

    create: (data: Partial<DiscoveryRequest>) =>
      postJson<DiscoveryRequest>('/discovery', data),

    update: (id: string, data: Partial<DiscoveryRequest>) =>
      putJson<DiscoveryRequest>(`/discovery/${id}`, data),

    delete: (id: string) =>
      deleteJson(`/discovery/${id}`),
  },

  // ===========================
  // Billing
  // ===========================
  billing: {
    timeEntries: {
      getAll: (caseId?: string, userId?: string) =>
        fetchJson<TimeEntry[]>(`/billing/time-entries${buildQueryString({ caseId, userId })}`),

      getById: (id: string) =>
        fetchJson<TimeEntry>(`/billing/time-entries/${id}`),

      create: (data: Partial<TimeEntry>) =>
        postJson<TimeEntry>('/billing/time-entries', data),

      update: (id: string, data: Partial<TimeEntry>) =>
        putJson<TimeEntry>(`/billing/time-entries/${id}`, data),

      delete: (id: string) =>
        deleteJson(`/billing/time-entries/${id}`),
    },

    getStats: (caseId?: string, startDate?: string, endDate?: string) =>
      fetchJson<any>(`/billing/stats${buildQueryString({ caseId, startDate, endDate })}`),
  },

  // ===========================
  // Calendar
  // ===========================
  calendar: {
    getAll: (caseId?: string, startDate?: string, endDate?: string) =>
      fetchJson<any[]>(`/calendar${buildQueryString({ caseId, startDate, endDate })}`),

    getById: (id: string) =>
      fetchJson<any>(`/calendar/${id}`),

    getUpcoming: (days?: number) =>
      fetchJson<any[]>(`/calendar/upcoming${buildQueryString({ days })}`),

    getByType: (type: string) =>
      fetchJson<any[]>(`/calendar/type/${encodeURIComponent(type)}`),

    create: (data: any) =>
      postJson<any>('/calendar', data),

    update: (id: string, data: any) =>
      putJson<any>(`/calendar/${id}`, data),
  },

  // ===========================
  // Tasks
  // ===========================
  tasks: {
    getAll: (caseId?: string, assigneeId?: string) =>
      fetchJson<WorkflowTask[]>(`/tasks${buildQueryString({ caseId, assigneeId })}`),

    getById: (id: string) =>
      fetchJson<WorkflowTask>(`/tasks/${id}`),

    getByStatus: (status: string) =>
      fetchJson<WorkflowTask[]>(`/tasks/status/${encodeURIComponent(status)}`),

    create: (data: Partial<WorkflowTask>) =>
      postJson<WorkflowTask>('/tasks', data),

    update: (id: string, data: Partial<WorkflowTask>) =>
      putJson<WorkflowTask>(`/tasks/${id}`, data),

    delete: (id: string) =>
      deleteJson(`/tasks/${id}`),
  },

  // ===========================
  // Users
  // ===========================
  users: {
    getAll: (orgId?: string) =>
      fetchJson<User[]>(`/users${buildQueryString({ orgId })}`),

    getById: (id: string) =>
      fetchJson<User>(`/users/${id}`),

    getByEmail: (email: string) =>
      fetchJson<User>(`/users/email/${encodeURIComponent(email)}`),

    update: (id: string, data: Partial<User>) =>
      putJson<User>(`/users/${id}`, data),

    delete: (id: string) =>
      deleteJson(`/users/${id}`),
  },

  // ===========================
  // User Profiles
  // ===========================
  userProfiles: {
    get: (userId: string) =>
      fetchJson<UserProfile>(`/user-profiles/user/${userId}`),

    create: (data: Partial<UserProfile>) =>
      postJson<UserProfile>('/user-profiles', data),

    update: (userId: string, data: Partial<UserProfile>) =>
      putJson<UserProfile>(`/user-profiles/user/${userId}`, data),

    updateLastActive: (userId: string) =>
      putJson<void>(`/user-profiles/user/${userId}/last-active`, {}),
  },

  // ===========================
  // Organizations
  // ===========================
  organizations: {
    getAll: () =>
      fetchJson<Organization[]>('/organizations'),

    getById: (id: string) =>
      fetchJson<Organization>(`/organizations/${id}`),

    create: (data: Partial<Organization>) =>
      postJson<Organization>('/organizations', data),

    update: (id: string, data: Partial<Organization>) =>
      putJson<Organization>(`/organizations/${id}`, data),

    delete: (id: string) =>
      deleteJson(`/organizations/${id}`),
  },

  // ===========================
  // Clients
  // ===========================
  clients: {
    getAll: (orgId?: string) =>
      fetchJson<Client[]>(`/clients${buildQueryString({ orgId })}`),

    getById: (id: string) =>
      fetchJson<Client>(`/clients/${id}`),

    getByName: (name: string) =>
      fetchJson<Client[]>(`/clients/name/${encodeURIComponent(name)}`),

    create: (data: Partial<Client>) =>
      postJson<Client>('/clients', data),

    update: (id: string, data: Partial<Client>) =>
      putJson<Client>(`/clients/${id}`, data),

    delete: (id: string) =>
      deleteJson(`/clients/${id}`),
  },

  // ===========================
  // Analytics
  // ===========================
  analytics: {
    getAll: (caseId?: string, metricType?: string) =>
      fetchJson<any[]>(`/analytics${buildQueryString({ caseId, metricType })}`),

    getById: (id: string) =>
      fetchJson<any>(`/analytics/${id}`),

    getCasePrediction: (caseId: string) =>
      fetchJson<any[]>(`/analytics/case-prediction/${caseId}`),

    getJudgeAnalytics: (judgeName: string) =>
      fetchJson<any[]>(`/analytics/judge/${encodeURIComponent(judgeName)}`),

    getCounselPerformance: (counselName: string) =>
      fetchJson<any[]>(`/analytics/counsel/${encodeURIComponent(counselName)}`),

    getDashboard: () =>
      fetchJson<{ stats: any[]; chartData: any[]; alerts: any[] }>('/analytics/dashboard'),

    create: (data: any) =>
      postJson<any>('/analytics', data),
  },

  // ===========================
  // Compliance
  // ===========================
  compliance: {
    getAll: (orgId?: string) =>
      fetchJson<any[]>(`/compliance${buildQueryString({ orgId })}`),

    getById: (id: string) =>
      fetchJson<any>(`/compliance/${id}`),

    getByRiskLevel: (riskLevel: string) =>
      fetchJson<any[]>(`/compliance/risk-level/${encodeURIComponent(riskLevel)}`),

    getConflicts: () =>
      fetchJson<ConflictCheck[]>('/compliance/conflicts'),

    getWalls: () =>
      fetchJson<EthicalWall[]>('/compliance/walls'),

    createConflictCheck: (data: Partial<ConflictCheck>) =>
      postJson<ConflictCheck>('/compliance/conflicts', data),

    createEthicalWall: (data: Partial<EthicalWall>) =>
      postJson<EthicalWall>('/compliance/walls', data),

    create: (data: any) =>
      postJson<any>('/compliance', data),

    update: (id: string, data: any) =>
      putJson<any>(`/compliance/${id}`, data),
  },

  // ===========================
  // Knowledge Base
  // ===========================
  knowledge: {
    getAll: (category?: string) =>
      fetchJson<KnowledgeItem[]>(`/knowledge${buildQueryString({ category })}`),

    getById: (id: string) =>
      fetchJson<KnowledgeItem>(`/knowledge/${id}`),

    search: (query: string) =>
      fetchJson<KnowledgeItem[]>(`/knowledge/search${buildQueryString({ q: query })}`),

    create: (data: Partial<KnowledgeItem>) =>
      postJson<KnowledgeItem>('/knowledge', data),

    update: (id: string, data: Partial<KnowledgeItem>) =>
      putJson<KnowledgeItem>(`/knowledge/${id}`, data),
  },

  // ===========================
  // Jurisdictions
  // ===========================
  jurisdictions: {
    getAll: (country?: string) =>
      fetchJson<Jurisdiction[]>(`/jurisdictions${buildQueryString({ country })}`),

    getById: (id: string) =>
      fetchJson<Jurisdiction>(`/jurisdictions/${id}`),

    getByCode: (code: string) =>
      fetchJson<Jurisdiction>(`/jurisdictions/code/${encodeURIComponent(code)}`),

    create: (data: Partial<Jurisdiction>) =>
      postJson<Jurisdiction>('/jurisdictions', data),

    update: (id: string, data: Partial<Jurisdiction>) =>
      putJson<Jurisdiction>(`/jurisdictions/${id}`, data),
  },

  // ===========================
  // Clauses
  // ===========================
  clauses: {
    getAll: (category?: string, type?: string) =>
      fetchJson<Clause[]>(`/clauses${buildQueryString({ category, type })}`),

    getById: (id: string) =>
      fetchJson<Clause>(`/clauses/${id}`),

    search: (query: string) =>
      fetchJson<Clause[]>(`/clauses/search${buildQueryString({ q: query })}`),

    create: (data: Partial<Clause>) =>
      postJson<Clause>('/clauses', data),

    update: (id: string, data: Partial<Clause>) =>
      putJson<Clause>(`/clauses/${id}`, data),

    delete: (id: string) =>
      deleteJson(`/clauses/${id}`),
  },

  // ===========================
  // Groups
  // ===========================
  groups: {
    getAll: () =>
      fetchJson<Group[]>('/groups'),

    create: (data: Partial<Group>) =>
      postJson<Group>('/groups', data),
  },

  // ===========================
  // Audit
  // ===========================
  audit: {
    getLogs: () =>
      fetchJson<AuditLogEntry[]>('/audit'),
  },

  // ===========================
  // Parties
  // ===========================
  parties: {
    getAll: (caseId?: string) =>
      fetchJson<any[]>(`/parties${buildQueryString({ caseId })}`),

    create: (data: any) =>
      postJson<any>('/parties', data),

    update: (id: string, data: any) =>
      putJson<any>(`/parties/${id}`, data),

    delete: (id: string) =>
      deleteJson(`/parties/${id}`),

    getByCaseId: (caseId: string) =>
      fetchJson<CaseMember[]>(`/parties/case/${caseId}`),
  },

  // ===========================
  // Case-specific Operations
  // ===========================
  caseOperations: {
    getDocuments: (caseId: string) =>
      fetchJson<LegalDocument[]>(`/cases/${caseId}/documents`),

    getWorkflow: (caseId: string) =>
      fetchJson<WorkflowStage[]>(`/cases/${caseId}/workflow`),

    getMotions: (caseId: string) =>
      fetchJson<Motion[]>(`/cases/${caseId}/motions`),

    getDiscovery: (caseId: string) =>
      fetchJson<DiscoveryRequest[]>(`/cases/${caseId}/discovery`),

    getEvidence: (caseId: string) =>
      fetchJson<EvidenceItem[]>(`/cases/${caseId}/evidence`),

    getTimeline: (caseId: string) =>
      fetchJson<TimelineEvent[]>(`/cases/${caseId}/timeline`),

    getBilling: (caseId: string) =>
      fetchJson<TimeEntry[]>(`/cases/${caseId}/billing`),

    getTeam: (caseId: string) =>
      fetchJson<CaseMember[]>(`/parties/case/${caseId}`),

    addTeamMember: (caseId: string, userId: string, role: string) =>
      postJson<void>('/parties', { case_id: caseId, user_id: userId, role }),

    removeTeamMember: (caseId: string, userId: string) =>
      deleteJson(`/parties/case/${caseId}/user/${userId}`),
  },

  // ===========================
  // Search (Advanced AI-Powered)
  // ===========================
  search: {
    /**
     * Perform semantic search using vector embeddings
     * @param query - The search query text
     * @param options - Optional parameters including limit, threshold, and pre-computed embedding
     * @note If embedding is not provided, the backend returns empty results.
     *       For full semantic search, generate embeddings using OpenAI ada-002 before calling.
     */
    semantic: (query: string, options?: { limit?: number; threshold?: number; embedding?: number[] }) =>
      postJson<SemanticSearchResult[]>('/search/semantic', {
        query,
        limit: options?.limit,
        threshold: options?.threshold,
        embedding: options?.embedding
      }),

    /**
     * Perform hybrid search combining semantic and keyword matching
     * @param query - The search query text
     * @param options - Optional parameters including limit, semanticWeight, and pre-computed embedding
     * @note If embedding is not provided, the backend returns empty results.
     */
    hybrid: (query: string, options?: { limit?: number; semanticWeight?: number; embedding?: number[] }) =>
      postJson<SemanticSearchResult[]>('/search/hybrid', {
        query,
        limit: options?.limit,
        semanticWeight: options?.semanticWeight,
        embedding: options?.embedding
      }),

    /**
     * Find documents similar to a given document
     * Uses the document's stored embeddings - no additional embedding needed
     */
    findSimilarDocuments: (documentId: string, limit?: number) =>
      fetchJson<SemanticSearchResult[]>(`/search/similar-documents/${documentId}${buildQueryString({ limit })}`),

    /**
     * Extract legal citations from text
     */
    extractLegalCitations: (text: string, documentId?: string) =>
      postJson<{ citations: string[]; count: number }>('/search/legal-citations', { text, documentId }),

    /**
     * Get search query history for analytics
     */
    getQueryHistory: (limit?: number) =>
      fetchJson<any[]>(`/search/query-history${buildQueryString({ limit })}`),

    getResearchHistory: () =>
      fetchJson<ResearchSession[]>('/search/history'),

    saveResearchSession: (data: Partial<ResearchSession>) =>
      postJson<ResearchSession>('/search/sessions', data),

    updateResearchFeedback: (id: string, feedback: 'positive' | 'negative') =>
      putJson<void>(`/search/sessions/${id}/feedback`, { feedback }),

    perform: (query: string) =>
      postJson<any>('/search', { query }),
  },

  // ===========================
  // Utility Methods
  // ===========================

  /**
   * Set authentication token in local storage
   */
  setAuthToken: (token: string, remember: boolean = true) => {
    if (remember) {
      localStorage.setItem('authToken', token);
    } else {
      sessionStorage.setItem('authToken', token);
    }
  },

  /**
   * Clear authentication token from storage
   */
  clearAuthToken: () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return getAuthToken() !== null;
  },

  /**
   * Get current auth token
   */
  getToken: (): string | null => {
    return getAuthToken();
  },

  // ===========================
  // Legacy Compatibility Methods
  // ===========================
  // These methods are deprecated but maintained for backward compatibility.
  // Please use the namespaced API (e.g., ApiService.cases.getAll() instead of ApiService.getCases())

  /** @deprecated Use ApiService.cases.getAll() instead */
  getCases: () => fetchJson<Case[]>('/cases'),

  /** @deprecated Use ApiService.cases.getById() instead */
  getCase: (id: string) => fetchJson<Case>(`/cases/${id}`),

  /** @deprecated Use ApiService.users.getAll() instead */
  getUsers: (orgId?: string) => fetchJson<User[]>(`/users${buildQueryString({ orgId })}`),

  /** @deprecated Use ApiService.users.getById() instead */
  getUser: (id: string) => fetchJson<User>(`/users/${id}`),

  /** @deprecated Use ApiService.documents.getAll() instead */
  getDocuments: (caseId?: string) => fetchJson<LegalDocument[]>(`/documents${buildQueryString({ caseId })}`),

  /** @deprecated Use ApiService.auth.login() instead */
  login: (email: string, password: string) =>
    postJson<{ access_token: string; user: User }>('/auth/login', { email, password }),

  /** @deprecated Use ApiService.auth.getCurrentUser() instead */
  getCurrentUser: () => fetchJson<User>('/auth/me'),

  /** @deprecated Use ApiService.users.update() instead */
  updateUser: (id: string, data: Partial<User>) =>
    putJson<User>(`/users/${id}`, data),

  /** @deprecated Use ApiService.userProfiles.update() instead */
  updateUserProfile: (userId: string, data: Partial<UserProfile>) =>
    putJson<UserProfile>(`/user-profiles/user/${userId}`, data),

  /** @deprecated Use ApiService.userProfiles.updateLastActive() instead */
  updateUserLastActive: (userId: string) =>
    putJson<void>(`/user-profiles/user/${userId}/last-active`, {}),

  /** @deprecated Use ApiService.evidence.getAll() instead */
  getEvidence: (caseId?: string) =>
    fetchJson<EvidenceItem[]>(`/evidence${buildQueryString({ caseId })}`),

  /** @deprecated Use ApiService.motions.getAll() instead */
  getMotions: (caseId?: string) =>
    fetchJson<Motion[]>(`/motions${buildQueryString({ caseId })}`),

  /** @deprecated Use ApiService.discovery.getAll() instead */
  getDiscovery: (caseId?: string) =>
    fetchJson<DiscoveryRequest[]>(`/discovery${buildQueryString({ caseId })}`),

  /** @deprecated Use ApiService.discovery.update() instead */
  updateDiscoveryRequest: (id: string, data: Partial<DiscoveryRequest>) =>
    putJson<DiscoveryRequest>(`/discovery/${id}`, data),

  /** @deprecated Use ApiService.audit.getLogs() instead */
  getAuditLogs: () => fetchJson<AuditLogEntry[]>('/audit'),

  /** @deprecated Use ApiService.analytics.getJudgeAnalytics() instead */
  getJudgeAnalytics: () =>
    fetchJson<{ profile: JudgeProfile; stats: unknown[] }>('/analytics/judge'),

  /** @deprecated Use ApiService.analytics.getCounselPerformance() instead */
  getCounselAnalytics: () =>
    fetchJson<{ profile: OpposingCounselProfile; outcomes: unknown[] }>('/analytics/counsel'),

  /** @deprecated Use ApiService.billing.getStats() instead */
  getBillingStats: () =>
    fetchJson<{ wip: unknown[]; realization: unknown[] }>('/billing/stats'),

  /** @deprecated Use ApiService.clients.getAll() instead */
  getClients: (orgId?: string) =>
    fetchJson<Client[]>(`/clients${buildQueryString({ orgId })}`),

  /** @deprecated Use ApiService.clauses.getAll() instead */
  getClauses: (category?: string) =>
    fetchJson<Clause[]>(`/clauses${buildQueryString({ category })}`),

  /** @deprecated Use ApiService.compliance.getConflicts() instead */
  getConflicts: () => fetchJson<ConflictCheck[]>('/compliance/conflicts'),

  /** @deprecated Use ApiService.compliance.getWalls() instead */
  getWalls: () => fetchJson<EthicalWall[]>('/compliance/walls'),

  /** @deprecated Use ApiService.analytics.getDashboard() instead */
  getDashboard: () =>
    fetchJson<{ stats: unknown[]; chartData: unknown[]; alerts: unknown[] }>('/analytics/dashboard'),

  /** @deprecated Use ApiService.knowledge.getAll() instead */
  getKnowledgeBase: (category?: string) =>
    fetchJson<KnowledgeItem[]>(`/knowledge${buildQueryString({ category })}`),

  /** @deprecated Use ApiService.search.getResearchHistory() instead */
  getResearchHistory: () => fetchJson<ResearchSession[]>('/search/history'),

  /** @deprecated Use ApiService.search.saveResearchSession() instead */
  saveResearchSession: (data: Partial<ResearchSession>) =>
    postJson<ResearchSession>('/search/sessions', data),

  /** @deprecated Use ApiService.search.updateResearchFeedback() instead */
  submitResearchFeedback: (id: string, feedback: 'positive' | 'negative') =>
    putJson<void>(`/search/sessions/${id}/feedback`, { feedback }),

  /** @deprecated Use ApiService.organizations.getAll() instead */
  getOrganizations: () => fetchJson<Organization[]>('/organizations'),

  /** @deprecated Use ApiService.groups.getAll() instead */
  getGroups: () => fetchJson<Group[]>('/groups'),

  /** @deprecated Use ApiService.calendar.getByType('deadline') instead */
  getCalendarDeadlines: () => fetchJson<unknown[]>('/calendar/type/deadline'),

  /** @deprecated Use ApiService.calendar.getByType('hearing') instead */
  getCalendarHearings: () => fetchJson<unknown[]>('/calendar/type/hearing'),

  /** @deprecated Use ApiService.calendar.getByType('statute-of-limitations') instead */
  getCalendarSOL: () => fetchJson<unknown[]>('/calendar/type/statute-of-limitations'),

  /** @deprecated Use ApiService.calendar.getByType('team') instead */
  getCalendarTeam: () => fetchJson<unknown[]>('/calendar/type/team'),

  /** @deprecated Use ApiService.caseOperations.getDiscovery() instead */
  getCaseDiscovery: (caseId: string) =>
    fetchJson<DiscoveryRequest[]>(`/cases/${caseId}/discovery`),

  /** @deprecated Use ApiService.caseOperations.getEvidence() instead */
  getCaseEvidence: (caseId: string) =>
    fetchJson<EvidenceItem[]>(`/cases/${caseId}/evidence`),

  /** @deprecated Use ApiService.caseOperations.getMotions() instead */
  getCaseMotions: (caseId: string) =>
    fetchJson<Motion[]>(`/cases/${caseId}/motions`),

  /** @deprecated Use ApiService.caseOperations.getTeam() instead */
  getCaseTeam: (caseId: string) =>
    fetchJson<CaseMember[]>(`/parties/case/${caseId}`),

  /** @deprecated Use ApiService.caseOperations.addTeamMember() instead */
  addCaseTeamMember: (caseId: string, userId: string, role: string) =>
    postJson<void>('/parties', { case_id: caseId, user_id: userId, role }),

  /** @deprecated Use ApiService.caseOperations.removeTeamMember() instead */
  removeCaseTeamMember: (caseId: string, userId: string) =>
    deleteJson(`/parties/case/${caseId}/user/${userId}`),

  /** @deprecated Use ApiService.documents.create() instead */
  createDocument: (data: Partial<LegalDocument>) =>
    postJson<LegalDocument>('/documents', data),

  /** @deprecated Use ApiService.motions.create() instead */
  createMotion: (data: Partial<Motion>) =>
    postJson<Motion>('/motions', data),

  /** @deprecated Use ApiService.userProfiles.get() instead */
  getUserProfile: (userId: string) =>
    fetchJson<UserProfile>(`/user-profiles/user/${userId}`),

  // Placeholder methods for features not yet implemented in backend
  getFirmProcesses: () => Promise.resolve([]),
  getLegalHolds: () => Promise.resolve([]),
  getPrivilegeLogs: () => Promise.resolve([]),

  /** @deprecated Use ApiService.cases.create() instead */
  createCase: async (data: Partial<Case>): Promise<Case> => {
    const apiRequest = {
      title: data.title,
      client_name: data.client,
      opposing_counsel: data.opposingCounsel,
      status: data.status,
      filing_date: data.filingDate,
      description: data.description,
      value: data.value,
      matter_type: data.matterType,
      jurisdiction: data.jurisdiction,
      court: data.court,
      billing_model: data.billingModel,
      judge: data.judge,
      owner_org_id: data.ownerOrgId,
    };
    const cleanRequest = Object.fromEntries(Object.entries(apiRequest).filter(([_, v]) => v !== undefined));
    const apiCase = await postJson<ApiCase>('/cases', cleanRequest);
    return transformApiCase(apiCase);
  },

  /** @deprecated Use ApiService.cases.update() instead */
  updateCase: async (id: string, data: Partial<Case>): Promise<Case> => {
    const apiRequest = {
      title: data.title,
      client_name: data.client,
      opposing_counsel: data.opposingCounsel,
      status: data.status,
      filing_date: data.filingDate,
      description: data.description,
      value: data.value,
      matter_type: data.matterType,
      jurisdiction: data.jurisdiction,
      court: data.court,
      billing_model: data.billingModel,
      judge: data.judge,
      owner_org_id: data.ownerOrgId,
    };
    const cleanRequest = Object.fromEntries(Object.entries(apiRequest).filter(([_, v]) => v !== undefined));
    const apiCase = await putJson<ApiCase>(`/cases/${id}`, cleanRequest);
    return transformApiCase(apiCase);
  },

  /** @deprecated Use ApiService.cases.delete() instead */
  deleteCase: (id: string) => deleteJson(`/cases/${id}`),

  /** @deprecated Use ApiService.caseOperations.getDocuments() instead */
  getCaseDocuments: (caseId: string) =>
    fetchJson<LegalDocument[]>(`/cases/${caseId}/documents`),

  /** @deprecated Use ApiService.documents.getById() instead */
  getDocument: (id: string) =>
    fetchJson<LegalDocument>(`/documents/${id}`),

  /** @deprecated Use ApiService.jurisdictions.getAll() instead */
  getJurisdictions: (type?: string) =>
    fetchJson<Jurisdiction[]>(`/jurisdictions${type ? `?type=${type}` : ''}`),
};
