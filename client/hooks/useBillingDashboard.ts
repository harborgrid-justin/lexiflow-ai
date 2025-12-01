import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '../services/apiService';
import { Client, TimeEntry } from '../types';

interface BillingStats {
  wip?: Array<{ month: string; amount: number }>;
  realization?: Array<{ name: string; value: number; color: string }>;
}

export const useBillingDashboard = () => {
  // Parallel API requests with TanStack Query - automatic caching
  const { data: stats } = useQuery<BillingStats>({
    queryKey: ['billing', 'stats'],
    queryFn: () => ApiService.billing.getStats(),
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: () => ApiService.clients.getAll(),
    staleTime: 10 * 60 * 1000, // 10 min cache
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