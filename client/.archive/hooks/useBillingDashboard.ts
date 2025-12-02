import { useMemo } from 'react';
import { useApiRequest } from '../enzyme';
import { Client } from '../types';

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
    type: 'corporation',
    email: 'legal@acme.com',
    phone: '+1-555-0100',
    address: '123 Business Ave, Suite 100',
    industry: 'Technology',
    status: 'Active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    totalBilled: 125000,
    matters: [],
  },
  {
    id: '2',
    name: 'TechStart Inc',
    type: 'corporation',
    email: 'contact@techstart.io',
    phone: '+1-555-0101',
    address: '456 Innovation Blvd',
    industry: 'Software',
    status: 'Active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    totalBilled: 89000,
    matters: [],
  },
  {
    id: '3',
    name: 'Global Industries',
    type: 'corporation',
    email: 'legal@globalind.com',
    phone: '+1-555-0102',
    address: '789 Corporate Center',
    industry: 'Manufacturing',
    status: 'Active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    totalBilled: 156000,
    matters: [],
  },
];

export const useBillingDashboard = () => {
  // ✅ ENZYME: Parallel API requests - automatic caching and refetching
  const { data: stats } = useApiRequest<BillingStats>({
    endpoint: '/api/v1/billing/stats',
    options: {
      staleTime: 5 * 60 * 1000, // 5 min cache
      // Use mock data as fallback
      initialData: {
        wip: mockWipData,
        realization: mockRealizationData,
      },
    }
  });

  const { data: clients = mockClients } = useApiRequest<Client[]>({
    endpoint: '/api/v1/clients',
    options: {
      staleTime: 10 * 60 * 1000, // 10 min cache
      // Use mock data as fallback
      initialData: mockClients,
    }
  });

  // Derive data using useMemo for performance
  const wipData = useMemo(() => {
    const data = stats?.wip || mockWipData;
    return data.map((w: any) => ({ 
      name: w.month,
      month: w.month, 
      wip: w.amount,
      billed: Math.floor(w.amount * 0.7), // Mock billed amount
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