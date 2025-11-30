/**
 * API Types for LexiFlow AI Frontend
 * These types match the backend API responses (snake_case format)
 *
 * IMPORTANT: The backend returns snake_case field names
 * Use the transformation utilities to convert to camelCase if needed
 */

// Re-export shared types
export * from '../shared-types';

// Import specific types for use
import {
  ApiUser,
  ApiCase,
  ApiDocument,
  ApiEvidence,
  ApiTask,
  ApiMotion,
  ApiDiscoveryRequest,
  ApiClient,
  ApiOrganization,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  CreateCaseRequest,
  UpdateCaseRequest,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  CreateEvidenceRequest,
  UpdateEvidenceRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  CreateMotionRequest,
  UpdateMotionRequest,
  CreateDiscoveryRequest,
  UpdateDiscoveryRequestDto,
  CreateUserRequest,
  UpdateUserRequest,
} from '../shared-types';

/**
 * API Service Type Definitions
 * These match the actual apiService.ts calls
 */
export interface ApiServiceTypes {
  // Auth
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: RegisterRequest) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<ApiUser>;

  // Cases
  getCases: () => Promise<ApiCase[]>;
  getCase: (id: string) => Promise<ApiCase>;
  createCase: (data: CreateCaseRequest) => Promise<ApiCase>;
  updateCase: (id: string, data: UpdateCaseRequest) => Promise<ApiCase>;
  deleteCase: (id: string) => Promise<void>;

  // Users
  getUsers: () => Promise<ApiUser[]>;
  getUser: (id: string) => Promise<ApiUser>;
  createUser: (data: CreateUserRequest) => Promise<ApiUser>;
  updateUser: (id: string, data: UpdateUserRequest) => Promise<ApiUser>;
  deleteUser: (id: string) => Promise<void>;

  // Documents
  getDocuments: () => Promise<ApiDocument[]>;
  getDocument: (id: string) => Promise<ApiDocument>;
  createDocument: (data: CreateDocumentRequest) => Promise<ApiDocument>;
  updateDocument: (id: string, data: UpdateDocumentRequest) => Promise<ApiDocument>;
  deleteDocument: (id: string) => Promise<void>;

  // Evidence
  getEvidence: () => Promise<ApiEvidence[]>;
  getEvidenceItem: (id: string) => Promise<ApiEvidence>;
  createEvidence: (data: CreateEvidenceRequest) => Promise<ApiEvidence>;
  updateEvidence: (id: string, data: UpdateEvidenceRequest) => Promise<ApiEvidence>;
  deleteEvidence: (id: string) => Promise<void>;

  // Tasks
  getTasks: () => Promise<ApiTask[]>;
  getTask: (id: string) => Promise<ApiTask>;
  createTask: (data: CreateTaskRequest) => Promise<ApiTask>;
  updateTask: (id: string, data: UpdateTaskRequest) => Promise<ApiTask>;
  deleteTask: (id: string) => Promise<void>;

  // Motions
  getMotions: () => Promise<ApiMotion[]>;
  getMotion: (id: string) => Promise<ApiMotion>;
  createMotion: (data: CreateMotionRequest) => Promise<ApiMotion>;
  updateMotion: (id: string, data: UpdateMotionRequest) => Promise<ApiMotion>;
  deleteMotion: (id: string) => Promise<void>;

  // Discovery
  getDiscovery: () => Promise<ApiDiscoveryRequest[]>;
  getDiscoveryRequest: (id: string) => Promise<ApiDiscoveryRequest>;
  createDiscoveryRequest: (data: CreateDiscoveryRequest) => Promise<ApiDiscoveryRequest>;
  updateDiscoveryRequest: (id: string, data: UpdateDiscoveryRequestDto) => Promise<ApiDiscoveryRequest>;
  deleteDiscoveryRequest: (id: string) => Promise<void>;

  // Clients
  getClients: () => Promise<ApiClient[]>;
  getClient: (id: string) => Promise<ApiClient>;

  // Organizations
  getOrganizations: () => Promise<ApiOrganization[]>;
  getOrganization: (id: string) => Promise<ApiOrganization>;
}

/**
 * Type guard to check if a value is an ApiUser
 */
export function isApiUser(value: any): value is ApiUser {
  return (
    value &&
    typeof value.id === 'string' &&
    typeof value.email === 'string' &&
    typeof value.first_name === 'string' &&
    typeof value.last_name === 'string'
  );
}

/**
 * Type guard to check if a value is an ApiCase
 */
export function isApiCase(value: any): value is ApiCase {
  return (
    value &&
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.client_name === 'string'
  );
}

/**
 * Type guard to check if a value is an ApiDocument
 */
export function isApiDocument(value: any): value is ApiDocument {
  return (
    value &&
    typeof value.id === 'string' &&
    typeof value.filename === 'string' &&
    typeof value.title === 'string' &&
    typeof value.file_path === 'string'
  );
}
