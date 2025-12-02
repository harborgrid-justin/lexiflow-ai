# Enzyme Module Analysis

## Overview

The Enzyme module (`/client/enzyme/`) is a custom UI/routing/API framework layer providing:
- Custom React hooks for API requests
- Progressive hydration for performance
- Hash-based routing
- Analytics tracking integration

## Module Structure

```
/client/enzyme/
├── components/
│   ├── CaseCard.tsx
│   ├── EditCaseDemo.tsx
│   ├── EnzymeLayout.tsx
│   ├── HydrationBoundary.tsx     # Progressive hydration
│   ├── HydrationDemo.tsx
│   └── index.ts
├── hooks/
│   ├── useHashRouter.ts          # Custom router
│   └── index.ts
├── services/
│   ├── cases.service.ts
│   ├── client.ts                 # API client config
│   ├── hooks.ts                  # useApiRequest, useApiMutation
│   └── index.ts
├── types/
│   └── index.ts
├── utils/
│   └── index.ts
├── index.ts                      # Main exports
├── ENZYME_COMPLETE_GUIDE.md
├── MIGRATION_SCRATCHPAD.md
├── LESSONS_LEARNED.md
└── EDIT_CASE_IMPLEMENTATION.md
```

## Key Components

### 1. API Hooks (`services/hooks.ts`)

```typescript
// GET request with caching
const { data, isLoading, error, refetch } = useApiRequest<Case[]>('/api/v1/cases', {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: true,
  retry: 2,
});

// Mutation with retry
const mutation = useApiMutation<Case, CreateCasePayload>({
  endpoint: '/api/v1/cases',
  method: 'POST',
});
```

### 2. Progressive Hydration (`components/HydrationBoundary.tsx`)

```typescript
<HydrationBoundary
  priority="normal"
  trigger="visible"
  fallback={<Skeleton />}
>
  <ExpensiveComponent />
</HydrationBoundary>
```

**Priority Levels:**
- `critical` - Immediate hydration
- `high` - After critical components
- `normal` - Default
- `low` - When browser is idle
- `manual` - Only on explicit trigger

**Trigger Modes:**
- `immediate` - Hydrate right away
- `visible` - When in viewport
- `interaction` - On user interaction
- `idle` - When browser is idle
- `manual` - Programmatic control

### 3. Hash Router (`hooks/useHashRouter.ts`)

```typescript
const { currentRoute, navigate, params } = useHashRouter();

// Navigate to route
navigate('cases');

// With parameters
navigate('edit-case/123');
```

## Issues Identified

### Critical Issues

1. **Cache Growth Unbounded** (`hooks.ts:77-90`)
   - Global cache has no size limit
   - Can cause memory issues in long sessions
   - **Fix**: Implement LRU cache with max size

2. **staleTime Logic** (`hooks.ts:176`)
   - Current: `Date.now() - lastFetchTimeRef.current > staleTime`
   - Issue: Marks data stale immediately if staleTime=0
   - **Fix**: Add check for staleTime > 0

3. **No Request Cancellation**
   - No AbortController usage
   - Concurrent requests can't be cancelled
   - **Fix**: Add abort controller per request

### Medium Issues

1. **Hard-coded Timeout** (`client.ts:41`)
   - Timeout is 30000ms
   - Should reference `API_CONFIG.TIMEOUT_MS`

2. **Token Refresh Not Implemented** (`client.ts:62`)
   - `autoRefreshToken: false`
   - Tokens can expire without refresh

3. **No Error Boundary** (`index.ts`)
   - Enzyme exports don't have error boundaries
   - Errors in Enzyme code crash the entire app

## Recommended Improvements

### Week 1: Critical Fixes

```typescript
// 1. Add LRU cache (hooks.ts)
class LRUCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private maxSize = 50;

  set(key: string, value: T) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, { data: value, timestamp: Date.now() });
  }
}

// 2. Add request cancellation (hooks.ts)
const abortControllerRef = useRef<AbortController>(new AbortController());

useEffect(() => {
  return () => abortControllerRef.current.abort();
}, []);

// 3. Fix staleTime logic (hooks.ts)
const isStale = staleTime > 0 && (Date.now() - lastFetchTimeRef.current > staleTime);
```

### Week 2: Configuration Integration

```typescript
// Use centralized config (client.ts)
import { API_CONFIG, RETRY_CONFIG } from '@/config';

const enzymeClient = createApiClient({
  baseUrl: API_CONFIG.getBaseUrl(),
  timeout: API_CONFIG.TIMEOUT_MS,
  retry: {
    maxAttempts: RETRY_CONFIG.MAX_ATTEMPTS,
    backoffFactor: RETRY_CONFIG.BACKOFF_FACTOR,
  },
});
```

## Usage Patterns

### Correct Pattern (Use Enzyme Wrappers)

```typescript
import { useApiRequest, useApiMutation } from '@/enzyme';

function CaseList() {
  const { data, isLoading, error } = useApiRequest<Case[]>('/api/v1/cases');

  if (isLoading) return <Spinner />;
  if (error) return <Error message={error} />;
  return <CaseTable cases={data} />;
}
```

### Avoid (Direct TanStack Query)

```typescript
// Don't mix patterns - use Enzyme consistently
import { useQuery } from '@tanstack/react-query';

function CaseList() {
  const { data } = useQuery({
    queryKey: ['cases'],
    queryFn: () => fetch('/api/v1/cases').then(r => r.json()),
  });
}
```

## Integration with Auth

```typescript
// enzyme/services/client.ts
const lexiflowTokenProvider = {
  getAccessToken: (): string | null => getAuthToken(),
  setAccessToken: (token: string) => localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, token),
  clearTokens: () => {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    sessionStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
  },
};
```

## Existing Documentation

The enzyme module includes comprehensive internal documentation:

1. **ENZYME_COMPLETE_GUIDE.md** (486 lines) - Official patterns and 60+ hooks
2. **MIGRATION_SCRATCHPAD.md** (594 lines) - Migration tracking for 54 components
3. **LESSONS_LEARNED.md** (7,574 lines) - Extensive learnings and API deviations
4. **EDIT_CASE_IMPLEMENTATION.md** (124 lines) - Example implementation

## Migration Status

**Total Migrations: 54**
- ✅ 32 components (100% complete)
- ✅ 21 of 26 hooks (81% complete)
- 🔄 Wave 6 in progress (3 of 8 complete)

---

*Last Updated: 2025-12-02*
