/**
 * useDiscoveryPlatform Hook - Discovery Management
 *
 * Manages discovery requests, responses, and FRCP compliance workflows.
 *
 * @see /client/enzyme/ENZYME_COMPLETE_GUIDE.md
 */

import { useApiRequest } from '../services/hooks';
import { enzymeClient } from '../services/client';
import { useLatestCallback, useIsMounted } from '../index';
import type { DiscoveryRequest } from '../../types';

export const useDiscoveryPlatform = () => {
  const isMounted = useIsMounted();

  // Fetch discovery requests - automatic caching and error handling
  const {
    data: requests = [],
    isLoading,
    error,
    refetch,
  } = useApiRequest<DiscoveryRequest[]>({
    endpoint: '/discovery/requests',
    options: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  });

  const updateRequest = useLatestCallback(async (reqId: string, updates: Partial<DiscoveryRequest>) => {
    try {
      await enzymeClient.put<DiscoveryRequest>(`/discovery/requests/${reqId}`, updates);
      if (isMounted()) {
        await refetch();
      }
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
    refetch,
  };
};

export default useDiscoveryPlatform;
