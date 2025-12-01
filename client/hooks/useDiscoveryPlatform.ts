import { useApiRequest, useApiMutation, useLatestCallback } from '../enzyme';
import { DiscoveryRequest } from '../types';

export const useDiscoveryPlatform = () => {
  // ✅ ENZYME: Fetch discovery requests - automatic caching and error handling
  const { data: requests = [], isLoading, error, refetch } = useApiRequest<DiscoveryRequest[]>({
    endpoint: '/api/v1/discovery/requests',
    options: {
      staleTime: 5 * 60 * 1000, // 5 min cache
      retry: 2
    }
  });

  // ✅ ENZYME: Mutation for updating discovery requests
  const updateRequestMutation = useApiMutation({
    endpoint: '/api/v1/discovery/requests/:id',
    method: 'PUT',
    onSuccess: () => {
      refetch();
    }
  });

  const updateRequest = useLatestCallback(async (reqId: string, updates: Partial<DiscoveryRequest>) => {
    try {
      await updateRequestMutation.mutate({ id: reqId, ...updates });
    } catch (err) {
      console.error('Failed to update discovery request:', err);
      throw err;
    }
  });

  return {
    requests,
    isLoading,
    error,
    updateRequest,
    refetch
  };
};