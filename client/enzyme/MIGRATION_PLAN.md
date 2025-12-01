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

### Phase 2: API Layer Migration (Priority)
Convert existing API calls to use Enzyme's data fetching:

#### High Priority Components:
1. **CaseList** → Use `useApiRequest` for case fetching
2. **CaseDetail** → Use `useApiRequest` with params
3. **Dashboard** → Use multiple `useApiRequest` for stats
4. **DocumentManager** → Use `useApiMutation` for uploads
5. **BillingDashboard** → Use `useApiRequest` with polling

#### Benefits:
- Automatic caching and refetching
- Network-aware loading
- Built-in error handling
- Optimistic updates
- Request deduplication

### Phase 3: Performance Optimization
Add Enzyme performance features:

1. **Progressive Hydration**
   - Lazy load heavy components
   - Priority-based loading
   - Viewport-based activation

2. **Network Awareness**
   - Adapt to slow connections
   - Smart prefetching
   - Bandwidth-conscious loading

3. **Analytics Batching**
   - Use `useBuffer` for all analytics
   - Reduce API overhead
   - Better performance tracking

### Phase 4: Hook Migration
Replace existing hooks with Enzyme equivalents:

| Current | Enzyme Replacement | Benefits |
|---------|-------------------|----------|
| `useCallback` | `useLatestCallback` | No dependency array needed |
| Custom `useAsync` | `useAsync` from Enzyme | Better error handling |
| Manual cleanup | `useIsMounted` | Prevents memory leaks |
| `setTimeout/setInterval` | `useTimeout/useInterval` | Auto-cleanup |

### Phase 5: Component Enhancement
Add Enzyme features to existing components:

1. **Error Boundaries** - Already using ErrorBoundary ✅
2. **Loading States** - Use Enzyme's LoadingFallback
3. **Offline Support** - Use `useOnlineStatus`
4. **Accessibility** - Use `useScreenReaderAnnounce`

## Migration Priority

### Immediate (Week 1)
- [ ] Convert `CaseList` to use Enzyme API hooks
- [ ] Convert `CaseDetail` to use Enzyme API hooks
- [ ] Add `useIsMounted` to all async operations
- [ ] Replace `useCallback` with `useLatestCallback`

### Short-term (Week 2-3)
- [ ] Convert all document operations to use `useApiMutation`
- [ ] Add analytics batching with `useBuffer`
- [ ] Implement network-aware loading
- [ ] Add progressive hydration to heavy components

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
