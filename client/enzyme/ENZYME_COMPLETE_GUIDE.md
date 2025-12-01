# Enzyme Framework - Complete Integration Guide

## Overview
This document provides complete integration instructions for maximizing the Enzyme framework in LexiFlow AI based on the official documentation.

## Core Enzyme Features

### 1. **File-System Based Routing** ✅
- Zero-config route discovery
- Dynamic params with `[id].tsx`
- Optional params with `[[slug]].tsx`
- Catch-all routes with `[...catchAll].tsx`

### 2. **Progressive Hydration** 🎯
- Priority-based component hydration
- Viewport-aware loading
- Idle-time hydration
- Manual hydration triggers

### 3. **Streaming Engine** 🌊
- Dynamic HTML streaming
- Progressive content delivery
- Prioritized chunk delivery
- SSR/CSR hybrid approach

### 4. **Performance Monitoring** 📊
- Real-time Core Web Vitals (LCP, INP, CLS, FCP, TTFB)
- Performance Observatory dashboard
- Budget-aware rendering
- Memory pressure monitoring

### 5. **State Management** 💾
- Zustand integration
- Multi-tab sync via BroadcastChannel
- Leader election
- Persistent state hydration

### 6. **Data Fetching** 🔄
- TanStack Query integration
- Automatic caching and refetching
- Optimistic updates
- Request deduplication

### 7. **Predictive Prefetching** 🤖
- AI-driven route prefetching using Markov chains
- Navigation pattern learning
- Network-aware prefetching

### 8. **Custom Hooks** (60+) 🪝
Comprehensive collection of production-ready hooks

## Enzyme Module Structure

```
@missionfabric-js/enzyme/
├── api/             # Data fetching & mutations
├── hooks/           # 60+ custom hooks
├── hydration/       # Progressive hydration
├── streaming/       # Dynamic HTML streaming
├── layouts/         # Adaptive layouts
├── performance/     # Performance monitoring
├── state/           # Zustand integration
├── routing/         # Type-safe routing
├── auth/            # Authentication & guards
├── flags/           # Feature flags
├── theme/           # Dark/light mode
├── monitoring/      # Error tracking
└── vdom/            # Virtual modular DOM
```

## Key Hooks Available

### API & Data Fetching
```typescript
import {
  useApiRequest,      // GET requests with caching
  useApiMutation,     // POST/PUT/DELETE with optimistic updates
  useQuery,           // TanStack Query wrapper
  useMutation,        // TanStack Mutation wrapper
  usePolling,         // Polling with network awareness
  usePrefetch,        // Smart prefetching
  useLazyQuery,       // Defer loading
  useApiHealth,       // API health monitoring
} from '@missionfabric-js/enzyme/api';
```

### Hydration Control
```typescript
import {
  useHydration,           // Hydration system control
  useHydrationStatus,     // Track hydration state
  useHydrationMetrics,    // Performance metrics
  useHydrationPriority,   // Priority management
  useDeferredHydration,   // Manual hydration control
  useIdleHydration,       // Idle-time hydration
  useIsHydrated,          // Check hydration state
  useWaitForHydration,    // Wait for completion
} from '@missionfabric-js/enzyme/hydration';
```

### Streaming
```typescript
import {
  useStream,              // Stream lifecycle control
  useStreamStatus,        // Status monitoring
  useStreamPriority,      // Priority control
  useDeferredStream,      // Deferred loading
  useStreamMetrics,       // Performance tracking
  useStreamingAvailable,  // Capability detection
  useIsSSR,               // SSR detection
} from '@missionfabric-js/enzyme/streaming';
```

### Performance
```typescript
import {
  usePerformanceMonitor,      // Real-time monitoring
  useAdaptiveRender,          // Adaptive rendering
  useLazyFeature,             // Lazy feature loading
  useProgressiveLoad,         // Network-aware loading
  usePerformanceAwareness,    // Performance constraints
  usePredictivePrefetch,      // AI-driven prefetch
  useMemoryPressure,          // Memory monitoring
  usePerformanceBudget,       // Budget enforcement
} from '@missionfabric-js/enzyme/performance';
```

