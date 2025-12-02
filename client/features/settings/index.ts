/**
 * Settings Feature Exports
 *
 * This file provides a centralized export point for all settings-related
 * components, hooks, and utilities.
 */

// Pages
export { SettingsPage } from './pages/SettingsPage';
export { AdminPage } from './pages/AdminPage';
export { IntegrationsPage } from './pages/IntegrationsPage';
export { ProfilePage } from './pages/ProfilePage';

// API Hooks
export {
  useUserSettings,
  useUpdateUserSettings,
  useOrganizationSettings,
  useUpdateOrganizationSettings,
  useChangePassword,
  useSetupTwoFactor,
  useEnableTwoFactor,
  useDisableTwoFactor,
  useSessions,
  useRevokeSession,
  useRevokeAllSessions,
  useApiKeys,
  useCreateApiKey,
  useRevokeApiKey,
  useIntegrations,
  useConnectIntegration,
  useDisconnectIntegration,
  useUploadAvatar,
  settingsKeys,
} from './api/settings.api';

export {
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useResendInvitation,
  useResetUserPassword,
  useRoles,
  useRole,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
  useAuditLog,
  useExportAuditLog,
  useOrganizationStats,
  adminKeys,
} from './api/admin.api';

// Types
export type {
  Theme,
  Language,
  DateFormat,
  DigestFrequency,
  UserSettings,
  UpdateUserSettingsInput,
  OrganizationSettings,
  UpdateOrganizationSettingsInput,
  User,
  UserRole,
  UserStatus,
  CreateUserInput,
  UpdateUserInput,
  Role,
  Permission,
  CreateRoleInput,
  UpdateRoleInput,
  AuditLogEntry,
  AuditAction,
  AuditLogFilters,
  AuditLogResponse,
  UserSession,
  ApiKey,
  CreateApiKeyInput,
  Integration,
  IntegrationType,
  IntegrationStatus,
  IntegrationCategory,
  ConnectIntegrationInput,
  ChangePasswordInput,
  TwoFactorSetup,
  EnableTwoFactorInput,
  VerifyTwoFactorInput,
} from './api/settings.types';

// Store
export {
  settingsStore,
  useSettingsStore,
  useTheme,
  useSidebarCollapsed,
  useUserSettingsStore,
  settingsActions,
} from './store/settings.store';
