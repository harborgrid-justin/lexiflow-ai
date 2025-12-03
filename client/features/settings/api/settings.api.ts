// Settings API with TanStack Query hooks

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { enzymeSettingsService } from '@/enzyme/services/settings.service';
import { enzymeAuthService } from '@/enzyme/services/auth.service';
import type {
  UserSettings,
  UpdateUserSettingsInput,
  OrganizationSettings,
  UpdateOrganizationSettingsInput,
  ChangePasswordInput,
  TwoFactorSetup,
  EnableTwoFactorInput,
  UserSession,
  ApiKey,
  CreateApiKeyInput,
  Integration,
  ConnectIntegrationInput,
  IntegrationType,
} from './settings.types';

// Query Keys
export const settingsKeys = {
  all: ['settings'] as const,
  user: () => [...settingsKeys.all, 'user'] as const,
  organization: () => [...settingsKeys.all, 'organization'] as const,
  sessions: () => [...settingsKeys.all, 'sessions'] as const,
  apiKeys: () => [...settingsKeys.all, 'apiKeys'] as const,
  integrations: () => [...settingsKeys.all, 'integrations'] as const,
  integration: (type: IntegrationType) => [...settingsKeys.integrations(), type] as const,
};

// ============================================================================
// User Settings Hooks
// ============================================================================

/**
 * Fetch current user settings
 */
export const useUserSettings = () => {
  return useQuery({
    queryKey: settingsKeys.user(),
    queryFn: () => enzymeSettingsService.user.get(),
  });
};

/**
 * Update user settings
 */
export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserSettingsInput) => enzymeSettingsService.user.update(data),
    onSuccess: (data) => {
      queryClient.setQueryData(settingsKeys.user(), data);
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
};

// ============================================================================
// Organization Settings Hooks
// ============================================================================

/**
 * Fetch organization settings
 */
export const useOrganizationSettings = () => {
  return useQuery({
    queryKey: settingsKeys.organization(),
    queryFn: () => enzymeSettingsService.organization.get(),
  });
};

/**
 * Update organization settings (Admin only)
 */
export const useUpdateOrganizationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrganizationSettingsInput) => enzymeSettingsService.organization.update(data),
    onSuccess: (data) => {
      queryClient.setQueryData(settingsKeys.organization(), data);
    },
  });
};

// ============================================================================
// Security Hooks
// ============================================================================

/**
 * Change password
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordInput) => enzymeAuthService.changePassword(data.currentPassword, data.newPassword),
  });
};

/**
 * Setup two-factor authentication
 */
export const useSetupTwoFactor = () => {
  return useMutation({
    mutationFn: () => enzymeSettingsService.security.setupTwoFactor(),
  });
};

/**
 * Enable two-factor authentication
 */
export const useEnableTwoFactor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EnableTwoFactorInput) => enzymeSettingsService.security.enableTwoFactor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.user() });
    },
  });
};

/**
 * Disable two-factor authentication
 */
export const useDisableTwoFactor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (password: string) => enzymeSettingsService.security.disableTwoFactor(password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.user() });
    },
  });
};

// ============================================================================
// Session Management Hooks
// ============================================================================

/**
 * Fetch active sessions
 */
export const useSessions = () => {
  return useQuery({
    queryKey: settingsKeys.sessions(),
    queryFn: () => enzymeSettingsService.sessions.getAll(),
  });
};

/**
 * Revoke a session
 */
export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => enzymeSettingsService.sessions.revoke(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.sessions() });
    },
  });
};

/**
 * Revoke all sessions except current
 */
export const useRevokeAllSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => enzymeSettingsService.sessions.revokeAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.sessions() });
    },
  });
};

// ============================================================================
// API Key Management Hooks
// ============================================================================

/**
 * Fetch API keys
 */
export const useApiKeys = () => {
  return useQuery({
    queryKey: settingsKeys.apiKeys(),
    queryFn: () => enzymeSettingsService.apiKeys.getAll(),
  });
};

/**
 * Create API key
 */
export const useCreateApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApiKeyInput) => enzymeSettingsService.apiKeys.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.apiKeys() });
    },
  });
};

/**
 * Revoke API key
 */
export const useRevokeApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyId: string) => enzymeSettingsService.apiKeys.revoke(keyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.apiKeys() });
    },
  });
};

// ============================================================================
// Integration Hooks
// ============================================================================

/**
 * Fetch available integrations
 */
export const useIntegrations = () => {
  return useQuery({
    queryKey: settingsKeys.integrations(),
    queryFn: () => enzymeSettingsService.integrations.getAll(),
  });
};

/**
 * Connect an integration
 */
export const useConnectIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConnectIntegrationInput) => enzymeSettingsService.integrations.connect(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.integrations() });
    },
  });
};

/**
 * Disconnect an integration
 */
export const useDisconnectIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (type: IntegrationType) => enzymeSettingsService.integrations.disconnect(type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.integrations() });
    },
  });
};

/**
 * Upload avatar
 */
export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => enzymeSettingsService.user.uploadAvatar(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.user() });
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
};
