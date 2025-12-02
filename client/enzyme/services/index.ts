// Enzyme Service Index for LexiFlow
// Central export for all Enzyme-based API utilities

// Core client
export { enzymeClient, createScopedClient, isApiError } from './client';
export type { ApiClientConfig, ApiError } from './client';

// React hooks - Custom simplified hooks with enhanced features
export {
  useApiRequest,
  useApiMutation,
  useLazyApiRequest,
  invalidateCache,
  clearCache,
} from './hooks';

// Hook types and interfaces
export type {
  UseApiRequestOptions,
  UseApiRequestResult,
  UseApiMutationOptions,
  UseApiMutationResult,
  UseLazyApiRequestResult,
} from './hooks';

// Re-export Enzyme's built-in hooks for advanced use cases
export {
  useEnzymeApiRequest,
  useEnzymeApiMutation,
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
} from './hooks';

// Example service using Enzyme (for reference/migration)
export { enzymeCasesService } from './cases.service';
