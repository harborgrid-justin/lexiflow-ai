// Settings Service using Enzyme API Client
// Provides type-safe settings operations

import { enzymeClient } from './client';
import {
  UserSettings,
  OrganizationSettings,
  ApiKey,
  Integration,
  IntegrationType,
  ConnectIntegrationInput,
  TwoFactorSetup,
  EnableTwoFactorInput,
  UserSession,
} from '../../features/settings/api/settings.types';

const ENDPOINTS = {
  user: '/users/me/settings',
  organization: '/organizations/settings',
  security: {
    setup2fa: '/users/me/2fa/setup',
    enable2fa: '/users/me/2fa/enable',
    disable2fa: '/users/me/2fa/disable',
  },
  sessions: {
    list: '/users/me/sessions',
    revoke: (id: string) => `/users/me/sessions/${id}`,
  },
  apiKeys: {
    list: '/users/me/api-keys',
    revoke: (id: string) => `/users/me/api-keys/${id}`,
  },
  integrations: {
    list: '/integrations',
    connect: '/integrations/connect',
    disconnect: (type: string) => `/integrations/${type}`,
  },
  avatar: '/users/me/avatar',
} as const;

export const enzymeSettingsService = {
  user: {
    async get(): Promise<UserSettings> {
      const response = await enzymeClient.get<UserSettings>(ENDPOINTS.user);
      return response.data;
    },
    async update(data: Partial<UserSettings>): Promise<UserSettings> {
      const response = await enzymeClient.patch<UserSettings>(ENDPOINTS.user, { body: data });
      return response.data;
    },
    async uploadAvatar(file: File): Promise<unknown> {
      const formData = new FormData();
      formData.append('avatar', file);
      const response = await enzymeClient.post(ENDPOINTS.avatar, {
        body: formData,
        headers: {
            'Content-Type': undefined 
        }
      });
      return response.data;
    }
  },
  organization: {
    async get(): Promise<OrganizationSettings> {
      const response = await enzymeClient.get<OrganizationSettings>(ENDPOINTS.organization);
      return response.data;
    },
    async update(data: Partial<OrganizationSettings>): Promise<OrganizationSettings> {
      const response = await enzymeClient.patch<OrganizationSettings>(ENDPOINTS.organization, { body: data });
      return response.data;
    },
  },
  security: {
    async setupTwoFactor(): Promise<TwoFactorSetup> {
      const response = await enzymeClient.post<TwoFactorSetup>(ENDPOINTS.security.setup2fa);
      return response.data;
    },
    async enableTwoFactor(data: EnableTwoFactorInput): Promise<{ backupCodes: string[] }> {
      const response = await enzymeClient.post<{ backupCodes: string[] }>(ENDPOINTS.security.enable2fa, { body: data });
      return response.data;
    },
    async disableTwoFactor(password: string): Promise<void> {
      await enzymeClient.post(ENDPOINTS.security.disable2fa, { body: { password } });
    },
  },
  sessions: {
    async getAll(): Promise<UserSession[]> {
      const response = await enzymeClient.get<UserSession[]>(ENDPOINTS.sessions.list);
      return response.data || [];
    },
    async revoke(id: string): Promise<void> {
      await enzymeClient.delete(ENDPOINTS.sessions.revoke(id));
    },
    async revokeAll(): Promise<void> {
      await enzymeClient.delete(ENDPOINTS.sessions.list);
    },
  },
  apiKeys: {
    async getAll(): Promise<ApiKey[]> {
      const response = await enzymeClient.get<ApiKey[]>(ENDPOINTS.apiKeys.list);
      return response.data || [];
    },
    async create(data: { name: string; scopes: string[] }): Promise<ApiKey> {
      const response = await enzymeClient.post<ApiKey>(ENDPOINTS.apiKeys.list, { body: data });
      return response.data;
    },
    async revoke(id: string): Promise<void> {
      await enzymeClient.delete(ENDPOINTS.apiKeys.revoke(id));
    },
  },
  integrations: {
    async getAll(): Promise<Integration[]> {
      const response = await enzymeClient.get<Integration[]>(ENDPOINTS.integrations.list);
      return response.data || [];
    },
    async connect(data: ConnectIntegrationInput): Promise<Integration> {
      const response = await enzymeClient.post<Integration>(ENDPOINTS.integrations.connect, { body: data });
      return response.data;
    },
    async disconnect(type: IntegrationType): Promise<void> {
      await enzymeClient.delete(ENDPOINTS.integrations.disconnect(type));
    },
  },
};
