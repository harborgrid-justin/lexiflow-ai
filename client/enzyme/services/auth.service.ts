// Auth Service using Enzyme API Client
// Provides type-safe authentication operations

import { enzymeClient } from './client';
import { User } from '../../types';

/**
 * Endpoint definitions for authentication
 */
const ENDPOINTS = {
  login: '/auth/login',
  register: '/auth/register',
  me: '/auth/me',
  logout: '/auth/logout',
  refreshToken: '/auth/refresh',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  changePassword: '/auth/change-password',
} as const;

/**
 * Login response with token and user
 */
interface LoginResponse {
  access_token: string;
  user: User;
  expires_in?: number;
  refresh_token?: string;
}

/**
 * Registration data
 */
interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  organization_id?: string;
}

/**
 * Auth service using Enzyme API client
 * Provides type-safe, retry-enabled API calls for authentication
 */
export const enzymeAuthService = {
  /**
   * Login with email and password
   * @example
   * const { access_token, user } = await enzymeAuthService.login('user@example.com', 'password123');
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await enzymeClient.post<LoginResponse>(ENDPOINTS.login, {
      body: { email, password },
    });
    
    // Store the token after successful login
    if (response.data.access_token) {
      localStorage.setItem('authToken', response.data.access_token);
    }
    
    return response.data;
  },

  /**
   * Register a new user
   * @example
   * const user = await enzymeAuthService.register({
   *   email: 'newuser@example.com',
   *   password: 'securepassword',
   *   first_name: 'John',
   *   last_name: 'Doe'
   * });
   */
  async register(userData: RegisterData): Promise<User> {
    const response = await enzymeClient.post<User>(ENDPOINTS.register, {
      body: userData,
    });
    return response.data;
  },

  /**
   * Get current authenticated user
   * @example
   * const currentUser = await enzymeAuthService.getCurrentUser();
   */
  async getCurrentUser(): Promise<User> {
    const response = await enzymeClient.get<User>(ENDPOINTS.me);
    return response.data;
  },

  /**
   * Logout the current user
   * @example
   * await enzymeAuthService.logout();
   */
  async logout(): Promise<void> {
    try {
      await enzymeClient.post(ENDPOINTS.logout, { body: {} });
    } finally {
      // Always clear tokens on logout
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
    }
  },

  /**
   * Refresh the access token
   * @example
   * const { access_token } = await enzymeAuthService.refreshToken(refreshToken);
   */
  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    const response = await enzymeClient.post<{ access_token: string }>(ENDPOINTS.refreshToken, {
      body: { refresh_token: refreshToken },
    });
    
    if (response.data.access_token) {
      localStorage.setItem('authToken', response.data.access_token);
    }
    
    return response.data;
  },

  /**
   * Request password reset email
   * @example
   * await enzymeAuthService.forgotPassword('user@example.com');
   */
  async forgotPassword(email: string): Promise<void> {
    await enzymeClient.post(ENDPOINTS.forgotPassword, {
      body: { email },
    });
  },

  /**
   * Reset password with token
   * @example
   * await enzymeAuthService.resetPassword('reset-token-123', 'newpassword123');
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await enzymeClient.post(ENDPOINTS.resetPassword, {
      body: { token, password: newPassword },
    });
  },

  /**
   * Change password for authenticated user
   * @example
   * await enzymeAuthService.changePassword('oldpassword', 'newpassword');
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await enzymeClient.post(ENDPOINTS.changePassword, {
      body: { current_password: currentPassword, new_password: newPassword },
    });
  },

  /**
   * Check if user is authenticated (has valid token)
   * @example
   * const isLoggedIn = enzymeAuthService.isAuthenticated();
   */
  isAuthenticated(): boolean {
    return !!(localStorage.getItem('authToken') || sessionStorage.getItem('authToken'));
  },

  /**
   * Get the current auth token
   * @example
   * const token = enzymeAuthService.getToken();
   */
  getToken(): string | null {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  },
};

export default enzymeAuthService;
