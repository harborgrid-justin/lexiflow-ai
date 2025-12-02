import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import { useAuthStore } from '@stores/auth.store';
import { QUERY_KEYS } from '@lib/constants';
import type { ApiResponse } from '@types/index';
import type { LoginCredentials, RegisterData, LoginResponse, RegisterResponse } from '../types';

// Login mutation
export function useLogin() {
  const { login } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiClient.post<ApiResponse<LoginResponse>>(
        '/auth/login',
        credentials
      );
      return response.data;
    },
    onSuccess: (data) => {
      login(data.user, data.tokens);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_USER });
    },
  });
}

// Register mutation
export function useRegister() {
  const { login } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiClient.post<ApiResponse<RegisterResponse>>(
        '/auth/register',
        data
      );
      return response.data;
    },
    onSuccess: (data) => {
      login(data.user, data.tokens);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_USER });
    },
  });
}

// Logout mutation
export function useLogout() {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
    onError: () => {
      // Logout locally even if API call fails
      logout();
      queryClient.clear();
    },
  });
}

// Get current user query
export function useCurrentUser() {
  const { user, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: QUERY_KEYS.AUTH_USER,
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<LoginResponse['user']>>('/auth/me');
      return response.data;
    },
    enabled: isAuthenticated && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
