/**
 * Service Contracts - Index
 * 
 * Central export point for all service interface contracts.
 * This enables consistent service contract usage across the application.
 */

// Base Service Contract
export type {
  IBaseService,
  QueryOptions,
  ServiceResponse,
  ValidationResult,
  ValidationError,
  HealthStatus
} from './IBaseService';

// Domain Service Contracts
export type {
  ICaseService,
  IDocumentService,
  IComplianceService,
  IClientService,
  IBillingService,
  ITaskService,
  IEvidenceService,
  ICommunicationService,
  IMotionService
} from './IDomainServices';

// Infrastructure Service Contracts
export type {
  IAuthenticationService,
  ICacheService,
  ILoggingService,
  ILogger,
  INotificationService,
  IAnalyticsService,
  IConfigurationService,
  IFileStorageService,
  ISearchService,
  AuthResult,
  LogMetadata,
  NotificationRequest,
  Notification,
  AnalyticsEvent,
  MetricsQuery,
  FileUploadResult,
  FileInfo,
  SearchQuery,
  SearchResult,
  SearchHit,
  SearchDocument
} from './IInfrastructureServices';

/**
 * Service Container Interface
 * Defines the contract for the service registry/container
 */
export interface IServiceContainer {
  register<T>(key: string, implementation: T): void;
  register<T>(key: string, factory: () => T): void;
  resolve<T>(key: string): T;
  isRegistered(key: string): boolean;
  unregister(key: string): void;
  clear(): void;
}

/**
 * Service Registry Keys
 * Centralized service identifiers for dependency injection
 */
export const SERVICE_KEYS = {
  // Domain Services
  CASE_SERVICE: 'ICaseService',
  DOCUMENT_SERVICE: 'IDocumentService',
  COMPLIANCE_SERVICE: 'IComplianceService',
  CLIENT_SERVICE: 'IClientService',
  BILLING_SERVICE: 'IBillingService',
  TASK_SERVICE: 'ITaskService',
  EVIDENCE_SERVICE: 'IEvidenceService',
  COMMUNICATION_SERVICE: 'ICommunicationService',
  MOTION_SERVICE: 'IMotionService',
  
  // Infrastructure Services
  AUTH_SERVICE: 'IAuthenticationService',
  CACHE_SERVICE: 'ICacheService',
  LOGGING_SERVICE: 'ILoggingService',
  NOTIFICATION_SERVICE: 'INotificationService',
  ANALYTICS_SERVICE: 'IAnalyticsService',
  CONFIG_SERVICE: 'IConfigurationService',
  FILE_STORAGE_SERVICE: 'IFileStorageService',
  SEARCH_SERVICE: 'ISearchService'
} as const;

export type ServiceKey = typeof SERVICE_KEYS[keyof typeof SERVICE_KEYS];