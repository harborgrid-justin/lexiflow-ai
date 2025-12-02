/**
 * Settings API Exports
 *
 * Re-exports all settings API hooks and types for clean imports.
 */

// Types
export * from './settings.types';

// Settings API Hooks
export {
  settingsKeys,
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
} from './settings.api';

// Admin API Hooks (if available)
export * from './admin.api';
