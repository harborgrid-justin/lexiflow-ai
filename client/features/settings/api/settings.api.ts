// Settings API with TanStack Query hooks

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

// API base URL
const API_BASE = '/api';

// Helper function for API calls
const apiCall = async <T,>(endpoint: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
};

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
    queryFn: () => apiCall<UserSettings>('/users/me/settings'),
  });
};

/**
 * Update user settings
 */
export const useUpdateUserSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserSettingsInput) =>
      apiCall<UserSettings>('/users/me/settings', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
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
    queryFn: () => apiCall<OrganizationSettings>('/organizations/settings'),
  });
};

/**
 * Update organization settings (Admin only)
 */
export const useUpdateOrganizationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrganizationSettingsInput) =>
      apiCall<OrganizationSettings>('/organizations/settings', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
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
    mutationFn: (data: ChangePasswordInput) =>
      apiCall<{ message: string }>('/users/me/password', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  });
};

/**
 * Setup two-factor authentication
 */
export const useSetupTwoFactor = () => {
  return useMutation({
    mutationFn: () => apiCall<TwoFactorSetup>('/users/me/2fa/setup', { method: 'POST' }),
  });
};

/**
 * Enable two-factor authentication
 */
export const useEnableTwoFactor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EnableTwoFactorInput) =>
      apiCall<{ backupCodes: string[] }>('/users/me/2fa/enable', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
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
    mutationFn: (password: string) =>
      apiCall<{ message: string }>('/users/me/2fa/disable', {
        method: 'POST',
        body: JSON.stringify({ password }),
      }),
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
    queryFn: () => apiCall<UserSession[]>('/users/me/sessions'),
  });
};

/**
 * Revoke a session
 */
export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) =>
      apiCall<{ message: string }>(`/users/me/sessions/${sessionId}`, {
        method: 'DELETE',
      }),
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
    mutationFn: () =>
      apiCall<{ message: string }>('/users/me/sessions', {
        method: 'DELETE',
      }),
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
    queryFn: () => apiCall<ApiKey[]>('/users/me/api-keys'),
  });
};

/**
 * Create API key
 */
export const useCreateApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApiKeyInput) =>
      apiCall<ApiKey>('/users/me/api-keys', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
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
    mutationFn: (keyId: string) =>
      apiCall<{ message: string }>(`/users/me/api-keys/${keyId}`, {
        method: 'DELETE',
      }),
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
    queryFn: () => apiCall<Integration[]>('/integrations'),
  });
};

/**
 * Connect an integration
 */
export const useConnectIntegration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConnectIntegrationInput) =>
      apiCall<Integration>('/integrations/connect', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
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
    mutationFn: (type: IntegrationType) =>
      apiCall<{ message: string }>(`/integrations/${type}`, {
        method: 'DELETE',
      }),
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
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${API_BASE}/users/me/avatar`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Upload failed' }));
        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.user() });
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
    },
  });
};
