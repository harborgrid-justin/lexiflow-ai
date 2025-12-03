/**
 * useLegalHolds Hook
 *
 * Manages legal holds for discovery compliance.
 */

import { useApiRequest, useApiMutation, useLatestCallback } from '@/enzyme';
import { DiscoveryApi } from '../api/discovery.api';
import type { LegalHold } from '../api/discovery.types';

export const useLegalHolds = () => {
  const { 
    data: holds = [], 
    isLoading, 
    error,
    refetch 
  } = useApiRequest<LegalHold[]>({
    endpoint: '/discovery/legal-holds',
    options: {
      staleTime: 5 * 60 * 1000
    }
  });

  const { mutateAsync: createMutation } = useApiMutation<LegalHold, Omit<LegalHold, 'id'>>({
    mutationFn: DiscoveryApi.createLegalHold,
    onSuccess: () => {
      refetch();
    }
  });

  const { mutateAsync: releaseMutation } = useApiMutation<LegalHold, string>({
    mutationFn: DiscoveryApi.releaseLegalHold,
    onSuccess: () => {
      refetch();
    }
  });

  const createHold = useLatestCallback(async (data: Omit<LegalHold, 'id'>) => {
    return createMutation(data);
  });

  const releaseHold = useLatestCallback(async (id: string) => {
    return releaseMutation(id);
  });

  return {
    holds,
    activeHolds: holds.filter(h => h.status === 'Active'),
    isLoading,
    error: error as Error | null,
    createHold,
    releaseHold,
    isCreating: createMutation.isPending,
    isReleasing: releaseMutation.isPending,
    refetch
  };
};

export default useLegalHolds;
