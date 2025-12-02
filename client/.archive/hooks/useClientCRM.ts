import { useApiRequest, useApiMutation, useLatestCallback } from '../enzyme';
import { Client } from '../types';
import { useQueryClient } from '@tanstack/react-query';

export const useClientCRM = () => {
  const queryClient = useQueryClient();

  // Fetch clients with Enzyme - automatic caching
  const { data: clients = [] } = useApiRequest<Client[]>({
    endpoint: '/api/v1/clients',
    options: { staleTime: 5 * 60 * 1000 } // 5 min cache
  });

  // Mutation for creating clients
  const { mutateAsync: createClient } = useApiMutation<Client, Partial<Client>>({
    method: 'POST',
    endpoint: '/api/v1/clients',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/clients'] });
    }
  });

  const handleAddClient = useLatestCallback(async (clientName: string) => {
    const newClient: Partial<Client> = {
      name: clientName,
      industry: 'General',
      status: 'Prospect',
      totalBilled: 0,
      matters: []
    };
    await createClient({ data: newClient });
  });

  return {
    clients,
    handleAddClient
  };
};