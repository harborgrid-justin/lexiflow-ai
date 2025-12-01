/**
 * Enzyme Framework - Main Entry Point
 *
 * This is the central hub for all Enzyme-powered features in LexiFlow AI.
 * Enzyme provides a modern, performance-optimized approach to building
 * React applications with progressive hydration, smart caching, and
 * network-aware loading strategies.
 *
 * @see https://github.com/harborgrid-justin/enzyme/tree/master/docs
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
  // Custom Hooks - Lifecycle
  useIsMounted,
  useMountedState,
  useLatestCallback,
  useLatestRef,

  // Custom Hooks - Buffering & Batching
  useBuffer,
  useTimeWindowBuffer,
  useBatchBuffer,

  // Custom Hooks - Analytics
  useTrackEvent,
  usePageView,
  useTrackFeature,
  useTrackForm,
  useTrackClick,
  useTrackSearch,
  useTrackScrollDepth,
  useTrackTimeOnPage,
  useTrackedSection,

  // Custom Hooks - Network
  getNetworkInfo,
  isSlowConnection,
  shouldAllowPrefetch,
  useOnlineStatus,
  useNetworkStatus,
  useNetworkQuality,
  useSlowConnection,
  useOfflineFallback,
  useOnReconnect,
  useNetworkAwareFetch,

  // Custom Hooks - Async & Error Recovery
  useAsync,
  useAsyncWithRecovery,
  useOptimisticUpdate,
  useSafeCallback,
  useErrorToast,
  useRecoveryState,

  // Custom Hooks - Utilities
  useDisposable,
  useAbortController,
  useTimeout,
  useInterval,
  useEventListener,
  useSafeState,
  useDebouncedValue,
  useDebouncedCallback,
  useThrottledValue,

  // Custom Hooks - Prefetching
  SmartPrefetchManager,
  createPrefetchConfig,
  usePrefetchRoute,
  usePrefetchOnHover,

  // Custom Hooks - Accessibility
  useKeyboardShortcuts,
  useScreenReaderAnnounce,
  announceToScreenReader,
  ScreenReaderAnnouncementRegion,

  // Custom Hooks - Theme
  useTheme,
  useSystemThemePreference,

  // Custom Hooks - Store
  useGlobalStore,
  useGlobalStoreMultiple,
  useGlobalStoreActions,
  useStoreHydrated,
} from '@missionfabric-js/enzyme/hooks';

export {
  // Layout Components
  DOMContextProvider,
  AdaptiveLayout,
} from '@missionfabric-js/enzyme/layouts';

// Hydration Module exports
export {
  // Types
  type HydrationPriority as EnzymeHydrationPriority,
  type HydrationTrigger as EnzymeHydrationTrigger,
  type HydrationState as EnzymeHydrationState,
  type HydrationBoundaryProps as EnzymeHydrationBoundaryProps,

  // Components
  HydrationProvider,
  HydrationBoundary as EnzymeHydrationBoundary,
  LazyHydration as EnzymeLazyHydration,
  withHydrationBoundary,

  // Hooks
  useHydration,
  useHydrationStatus,
  useIsHydrated as useEnzymeIsHydrated,
  useWaitForHydration,
  useHydrationMetrics,
  useHydrationProgress,
  useIsHydrationComplete,
  useDeferredHydration,
  useIdleHydration,

  // Scheduler
  HydrationScheduler,
  getHydrationScheduler,

  // Utils
  initHydrationSystem,
} from '@missionfabric-js/enzyme/hydration';
