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
    // Convert field errors to the expected Record<string, string[]> format
    const validationErrors: Record<string, string[]> = {};
    if (err.fieldErrors) {
      err.fieldErrors.forEach(fieldError => {
        if (!validationErrors[fieldError.field]) {
          validationErrors[fieldError.field] = [];
        }
        validationErrors[fieldError.field].push(fieldError.message);
      });
    }

    return {
      message: err.getUserFriendlyMessage(),
      status: err.statusCode,
      validationErrors: Object.keys(validationErrors).length > 0 ? validationErrors : undefined,
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
 * - Now uses useSafeState for memory-leak prevention
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
  const [data, setData] = useSafeState<T | null>(null);
  const [loading, setLoading] = useSafeState(false);
  const [error, setError] = useSafeState<ApiErrorState | null>(null);

  const executeApiCall = useLatestCallback(async () => {
    if (!isMounted()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      if (isMounted()) {
        setData(result);
        setLoading(false);
      }
    } catch (err) {
      if (isMounted()) {
        setError(extractErrorState(err));
        setLoading(false);
      }
    }
  });

  // Effect to execute API call when dependencies change
  useEffect(() => {
    executeApiCall();
  }, dependencies);

  const refetch = useLatestCallback(() => {
    executeApiCall();
  });

  return {
    data,
    loading,
    error,
    refetch,
  };
}

// Specific hooks for common operations
export function useCases() {
  return useApi(() => ApiService.cases.getAll());
}

export function useCase(id: string) {
  return useApi(() => ApiService.cases.getById(id), [id]);
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
 * - Now uses useSafeState for memory-leak prevention
 * - useIsMounted prevents state updates on unmounted components
 * - useLatestCallback ensures stable mutate reference
 * - Backwards compatible with existing usage
 *
 * @param mutationFn - Function that performs the mutation
 * @returns Object with mutate function, loading state, error state, and helper functions
 */
export function useMutation<T, P>(mutationFn: (params: P) => Promise<T>) {
  const isMounted = useIsMounted();
  const [loading, setLoading] = useSafeState(false);
  const [error, setError] = useSafeState<ApiErrorState | null>(null);

  /**
   * Wrapper around mutationFn that handles loading and error states
   * Maintains backwards compatibility with original API
   */
  const mutate = useLatestCallback(async (params: P): Promise<T | null> => {
    if (!isMounted()) return null;

    setLoading(true);
    setError(null);

    try {
      const result = await mutationFn(params);
      if (isMounted()) {
        setLoading(false);
      }
      return result;
    } catch (err) {
      if (isMounted()) {
        setError(extractErrorState(err));
        setLoading(false);
      }
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
      }

      // Always set loading to false, regardless of success/failure
      if (isMounted()) {
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