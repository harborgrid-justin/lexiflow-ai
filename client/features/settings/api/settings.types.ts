// Settings & Admin Types for LexiFlow AI

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'en' | 'es' | 'fr' | 'de';
export type DateFormat = 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
export type DigestFrequency = 'none' | 'daily' | 'weekly' | 'monthly';

// User Settings
export interface UserSettings {
  id: string;
  userId: string;

  // Profile
  avatar?: string;
  phone?: string;
  title?: string;
  barNumber?: string;
  signature?: string;

  // Preferences
  theme: Theme;
  language: Language;
  timezone: string;
  dateFormat: DateFormat;
  defaultView: string;

  // Notifications
  emailNotifications: {
    caseUpdates: boolean;
    deadlines: boolean;
    messages: boolean;
    assignments: boolean;
    mentions: boolean;
    systemAlerts: boolean;
  };
  inAppNotifications: {
    caseUpdates: boolean;
    deadlines: boolean;
    messages: boolean;
    assignments: boolean;
    mentions: boolean;
  };
  digestFrequency: DigestFrequency;

  // Security
  twoFactorEnabled: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserSettingsInput {
  avatar?: string;
  phone?: string;
  title?: string;
  barNumber?: string;
  signature?: string;
  theme?: Theme;
  language?: Language;
  timezone?: string;
  dateFormat?: DateFormat;
  defaultView?: string;
  emailNotifications?: Partial<UserSettings['emailNotifications']>;
  inAppNotifications?: Partial<UserSettings['inAppNotifications']>;
  digestFrequency?: DigestFrequency;
}

// Organization Settings
export interface OrganizationSettings {
  id: string;
  organizationId: string;

  // Firm Information
  firmName: string;
  logo?: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  phone?: string;
  email?: string;
  website?: string;

  // Default Settings
  defaultBillingRates: {
    partner: number;
    associate: number;
    paralegal: number;
    clerk: number;
  };
  currency: string;
  fiscalYearStart: string;

  // Practice Areas
  practiceAreas: string[];

  // Matter Types
  matterTypes: string[];

  // Features
  features: {
    billing: boolean;
    timeTracking: boolean;
    documentManagement: boolean;
    caseManagement: boolean;
    compliance: boolean;
    analytics: boolean;
  };

  createdAt: string;
  updatedAt: string;
}

export interface UpdateOrganizationSettingsInput {
  firmName?: string;
  logo?: string;
  businessAddress?: Partial<OrganizationSettings['businessAddress']>;
  phone?: string;
  email?: string;
  website?: string;
  defaultBillingRates?: Partial<OrganizationSettings['defaultBillingRates']>;
  currency?: string;
  fiscalYearStart?: string;
  practiceAreas?: string[];
  matterTypes?: string[];
  features?: Partial<OrganizationSettings['features']>;
}

// User Management
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
  title?: string;
  phone?: string;
  barNumber?: string;
  status: UserStatus;
  organizationId: string;
  permissions: Permission[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'partner' | 'associate' | 'paralegal' | 'clerk' | 'client';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface CreateUserInput {
  email: string;
  name: string;
  role: UserRole;
  title?: string;
  phone?: string;
  permissions?: Permission[];
}

export interface UpdateUserInput {
  name?: string;
  role?: UserRole;
  title?: string;
  phone?: string;
  barNumber?: string;
  status?: UserStatus;
  permissions?: Permission[];
}

// Roles & Permissions
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem: boolean;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export type Permission =
  // Cases
  | 'cases:read'
  | 'cases:create'
  | 'cases:update'
  | 'cases:delete'
  | 'cases:assign'
  // Documents
  | 'documents:read'
  | 'documents:create'
  | 'documents:update'
  | 'documents:delete'
  | 'documents:share'
  // Billing
  | 'billing:read'
  | 'billing:create'
  | 'billing:update'
  | 'billing:approve'
  // Clients
  | 'clients:read'
  | 'clients:create'
  | 'clients:update'
  | 'clients:delete'
  // Users
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete'
  // Admin
  | 'admin:settings'
  | 'admin:billing'
  | 'admin:users'
  | 'admin:roles'
  | 'admin:audit';

export interface CreateRoleInput {
  name: string;
  description: string;
  permissions: Permission[];
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
  permissions?: Permission[];
}

// Audit Log
export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export type AuditAction =
  | 'user:login'
  | 'user:logout'
  | 'user:create'
  | 'user:update'
  | 'user:delete'
  | 'case:create'
  | 'case:update'
  | 'case:delete'
  | 'document:create'
  | 'document:update'
  | 'document:delete'
  | 'document:download'
  | 'settings:update'
  | 'role:create'
  | 'role:update'
  | 'role:delete';

export interface AuditLogFilters {
  userId?: string;
  action?: AuditAction;
  resource?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogResponse {
  entries: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Session Management
export interface UserSession {
  id: string;
  userId: string;
  deviceName: string;
  browser: string;
  os: string;
  ipAddress: string;
  location?: string;
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
}

// API Keys
export interface ApiKey {
  id: string;
  userId: string;
  name: string;
  key: string; // Only returned on creation
  prefix: string;
  permissions: Permission[];
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface CreateApiKeyInput {
  name: string;
  permissions: Permission[];
  expiresAt?: string;
}

// Integrations
export interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  description: string;
  icon: string;
  status: IntegrationStatus;
  category: IntegrationCategory;
  connectedAt?: string;
  config?: Record<string, any>;
}

export type IntegrationType =
  | 'email_office365'
  | 'email_gmail'
  | 'calendar_office365'
  | 'calendar_google'
  | 'storage_dropbox'
  | 'storage_box'
  | 'storage_onedrive'
  | 'pacer'
  | 'efiling'
  | 'accounting_quickbooks'
  | 'accounting_xero';

export type IntegrationStatus = 'available' | 'connected' | 'error';
export type IntegrationCategory = 'email' | 'calendar' | 'storage' | 'legal' | 'accounting';

export interface ConnectIntegrationInput {
  type: IntegrationType;
  config: Record<string, any>;
}

// Change Password
export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Two-Factor Authentication
export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface EnableTwoFactorInput {
  code: string;
}

export interface VerifyTwoFactorInput {
  code: string;
}
