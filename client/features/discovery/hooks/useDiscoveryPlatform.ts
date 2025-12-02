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

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLatestCallback } from '@/enzyme';
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
  const queryClient = useQueryClient();

  // Fetch discovery requests
  const { 
    data: requests = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['discovery', 'requests'],
    queryFn: DiscoveryApi.getRequests,
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateDiscoveryRequestInput }) =>
      DiscoveryApi.updateRequest(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discovery', 'requests'] });
    }
  });

  const updateRequest = useLatestCallback(async (reqId: string, updates: UpdateDiscoveryRequestInput) => {
    try {
      await updateMutation.mutateAsync({ id: reqId, updates });
    } catch (err) {
      console.error('Failed to update discovery request:', err);
      throw err;
    }
  });

  return {
    requests,
    isLoading,
    error: error as Error | null,
    updateRequest,
    refetch
  };
};

export default useDiscoveryPlatform;
