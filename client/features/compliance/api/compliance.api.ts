/**
 * Compliance API Hooks
 * 
 * Refactored to use SOA service architecture with dependency injection.
 * Uses the service registry to access the compliance service instead of direct API calls.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useService } from '@/core/registry';
import { SERVICE_KEYS, IComplianceService } from '@/core/contracts';
import type { EthicalWall } from '@/types';

// Query Keys
export const complianceKeys = {
  all: ['compliance'] as const,
  dashboard: () => [...complianceKeys.all, 'dashboard'] as const,
  conflicts: () => [...complianceKeys.all, 'conflicts'] as const,
  conflict: (id: string) => [...complianceKeys.conflicts(), id] as const,
  ethicalWalls: () => [...complianceKeys.all, 'ethical-walls'] as const,
  ethicalWall: (id: string) => [...complianceKeys.ethicalWalls(), id] as const,
  riskAssessments: () => [...complianceKeys.all, 'risk'] as const,
};

// Queries
export function useComplianceDashboard() {
  const complianceService = useService<IComplianceService>(SERVICE_KEYS.COMPLIANCE_SERVICE);
  
  return useQuery({
    queryKey: complianceKeys.dashboard(),
    queryFn: async () => {
      const response = await complianceService.getAll();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useConflictChecks() {
  const complianceService = useService<IComplianceService>(SERVICE_KEYS.COMPLIANCE_SERVICE);
  
  return useQuery({
    queryKey: complianceKeys.conflicts(),
    queryFn: async () => {
      const response = await complianceService.getConflictChecks();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useEthicalWalls() {
  const complianceService = useService<IComplianceService>(SERVICE_KEYS.COMPLIANCE_SERVICE);
  
  return useQuery({
    queryKey: complianceKeys.ethicalWalls(),
    queryFn: async () => {
      const response = await complianceService.getEthicalWalls();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useEthicalWall(id: string) {
  const complianceService = useService<IComplianceService>(SERVICE_KEYS.COMPLIANCE_SERVICE);
  
  return useQuery({
    queryKey: complianceKeys.ethicalWall(id),
    queryFn: async () => {
      const response = await complianceService.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

// Mutations
export function useRunConflictCheck() {
  const queryClient = useQueryClient();
  const complianceService = useService<IComplianceService>(SERVICE_KEYS.COMPLIANCE_SERVICE);

  return useMutation({
    mutationFn: async (entityName: string) => {
      const response = await complianceService.runConflictCheck(entityName);
      if (!response.success) {
        throw new Error(response.message || 'Failed to run conflict check');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complianceKeys.conflicts() });
    },
  });
}

export function useCreateEthicalWall() {
  const queryClient = useQueryClient();
  const complianceService = useService<IComplianceService>(SERVICE_KEYS.COMPLIANCE_SERVICE);

  return useMutation({
    mutationFn: async (data: Partial<EthicalWall>) => {
      const response = await complianceService.createEthicalWall(data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create ethical wall');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complianceKeys.ethicalWalls() });
    },
  });
}

export function useUpdateEthicalWall() {
  const queryClient = useQueryClient();
  const complianceService = useService<IComplianceService>(SERVICE_KEYS.COMPLIANCE_SERVICE);

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EthicalWall> }) => {
      const response = await complianceService.update(id, data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update ethical wall');
      }
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: complianceKeys.ethicalWall(id) });
      queryClient.invalidateQueries({ queryKey: complianceKeys.ethicalWalls() });
    },
  });
}
