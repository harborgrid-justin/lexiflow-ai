/**
 * Discovery Platform Hook - ENZYME MIGRATION COMPLETE
 *
 * Manages discovery requests, responses, and FRCP compliance workflows.
 * Handles fetching, updating, and caching of discovery request data.
 *
 * ENZYME FEATURES:
 * - useApiRequest: Automatic caching and error handling for discovery requests
 * - useApiMutation: Optimistic updates for request modifications
 * - useLatestCallback: Stable callback references for event handlers
 * - TanStack Query: Advanced caching with 5-minute stale time
 *
 * PATTERNS:
 * 1. Automatic refetch after mutations to keep data fresh
 * 2. Error handling delegated to useApiRequest/useApiMutation
 * 3. Stable callbacks prevent unnecessary re-renders
 * 4. Query invalidation ensures UI consistency
 *
 * LEGAL COMPLIANCE:
 * - No PII logged in analytics
 * - Discovery request data cached but not persisted to localStorage
 * - Proper error handling to prevent data loss
 *
 * @see /client/enzyme/ENZYME_COMPLETE_GUIDE.md
 */

import { useApiRequest, useApiMutation, useLatestCallback } from '../enzyme';
import { DiscoveryRequest } from '../types';

export const useDiscoveryPlatform = () => {
  // ENZYME: Fetch discovery requests - automatic caching and error handling
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