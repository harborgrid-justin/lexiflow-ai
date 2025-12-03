/**
 * useClientCRM Hook - Client Relationship Management
 *
 * Manages client data and CRM operations.
 *
 * @see /client/enzyme/ENZYME_COMPLETE_GUIDE.md
 */

import { useApiRequest } from '../services/hooks';
import { enzymeClient } from '../services/client';
import { useLatestCallback, useIsMounted } from '../index';
import type { Client } from '../../types';

export const useClientCRM = () => {
  const isMounted = useIsMounted();

  // Fetch clients with Enzyme - automatic caching
  const {
    data: clients = [],
    refetch,
  } = useApiRequest<Client[]>({
    endpoint: '/clients',
    options: {
      staleTime: 5 * 60 * 1000,
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

    try {
      await enzymeClient.post<Client>('/clients', newClient);
      if (isMounted()) {
        await refetch();
      }
    } catch (err) {
      console.error('Failed to create client:', err);
    }
  });

  return {
    clients,
    handleAddClient,
    refetch,
  };
};

export default useClientCRM;
