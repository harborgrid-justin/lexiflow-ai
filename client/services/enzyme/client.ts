// LexiFlow Enzyme API Client
// Enterprise-grade HTTP client using @missionfabric-js/enzyme
// Provides type-safe API communication with built-in retry, rate limiting, and token management

import { 
  createApiClient, 
  type ApiClientConfig,
  type ApiError,
  isApiError,
} from '@missionfabric-js/enzyme/api';
import { API_BASE_URL, getAuthToken } from '../config';

/**
 * Custom token provider that integrates with LexiFlow's existing auth storage
 */
const lexiflowTokenProvider = {
  getAccessToken: (): string | null => {
    return getAuthToken();
  },
  getRefreshToken: (): string | null => {
    // LexiFlow currently uses a single token - extend this when implementing refresh tokens
    return null;
  },
  setAccessToken: (token: string): void => {
    localStorage.setItem('authToken', token);
  },
  setRefreshToken: (_token: string): void => {
    // No-op for now - implement when adding refresh token support
  },
  clearTokens: (): void => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
  },
};

/**
 * Enzyme API client configuration for LexiFlow
 */
const clientConfig: ApiClientConfig = {
  baseUrl: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  
  // Retry configuration for resilient API calls
  retry: {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffFactor: 2,
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
    retryOnNetworkError: true,
  },
  
  // Enable request deduplication for concurrent identical GET requests
  deduplicate: true,
  
  // Token management
  tokenProvider: lexiflowTokenProvider,
  autoRefreshToken: false, // Enable when implementing token refresh
  
  // Standard rate limiting (100 requests/minute)
  rateLimit: 'standard',
  
  // Global error handler
  onError: (error) => {
    console.error('[LexiFlow API Error]', error);
    
    // Handle 401 - redirect to login
    if (error.status === 401) {
      // Clear tokens and redirect (if not already on login page)
      lexiflowTokenProvider.clearTokens();
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
  },
  
  // Request lifecycle hooks for debugging/monitoring
  onRequestStart: (config) => {
    if (import.meta.env?.DEV) {
      console.debug('[API Request]', config.method, config.url);
    }
  },
  
  onRequestEnd: (response) => {
    if (import.meta.env?.DEV && 'status' in response) {
      console.debug('[API Response]', response.status);
    }
  },
};

/**
 * Main Enzyme API client for LexiFlow
 * Use this client for new API integrations
 */
export const enzymeClient = createApiClient(clientConfig);

/**
 * Create a scoped API client for specific features
 * Useful for microservices or external APIs
 */
export function createScopedClient(baseUrl: string, options?: Partial<ApiClientConfig>) {
  return createApiClient({
    ...clientConfig,
    baseUrl,
    ...options,
  });
}

// Export types for use in services
export type { ApiClientConfig, ApiError };
export { isApiError };
