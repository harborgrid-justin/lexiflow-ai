import { useMemo } from 'react';
import { useApiRequest } from '../enzyme';
import { Client, TimeEntry } from '../types';

interface BillingStats {
  wip?: Array<{ month: string; amount: number }>;
  realization?: Array<{ name: string; value: number; color: string }>;
}

export const useBillingDashboard = () => {
  // ✅ ENZYME: Parallel API requests - automatic caching and refetching
  const { data: stats } = useApiRequest<BillingStats>({
    endpoint: '/api/v1/billing/stats',
    options: {
      staleTime: 5 * 60 * 1000, // 5 min cache
    }
  });

  const { data: clients = [] } = useApiRequest<Client[]>({
    endpoint: '/api/v1/clients',
    options: {
      staleTime: 10 * 60 * 1000, // 10 min cache
    }
  });

  // Derive data using useMemo for performance
  const wipData = useMemo(() => {
    if (!stats?.wip) return [];
    return stats.wip.map((w: any) => ({ month: w.month, wip: w.amount }));
  }, [stats]);

  const realizationData = stats?.realization || [];
  const totalWip = wipData.reduce((acc, curr) => acc + curr.wip, 0);

  return {
    wipData,
    realizationData,
    clients,
    totalWip
  };
};