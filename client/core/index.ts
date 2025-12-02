/**
 * Core Module - Application Infrastructure
 * 
 * This module provides the foundational infrastructure for the LexiFlow application:
 * - Providers: React Query, Auth, Theme
 * - Guards: Route protection, RBAC
 * - Router: Lazy-loaded routing
 * - Hooks: Core application hooks
 * - Utils: Shared utilities
 */

// Providers
export { AppProviders } from './providers/AppProviders';
export { QueryProvider, queryClient } from './providers/QueryProvider';

// Router
export { AppRouter, routes, getRoute, getRoutesByCategory, hasRouteAccess } from './router';
export type { RouteDefinition } from './router';

// Guards
export { AuthGuard } from './guards/AuthGuard';
export { RoleGuard } from './guards/RoleGuard';
export { FeatureGuard, isFeatureEnabled } from './guards/FeatureGuard';

// Hooks
export { useAppNavigation } from './hooks/useAppNavigation';
export { usePermissions } from './hooks/usePermissions';

// Types
export type { Permission, FeatureFlag, RouteConfig } from './types';
