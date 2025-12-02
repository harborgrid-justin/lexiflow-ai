/**
 * LexiFlow AI - Configuration Module
 *
 * Centralized exports for all configuration values.
 * Import from this module instead of scattered config files.
 *
 * @example
 * import { FEATURE_FLAGS, API_CONFIG, CACHE_CONFIG } from '@/config';
 */

export {
  // Feature Flags
  FEATURE_FLAGS,
  setFeatureFlag,

  // API Configuration
  API_CONFIG,

  // Cache & Query Configuration
  CACHE_CONFIG,

  // Retry Configuration
  RETRY_CONFIG,

  // Authentication Configuration
  AUTH_CONFIG,

  // Third-Party Services
  SERVICES_CONFIG,

  // UI Configuration
  UI_CONFIG,

  // Debug Utilities
  logConfig,

  // Types
  type FeatureFlags,
  type ApiConfig,
  type CacheConfig,
  type RetryConfig,
  type AuthConfig,
  type ServicesConfig,
  type UiConfig,
} from './app.config';
