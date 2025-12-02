import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import { QUERY_KEYS } from '@lib/constants';
import type { ApiResponse, PaginatedResponse, Case } from '@types/index';
import type { GetCasesParams, CreateCaseData, UpdateCaseData } from '../types';

// Get all cases
export function useCases(params?: GetCasesParams) {
  return useQuery({
    queryKey: [...QUERY_KEYS.CASES, params],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<PaginatedResponse<Case>>>('/cases', {
        params,
      });
      return response.data;
    },
  });
}

// Get single case
export function useCase(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.CASE_DETAIL(id),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Case>>(`/cases/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
}

// Create case
export function useCreateCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCaseData) => {
      const response = await apiClient.post<ApiResponse<Case>>('/cases', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CASES });
    },
  });
}

// Update case
export function useUpdateCase(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateCaseData) => {
      const response = await apiClient.patch<ApiResponse<Case>>(`/cases/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CASES });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CASE_DETAIL(id) });
    },
  });
}

// Delete case
export function useDeleteCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/cases/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CASES });
    },
  });
}
