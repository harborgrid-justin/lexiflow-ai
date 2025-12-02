/**
 * Auth Feature Types
 * Type definitions for authentication and authorization
 */

import type { User, UserRole } from '@/types';

// ==================== Auth Request/Response Types ====================

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
  organizationId?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

export interface TokenRefreshResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}

// ==================== Password Reset Types ====================

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ==================== Two-Factor Auth Types ====================

export interface TwoFactorSetupResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorVerifyRequest {
  code: string;
  userId?: string;
}

export interface TwoFactorLoginRequest {
  userId: string;
  code: string;
  trustDevice?: boolean;
}

// ==================== SSO Types ====================

export type SSOProvider = 'google' | 'microsoft' | 'okta' | 'saml';

export interface SSOLoginRequest {
  provider: SSOProvider;
  redirectUrl?: string;
}

export interface SSOCallbackParams {
  provider: SSOProvider;
  code: string;
  state?: string;
}

// ==================== Session Types ====================

export interface Session {
  id: string;
  userId: string;
  userAgent: string;
  ipAddress: string;
  location?: string;
  createdAt: string;
  lastActiveAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

// ==================== Invitation Types ====================

export interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  organizationId: string;
  invitedBy: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  createdAt: string;
}

export interface AcceptInviteRequest {
  token: string;
  name: string;
  password: string;
}

// ==================== Auth State Types ====================

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'requires_2fa';

export interface AuthState {
  user: User | null;
  status: AuthStatus;
  isImpersonating: boolean;
  originalUser: User | null;
  error: string | null;
}

// ==================== Permission Types ====================

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

export interface RolePermissions {
  role: UserRole;
  permissions: Permission[];
}
