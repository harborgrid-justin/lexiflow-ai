/**
 * Core Module - Application Infrastructure
 * 
 * This module provides the foundational infrastructure for the LexiFlow application:
 * - Providers: React Query, Auth, Theme
 * - Guards: Route protection, RBAC
 * - Router: Lazy-loaded routing
 * - Hooks: Core application hooks
 * - Contracts: Service interfaces for SOA
 * - Registry: Dependency injection and service discovery
 * - Services: Infrastructure and domain service implementations
 * - Bootstrap: Application initialization
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

// Service Contracts (SOA Architecture)
export type * from './contracts';

// Service Registry (Dependency Injection)
export {
  ServiceContainer,
  ServiceRegistry,
  getService,
  registerService,
  isServiceRegistered,
  serviceRegistry,
  useService,
  useServiceOptional,
  useServiceAvailable,
  useServices,
  useDomainServices,
  useInfrastructureServices
} from './registry';

// Service Implementations
export * from './services';

// Bootstrap
export { bootstrapApplication, shutdownApplication } from './bootstrap';

// Types
export type { Permission, FeatureFlag, RouteConfig } from './types';
