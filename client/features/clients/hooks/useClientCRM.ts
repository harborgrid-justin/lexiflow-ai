/**
 * useClientCRM Hook
 *
 * Data fetching and state management for the Client CRM.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/services/apiService';
import { useLatestCallback } from '@/enzyme';
import type { Client } from '@/types';

export const useClientCRM = () => {
  const queryClient = useQueryClient();

  // Fetch clients
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => ApiService.clients.getAll(),
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  // Mutation for creating clients
  const createClientMutation = useMutation({
    mutationFn: (data: Partial<Client>) => ApiService.clients.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });

  const handleAddClient = useLatestCallback(async (clientName: string) => {
    const newClient: Partial<Client> = {
      name: clientName,
      industry: 'General',
      status: 'Prospect',
      totalBilled: 0,
      matters: [],
    };
    await createClientMutation.mutateAsync(newClient);
  });

  return {
    clients,
    isLoading,
    handleAddClient,
  };
};
