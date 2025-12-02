/**
 * LexiFlow AI - Centralized Application Configuration
 *
 * This module consolidates all configuration values that were previously
 * scattered across the codebase. Use this as the single source of truth
 * for all configurable values.
 *
 * @see docs/lessons-learned/CONFIGURATION_CONSOLIDATION.md
 */

// =============================================================================
// Environment Detection
// =============================================================================

const isDevelopment = typeof import.meta !== 'undefined'
  ? import.meta.env?.DEV === true
  : process.env.NODE_ENV === 'development';

const isProduction = typeof import.meta !== 'undefined'
  ? import.meta.env?.PROD === true
  : process.env.NODE_ENV === 'production';

const isCodespaces = typeof window !== 'undefined' && (
  window.location.hostname.endsWith('.app.github.dev') ||
  window.location.hostname.endsWith('.github.dev')
);

// =============================================================================
// Feature Flags
// =============================================================================

export const FEATURE_FLAGS = {
  /**
   * DEV_LOGIN_BYPASS - When enabled, bypasses the login flow and automatically
   * logs in as an admin user. This is useful for development and testing when
   * switching servers frequently causes CORS/authentication issues.
   *
   * Set via environment variable: VITE_DEV_LOGIN_BYPASS=true
   * OR set directly in development for quick testing
   */
  DEV_LOGIN_BYPASS: isDevelopment && (
    import.meta.env?.VITE_DEV_LOGIN_BYPASS === 'true' ||
    localStorage.getItem('lexiflow:dev:loginBypass') === 'true'
  ),

  /**
   * SHOW_TOKEN_REFRESH_BUTTON - When enabled, shows a floating button
   * to manually refresh the authentication token without affecting
   * other user settings.
   */
  SHOW_TOKEN_REFRESH_BUTTON: isDevelopment ||
    localStorage.getItem('lexiflow:dev:showTokenRefresh') === 'true',

  /**
   * ENABLE_DEBUG_LOGGING - When enabled, logs API requests, responses,
   * and state changes to the console.
   */
  ENABLE_DEBUG_LOGGING: isDevelopment &&
    localStorage.getItem('lexiflow:dev:debugLogging') !== 'false',

  /**
   * USE_MOCK_DATA - When enabled, uses mock data instead of making
   * actual API calls. Useful for frontend development without backend.
   */
  USE_MOCK_DATA: import.meta.env?.VITE_USE_MOCK_DATA === 'true',
} as const;

// =============================================================================
// API Configuration
// =============================================================================

const getEnvVar = (key: string, defaultValue: string = ''): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return (import.meta.env as Record<string, string>)[key] || defaultValue;
  }
  return defaultValue;
};

export const API_CONFIG = {
  /**
   * Default ports for client and server
   */
  PORTS: {
    CLIENT: parseInt(getEnvVar('VITE_PORT', '3000'), 10),
    SERVER: parseInt(getEnvVar('VITE_API_PORT', '3001'), 10),
  },

  /**
   * API path prefix
   */
  PATH_PREFIX: '/api/v1',

  /**
   * Request timeout in milliseconds
   */
  TIMEOUT_MS: 30000,

  /**
   * Get the base URL for API requests
   * Handles localhost, Codespaces, and production environments
   */
  getBaseUrl(): string {
    const envUrl = getEnvVar('VITE_API_URL');

    // Use environment variable if set (and not localhost when in Codespaces)
    if (envUrl && !isCodespaces) {
      const trimmed = envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
      return `${trimmed}${this.PATH_PREFIX}`;
    }

    // Handle Codespaces environment
    if (isCodespaces && typeof window !== 'undefined') {
      const { protocol, hostname } = window.location;
      const match = hostname.match(/^(.*)-(\d+)\.(app\.github\.dev|github\.dev)$/);
      if (match) {
        const [, base, , domain] = match;
        return `${protocol}//${base}-${this.PORTS.SERVER}.${domain}${this.PATH_PREFIX}`;
      }
    }

    // Development mode with Vite proxy
    if (isDevelopment) {
      return this.PATH_PREFIX;
    }

    // Production - require explicit configuration
    if (isProduction && !envUrl) {
      console.error('[LexiFlow Config] VITE_API_URL is required in production');
    }

    return `http://localhost:${this.PORTS.SERVER}${this.PATH_PREFIX}`;
  },
} as const;

// =============================================================================
// Cache & Query Configuration
// =============================================================================

export const CACHE_CONFIG = {
  /**
   * Stale times for different data types (in milliseconds)
   * Data is considered "stale" after this time and will be refetched
   */
  STALE_TIMES: {
    /** User profile data - 5 minutes */
    USER: 5 * 60 * 1000,
    /** Case list data - 2 minutes */
    CASES: 2 * 60 * 1000,
    /** Document data - 30 seconds */
    DOCUMENTS: 30 * 1000,
    /** Billing data - 5 minutes */
    BILLING: 5 * 60 * 1000,
    /** Calendar events - 5 minutes */
    CALENDAR: 5 * 60 * 1000,
    /** Analytics data - 10 minutes */
    ANALYTICS: 10 * 60 * 1000,
    /** Evidence data - 3 minutes */
    EVIDENCE: 3 * 60 * 1000,
    /** Research results - 15 minutes */
    RESEARCH: 15 * 60 * 1000,
    /** Default stale time - 5 minutes */
    DEFAULT: 5 * 60 * 1000,
  },

  /**
   * Garbage collection time - how long to keep unused data in cache
   */
  GC_TIME: 30 * 60 * 1000,

  /**
   * Maximum number of items to keep in LRU cache
   */
  MAX_CACHE_SIZE: 100,
} as const;

