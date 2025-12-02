/**
 * useAuth Hook
 * Primary hook for authentication functionality
 * Combines TanStack Query with Zustand store
 */

import { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  useCurrentUser, 
  useLogin, 
  useLogout, 
  useRegister,
} from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import type { LoginCredentials, RegisterData } from '../api/auth.types';

export const useAuth = () => {
  const queryClient = useQueryClient();
  
  // Zustand store
  const {
    user: storeUser,
    status,
    isImpersonating,
    originalUser,
    error,
    setUser,
    setStatus,
    setError,
    impersonateUser: storeImpersonate,
    stopImpersonating: storeStopImpersonating,
    reset,
  } = useAuthStore();

  // TanStack Query
  const { data: queryUser, isLoading, isError, refetch } = useCurrentUser({
    enabled: status !== 'unauthenticated',
  });

  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useRegister();

  // Sync query user with store
  useEffect(() => {
    if (queryUser && !isImpersonating) {
      setUser(queryUser);
    }
  }, [queryUser, isImpersonating, setUser]);

  // Update status based on loading/error states
  useEffect(() => {
    if (isLoading) {
      setStatus('loading');
    } else if (isError) {
      setStatus('unauthenticated');
    } else if (queryUser) {
      setStatus('authenticated');
    }
  }, [isLoading, isError, queryUser, setStatus]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setStatus('loading');
      setError(null);
      const result = await loginMutation.mutateAsync(credentials);
      setUser(result.user);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      setStatus('unauthenticated');
      return false;
    }
  }, [loginMutation, setUser, setStatus, setError]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
      reset();
      queryClient.clear();
    } catch (err) {
      console.error('Logout error:', err);
      // Still reset local state even if API call fails
      reset();
    }
  }, [logoutMutation, reset, queryClient]);

  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    try {
      setStatus('loading');
      setError(null);
      const result = await registerMutation.mutateAsync(data);
      // Result is AuthResponse which has user property
      if (result && 'user' in result && result.user) {
        setUser(result.user as typeof storeUser);
      }
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      setStatus('unauthenticated');
      return false;
    }
  }, [registerMutation, setUser, setStatus, setError]);

  const impersonateUser = useCallback((user: typeof storeUser) => {
    if (user) {
      storeImpersonate(user);
    }
  }, [storeImpersonate]);

  const stopImpersonating = useCallback(() => {
    storeStopImpersonating();
  }, [storeStopImpersonating]);

  const refreshUser = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Use store user (which could be impersonated) or query user
  const user = storeUser ?? queryUser ?? null;

  return {
    // State
    user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading' || isLoading,
    isImpersonating,
    originalUser,
    error,
    status,

    // Actions
    login,
    logout,
    register,
    impersonateUser,
    stopImpersonating,
    refreshUser,

    // Mutation states for UI feedback
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};

export default useAuth;
