/**
 * useDiscoveryPlatform Hook
 *
 * Manages discovery requests, responses, and FRCP compliance workflows.
 *
 * Features:
 * - TanStack Query for data fetching with caching
 * - Mutations for request updates
 * - Stable callbacks with useLatestCallback
 */

import { useApiRequest, useApiMutation, useLatestCallback } from '@/enzyme';
import { DiscoveryApi } from '../api/discovery.api';
import type { DiscoveryRequest } from '@/types';
import type { UpdateDiscoveryRequestInput } from '../api/discovery.types';

interface UseDiscoveryPlatformReturn {
  requests: DiscoveryRequest[];
  isLoading: boolean;
  error: Error | null;
  updateRequest: (reqId: string, updates: UpdateDiscoveryRequestInput) => Promise<void>;
  refetch: () => void;
}

export const useDiscoveryPlatform = (): UseDiscoveryPlatformReturn => {
  // Fetch discovery requests
  const { 
    data: requests = [], 
    isLoading, 
    error,
    refetch 
  } = useApiRequest<DiscoveryRequest[]>({
    endpoint: '/discovery/requests',
    options: {
      staleTime: 5 * 60 * 1000,
      retry: 2
    }
  });

  // Update mutation
  const { mutateAsync: updateMutation } = useApiMutation<DiscoveryRequest, { id: string; updates: UpdateDiscoveryRequestInput }>({
    mutationFn: ({ id, updates }) => DiscoveryApi.updateRequest(id, updates),
    onSuccess: () => {
      refetch();
    }
  });

  const updateRequest = useLatestCallback(async (reqId: string, updates: UpdateDiscoveryRequestInput) => {
    try {
      await updateMutation({ id: reqId, updates });
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

export default useDiscoveryPlatform;
