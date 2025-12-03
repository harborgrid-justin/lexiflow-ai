/**
 * Infrastructure Service Interfaces
 * 
 * Defines contracts for cross-cutting concerns and infrastructure services
 * that support the domain services. These handle authentication, logging,
 * caching, notifications, and other enterprise concerns.
 */

import { ServiceResponse } from './IBaseService';

/**
 * Authentication Service Interface
 */
export interface IAuthenticationService {
  login(email: string, password: string): Promise<ServiceResponse<AuthResult>>;
  logout(): Promise<ServiceResponse<void>>;
  refreshToken(): Promise<ServiceResponse<string>>;
  validateToken(token: string): Promise<ServiceResponse<boolean>>;
  getCurrentUser(): Promise<ServiceResponse<any>>;
  hasPermission(permission: string): Promise<ServiceResponse<boolean>>;
  hasRole(role: string): Promise<ServiceResponse<boolean>>;
}

export interface AuthResult {
  user: any;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

/**
 * Caching Service Interface
 */
export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  getKeys(pattern?: string): Promise<string[]>;
}

/**
 * Logging Service Interface
 */
export interface ILoggingService {
  debug(message: string, meta?: LogMetadata): void;
  info(message: string, meta?: LogMetadata): void;
  warn(message: string, meta?: LogMetadata): void;
  error(message: string, error?: Error, meta?: LogMetadata): void;
  fatal(message: string, error?: Error, meta?: LogMetadata): void;
  createLogger(context: string): ILogger;
}

export interface ILogger {
  debug(message: string, meta?: LogMetadata): void;
  info(message: string, meta?: LogMetadata): void;
  warn(message: string, meta?: LogMetadata): void;
  error(message: string, error?: Error, meta?: LogMetadata): void;
  fatal(message: string, error?: Error, meta?: LogMetadata): void;
}

export interface LogMetadata {
  userId?: string;
  caseId?: string;
  action?: string;
  ip?: string;
  userAgent?: string;
  correlationId?: string;
  [key: string]: any;
}

/**
 * Notification Service Interface
 */
export interface INotificationService {
  send(notification: NotificationRequest): Promise<ServiceResponse<void>>;
  sendBulk(notifications: NotificationRequest[]): Promise<ServiceResponse<void>>;
  getNotifications(userId: string): Promise<ServiceResponse<Notification[]>>;
  markAsRead(notificationId: string): Promise<ServiceResponse<void>>;
  subscribe(userId: string, topic: string): Promise<ServiceResponse<void>>;
  unsubscribe(userId: string, topic: string): Promise<ServiceResponse<void>>;
}

export interface NotificationRequest {
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  channel: 'email' | 'sms' | 'push' | 'in-app';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  data?: Record<string, any>;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  data?: Record<string, any>;
}

/**
 * Analytics Service Interface
 */
export interface IAnalyticsService {
  track(event: AnalyticsEvent): Promise<void>;
  trackPageView(page: string, userId?: string): Promise<void>;
  trackUserAction(action: string, userId: string, metadata?: Record<string, any>): Promise<void>;
  getMetrics(query: MetricsQuery): Promise<ServiceResponse<any>>;
  generateReport(type: string, parameters: Record<string, any>): Promise<ServiceResponse<any>>;
}

export interface AnalyticsEvent {
  name: string;
  userId?: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

export interface MetricsQuery {
  metrics: string[];
  dateRange: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, any>;
  groupBy?: string[];
}

/**
 * Configuration Service Interface
 */
export interface IConfigurationService {
  get<T>(key: string, defaultValue?: T): T;
  set(key: string, value: any): Promise<void>;
  getAll(): Record<string, any>;
  isFeatureEnabled(feature: string): boolean;
  getFeatureFlags(): Record<string, boolean>;
  reload(): Promise<void>;
}

/**
 * File Storage Service Interface
 */
export interface IFileStorageService {
  upload(file: File, path: string, metadata?: Record<string, any>): Promise<ServiceResponse<FileUploadResult>>;
  download(fileId: string): Promise<ServiceResponse<Blob>>;
  delete(fileId: string): Promise<ServiceResponse<void>>;
  getFileInfo(fileId: string): Promise<ServiceResponse<FileInfo>>;
  generateDownloadUrl(fileId: string, expiresIn?: number): Promise<ServiceResponse<string>>;
  list(path?: string): Promise<ServiceResponse<FileInfo[]>>;
}

export interface FileUploadResult {
  fileId: string;
  url: string;
  size: number;
  mimeType: string;
  checksum: string;
}

export interface FileInfo {
  id: string;
  name: string;
  path: string;
  size: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

/**
 * Search Service Interface
 */
export interface ISearchService {
  search(query: SearchQuery): Promise<ServiceResponse<SearchResult>>;
  index(document: SearchDocument): Promise<ServiceResponse<void>>;
  update(documentId: string, document: Partial<SearchDocument>): Promise<ServiceResponse<void>>;
  delete(documentId: string): Promise<ServiceResponse<void>>;
  suggest(query: string, type?: string): Promise<ServiceResponse<string[]>>;
}

export interface SearchQuery {
  query: string;
  filters?: Record<string, any>;
  sort?: string;
  page?: number;
  limit?: number;
  highlight?: boolean;
  facets?: string[];
}

export interface SearchResult {
  hits: SearchHit[];
  total: number;
  page: number;
  limit: number;
  facets?: Record<string, any>;
}

export interface SearchHit {
  id: string;
  score: number;
  source: any;
  highlights?: Record<string, string[]>;
}

export interface SearchDocument {
  id: string;
  type: string;
  title: string;
  content: string;
  metadata?: Record<string, any>;
  tags?: string[];
}