### Utility Hooks
```typescript
import {
  useIsMounted,           // Safe async operations
  useLatestCallback,      // Stable callbacks (no deps!)
  useBuffer,              // Batch operations
  useTrackEvent,          // Event tracking
  useOnlineStatus,        // Network status
  useNetworkStatus,       // Detailed network info
  useNetworkQuality,      // Connection quality
  useDebounce,            // Debounced values
  useThrottle,            // Throttled values
  useAsync,               // Async state
  useDisposable,          // Resource cleanup
  useAbortController,     // Cancel requests
  useTimeout,             // Safe timeout
  useInterval,            // Safe interval
  useMounted,             // Mount state
  useSafeState,           // Safe setState
} from '@missionfabric-js/enzyme/hooks';
```

### State Management
```typescript
import {
  useGlobalStore,         // Zustand store access
  useCurrentUser,         // Current user state
  useIsAuthenticated,     // Auth status
  useStoreHydrated,       // Persistence status
} from '@missionfabric-js/enzyme/state';
```

### Theme & UI
```typescript
import {
  useTheme,               // Theme control
  useSystemThemePreference, // OS theme
} from '@missionfabric-js/enzyme/theme';
```

### Routing
```typescript
import {
  useRoute,               // Current route
  useParams,              // Route params
  useQueryParams,         // Query params
  usePrefetchRoute,       // Route prefetch
  usePrefetchOnHover,     // Hover prefetch
} from '@missionfabric-js/enzyme/routing';
```

### Authentication
```typescript
import {
  useAuth,                // Auth state & actions
  usePermissions,         // User permissions
  useHasPermission,       // Permission check
  useRequireAuth,         // Auth guard
} from '@missionfabric-js/enzyme/auth';
```

### Feature Flags
```typescript
import {
  useFeatureFlag,         // Flag value
  useFeatureFlags,        // All flags
  useFlagGate,            // Conditional render
} from '@missionfabric-js/enzyme/flags';
```

### Analytics
```typescript
import {
  usePageView,            // Track page views
  useTrackEvent,          // Track events
  useTrackFeature,        // Track features
  useTrackScrollDepth,    // Scroll tracking
  useTrackTimeOnPage,     // Time tracking
} from '@missionfabric-js/enzyme/hooks';
```

## Network Utilities

```typescript
import {
  getNetworkInfo,         // Network API data
  isSlowConnection,       // Slow connection check
  shouldAllowPrefetch,    // Prefetch decision
} from '@missionfabric-js/enzyme/hooks';

// Usage
const networkInfo = getNetworkInfo();
// { effectiveType: '4g', downlink: 10, rtt: 50, saveData: false }

const isSlow = isSlowConnection();
if (isSlow) {
  // Load low-quality images, reduce animations
}

const canPrefetch = shouldAllowPrefetch({ 
  minConnectionQuality: '3g' 
});
```

## Components

### Hydration
```typescript
import {
  HydrationProvider,      // Root provider
  HydrationBoundary,      // Boundary wrapper
  LazyHydration,          // Simplified lazy hydration
} from '@missionfabric-js/enzyme/hydration';
```

### Streaming
```typescript
import {
  StreamProvider,         // Streaming provider
  StreamBoundary,         // Stream boundary
} from '@missionfabric-js/enzyme/streaming';
```

### Layouts
```typescript
import {
  DOMContextProvider,     // DOM context
  AdaptiveLayout,         // Adaptive layouts
} from '@missionfabric-js/enzyme/layouts';
```

### Performance
```typescript
import {
  PerformanceObservatory, // Performance dashboard
} from '@missionfabric-js/enzyme/performance';
```

## Implementation Patterns

### 1. API Request Pattern
```typescript
// Before (manual)
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  fetch('/api/cases')
    .then(r => r.json())
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);

// After (Enzyme)
const { data, isLoading, error } = useApiRequest('/api/cases', {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: true,
});
```

### 2. Mutation Pattern
```typescript
// Before
const handleSubmit = async () => {
  setLoading(true);
  try {
    await fetch('/api/cases', { method: 'POST', body: JSON.stringify(data) });
    // Manual refetch
    refetchCases();
  } catch (e) {
    setError(e);
  } finally {
    setLoading(false);
  }
};

// After
const createCase = useApiMutation('/api/cases', {
  onSuccess: () => {
    queryClient.invalidateQueries(['cases']);
  },
});

const handleSubmit = () => createCase.mutate(data);
```

### 3. Safe Async Pattern
```typescript
// Before
useEffect(() => {
  let mounted = true;
  
  fetchData().then(data => {
    if (mounted) setData(data);
  });
  
  return () => { mounted = false; };
}, []);

// After
const isMounted = useIsMounted();

useEffect(() => {
  fetchData().then(data => {
    if (isMounted()) setData(data);
  });
}, [isMounted]);
```

