/**
 * useComplianceDashboard Hook - Compliance Management
 *
 * Manages conflict checks and ethical walls.
 *
 * @see /client/enzyme/ENZYME_COMPLETE_GUIDE.md
 */

import { useApiRequest } from '../services/hooks';
import type { ConflictCheck, EthicalWall } from '../../types';

export const useComplianceDashboard = () => {
  // Parallel API requests with Enzyme - automatic caching
  const { data: conflicts = [], isLoading: loadingConflicts } = useApiRequest<ConflictCheck[]>({
    endpoint: '/compliance/conflicts',
    options: {
      staleTime: 5 * 60 * 1000,
    },
  });

  const { data: walls = [], isLoading: loadingWalls } = useApiRequest<EthicalWall[]>({
    endpoint: '/compliance/walls',
    options: {
      staleTime: 5 * 60 * 1000,
    },
  });

  return {
    conflicts,
    walls,
    loading: loadingConflicts || loadingWalls,
  };
};

export default useComplianceDashboard;
