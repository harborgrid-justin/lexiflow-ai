/**
 * usePrivilegeLog Hook
 *
 * Manages privilege log entries for discovery.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLatestCallback } from '@/enzyme';
import { DiscoveryApi } from '../api/discovery.api';
import type { PrivilegeLogEntry } from '../api/discovery.types';

export const usePrivilegeLog = () => {
  const queryClient = useQueryClient();

  const { 
    data: entries = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['discovery', 'privilege-log'],
    queryFn: DiscoveryApi.getPrivilegeLog,
    staleTime: 5 * 60 * 1000
  });

  const addMutation = useMutation({
    mutationFn: DiscoveryApi.addPrivilegeEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discovery', 'privilege-log'] });
    }
  });

  const addEntry = useLatestCallback(async (data: Omit<PrivilegeLogEntry, 'id'>) => {
    return addMutation.mutateAsync(data);
  });

  return {
    entries,
    isLoading,
    error: error as Error | null,
    addEntry,
    isAdding: addMutation.isPending,
    refetch
  };
};

export default usePrivilegeLog;
