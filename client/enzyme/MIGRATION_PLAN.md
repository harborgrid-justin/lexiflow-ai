# Enzyme Migration Plan

## Overview
This document outlines the strategy for migrating the LexiFlow AI frontend to use the Enzyme framework for improved performance, better data fetching, and progressive hydration.

## Project Structure

```
client/enzyme/
├── components/          # Enzyme-powered React components
│   ├── CaseCard.tsx
│   ├── EditCaseDemo.tsx
│   ├── EnzymeLayout.tsx
│   └── HydrationDemo.tsx
├── hooks/              # Custom Enzyme hooks
│   └── index.ts
├── services/           # API services using Enzyme
│   ├── cases.service.ts
│   ├── client.ts
│   ├── hooks.ts
│   └── index.ts
├── types/              # TypeScript types
│   └── index.ts
├── utils/              # Utility functions
│   └── index.ts
└── index.ts           # Main entry point
```

## Migration Phases

### Phase 1: Core Infrastructure ✅
- [x] Create enzyme folder structure
- [x] Move existing enzyme components
- [x] Create central index files
- [x] Export all Enzyme features

### Phase 2: API Layer Migration (Priority) ✅ IN PROGRESS
Convert existing API calls to use Enzyme's data fetching:

#### High Priority Components:
1. **CaseList** → ✅ Migrated to `useApiRequest` and `useApiMutation`
2. **CaseDetail** → ✅ Migrated to `useApiRequest` for all data fetching
3. **Dashboard** → ✅ Already using `useApiRequest`
4. **DocumentManager** → ✅ Already using `useApiRequest` and `useApiMutation`
5. **BillingDashboard** → ✅ Migrated to `useApiRequest`

#### Benefits Achieved:
- ✅ Automatic caching and refetching
- ✅ Network-aware loading
- ✅ Built-in error handling
- ✅ Optimistic updates
- ✅ Request deduplication

### Phase 3: Performance Optimization 🎯 IN PROGRESS
Add Enzyme performance features:

1. **Progressive Hydration**
   - [ ] Add to CaseDetail (heavy component)
   - [ ] Add to DocumentManager (large tables)
   - [ ] Add to Dashboard (charts)
   - [x] Priority-based loading (custom HydrationBoundary created)
   - [x] Viewport-based activation (IntersectionObserver implemented)
   - [x] DiscoveryPlatform fully migrated with HydrationBoundary

2. **Network Awareness**
   - [x] Import network utilities
   - [ ] Adapt image loading on slow connections
   - [ ] Smart prefetching for navigation
   - [ ] Bandwidth-conscious loading
   - [x] HydrationBoundary respects connection speed

3. **Analytics Batching**
   - [ ] Replace individual analytics calls with `useBuffer`
   - [ ] Reduce API overhead
   - [ ] Better performance tracking
   - **BLOCKED:** `useTrackEvent` signature mismatch must be resolved first

### Phase 4: Hook Migration ✅ MOSTLY COMPLETE
Replace existing hooks with Enzyme equivalents:

| Current | Enzyme Replacement | Status |
|---------|-------------------|--------|
| `useCallback` | `useLatestCallback` | ✅ Applied to CaseList, Dashboard, BillingDashboard |
| Custom `useAsync` | `useAsync` from Enzyme | ⏳ Pending |
| Manual cleanup | `useIsMounted` | ✅ Applied to all major hooks |
| `setTimeout/setInterval` | `useTimeout/useInterval` | ⏳ Pending |
| TanStack Query | `useApiRequest` | ✅ Applied to 5 major components |
| TanStack Mutation | `useApiMutation` | ✅ Applied to CaseList, DocumentManager |

### Phase 5: Component Enhancement
Add Enzyme features to existing components:

1. **Error Boundaries** - Already using ErrorBoundary ✅
2. **Loading States** - Use Enzyme's LoadingFallback
3. **Offline Support** - Use `useOnlineStatus`
4. **Accessibility** - Use `useScreenReaderAnnounce`

## Migration Priority

### ✅ Completed (Week 1)
- [x] Convert `CaseList` to use Enzyme API hooks
- [x] Convert `CaseDetail` to use Enzyme API hooks
- [x] Convert `Dashboard` to use Enzyme API hooks (was already done)
- [x] Convert `DocumentManager` to use Enzyme API hooks (was already done)
- [x] Convert `BillingDashboard` to use Enzyme API hooks
- [x] Add `useIsMounted` to all async operations
- [x] Replace `useCallback` with `useLatestCallback` in key components

