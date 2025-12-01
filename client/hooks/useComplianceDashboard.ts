import { useApiRequest } from '../enzyme';
import { ConflictCheck, EthicalWall } from '../types';

export const useComplianceDashboard = () => {
  // Parallel API requests with Enzyme - automatic caching
  const { data: conflicts = [] } = useApiRequest<ConflictCheck[]>({
    endpoint: '/api/v1/compliance/conflicts',
    options: { staleTime: 5 * 60 * 1000 } // 5 min cache
  });

  const { data: walls = [] } = useApiRequest<EthicalWall[]>({
    endpoint: '/api/v1/compliance/walls',
    options: { staleTime: 5 * 60 * 1000 } // 5 min cache
  });

  return {
    conflicts,
    walls
  };
};