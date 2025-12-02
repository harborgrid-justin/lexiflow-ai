/**
 * Compliance Dashboard Hook
 * 
 * Provides data fetching for compliance features including
 * conflict checks and ethical walls.
 * 
 * @module features/compliance/hooks
 */

import { useApiRequest } from '@/enzyme';
import { ConflictCheck, EthicalWall } from '@/types';

export const useComplianceDashboard = () => {
  // Parallel API requests with Enzyme - automatic caching
  const { data: conflicts = [], isLoading: conflictsLoading, refetch: refetchConflicts } = useApiRequest<ConflictCheck[]>({
    endpoint: '/api/v1/compliance/conflicts',
    options: { staleTime: 5 * 60 * 1000 } // 5 min cache
  });

  const { data: walls = [], isLoading: wallsLoading, refetch: refetchWalls } = useApiRequest<EthicalWall[]>({
    endpoint: '/api/v1/compliance/walls',
    options: { staleTime: 5 * 60 * 1000 } // 5 min cache
  });

  return {
    conflicts,
    walls,
    isLoading: conflictsLoading || wallsLoading,
    refetch: () => {
      refetchConflicts();
      refetchWalls();
    }
  };
};
