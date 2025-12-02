/**
 * useBillingDashboard Hook
 *
 * Data fetching and state management for the billing dashboard.
 * Uses TanStack Query for caching and background refetching.
 */

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/services/apiService';

interface BillingStats {
  wip?: Array<{ month: string; amount: number }>;
  realization?: Array<{ name: string; value: number; color: string }>;
}

interface BillingClient {
  id: string;
  name: string;
  industry: string;
  status: 'Active' | 'Prospect' | 'Former';
  totalBilled: number;
  matters: string[];
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

const mockClients: BillingClient[] = [
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
  // API request for billing stats
  const { data: statsData } = useQuery({
    queryKey: ['billing', 'stats'],
    queryFn: async () => {
      try {
        const response = await ApiService.billing.getStats();
        return response as BillingStats;
      } catch {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  // API request for clients
  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      try {
        const response = await ApiService.clients.getAll();
        return response as BillingClient[];
      } catch {
        return null;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 min cache
  });

  // Derive data using useMemo for performance
  const wipData = useMemo(() => {
    const data = statsData?.wip || mockWipData;
    return data.map((w: { month: string; amount: number }) => ({
      name: w.month,
      month: w.month,
      wip: w.amount,
      billed: Math.floor(w.amount * 0.7),
    }));
  }, [statsData]);

  const realizationData = useMemo(() => {
    return statsData?.realization || mockRealizationData;
  }, [statsData]);

  const clients = useMemo(() => {
    return clientsData ?? mockClients;
  }, [clientsData]);

  const totalWip = useMemo(() => {
    return wipData.reduce((acc, curr) => acc + curr.wip, 0);
  }, [wipData]);

  return {
    wipData,
    realizationData,
    clients,
    totalWip,
  };
};
