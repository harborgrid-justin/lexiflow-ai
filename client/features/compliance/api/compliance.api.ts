/**
 * Compliance API Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/services/apiService';
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
    queryFn: () => ApiService.compliance.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useConflictChecks() {
  return useQuery({
    queryKey: complianceKeys.conflicts(),
    queryFn: () => ApiService.compliance.getConflicts(),
    staleTime: 2 * 60 * 1000,
  });
}

export function useEthicalWalls() {
  return useQuery({
    queryKey: complianceKeys.ethicalWalls(),
    queryFn: () => ApiService.compliance.getWalls(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useEthicalWall(id: string) {
  return useQuery({
    queryKey: complianceKeys.ethicalWall(id),
    queryFn: () => ApiService.compliance.getById(id),
    enabled: !!id,
  });
}

// Mutations
export function useRunConflictCheck() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entityName: string) => 
      ApiService.compliance.createConflictCheck({ entityName, date: new Date().toISOString(), status: 'Review', foundIn: [], checkedBy: '' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complianceKeys.conflicts() });
    },
  });
}

export function useCreateEthicalWall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<EthicalWall>) => ApiService.compliance.createEthicalWall(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complianceKeys.ethicalWalls() });
    },
  });
}

export function useUpdateEthicalWall() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<EthicalWall> }) =>
      ApiService.compliance.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: complianceKeys.ethicalWall(id) });
      queryClient.invalidateQueries({ queryKey: complianceKeys.ethicalWalls() });
    },
  });
}