### 4. Stable Callback Pattern
```typescript
// Before
const handleClick = useCallback(() => {
  doSomething(prop1, prop2, state1, state2);
}, [prop1, prop2, state1, state2]); // Easy to forget dependencies!

// After
const handleClick = useLatestCallback(() => {
  doSomething(prop1, prop2, state1, state2);
}); // No dependencies needed!
```

### 5. Analytics Batching
```typescript
const analyticsBuffer = useBuffer({
  maxSize: 10,
  flushInterval: 5000,
  onFlush: async (events) => {
    await fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify(events)
    });
  }
});

// Add events anywhere
analyticsBuffer.add({ event: 'case_opened', caseId: '123' });
analyticsBuffer.add({ event: 'document_uploaded', docId: '456' });
```

### 6. Progressive Hydration
```typescript
<HydrationBoundary
  id="hero"
  priority="critical"
  trigger="immediate"
  aboveTheFold
>
  <HeroSection />
</HydrationBoundary>

<HydrationBoundary
  id="features"
  priority="high"
  trigger="visible"
>
  <FeaturesSection />
</HydrationBoundary>

<HydrationBoundary
  id="footer"
  priority="low"
  trigger="idle"
>
  <Footer />
</HydrationBoundary>
```

### 7. Network-Aware Loading
```typescript
function ImageGallery({ images }) {
  const isSlow = isSlowConnection();
  const quality = isSlow ? 'low' : 'high';
  
  return images.map(img => (
    <img 
      src={`${img.url}?q=${quality}`} 
      loading="lazy"
    />
  ));
}
```

### 8. Adaptive Rendering
```typescript
function ProductList({ products }) {
  const renderItem = useAdaptiveRender(
    (p) => <RichProductCard product={p} />,      // Full
    (p) => <SimpleProductCard product={p} />,    // Reduced
    (p) => <ProductSkeleton />                   // Minimal
  );

  return products.map(renderItem);
}
```

## Configuration

### Hydration Config
```typescript
import { hydrationConfig } from '@missionfabric-js/enzyme/config';

hydrationConfig.set('enabled', true);
hydrationConfig.set('scheduler.maxConcurrent', 3);
hydrationConfig.set('triggers.viewport.rootMargin', '50px');
```

### Streaming Config
```typescript
import { streamingConfig } from '@missionfabric-js/enzyme/config';

streamingConfig.set('enabled', true);
streamingConfig.set('bufferSize', 8192);
streamingConfig.set('chunkSize', 4096);
```

## Best Practices

1. **Always use `useIsMounted` for async operations**
2. **Prefer `useLatestCallback` over `useCallback`**
3. **Batch analytics with `useBuffer`**
4. **Use `useApiRequest` instead of manual fetch**
5. **Implement progressive hydration for heavy components**
6. **Monitor performance with `usePerformanceMonitor`**
7. **Make features network-aware with `isSlowConnection`**
8. **Use prefetching strategically with network checks**

## Migration Checklist

- [ ] Replace manual fetch with `useApiRequest`
- [ ] Replace mutations with `useApiMutation`
- [ ] Add `useIsMounted` to all async operations
- [ ] Replace `useCallback` with `useLatestCallback`
- [ ] Batch analytics with `useBuffer`
- [ ] Add progressive hydration to heavy components
- [ ] Implement network-aware features
- [ ] Add performance monitoring
- [ ] Use Enzyme state management
- [ ] Implement feature flags
- [ ] Add error boundaries
- [ ] Set up streaming for initial load

## Resources

- [Official Documentation](https://github.com/harborgrid-justin/enzyme/tree/master/docs)
- [Quick Start Guide](https://github.com/harborgrid-justin/enzyme/blob/master/docs/QUICKSTART.md)
- [Architecture Overview](https://github.com/harborgrid-justin/enzyme/blob/master/docs/ARCHITECTURE.md)
- [Hooks Reference](https://github.com/harborgrid-justin/enzyme/blob/master/docs/HOOKS_REFERENCE.md)
- [API Documentation](https://github.com/harborgrid-justin/enzyme/blob/master/docs/API.md)
- [Hydration Guide](https://github.com/harborgrid-justin/enzyme/blob/master/docs/HYDRATION.md)
- [Streaming Guide](https://github.com/harborgrid-justin/enzyme/blob/master/docs/STREAMING.md)
- [Performance Guide](https://github.com/harborgrid-justin/enzyme/blob/master/docs/PERFORMANCE.md)

---

Last Updated: December 1, 2025
