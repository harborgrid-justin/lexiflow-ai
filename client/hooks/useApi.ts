/**
 * ENZYME MIGRATION - Enhanced API Hooks
 *
 * This file provides foundational API data fetching hooks that have been enhanced
 * with Enzyme's Virtual DOM patterns for improved performance, reliability, and UX.
 *
 * MIGRATION SUMMARY:
 * - useApi: Enhanced with useApiRequest, useIsMounted, useLatestCallback, useSafeState
 * - useMutation: Enhanced with useApiMutation, useIsMounted, useLatestCallback, useSafeState
 * - useAuth: Enhanced with useIsMounted, useLatestCallback, useSafeState
 * - All specific hooks (useCases, useCase, etc.): Updated to use enhanced base hooks
 *
 * ENZYME FEATURES USED:
 * - useApiRequest: TanStack Query wrapper for declarative data fetching
 * - useApiMutation: TanStack Query mutations with optimistic updates
 * - useIsMounted: Prevents state updates on unmounted components
 * - useLatestCallback: Stable callback references with latest closure values
 * - useSafeState: Memory-leak-safe state management
 *
 * BENEFITS:
 * - Automatic caching, deduplication, and background refetching
 * - Race condition prevention via useIsMounted guards
 * - Stable callback references prevent unnecessary re-renders
 * - Memory-leak prevention via useSafeState
 * - Consistent error handling with ApiError integration
 *
 * @see /client/enzyme/MIGRATION_PLAN.md
 * @migration Agent 41 - Wave 6 (Hooks - Enzyme Virtual DOM)
 * @date December 2, 2025
 */

import { useEffect } from 'react';
import { ApiService, ApiError } from '../services/apiService';
import {
  useApiRequest,
  useApiMutation,
  useIsMounted,
  useLatestCallback,
  useSafeState,
} from '../enzyme';

/**
 * Error state with typed API error information
 */
export interface ApiErrorState {
  /** User-friendly error message */
  message: string;
  /** HTTP status code */
  status?: number;
  /** Field-level validation errors (for 422 responses) */
  validationErrors?: Record<string, string[]>;
  /** Whether this is a validation error */
  isValidation?: boolean;
  /** Whether this is a server error */
  isServerError?: boolean;
  /** The original ApiError for advanced usage */
  original?: ApiError;
}

/**
 * Extract structured error state from an error
 */
function extractErrorState(err: unknown): ApiErrorState {
  if (err instanceof ApiError) {
    return {
      message: err.getUserMessage(),
      status: err.status,
      validationErrors: err.getValidationErrors(),
      isValidation: err.isValidationError(),
      isServerError: err.isServerError(),
      original: err,
    };
  }
  return {
    message: err instanceof Error ? err.message : 'An unexpected error occurred',
  };
}

/**
 * Generic hook for API data fetching with structured error handling
 *
 * ENZYME ENHANCED:
 * - Now uses useApiRequest for automatic caching and deduplication
 * - useIsMounted prevents state updates on unmounted components
 * - useLatestCallback ensures stable refetch reference
 * - Backwards compatible with existing usage
 *
 * @param apiCall - Function that returns a promise with the data
 * @param dependencies - Dependencies array (triggers refetch when changed)
 * @returns Object with data, loading, error, and refetch function
 */
export function useApi<T>(apiCall: () => Promise<T>, dependencies: unknown[] = []) {
  const isMounted = useIsMounted();

  // Use Enzyme's useApiRequest with custom query function
  // Note: We create a unique query key based on the apiCall function and dependencies
  const queryKey = ['api', apiCall.toString().substring(0, 50), ...dependencies];

  const { data, isLoading: loading, error: rawError, refetch } = useApiRequest<T>({
    queryKey,
    queryFn: apiCall,
    options: {
      enabled: true,
      staleTime: 0, // Always refetch on mount to maintain original behavior
      retry: 1, // Retry once on failure
    }
  });

  // Convert raw error to ApiErrorState format for backwards compatibility
  const error = rawError ? extractErrorState(rawError) : null;

  // Wrap refetch with useLatestCallback and isMounted guard
  const safeRefetch = useLatestCallback(async () => {
    if (!isMounted()) return;
    await refetch();
  });

  return {
    data: data ?? null,
    loading,
    error,
    refetch: safeRefetch
  };
}

// Specific hooks for common operations
export function useCases() {
  return useApi(() => ApiService.getCases());
}

export function useCase(id: string) {
  return useApi(() => ApiService.getCase(id), [id]);
}

export function useUsers() {
  return useApi(() => ApiService.getUsers());
}

export function useDocuments() {
  return useApi(() => ApiService.getDocuments());
}

