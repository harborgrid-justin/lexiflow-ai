// Enzyme API Hooks for LexiFlow
// React hooks for data fetching and mutations using Enzyme's built-in hooks
// These hooks provide loading states, error handling, and caching out of the box

import { useCallback, useState, useEffect } from 'react';
import { enzymeClient } from './client';

// Re-export Enzyme's built-in hooks for direct use
export {
  useApiRequest as useEnzymeApiRequest,
  useApiMutation as useEnzymeApiMutation,
  useGet,
  useGetById,
  useGetList,
  usePost,
  usePut,
  usePatch,
  useDelete,
  usePolling,
  usePrefetch,
  useLazyQuery,
  useApiHealth,
  useApiConnectivity,
  type ApiError,
  type UseApiRequestResult,
  type UseApiMutationResult,
} from '@missionfabric-js/enzyme/api';

/**
 * Simplified API request hook for LexiFlow
 * Provides loading, error, and data states for GET requests
 * Uses the configured enzymeClient instance
 */
export function useApiRequest<T>(
  endpoint: string,
  options?: {
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const enabled = options?.enabled;
  const onSuccess = options?.onSuccess;
  const onError = options?.onError;

  const fetchData = useCallback(async () => {
    if (enabled === false) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await enzymeClient.get<T>(endpoint);
      setData(response.data);
      onSuccess?.(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, enabled, onSuccess, onError]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
}

/**
 * API mutation hook for POST/PUT/PATCH/DELETE requests
 * Returns a mutate function with loading and error states
 */
export function useApiMutation<TData, TVariables = unknown>(
  endpoint: string,
  options?: {
    method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    onSuccess?: (data: TData) => void;
    onError?: (error: Error) => void;
  }
) {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const method = options?.method ?? 'POST';

  const mutate = useCallback(async (variables?: TVariables) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let response;
      
      switch (method) {
        case 'POST':
          response = await enzymeClient.post<TData>(endpoint, { body: variables });
          break;
        case 'PUT':
          response = await enzymeClient.put<TData>(endpoint, { body: variables });
          break;
        case 'PATCH':
          response = await enzymeClient.patch<TData>(endpoint, { body: variables });
          break;
        case 'DELETE':
          response = await enzymeClient.delete<TData>(endpoint);
          break;
      }
      
      setData(response.data);
      options?.onSuccess?.(response.data);
      return response.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, method, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { mutate, data, isLoading, error, reset };
}

/**
 * Lazy API request hook
 * Returns a fetch function that can be called manually
 */
export function useLazyApiRequest<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async (params?: Record<string, string | number | boolean>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await enzymeClient.get<T>(endpoint, { params });
      setData(response.data);
      return response.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  return { fetch, data, isLoading, error };
}
