/**
 * useLegalHolds Hook
 *
 * Manages legal holds for discovery compliance.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLatestCallback } from '@/enzyme';
import { DiscoveryApi } from '../api/discovery.api';
import type { LegalHold } from '../api/discovery.types';

export const useLegalHolds = () => {
  const queryClient = useQueryClient();

  const { 
    data: holds = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['discovery', 'legal-holds'],
    queryFn: DiscoveryApi.getLegalHolds,
    staleTime: 5 * 60 * 1000
  });

  const createMutation = useMutation({
    mutationFn: DiscoveryApi.createLegalHold,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discovery', 'legal-holds'] });
    }
  });

  const releaseMutation = useMutation({
    mutationFn: DiscoveryApi.releaseLegalHold,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discovery', 'legal-holds'] });
    }
  });

  const createHold = useLatestCallback(async (data: Omit<LegalHold, 'id'>) => {
    return createMutation.mutateAsync(data);
  });

  const releaseHold = useLatestCallback(async (id: string) => {
    return releaseMutation.mutateAsync(id);
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