### 🎯 In Progress (Week 2)
- [ ] Add progressive hydration to heavy components
- [ ] Implement network-aware loading strategies
- [ ] Add analytics batching with `useBuffer`
- [ ] Migrate remaining components (ResearchTool, DiscoveryPlatform, etc.)

### Medium-term (Month 1)
- [ ] Migrate all API calls to Enzyme client
- [ ] Add offline support
- [ ] Implement smart prefetching
- [ ] Add comprehensive error recovery

### Long-term (Month 2+)
- [ ] Full hydration strategy
- [ ] Advanced caching strategies
- [ ] Real-time updates with WebSockets
- [ ] Performance monitoring dashboard

## Code Examples

### Before (Current)
```typescript
const [cases, setCases] = useState<Case[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await ApiService.get<Case[]>('/api/v1/cases');
      setCases(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchCases();
}, []);
```

### After (Enzyme)
```typescript
import { useApiRequest } from '../enzyme';

const { data: cases, isLoading, error } = useApiRequest<Case[]>('/api/v1/cases', {
  refetchOnWindowFocus: true,
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Benefits:
- 90% less code
- Automatic caching
- Auto-refetch on focus
- Built-in error handling
- Loading states included
- Network-aware by default

## File Updates Required

### 1. Update Imports
```typescript
// Old
import { ApiService } from '../services/apiService';

// New
import { useApiRequest, useApiMutation } from '../enzyme';
```

### 2. Update Components
Each component needs:
- Import Enzyme hooks
- Replace useState/useEffect with `useApiRequest`
- Replace manual fetch calls with `useApiMutation`
- Add `useIsMounted` for async operations
- Replace `useCallback` with `useLatestCallback`

### 3. Update Services
- Move API logic to enzyme/services/
- Use enzymeClient for requests
- Export typed service functions

## Testing Strategy

1. **Unit Tests** - Test Enzyme hooks in isolation
2. **Integration Tests** - Test API integration
3. **E2E Tests** - Test full user flows
4. **Performance Tests** - Measure improvements

## Rollback Plan

If issues arise:
1. Keep old code in `.old.ts` files
2. Feature flags for gradual rollout
3. Easy revert via git
4. Dual implementation during transition

## Success Metrics

Track these metrics to measure success:

- [ ] API requests reduced by 50% (caching)
- [ ] Page load time improved by 30%
- [ ] Bundle size reduced by 20%
- [ ] Time to Interactive improved
- [ ] Memory leaks eliminated
- [ ] Network requests optimized

## Documentation

As we migrate:
- Document each converted component
- Create Enzyme best practices guide
- Update component documentation
- Add inline code comments

## Next Steps

1. Start with CaseList component
2. Document the process
3. Create reusable patterns
4. Train team on Enzyme
5. Gradually expand to all components

---

Last Updated: December 1, 2025

---

## Agent 8 Learnings and API Deviation Notes

### Critical Finding: API Signature Mismatches

The following critical deviations were found between Enzyme documentation and actual usage:

#### 1. `useApiRequest` - THREE DIFFERENT SIGNATURES EXIST

| Source | Signature | Status |
|--------|-----------|--------|
| Enzyme Docs | `useApiRequest(queryKey[], queryFn(), options)` | Not used |
| Custom `/enzyme/services/hooks.ts` | `useApiRequest(endpoint: string, options?)` | Defined |
| Actual hook usage | `useApiRequest({ endpoint, options })` | Breaks! |

**Resolution Required:** Update `/client/enzyme/services/hooks.ts` to accept object-style arguments.

#### 2. `useTrackEvent` - String vs Object

| Source | Signature |
|--------|-----------|
| Enzyme Docs | `trackEvent(name: string, properties?: object)` |
| Component Usage | `trackEvent({ name: string, properties: object })` |

**Resolution Required:** Either update components to use `trackEvent('name', props)` OR create a wrapper function.

### Intentional Deviations (Acceptable)

1. **HydrationBoundary Priority** - Custom component uses string literals ('high', 'low') instead of numeric levels (1-5). This improves readability and is acceptable.

2. **Custom API Hooks** - The simplified `useApiRequest` and `useApiMutation` in `/enzyme/services/hooks.ts` are intentional wrappers around Enzyme's native hooks for LexiFlow-specific patterns.

### Missing Features in Custom Implementation

The custom hooks are missing these features from Enzyme's native hooks:
- `staleTime` configuration (currently no caching layer)
- `refetchOnWindowFocus` (not implemented)
- `retry` configuration (not implemented in custom hooks)
- Query key management for cache invalidation

Consider using Enzyme's native `useEnzymeApiRequest` for components requiring these features.
