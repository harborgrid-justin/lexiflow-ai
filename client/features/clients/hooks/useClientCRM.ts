/**
 * useClientCRM Hook
 *
 * Data fetching and state management for the Client CRM.
 */

import { useApiRequest, useApiMutation, useLatestCallback } from '@/enzyme';
import { ApiService } from '@/services/apiService';
import type { Client } from '@/types';

export const useClientCRM = () => {
  // Fetch clients
  const { data: clients = [], isLoading } = useApiRequest<Client[]>({
    endpoint: '/clients',
    options: {
      staleTime: 5 * 60 * 1000, // 5 min cache
    }
  });

  // Mutation for creating clients
  const { mutateAsync: createClient } = useApiMutation<Client, Partial<Client>>({
    mutationFn: (data) => ApiService.clients.create(data)
  });

  const handleAddClient = useLatestCallback(async (clientName: string) => {
    const newClient: Partial<Client> = {
      name: clientName,
      industry: 'General',
      status: 'Prospect',
      totalBilled: 0,
      matters: [],
    };
    await createClient(newClient);
  });

  return {
    clients,
    isLoading,
    handleAddClient,
  };
};
