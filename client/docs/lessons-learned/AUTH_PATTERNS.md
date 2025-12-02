# Authentication Patterns Analysis

## Executive Summary

The codebase contains **TWO PARALLEL AUTH SYSTEMS** with significant duplication:

1. **AuthContext** (`/contexts/AuthContext.tsx`) - **ACTIVE**, used by the application
2. **AuthStore** (`/features/auth/store/auth.store.ts`) - **UNUSED**, Zustand-based

This creates maintenance overhead and potential for bugs.

## Current Architecture

```
Authentication Layer:
├── AuthContext (React Context) - ACTIVE
│   ├── Uses useState for state
│   ├── Manages user, loading, login, logout
│   ├── Has impersonation support
│   └── Token stored via ApiService
│
├── AuthStore (Zustand) - UNUSED
│   ├── Uses Zustand with persist middleware
│   ├── Has error state management
│   ├── Has status enum (loading, authenticated, etc.)
│   └── Exports selectors and actions
│
└── Feature Auth Module
    ├── useAuth hook (TanStack Query + Zustand)
    ├── Auth API with mutations
    └── Multiple page components
```

## Key Files

| File | Purpose | Status |
|------|---------|--------|
| `/contexts/AuthContext.tsx` | Main auth provider | **ACTIVE** |
| `/features/auth/store/auth.store.ts` | Zustand store | **UNUSED** |
| `/features/auth/hooks/useAuth.ts` | TanStack Query hook | **UNUSED** |
| `/features/auth/api/auth.api.ts` | API mutations | Partial use |
| `/services/config.ts` | Token storage | Active |
| `/services/apiService.ts` | Token management | Active |

## Issues Identified

### 1. Duplicate useAuth Hooks

Two completely different implementations exist:

**Context Version (Active):**
```typescript
// /contexts/AuthContext.tsx
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Returns user, login, logout, etc.
};
```

**Feature Version (Unused):**
```typescript
// /features/auth/hooks/useAuth.ts
export const useAuth = () => {
  // Uses TanStack Query + Zustand
  // Has additional features: register, refreshUser, error state
};
```

### 2. Token Management Scattered

Token handling exists in 3 locations:
- `ApiService.setAuthToken()` - stores token
- `getAuthToken()` in config.ts - retrieves token
- `AuthContext` - directly accesses localStorage

### 3. Missing Features in Active System

The active AuthContext lacks:
- ✗ Error state (fixed in this update)
- ✗ Loading status enum
- ✗ Token refresh capability (fixed in this update)
- ✗ 2FA support

## Improvements Made

### New Features Added to AuthContext

```typescript
interface AuthContextType {
  // Existing
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  // ...

  // NEW: Added in this update
  refreshToken: () => Promise<boolean>;
  isDevBypassMode: boolean;
  tokenExpiryWarning: boolean;
  error: string | null;
  clearError: () => void;
}
```

### Login Bypass Feature Flag

When `FEATURE_FLAGS.DEV_LOGIN_BYPASS` is enabled:
- Login screen is skipped
- User is auto-authenticated as a dev admin
- Useful for testing when switching servers

### Token Refresh Button

A floating button allows manual token refresh:
- Available when `FEATURE_FLAGS.SHOW_TOKEN_REFRESH_BUTTON` is true
- Does not affect other user settings
- Shows success/error feedback

## Recommended Consolidation

### Option A: Enhance AuthContext (Less effort)

Keep using AuthContext but add missing features:
1. Add error state ✓ (done)
2. Add token refresh ✓ (done)
3. Add status enum for 2FA support
4. Deprecate feature auth module

### Option B: Migrate to Zustand (Better architecture)

Migrate all components to use the feature auth system:
1. Refactor components to use `/features/auth/hooks/useAuth`
2. Remove AuthContext
3. Benefit: TanStack Query integration, dev tools, persistence

## Usage Examples

### Current (After improvements)

```typescript
const { user, login, logout, error, refreshToken, isDevBypassMode } = useAuth();

// Handle login
const handleLogin = async () => {
  const success = await login(email, password);
  if (!success) {
    // error state is now populated
    console.log(error);
  }
};

// Manual token refresh
const handleRefresh = async () => {
  const success = await refreshToken();
  if (success) {
    console.log('Token refreshed!');
  }
};
```

### With Dev Bypass

```typescript
// In development, when VITE_DEV_LOGIN_BYPASS=true
// User is automatically logged in as admin
const { user, isDevBypassMode } = useAuth();

if (isDevBypassMode) {
  // Show indicator that we're in dev bypass mode
}
```

## Security Considerations

1. **Token Storage**: Currently uses localStorage. Consider sessionStorage for sensitive apps.
2. **Dev Bypass**: Only works in development mode. Production builds ignore this flag.
3. **Token Refresh**: Should implement proper refresh token rotation in backend.

## Files to Review for Migration

If migrating to Zustand auth:

1. `/App.tsx` - Uses `useAuth()` from context
2. `/core/guards/AuthGuard.tsx` - Uses `useAuth()`
3. `/core/guards/RoleGuard.tsx` - Uses `useAuth()`
4. `/core/router/AppRouter.tsx` - Uses `useAuth()`
5. `/features/settings/pages/ProfilePage.tsx` - Uses auth user

---

*Last Updated: 2025-12-02*
