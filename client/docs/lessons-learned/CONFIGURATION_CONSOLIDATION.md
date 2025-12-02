# Configuration Consolidation Guide

## Overview

Prior to this refactoring, configuration values were scattered across **10+ files** with hardcoded ports, URLs, timeouts, and cache settings. This made server migrations painful and debugging CORS issues time-consuming.

## New Architecture

All configuration is now centralized in `/client/config/app.config.ts`.

```
client/
├── config/
│   ├── app.config.ts    # All configuration values
│   └── index.ts         # Clean exports
```

## Using the Config Module

```typescript
import {
  FEATURE_FLAGS,
  API_CONFIG,
  CACHE_CONFIG,
  AUTH_CONFIG,
  RETRY_CONFIG,
} from '@/config';

// Get API base URL (handles localhost, Codespaces, production)
const baseUrl = API_CONFIG.getBaseUrl();

// Use cache settings
const staleTime = CACHE_CONFIG.STALE_TIMES.DOCUMENTS; // 30 seconds

// Check feature flags
if (FEATURE_FLAGS.DEV_LOGIN_BYPASS) {
  // Auto-login as admin
}
```

## Feature Flags

| Flag | Default | Description |
|------|---------|-------------|
| `DEV_LOGIN_BYPASS` | `false` | Skip login, auto-authenticate as admin |
| `SHOW_TOKEN_REFRESH_BUTTON` | `true` (dev) | Show floating refresh button |
| `ENABLE_DEBUG_LOGGING` | `true` (dev) | Log API requests and state changes |
| `USE_MOCK_DATA` | `false` | Use mock data instead of API calls |

### Enabling Feature Flags

**Option 1: Environment Variable**
```bash
VITE_DEV_LOGIN_BYPASS=true npm run dev
```

**Option 2: localStorage (persists)**
```javascript
localStorage.setItem('lexiflow:dev:loginBypass', 'true');
// Reload the page
```

**Option 3: Runtime (development only)**
```typescript
import { setFeatureFlag } from '@/config';
setFeatureFlag('DEV_LOGIN_BYPASS', true);
// Reload the page
```

## API Configuration

The `API_CONFIG.getBaseUrl()` function automatically detects your environment:

| Environment | Detection | Result |
|-------------|-----------|--------|
| Codespaces | `*.github.dev` hostname | Constructs API URL with port 3001 |
| Development | Vite dev server | Uses `/api/v1` proxy |
| Production | `VITE_API_URL` env var | Uses configured URL |
| Fallback | None | `http://localhost:3001/api/v1` |

## Cache Configuration

Stale times are now centralized:

```typescript
CACHE_CONFIG.STALE_TIMES = {
  USER: 5 * 60 * 1000,      // 5 minutes
  CASES: 2 * 60 * 1000,     // 2 minutes
  DOCUMENTS: 30 * 1000,     // 30 seconds
  BILLING: 5 * 60 * 1000,   // 5 minutes
  CALENDAR: 5 * 60 * 1000,  // 5 minutes
  ANALYTICS: 10 * 60 * 1000, // 10 minutes
  EVIDENCE: 3 * 60 * 1000,  // 3 minutes
  RESEARCH: 15 * 60 * 1000, // 15 minutes
  DEFAULT: 5 * 60 * 1000,   // 5 minutes
};
```

## Retry Configuration

```typescript
RETRY_CONFIG = {
  MAX_ATTEMPTS: 3,
  INITIAL_DELAY_MS: 1000,
  MAX_DELAY_MS: 10000,
  BACKOFF_FACTOR: 2,
  RETRYABLE_STATUS_CODES: [408, 429, 500, 502, 503, 504],
};
```

## Migration from Old Patterns

### Before (Scattered)

```typescript
// In http-client.ts
const timeout = 30000;

// In documents.api.ts
staleTime: 30000,

// In vite.config.ts
const CLIENT_PORT = 3000;
const SERVER_PORT = 3001;
```

### After (Centralized)

```typescript
import { API_CONFIG, CACHE_CONFIG } from '@/config';

const timeout = API_CONFIG.TIMEOUT_MS;
staleTime: CACHE_CONFIG.STALE_TIMES.DOCUMENTS,
const clientPort = API_CONFIG.PORTS.CLIENT;
const serverPort = API_CONFIG.PORTS.SERVER;
```

## Files Previously Containing Configuration

These files previously had hardcoded values that should now reference the config module:

| File | Values | Status |
|------|--------|--------|
| `vite.config.ts` | Ports 3000, 3001 | Should reference `API_CONFIG.PORTS` |
| `services/config.ts` | Port 3001, fallback URL | Should reference `API_CONFIG` |
| `services/http-client.ts` | Retry settings | Should reference `RETRY_CONFIG` |
| `enzyme/services/client.ts` | Timeout 30000 | Should reference `API_CONFIG.TIMEOUT_MS` |
| `features/*/api/*.ts` | Various stale times | Should reference `CACHE_CONFIG` |

## Debugging Configuration

In development, configuration is logged on app startup. You can also manually log it:

```typescript
import { logConfig } from '@/config';
logConfig();
```

Output:
```
[LexiFlow Config] Current Configuration
  Environment: { isDevelopment: true, isProduction: false, isCodespaces: false }
  Feature Flags: { DEV_LOGIN_BYPASS: false, SHOW_TOKEN_REFRESH_BUTTON: true, ... }
  API Base URL: /api/v1
  Cache Config: { STALE_TIMES: {...}, GC_TIME: 1800000, ... }
```

## Security Notes

1. **API Keys**: OpenAI keys should NOT be in browser code. Consider proxying through your backend.
2. **Fallback URLs**: The localhost fallback is for development only. Production requires `VITE_API_URL`.
3. **Token Storage**: Tokens are stored in localStorage by default. Consider sessionStorage for sensitive apps.

---

*Last Updated: 2025-12-02*
