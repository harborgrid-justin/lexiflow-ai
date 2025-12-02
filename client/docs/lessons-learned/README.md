# LexiFlow AI - Frontend Lessons Learned

This directory contains documentation from a comprehensive code review conducted on **2025-12-02** using 8 parallel analysis agents. The review identified opportunities for improvement across authentication, API services, state management, error handling, and configuration.

## Summary of Findings

### Critical Issues Fixed
- ✅ Removed incorrect `import { create } from 'react'` in documents and research stores
- ✅ Created centralized configuration module (`/config/app.config.ts`)
- ✅ Added login bypass feature flag for development testing
- ✅ Added token refresh button for manual session management

### Architecture Decisions
1. **Authentication**: Dual auth system (Context + Zustand) - recommend consolidating to single source
2. **State Management**: 19 Zustand stores, some with inconsistent patterns
3. **API Layer**: Mixed patterns between Enzyme wrappers and direct TanStack Query
4. **Configuration**: Now centralized in `/config/` module

## Documentation Files

| File | Description |
|------|-------------|
| [CONFIGURATION_CONSOLIDATION.md](./CONFIGURATION_CONSOLIDATION.md) | Guide to the new centralized config system |
| [AUTH_PATTERNS.md](./AUTH_PATTERNS.md) | Authentication architecture analysis |
| [API_SERVICE_PATTERNS.md](./API_SERVICE_PATTERNS.md) | API service standardization guide |
| [STATE_MANAGEMENT.md](./STATE_MANAGEMENT.md) | State management patterns and recommendations |
| [ERROR_HANDLING.md](./ERROR_HANDLING.md) | Error handling standardization guide |
| [ENZYME_MODULE.md](./ENZYME_MODULE.md) | Enzyme module analysis and improvements |
| [CODE_DEDUPLICATION.md](./CODE_DEDUPLICATION.md) | Code duplication analysis |

## Quick Reference: Feature Flags

```typescript
import { FEATURE_FLAGS, setFeatureFlag } from '@/config';

// Enable login bypass (development only)
setFeatureFlag('DEV_LOGIN_BYPASS', true);

// Or set via environment variable
VITE_DEV_LOGIN_BYPASS=true

// Or set via localStorage (persists across sessions)
localStorage.setItem('lexiflow:dev:loginBypass', 'true');
```

## Quick Reference: Token Refresh

The floating token refresh button appears in the bottom-right when:
- `FEATURE_FLAGS.SHOW_TOKEN_REFRESH_BUTTON` is enabled
- Running in development mode

Use it to manually refresh your auth token when switching servers.

## Priority Recommendations

### Week 1 (Critical)
1. Consolidate auth to single source of truth
2. Centralize all hardcoded URLs and ports
3. Add error boundaries to feature modules

### Week 2-3 (High Priority)
1. Standardize React Query usage (use Enzyme wrappers consistently)
2. Implement query key factories for all features
3. Add field-level validation error display

### Month 1 (Medium Priority)
1. Extract common patterns (StepWizard, Tag components)
2. Migrate custom stores to Zustand
3. Add comprehensive error logging

---

*Generated: 2025-12-02*
*Analysis conducted by 8 parallel code review agents*