// =============================================================================
// Retry Configuration
// =============================================================================

export const RETRY_CONFIG = {
  /** Maximum number of retry attempts */
  MAX_ATTEMPTS: 3,

  /** Initial delay between retries (ms) */
  INITIAL_DELAY_MS: 1000,

  /** Maximum delay between retries (ms) */
  MAX_DELAY_MS: 10000,

  /** Exponential backoff factor */
  BACKOFF_FACTOR: 2,

  /** HTTP status codes that should trigger a retry */
  RETRYABLE_STATUS_CODES: [408, 429, 500, 502, 503, 504] as const,
} as const;

// =============================================================================
// Authentication Configuration
// =============================================================================

export const AUTH_CONFIG = {
  /** Storage key for auth token */
  TOKEN_KEY: 'authToken',

  /** Storage key for refresh token */
  REFRESH_TOKEN_KEY: 'refreshToken',

  /** Storage key for auth state */
  STATE_KEY: 'auth-storage',

  /** Token expiry warning threshold (ms) - warn 5 minutes before expiry */
  EXPIRY_WARNING_MS: 5 * 60 * 1000,

  /** Default admin user for DEV_LOGIN_BYPASS mode */
  DEV_ADMIN_USER: {
    id: 'dev-admin-001',
    email: 'admin@lexiflow.dev',
    name: 'Dev Admin',
    role: 'admin' as const,
    avatar: null,
    organization_id: 'dev-org-001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
} as const;

// =============================================================================
// Third-Party Service Configuration
// =============================================================================

export const SERVICES_CONFIG = {
  OPENAI: {
    API_KEY: getEnvVar('VITE_OPENAI_API_KEY'),
    ENTERPRISE_KEY: getEnvVar('VITE_OPENAI_ENTERPRISE_KEY'),
    BASE_URL: getEnvVar('VITE_OPENAI_BASE_URL', 'https://api.openai.com/v1'),
    TIMEOUT_MS: 30000,
    MAX_RETRIES: 2,
    /** Maximum tokens for different operations */
    TOKEN_LIMITS: {
      SUMMARY: 1000,
      ANALYSIS: 2000,
      WORKFLOW: 1500,
    },
  },

  GOOGLE_MAPS: {
    API_KEY: getEnvVar('VITE_GOOGLE_MAPS_API_KEY'),
    LIBRARIES: ['places', 'geometry'] as const,
  },
} as const;

// =============================================================================
// UI Configuration
// =============================================================================

export const UI_CONFIG = {
  /** Default pagination page size */
  DEFAULT_PAGE_SIZE: 20,

  /** Animation durations (ms) */
  ANIMATIONS: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },

  /** Debounce delays (ms) */
  DEBOUNCE: {
    SEARCH: 300,
    RESIZE: 150,
    SCROLL: 100,
  },

  /** Toast notification duration (ms) */
  TOAST_DURATION: 5000,
} as const;

// =============================================================================
// Debug & Development Utilities
// =============================================================================

/**
 * Enable or disable a feature flag at runtime (development only)
 */
export const setFeatureFlag = (flag: keyof typeof FEATURE_FLAGS, enabled: boolean): void => {
  if (!isDevelopment) {
    console.warn('[LexiFlow Config] Feature flags can only be modified in development');
    return;
  }

  const key = `lexiflow:dev:${flag.replace(/_/g, '')}`;
  if (enabled) {
    localStorage.setItem(key, 'true');
  } else {
    localStorage.removeItem(key);
  }

  console.info(`[LexiFlow Config] Feature flag ${flag} set to ${enabled}. Reload to apply.`);
};

/**
 * Log current configuration (development only)
 */
export const logConfig = (): void => {
  if (!FEATURE_FLAGS.ENABLE_DEBUG_LOGGING) return;

  console.group('[LexiFlow Config] Current Configuration');
  console.log('Environment:', { isDevelopment, isProduction, isCodespaces });
  console.log('Feature Flags:', FEATURE_FLAGS);
  console.log('API Base URL:', API_CONFIG.getBaseUrl());
  console.log('Cache Config:', CACHE_CONFIG);
  console.groupEnd();
};

// Log config on load in development
if (isDevelopment && FEATURE_FLAGS.ENABLE_DEBUG_LOGGING) {
  logConfig();
}

// =============================================================================
// Type Exports
// =============================================================================

export type FeatureFlags = typeof FEATURE_FLAGS;
export type ApiConfig = typeof API_CONFIG;
export type CacheConfig = typeof CACHE_CONFIG;
export type RetryConfig = typeof RETRY_CONFIG;
export type AuthConfig = typeof AUTH_CONFIG;
export type ServicesConfig = typeof SERVICES_CONFIG;
export type UiConfig = typeof UI_CONFIG;
