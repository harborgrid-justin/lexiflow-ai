/**
 * Enzyme Framework - Main Entry Point
 * 
 * This is the central hub for all Enzyme-powered features in LexiFlow AI.
 * Enzyme provides a modern, performance-optimized approach to building
 * React applications with progressive hydration, smart caching, and
 * network-aware loading strategies.
 */

// Core Components
export * from './components/index';

// Hooks
export * from './hooks/index';

// Services
export * from './services/index';

// Types
export * from './types/index';

// Utils
export * from './utils/index';

// Re-export Enzyme library features
export {
  // API Hooks
  useApiRequest,
  useApiMutation,
} from '@missionfabric-js/enzyme/api';

export {
  // Custom Hooks
  useIsMounted,
  useLatestCallback,
  useBuffer,
  useTrackEvent,
  getNetworkInfo,
  isSlowConnection,
  shouldAllowPrefetch,
  useOnlineStatus,
  useNetworkStatus,
  useAsync,
  useDisposable,
  useAbortController,
  useTimeout,
  useInterval,
} from '@missionfabric-js/enzyme/hooks';

export {
  // Layout Components
  DOMContextProvider,
  AdaptiveLayout,
} from '@missionfabric-js/enzyme/layouts';

export type { HydrationPriority } from '@missionfabric-js/enzyme/hydration';
