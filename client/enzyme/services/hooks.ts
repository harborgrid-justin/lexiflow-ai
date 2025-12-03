// Enzyme API Hooks for LexiFlow
// React hooks for data fetching and mutations using Enzyme's built-in hooks
// These hooks provide loading states, error handling, and caching out of the box

import { useCallback, useState, useEffect, useRef } from 'react';
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
 * Configuration options for useApiRequest hook
 */
export interface UseApiRequestOptions<T> {
  /** Whether the request should be executed automatically. Default: true */
  enabled?: boolean;
  /** Callback invoked when the request succeeds */
  onSuccess?: (data: T) => void;
  /** Callback invoked when the request fails */
  onError?: (error: Error) => void;
  /** Time in milliseconds after which data is considered stale. Default: 0 (always stale) */
  staleTime?: number;
  /** Whether to refetch when window regains focus. Default: false */
  refetchOnWindowFocus?: boolean;
  /** Number of retry attempts on failure. Default: 0 */
  retry?: number;
  /** Delay in milliseconds between retry attempts. Default: 1000 */
  retryDelay?: number;
  /** Query parameters to append to the endpoint */
  params?: Record<string, string | number | boolean>;
}

/**
 * Result returned by useApiRequest hook
 */
export interface LocalUseApiRequestResult<T> {
  /** The fetched data, or null if not yet loaded */
  data: T | null;
  /** Whether the request is currently in progress */
  isLoading: boolean;
  /** Error object if the request failed */
  error: Error | null;
  /** Function to manually trigger a refetch */
  refetch: () => Promise<void>;
  /** Whether the data is considered stale based on staleTime */
  isStale: boolean;
  /** Whether the data has ever been successfully fetched */
  isFetched: boolean;
}

/**
 * Simple cache to store request results and timestamps
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const requestCache = new Map<string, CacheEntry<unknown>>();

/**
 * Generate a cache key from endpoint and params
 */
function getCacheKey(endpoint: string, params?: Record<string, string | number | boolean>): string {
  if (!params || Object.keys(params).length === 0) {
    return endpoint;
  }
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return `${endpoint}?${sortedParams}`;
}

/**
 * Simplified API request hook for LexiFlow with TanStack Query-like features
 *
 * @template T - The expected response data type
 * @param endpoint - The API endpoint URL
 * @param options - Configuration options for the request
 *
 * @example
 * ```typescript
 * // Basic usage
 * const { data, isLoading, error } = useApiRequest<Case[]>('/cases');
 *
 * // With options
 * const { data, isLoading, refetch } = useApiRequest<Case>('/cases/123', {
 *   staleTime: 5 * 60 * 1000, // 5 minutes
 *   refetchOnWindowFocus: true,
 *   retry: 3,
 *   onSuccess: (data) => console.log('Loaded:', data),
 * });
 *
 * // Object-style syntax
 * const { data } = useApiRequest({
 *   endpoint: '/cases',
 *   options: { enabled: true }
 * });
 * ```
 */
export function useApiRequest<T>(
  endpoint: string,
  options?: UseApiRequestOptions<T>
): LocalUseApiRequestResult<T>;

/**
 * Simplified API request hook for LexiFlow with TanStack Query-like features (object syntax)
 *
 * @template T - The expected response data type
 * @param config - Configuration object containing endpoint and options
 *
 * @example
 * ```typescript
 * const { data, isLoading } = useApiRequest<Case[]>({
 *   endpoint: '/cases',
 *   options: { staleTime: 60000 }
 * });
 * ```
 */
export function useApiRequest<T>(config: {
  endpoint: string;
  options?: UseApiRequestOptions<T>;
}): LocalUseApiRequestResult<T>;

