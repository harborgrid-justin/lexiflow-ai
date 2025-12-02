/**
 * Clients API Hooks
 * TanStack Query hooks for client operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/services/apiService';
import type { Client } from '@/types';

// Query Keys
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) =>
    [...clientKeys.lists(), filters] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
  summary: () => [...clientKeys.all, 'summary'] as const,
};

// Queries
export function useClients(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: clientKeys.list(filters),
    queryFn: () => ApiService.clients.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: () => ApiService.clients.getById(id),
    enabled: !!id,
  });
}

export function useClientSummary() {
  return useQuery({
    queryKey: clientKeys.summary(),
    queryFn: async () => {
      const clients = await ApiService.clients.getAll();
      return {
        totalClients: clients.length,
        activeClients: clients.filter((c: Client) => c.status === 'Active')
          .length,
        prospects: clients.filter((c: Client) => c.status === 'Prospect').length,
        totalRevenue: clients.reduce(
          (sum: number, c: Client) => sum + (c.totalBilled || 0),
          0
        ),
        avgBilledPerClient:
          clients.length > 0
            ? clients.reduce(
                (sum: number, c: Client) => sum + (c.totalBilled || 0),
                0
              ) / clients.length
            : 0,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Mutations
export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Client>) => ApiService.clients.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Client> }) =>
      ApiService.clients.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ApiService.clients.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
    },
  });
}
