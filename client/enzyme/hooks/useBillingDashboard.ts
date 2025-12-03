/**
 * useBillingDashboard Hook - Billing Dashboard Management
 *
 * Manages billing statistics, WIP, and realization data.
 *
 * @see /client/enzyme/ENZYME_COMPLETE_GUIDE.md
 */

import { useMemo } from 'react';
import { useApiRequest } from '../services/hooks';
import { Client } from '../../types';

interface BillingStats {
  wip?: Array<{ month: string; amount: number }>;
  realization?: Array<{ name: string; value: number; color: string }>;
}

// Mock data for WIP and Realization
const mockWipData = [
  { month: 'Jan', amount: 45000 },
  { month: 'Feb', amount: 52000 },
  { month: 'Mar', amount: 48000 },
  { month: 'Apr', amount: 61000 },
  { month: 'May', amount: 55000 },
  { month: 'Jun', amount: 67000 },
];

const mockRealizationData = [
  { name: 'Collected', value: 92.4, color: '#10b981' },
  { name: 'Write-off', value: 7.6, color: '#ef4444' },
];

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    industry: 'Technology',
    status: 'Active',
    totalBilled: 125000,
    matters: [],
  },
  {
    id: '2',
    name: 'TechStart Inc',
    industry: 'Software',
    status: 'Active',
    totalBilled: 89000,
    matters: [],
  },
  {
    id: '3',
    name: 'Global Industries',
    industry: 'Manufacturing',
    status: 'Active',
    totalBilled: 156000,
    matters: [],
  },
];

export const useBillingDashboard = () => {
  // Parallel API requests with automatic caching
  const { data: statsData } = useApiRequest<any>('/billing/stats', {
    staleTime: 5 * 60 * 1000,
  });

  const stats: BillingStats = statsData || {
    wip: mockWipData,
    realization: mockRealizationData,
  };

  const { data: clientsData } = useApiRequest<any>('/clients', {
    staleTime: 10 * 60 * 1000,
  });

  const clients: Client[] = clientsData || mockClients;

  // Derive data with memoization
  const wipData = useMemo(() => {
    const data = stats?.wip || mockWipData;
    return data.map((w: any) => ({ 
      name: w.month,
      month: w.month, 
      wip: w.amount,
      billed: Math.floor(w.amount * 0.7),
    }));
  }, [stats]);

  const realizationData = stats?.realization || mockRealizationData;
  const totalWip = wipData.reduce((acc, curr) => acc + curr.wip, 0);

  return {
    wipData,
    realizationData,
    clients,
    totalWip
  };
};
