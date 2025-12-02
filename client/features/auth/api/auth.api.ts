/**
 * Auth API Hooks
 * TanStack Query hooks for authentication operations
 */

import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { ApiService } from '@/services/apiService';
import type { User } from '@/types';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  TwoFactorSetupResponse,
  TwoFactorVerifyRequest,
  Session,
  AcceptInviteRequest,
  SSOProvider,
} from './auth.types';

// ==================== Query Keys ====================

export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  sessions: () => [...authKeys.all, 'sessions'] as const,
  twoFactorStatus: () => [...authKeys.all, '2fa-status'] as const,
};

// ==================== Query Hooks ====================

/**
 * Get current authenticated user
 */
export const useCurrentUser = (
  options?: Omit<UseQueryOptions<User>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: () => ApiService.auth.getCurrentUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    ...options,
  });
};

/**
 * Get active sessions
 */
export const useSessions = (
  options?: Omit<UseQueryOptions<Session[]>, 'queryKey' | 'queryFn'>
) => {
  return useQuery({
    queryKey: authKeys.sessions(),
    queryFn: async () => {
      // Placeholder - implement when backend supports sessions list
      return [] as Session[];
    },
    staleTime: 2 * 60 * 1000,
    ...options,
  });
};

// ==================== Mutation Hooks ====================

/**
 * Login mutation
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await ApiService.auth.login(credentials.email, credentials.password);
      ApiService.setAuthToken(response.access_token);
      return response;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.user(), data.user);
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};

/**
 * Register mutation
 */
export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await ApiService.auth.register(data.email, data.password, data.name);
      if (response.access_token) {
        ApiService.setAuthToken(response.access_token);
      }
      return response;
    },
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(authKeys.user(), data.user);
      }
    },
  });
};

/**
 * Logout mutation
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      ApiService.clearAuthToken();
    },
    onSuccess: () => {
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.clear();
    },
  });
};

/**
 * Forgot password mutation
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordRequest) => {
      // Placeholder - implement when backend supports
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true, message: 'Password reset email sent' };
    },
  });
};

/**
 * Reset password mutation
 */
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async (data: ResetPasswordRequest) => {
      // Placeholder - implement when backend supports
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
  });
};

/**
 * Change password mutation
 */
export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      // Placeholder - implement when backend supports
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
  });
};

/**
 * Setup two-factor authentication
 */
export const useSetupTwoFactor = () => {
  return useMutation({
    mutationFn: async (): Promise<TwoFactorSetupResponse> => {
      // Placeholder - implement when backend supports
      return {
        secret: 'JBSWY3DPEHPK3PXP',
        qrCode: 'data:image/png;base64,...',
        backupCodes: ['12345678', '87654321'],
      };
    },
  });
};

/**
 * Verify two-factor code
 */
export const useVerifyTwoFactor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TwoFactorVerifyRequest) => {
      // Placeholder - implement when backend supports
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.twoFactorStatus() });
    },
  });
};

/**
 * Disable two-factor authentication
 */
export const useDisableTwoFactor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (code: string) => {
      // Placeholder - implement when backend supports
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.twoFactorStatus() });
    },
  });
};

/**
 * SSO login redirect
 */
export const useSSOLogin = () => {
  return useMutation({
    mutationFn: async (provider: SSOProvider) => {
      // In real implementation, this would redirect to SSO provider
      const redirectUrl = `/api/auth/sso/${provider}`;
      window.location.href = redirectUrl;
      return { redirectUrl };
    },
  });
};

/**
 * Accept invitation
 */
export const useAcceptInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AcceptInviteRequest) => {
      // Placeholder - implement when backend supports
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};

/**
 * Revoke session
 */
export const useRevokeSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      // Placeholder - implement when backend supports
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.sessions() });
    },
  });
};

/**
 * Revoke all sessions except current
 */
export const useRevokeAllSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Placeholder - implement when backend supports
      await new Promise(resolve => setTimeout(resolve, 500));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: authKeys.sessions() });
    },
  });
};

/**
 * Update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const currentUser = queryClient.getQueryData<User>(authKeys.user());
      if (!currentUser) throw new Error('No authenticated user');
      
      const updatedUser = await ApiService.users.update(currentUser.id, data);
      return updatedUser;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(authKeys.user(), updatedUser);
    },
  });
};

/**
 * Refresh token
 */
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: async () => {
      // Placeholder - implement when backend supports refresh tokens
      const response = await ApiService.auth.getCurrentUser();
      return response;
    },
  });
};
