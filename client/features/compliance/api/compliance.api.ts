/**
 * Compliance API Hooks
 * 
 * Refactored to use SOA service architecture with dependency injection.
 * Uses the service registry to access the compliance service instead of direct API calls.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enzymeComplianceService } from '../../../enzyme/services/misc.service';
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
  return useQuery({
    queryKey: complianceKeys.dashboard(),
    queryFn: async () => {
      const response = await enzymeComplianceService.getAll();
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useConflictChecks() {
  return useQuery({
    queryKey: complianceKeys.conflicts(),
    queryFn: async () => {
      const response = await enzymeComplianceService.getConflicts();
      return response;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useEthicalWalls() {
  return useQuery({
    queryKey: complianceKeys.ethicalWalls(),
    queryFn: async () => {
      const response = await enzymeComplianceService.getWalls();
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useEthicalWall(id: string) {
  return useQuery({
    queryKey: complianceKeys.ethicalWall(id),
    queryFn: async () => {
      const response = await enzymeComplianceService.getById(id);
      return response;
    },
    enabled: !!id,
  });
}

// Mutations
export function useRunConflictCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entityName: string) => {
      // Assuming createConflictCheck accepts Partial<ConflictCheck> and entityName is a valid property
      const response = await enzymeComplianceService.createConflictCheck({ entityName } as any);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complianceKeys.conflicts() });
    },
  });
}

export function useCreateEthicalWall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<EthicalWall>) => {
      const response = await enzymeComplianceService.createEthicalWall(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complianceKeys.ethicalWalls() });
    },
  });
}

export function useUpdateEthicalWall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EthicalWall> }) => {
      const response = await enzymeComplianceService.update(id, data);
      return response as unknown as EthicalWall;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: complianceKeys.ethicalWall(id) });
      queryClient.invalidateQueries({ queryKey: complianceKeys.ethicalWalls() });
    },
  });
}