// Implementation
export function useApiRequest<T>(
  endpointOrConfig: string | { endpoint: string; options?: UseApiRequestOptions<T> },
  optionsParam?: UseApiRequestOptions<T>
): LocalUseApiRequestResult<T> {
  // Normalize arguments to support both signatures
  const endpoint = typeof endpointOrConfig === 'string'
    ? endpointOrConfig
    : endpointOrConfig.endpoint;
  const options = typeof endpointOrConfig === 'string'
    ? optionsParam
    : endpointOrConfig.options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isFetched, setIsFetched] = useState(false);

  const lastFetchTimeRef = useRef<number>(0);
  const retryCountRef = useRef<number>(0);
  const mountedRef = useRef<boolean>(true);

  const enabled = options?.enabled !== false;
  const staleTime = options?.staleTime ?? 0;
  const refetchOnWindowFocus = options?.refetchOnWindowFocus ?? false;
  const maxRetries = options?.retry ?? 0;
  const retryDelay = options?.retryDelay ?? 1000;
  const params = options?.params;

  const cacheKey = getCacheKey(endpoint, params);

  // Check if data is stale
  const isStale = Date.now() - lastFetchTimeRef.current > staleTime;

  const fetchData = useCallback(async () => {
    if (!enabled) return;

    // Check cache first
    const cached = requestCache.get(cacheKey) as CacheEntry<T> | undefined;
    if (cached && Date.now() - cached.timestamp < staleTime) {
      setData(cached.data);
      setIsFetched(true);
      lastFetchTimeRef.current = cached.timestamp;
      return;
    }

    setIsLoading(true);
    setError(null);

    const attemptFetch = async (attemptNumber: number): Promise<void> => {
      try {
        const response = await enzymeClient.get<T>(endpoint, { params });

        if (!mountedRef.current) return;

        const responseData = response.data;
        setData(responseData);
        setIsFetched(true);
        lastFetchTimeRef.current = Date.now();

        // Update cache
        requestCache.set(cacheKey, {
          data: responseData,
          timestamp: Date.now(),
        });

        options?.onSuccess?.(responseData);
        retryCountRef.current = 0;
      } catch (err) {
        if (!mountedRef.current) return;

        const errorObj = err instanceof Error ? err : new Error('Unknown error');

        // Retry logic
        if (attemptNumber < maxRetries) {
          retryCountRef.current = attemptNumber + 1;
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attemptNumber)));
          return attemptFetch(attemptNumber + 1);
        }

        setError(errorObj);
        options?.onError?.(errorObj);
        retryCountRef.current = 0;
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    await attemptFetch(0);
  }, [endpoint, enabled, staleTime, maxRetries, retryDelay, cacheKey, params, options]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Window focus refetch
  useEffect(() => {
    if (!refetchOnWindowFocus || !enabled) return;

    const handleFocus = () => {
      if (isStale && isFetched) {
        fetchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchOnWindowFocus, enabled, isStale, isFetched, fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const refetch = useCallback(async () => {
    // Force refetch by bypassing cache
    lastFetchTimeRef.current = 0;
    return fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch, isStale, isFetched };
}

/**
 * Configuration options for useApiMutation hook
 */
export interface UseApiMutationOptions<TData> {
  /** HTTP method to use. Default: 'POST' */
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Callback invoked when the mutation succeeds */
  onSuccess?: (data: TData) => void;
  /** Callback invoked when the mutation fails */
  onError?: (error: Error) => void;
  /** Number of retry attempts on failure. Default: 0 */
  retry?: number;
  /** Delay in milliseconds between retry attempts. Default: 1000 */
  retryDelay?: number;
}

/**
 * Result returned by useApiMutation hook
 */
export interface LocalUseApiMutationResult<TData, TVariables> {
  /** Function to trigger the mutation */
  mutateAsync: (variables?: TVariables) => Promise<TData>;
  /** The response data from the last successful mutation */
  data: TData | null;
  /** Whether the mutation is currently in progress */
  isLoading: boolean;
  /** Alias for isLoading */
  isPending: boolean;
  /** Error object if the mutation failed */
  error: Error | null;
  /** Function to reset the mutation state */
  reset: () => void;
  /** Whether a mutation has been attempted */
  isIdle: boolean;
}

/**
 * API mutation hook for POST/PUT/PATCH/DELETE requests with retry support
 *
 * @template TData - The expected response data type
 * @template TVariables - The type of variables to pass to the mutation
 * @param endpoint - The API endpoint URL
 * @param options - Configuration options for the mutation
 *
 * @example
 * ```typescript
 * // Basic POST mutation
 * const { mutate, isLoading, error } = useApiMutation<Case, Partial<Case>>(
 *   '/cases',
 *   { method: 'POST' }
 * );
 *
 * // Trigger the mutation
 * await mutate({ title: 'New Case', client: 'Acme Corp' });
 *
 * // With callbacks
 * const { mutate } = useApiMutation<Case, Partial<Case>>(
 *   '/cases',
 *   {
 *     method: 'POST',
 *     onSuccess: (data) => console.log('Created:', data),
 *     onError: (error) => console.error('Failed:', error),
 *     retry: 2,
 *   }
 * );
 * ```
 */
export function useApiMutation<TData, TVariables = unknown>(
  endpoint: string,
  options?: UseApiMutationOptions<TData>
): LocalUseApiMutationResult<TData, TVariables>;

export function useApiMutation<TData, TVariables = unknown>(config: {
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint?: string;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  retry?: number;
  retryDelay?: number;
}): LocalUseApiMutationResult<TData, TVariables>;

/**
 * API mutation hook for POST/PUT/PATCH/DELETE requests with retry support (object syntax without endpoint)
 *
 * @template TData - The expected response data type
 * @template TVariables - The type of variables to pass to the mutation
 * @param config - Configuration object
 *
 * @example
 * ```typescript
 * const { mutateAsync } = useApiMutation<Case, {endpoint: string, data: Partial<Case>}>({
 *   method: 'PUT',
 *   onSuccess: (data) => console.log('Updated:', data),
 * });
 *
 * await mutateAsync({ endpoint: '/cases/123', data: { title: 'Updated' } });
 * ```
 */
export function useApiMutation<TData, TVariables = {endpoint: string, data?: unknown}>(config: {
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint?: string;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
  retry?: number;
  retryDelay?: number;
}): LocalUseApiMutationResult<TData, TVariables>;

// Implementation
export function useApiMutation<TData, TVariables = unknown>(
  endpointOrConfig: string | { method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE'; endpoint?: string; onSuccess?: (data: TData) => void; onError?: (error: Error) => void; retry?: number; retryDelay?: number },
  optionsParam?: UseApiMutationOptions<TData>
): LocalUseApiMutationResult<TData, TVariables> {
  // Normalize arguments
  const isObjectConfig = typeof endpointOrConfig === 'object';
  const config = isObjectConfig ? endpointOrConfig as any : optionsParam;
  const endpoint = isObjectConfig ? '' : endpointOrConfig; // Will be overridden in mutate if object config

  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isIdle, setIsIdle] = useState(true);

  const method = config?.method ?? 'POST';
  const maxRetries = config?.retry ?? 0;
  const retryDelay = config?.retryDelay ?? 1000;

  const mutateAsync = useCallback(async (variables?: TVariables): Promise<TData> => {
    setIsLoading(true);
    setError(null);
    setIsIdle(false);

    const attemptMutation = async (attemptNumber: number): Promise<TData> => {
      try {
        let response;
        let actualEndpoint: string;
        let body: any;

        if (isObjectConfig && config?.endpoint) {
          // Endpoint in config, variables is body
          actualEndpoint = config.endpoint;
          body = variables;
        } else if (isObjectConfig) {
          // Endpoint in variables
          actualEndpoint = (variables as any)?.endpoint;
          body = (variables as any)?.data;
        } else {
          // String endpoint, variables is body
          actualEndpoint = endpoint;
          body = variables;
        }

        switch (method) {
          case 'POST':
            response = await enzymeClient.post<TData>(actualEndpoint, { body });
            break;
          case 'PUT':
            response = await enzymeClient.put<TData>(actualEndpoint, { body });
            break;
          case 'PATCH':
            response = await enzymeClient.patch<TData>(actualEndpoint, { body });
            break;
          case 'DELETE':
            response = await enzymeClient.delete<TData>(actualEndpoint);
            break;
        }

        setData(response.data);
        config?.onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error('Unknown error');

        // Retry logic
        if (attemptNumber < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attemptNumber)));
          return attemptMutation(attemptNumber + 1);
        }

        setError(errorObj);
        config?.onError?.(errorObj);
        throw errorObj;
      } finally {
        setIsLoading(false);
      }
    };

    return attemptMutation(0);
  }, [endpoint, isObjectConfig, config, method, maxRetries, retryDelay]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsIdle(true);
  }, []);

  return { mutateAsync, data, isLoading, isPending: isLoading, error, reset, isIdle };
}