export function useEvidence() {
  return useApi(() => ApiService.getEvidence());
}

export function useMotions() {
  return useApi(() => ApiService.getMotions());
}

export function useTasks() {
  return useApi(() => ApiService.tasks.getAll());
}

export function useDiscovery() {
  return useApi(() => ApiService.getDiscovery());
}

export function useClients() {
  return useApi(() => ApiService.getClients());
}

export function useOrganizations() {
  return useApi(() => ApiService.getOrganizations());
}

export function useCaseDocuments(caseId: string) {
  return useApi(() => ApiService.caseOperations.getDocuments(caseId), [caseId]);
}

export function useCaseTeam(caseId: string) {
  return useApi(() => ApiService.getCaseTeam(caseId), [caseId]);
}

export function useCaseEvidence(caseId: string) {
  return useApi(() => ApiService.getCaseEvidence(caseId), [caseId]);
}

export function useCaseMotions(caseId: string) {
  return useApi(() => ApiService.getCaseMotions(caseId), [caseId]);
}

export function useCaseBilling(caseId: string) {
  return useApi(() => ApiService.caseOperations.getBilling(caseId), [caseId]);
}

/**
 * Hook for mutations with loading state and structured error handling
 * Provides field-level validation errors for form submissions
 *
 * ENZYME ENHANCED:
 * - Now uses useApiMutation for automatic cache invalidation
 * - useIsMounted prevents state updates on unmounted components
 * - useLatestCallback ensures stable mutate reference
 * - useSafeState prevents memory leaks
 * - Backwards compatible with existing usage
 *
 * @param mutationFn - Function that performs the mutation
 * @returns Object with mutate function, loading state, error state, and helper functions
 */
export function useMutation<T, P>(mutationFn: (params: P) => Promise<T>) {
  const isMounted = useIsMounted();
  const [error, setError] = useSafeState<ApiErrorState | null>(null);

  // Use Enzyme's useApiMutation with custom mutation function
  const { mutate: apiMutate, isPending: loading } = useApiMutation<T, P>({
    mutationFn,
    options: {
      onError: (err: unknown) => {
        if (!isMounted()) return;
        setError(extractErrorState(err));
      },
      onSuccess: () => {
        if (!isMounted()) return;
        setError(null);
      },
    }
  });

  /**
   * Wrapper around apiMutate that returns the result or null
   * Maintains backwards compatibility with original API
   */
  const mutate = useLatestCallback(async (params: P): Promise<T | null> => {
    try {
      if (!isMounted()) return null;
      setError(null);
      const result = await apiMutate(params);
      return result;
    } catch (err) {
      if (!isMounted()) return null;
      setError(extractErrorState(err));
      return null;
    }
  });

  /**
   * Clear the current error state
   */
  const clearError = useLatestCallback(() => {
    if (!isMounted()) return;
    setError(null);
  });

  /**
   * Get validation error for a specific field
   */
  const getFieldError = useLatestCallback((fieldName: string): string | undefined => {
    return error?.validationErrors?.[fieldName]?.[0];
  });

  /**
   * Check if a specific field has a validation error
   */
  const hasFieldError = useLatestCallback((fieldName: string): boolean => {
    return Boolean(error?.validationErrors?.[fieldName]?.length);
  });

  return { mutate, loading, error, clearError, getFieldError, hasFieldError };
}

/**
 * Authentication hook with user state management
 *
 * ENZYME ENHANCED:
 * - useIsMounted prevents state updates on unmounted components
 * - useLatestCallback ensures stable login/logout references
 * - useSafeState prevents memory leaks
 * - Async operations guarded with isMounted checks
 *
 * @returns Object with user state, loading state, login, and logout functions
 */
export function useAuth() {
  const isMounted = useIsMounted();
  const [user, setUser] = useSafeState(null);
  const [loading, setLoading] = useSafeState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await ApiService.getCurrentUser();
        if (!isMounted()) return;
        setUser(currentUser);
      } catch (_err) {
        // User not authenticated
        if (!isMounted()) return;
        setUser(null);
      } finally {
        if (!isMounted()) return;
        setLoading(false);
      }
    };

    checkAuth();
  }, [isMounted, setUser, setLoading]);

  const login = useLatestCallback(async (email: string, password: string) => {
    try {
      const response = await ApiService.login(email, password);
      if (!isMounted()) return false;

      ApiService.setAuthToken(response.access_token);
      setUser(response.user);
      return true;
    } catch (_err) {
      return false;
    }
  });

  const logout = useLatestCallback(() => {
    ApiService.clearAuthToken();
    if (!isMounted()) return;
    setUser(null);
  });

  return { user, loading, login, logout };
}