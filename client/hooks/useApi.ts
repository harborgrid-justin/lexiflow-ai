import { useState, useEffect } from 'react';
import { ApiService, ApiError } from '../services/apiService';

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
 */
export function useApi<T>(apiCall: () => Promise<T>, dependencies: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiErrorState | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(extractErrorState(err));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(extractErrorState(err));
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
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
 */
export function useMutation<T, P>(mutationFn: (params: P) => Promise<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiErrorState | null>(null);

  const mutate = async (params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(params);
      return result;
    } catch (err) {
      setError(extractErrorState(err));
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear the current error state
   */
  const clearError = () => setError(null);

  /**
   * Get validation error for a specific field
   */
  const getFieldError = (fieldName: string): string | undefined => {
    return error?.validationErrors?.[fieldName]?.[0];
  };

  /**
   * Check if a specific field has a validation error
   */
  const hasFieldError = (fieldName: string): boolean => {
    return Boolean(error?.validationErrors?.[fieldName]?.length);
  };

  return { mutate, loading, error, clearError, getFieldError, hasFieldError };
}

// Authentication hook
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await ApiService.getCurrentUser();
        setUser(currentUser);
      } catch (_err) {
        // User not authenticated
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await ApiService.login(email, password);
      ApiService.setAuthToken(response.access_token);
      setUser(response.user);
      return true;
    } catch (_err) {
      return false;
    }
  };

  const logout = () => {
    ApiService.clearAuthToken();
    setUser(null);
  };

  return { user, loading, login, logout };
}