/**
 * Result returned by useLazyApiRequest hook
 */
export interface UseLazyApiRequestResult<T> {
  /** Function to manually trigger the request */
  fetch: (params?: Record<string, string | number | boolean>) => Promise<T>;
  /** The fetched data from the last successful request */
  data: T | null;
  /** Whether a request is currently in progress */
  isLoading: boolean;
  /** Error object if the request failed */
  error: Error | null;
  /** Function to reset the request state */
  reset: () => void;
}

/**
 * Lazy API request hook that doesn't execute automatically
 * Returns a fetch function that can be called manually with optional parameters
 *
 * @template T - The expected response data type
 * @param endpoint - The API endpoint URL
 *
 * @example
 * ```typescript
 * // Basic usage
 * const { fetch, data, isLoading } = useLazyApiRequest<Case[]>('/cases');
 *
 * // Trigger manually with a button click
 * const handleSearch = async () => {
 *   await fetch({ status: 'Active', search: 'contract' });
 * };
 *
 * // Use returned data
 * if (data) {
 *   console.log('Cases:', data);
 * }
 * ```
 */
export function useLazyApiRequest<T>(endpoint: string): UseLazyApiRequestResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async (params?: Record<string, string | number | boolean>): Promise<T> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await enzymeClient.get<T>(endpoint, { params });
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error');
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { fetch, data, isLoading, error, reset };
}

/**
 * Invalidate cached data for a specific endpoint or pattern
 *
 * @param endpointOrPattern - The endpoint to invalidate, or a pattern (e.g., '/cases*')
 *
 * @example
 * ```typescript
 * // Invalidate specific endpoint
 * invalidateCache('/cases');
 *
 * // Invalidate all endpoints matching pattern
 * invalidateCache('/cases*');
 * ```
 */
export function invalidateCache(endpointOrPattern: string): void {
  if (endpointOrPattern.endsWith('*')) {
    // Pattern matching - invalidate all keys starting with the pattern
    const pattern = endpointOrPattern.slice(0, -1);
    const keysToDelete: string[] = [];

    requestCache.forEach((_, key) => {
      if (key.startsWith(pattern)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => requestCache.delete(key));
  } else {
    // Exact match
    requestCache.delete(endpointOrPattern);
  }
}

/**
 * Clear all cached request data
 *
 * @example
 * ```typescript
 * // Clear everything on logout
 * clearCache();
 * ```
 */
export function clearCache(): void {
  requestCache.clear();
}
