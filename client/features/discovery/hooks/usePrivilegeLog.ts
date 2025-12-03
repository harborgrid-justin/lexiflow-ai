/**
 * usePrivilegeLog Hook
 *
 * Manages privilege log entries for discovery.
 */

import { useApiRequest, useApiMutation, useLatestCallback } from '@/enzyme';
import { DiscoveryApi } from '../api/discovery.api';
import type { PrivilegeLogEntry } from '../api/discovery.types';

export const usePrivilegeLog = () => {
  const { 
    data: entries = [], 
    isLoading, 
    error,
    refetch 
  } = useApiRequest<PrivilegeLogEntry[]>({
    endpoint: '/discovery/privilege-log',
    options: {
      staleTime: 5 * 60 * 1000
    }
  });

  const { mutateAsync: addMutation, isLoading: isAdding } = useApiMutation<PrivilegeLogEntry, Omit<PrivilegeLogEntry, 'id'>>({
    mutationFn: DiscoveryApi.addPrivilegeEntry,
    onSuccess: () => {
      refetch();
    }
  });

  const addEntry = useLatestCallback(async (data: Omit<PrivilegeLogEntry, 'id'>) => {
    return addMutation(data);
  });

  return {
    entries,
    isLoading,
    error,
    addEntry,
    isAdding,
    refetch
  };
};

export default usePrivilegeLog;
