/**
 * useCases Hook - Enzyme-powered case management
 * 
 * Provides type-safe access to case data with caching, 
 * optimistic updates, and real-time sync capabilities.
 */

import { useCallback, useMemo } from 'react';
import { useApiRequest, useApiMutation, invalidateCache } from '../services/hooks';
import { enzymeCasesService } from '../services/cases.service';
import { useLatestCallback, useIsMounted, useTrackEvent } from '@missionfabric-js/enzyme/hooks';
import type { Case, CaseStatus } from '../../types';

interface UseCasesOptions {
  /** Filter by status */
  status?: CaseStatus;
  /** Filter by client ID */
  clientId?: string;
  /** Filter by assignee ID */
  assigneeId?: string;
  /** Search term */
  search?: string;
  /** Enable automatic refresh */
  autoRefresh?: boolean;
  /** Stale time in milliseconds */
  staleTime?: number;
}

interface UseCasesResult {
  /** List of cases */
  cases: Case[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Whether data has been fetched at least once */
  isFetched: boolean;
  /** Refetch cases */
  refetch: () => Promise<void>;
  /** Create a new case */
  createCase: (data: Partial<Case>) => Promise<Case>;
  /** Update an existing case */
  updateCase: (id: string, data: Partial<Case>) => Promise<Case>;
  /** Delete a case */
  deleteCase: (id: string) => Promise<void>;
  /** Creating state */
  isCreating: boolean;
  /** Updating state */
  isUpdating: boolean;
  /** Deleting state */
  isDeleting: boolean;
}

/**
 * Hook for managing case data with Enzyme
 * 
 * @example
 * ```tsx
 * const { cases, isLoading, createCase } = useCases({ status: 'Active' });
 * 
 * // Create a new case
 * const newCase = await createCase({ title: 'New Case', client: 'Acme Corp' });
 * ```
 */
export function useCases(options: UseCasesOptions = {}): UseCasesResult {
  const { status, clientId, assigneeId, search, staleTime = 60000 } = options;
  
  const isMounted = useIsMounted();
  const trackEvent = useTrackEvent();

  // Build query params
  const params = useMemo(() => {
    const p: Record<string, string> = {};
    if (status) p.status = status;
    if (clientId) p.clientId = clientId;
    if (assigneeId) p.assigneeId = assigneeId;
    if (search) p.search = search;
    return Object.keys(p).length > 0 ? p : undefined;
  }, [status, clientId, assigneeId, search]);

  // Fetch cases
  const { 
    data, 
    isLoading, 
    error, 
    isFetched,
    refetch 
  } = useApiRequest<Case[]>({
    endpoint: '/cases',
    options: { 
      staleTime,
      params,
    }
  });

  // Create mutation
  const { 
    mutateAsync: createMutation, 
    isPending: isCreating 
  } = useApiMutation<Case>({
    method: 'POST',
    endpoint: '/cases',
  });

  // Update mutation
  const { 
    mutateAsync: updateMutation, 
    isPending: isUpdating 
  } = useApiMutation<Case>({
    method: 'PUT',
    endpoint: '/cases',
  });

  // Delete mutation
  const { 
    mutateAsync: deleteMutation, 
    isPending: isDeleting 
  } = useApiMutation<void>({
    method: 'DELETE',
    endpoint: '/cases',
  });

  const createCase = useLatestCallback(async (caseData: Partial<Case>): Promise<Case> => {
    const newCase = await createMutation({ data: caseData });
    
    if (isMounted()) {
      trackEvent('case_created', { caseId: newCase.id });
      invalidateCache('/cases');
    }
    
    return newCase;
  });

  const updateCase = useLatestCallback(async (id: string, caseData: Partial<Case>): Promise<Case> => {
    const updatedCase = await enzymeCasesService.update(id, caseData);
    
    if (isMounted()) {
      trackEvent('case_updated', { caseId: id });
      invalidateCache('/cases');
      invalidateCache(`/cases/${id}`);
    }
    
    return updatedCase;
  });

  const deleteCase = useLatestCallback(async (id: string): Promise<void> => {
    await enzymeCasesService.delete(id);
    
    if (isMounted()) {
      trackEvent('case_deleted', { caseId: id });
      invalidateCache('/cases');
    }
  });

  return {
    cases: data || [],
    isLoading,
    error,
    isFetched,
    refetch,
    createCase,
    updateCase,
    deleteCase,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

/**
 * Hook for fetching a single case by ID
 */
export function useCase(caseId: string | undefined) {
  const isMounted = useIsMounted();
  
  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useApiRequest<Case>({
    endpoint: caseId ? `/cases/${caseId}` : '',
    options: { 
      enabled: !!caseId,
      staleTime: 30000,
    }
  });

  return {
    case: data,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for case statistics
 */
export function useCaseStats() {
  const { data, isLoading, error } = useApiRequest<{
    total: number;
    active: number;
    closed: number;
    pending: number;
  }>({
    endpoint: '/cases/stats',
    options: { staleTime: 120000 }
  });

  return {
    stats: data || { total: 0, active: 0, closed: 0, pending: 0 },
    isLoading,
    error,
  };
}

export default useCases;
