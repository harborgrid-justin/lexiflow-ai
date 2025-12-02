/**
 * Billing API Hooks
 * TanStack Query hooks for billing operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/services/apiService';
import type { TimeEntry } from '@/types';

// Query Keys
export const billingKeys = {
  all: ['billing'] as const,
  entries: () => [...billingKeys.all, 'entries'] as const,
  entry: (id: string) => [...billingKeys.entries(), id] as const,
  caseEntries: (caseId: string) => [...billingKeys.entries(), 'case', caseId] as const,
  summary: () => [...billingKeys.all, 'summary'] as const,
  caseSummary: (caseId: string) => [...billingKeys.summary(), caseId] as const,
};

// Queries
export function useTimeEntries(caseId?: string) {
  return useQuery({
    queryKey: caseId ? billingKeys.caseEntries(caseId) : billingKeys.entries(),
    queryFn: () => caseId 
      ? ApiService.billing.getTimeEntries(caseId)
      : ApiService.billing.getAllTimeEntries(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTimeEntry(id: string) {
  return useQuery({
    queryKey: billingKeys.entry(id),
    queryFn: () => ApiService.billing.getTimeEntry(id),
    enabled: !!id,
  });
}

export function useBillingSummary(caseId?: string) {
  return useQuery({
    queryKey: caseId ? billingKeys.caseSummary(caseId) : billingKeys.summary(),
    queryFn: () => caseId 
      ? ApiService.billing.getCaseSummary(caseId)
      : ApiService.billing.getSummary(),
    staleTime: 5 * 60 * 1000,
  });
}

// Mutations
export function useCreateTimeEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<TimeEntry>) => ApiService.billing.createTimeEntry(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: billingKeys.entries() });
      if (variables.caseId) {
        queryClient.invalidateQueries({ queryKey: billingKeys.caseEntries(variables.caseId) });
      }
    },
  });
}

export function useUpdateTimeEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TimeEntry> }) =>
      ApiService.billing.updateTimeEntry(id, data),
    onSuccess: (_, { id, data }) => {
      queryClient.invalidateQueries({ queryKey: billingKeys.entry(id) });
      queryClient.invalidateQueries({ queryKey: billingKeys.entries() });
      if (data.caseId) {
        queryClient.invalidateQueries({ queryKey: billingKeys.caseEntries(data.caseId) });
      }
    },
  });
}

export function useDeleteTimeEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ApiService.billing.deleteTimeEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.entries() });
    },
  });
}
