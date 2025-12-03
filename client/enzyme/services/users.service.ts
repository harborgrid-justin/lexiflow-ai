// Users Service using Enzyme API Client
// Provides type-safe user operations with retry and rate limiting

import { enzymeClient } from './client';
import { User } from '../../types';
import { ApiUser } from '../../shared-types';
import { transformApiUser } from '../../utils/type-transformers';

/**
 * Endpoint definitions for users
 */
const ENDPOINTS = {
  list: '/users',
  detail: (id: string) => `/users/${id}`,
  byEmail: (email: string) => `/users/email/${encodeURIComponent(email)}`,
} as const;

/**
 * Query parameters for listing users
 */
interface UserListParams {
  orgId?: string;
  role?: string;
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Users service using Enzyme API client
 * Provides type-safe, retry-enabled, rate-limited API calls
 */
export const enzymeUsersService = {
  /**
   * Get all users with optional filtering
   * @example
   * const users = await enzymeUsersService.getAll({ orgId: 'org-123' });
   */
  async getAll(params?: UserListParams): Promise<User[]> {
    const response = await enzymeClient.get<ApiUser[]>(ENDPOINTS.list, {
      params: params as Record<string, string | number | boolean>,
    });
    return (response.data || []).map(transformApiUser);
  },

  /**
   * Get a single user by ID
   * @example
   * const user = await enzymeUsersService.getById('user-123');
   */
  async getById(id: string): Promise<User> {
    const response = await enzymeClient.get<ApiUser>(ENDPOINTS.detail(id));
    return transformApiUser(response.data);
  },

  /**
   * Get a user by email address
   * @example
   * const user = await enzymeUsersService.getByEmail('john@example.com');
   */
  async getByEmail(email: string): Promise<User> {
    const response = await enzymeClient.get<ApiUser>(ENDPOINTS.byEmail(email));
    return transformApiUser(response.data);
  },

  /**
   * Update an existing user
   * @example
   * const updated = await enzymeUsersService.update('user-123', { firstName: 'John' });
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    // Transform frontend User to API format
    const apiRequest = {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      role: data.role,
      organization_id: data.organizationId,
      status: data.status,
      phone: data.phone,
      avatar: data.avatar,
    };

    // Remove undefined values
    const cleanRequest = Object.fromEntries(
      Object.entries(apiRequest).filter(([_, v]) => v !== undefined)
    );

    const response = await enzymeClient.put<ApiUser>(ENDPOINTS.detail(id), {
      body: cleanRequest,
    });
    return transformApiUser(response.data);
  },

  /**
   * Delete a user
   * @example
   * await enzymeUsersService.delete('user-123');
   */
  async delete(id: string): Promise<void> {
    await enzymeClient.delete(ENDPOINTS.detail(id));
  },
};

export default enzymeUsersService;
