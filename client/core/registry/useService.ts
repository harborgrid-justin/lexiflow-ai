/**
 * useService Hook
 * 
 * React hook for accessing services from the service registry.
 * Provides type-safe service resolution and caching for React components.
 */

import { useMemo } from 'react';
import { ServiceKey } from '../contracts';
import { getService, isServiceRegistered } from './ServiceRegistry';

/**
 * Hook to resolve a service from the service registry
 * @param key - Service key to resolve
 * @returns The resolved service instance
 */
export function useService<T>(key: ServiceKey | string): T {
  return useMemo(() => {
    if (!isServiceRegistered(key)) {
      throw new Error(`Service '${key}' is not registered. Make sure to register it during application initialization.`);
    }
    return getService<T>(key);
  }, [key]);
}

/**
 * Hook to resolve a service with optional fallback
 * @param key - Service key to resolve
 * @param fallback - Fallback value if service is not available
 * @returns The resolved service instance or fallback
 */
export function useServiceOptional<T>(key: ServiceKey | string, fallback?: T): T | undefined {
  return useMemo(() => {
    try {
      if (isServiceRegistered(key)) {
        return getService<T>(key);
      }
      return fallback;
    } catch {
      return fallback;
    }
  }, [key, fallback]);
}

/**
 * Hook to check if a service is available
 * @param key - Service key to check
 * @returns Whether the service is registered
 */
export function useServiceAvailable(key: ServiceKey | string): boolean {
  return useMemo(() => isServiceRegistered(key), [key]);
}

/**
 * Hook to resolve multiple services at once
 * @param keys - Array of service keys to resolve
 * @returns Array of resolved service instances
 */
export function useServices<T = any>(keys: (ServiceKey | string)[]): T[] {
  return useMemo(() => {
    return keys.map(key => {
      if (!isServiceRegistered(key)) {
        throw new Error(`Service '${key}' is not registered.`);
      }
      return getService<T>(key);
    });
  }, [keys]);
}

/**
 * Hook for typed service access with domain-specific services
 */
export const useDomainServices = () => {
  return {
    useCase: <T>() => useService<T>('ICaseService'),
    useDocument: <T>() => useService<T>('IDocumentService'),
    useCompliance: <T>() => useService<T>('IComplianceService'),
    useUser: <T>() => useService<T>('IUserService'),
    useClient: <T>() => useService<T>('IClientService'),
    useBilling: <T>() => useService<T>('IBillingService'),
    useTask: <T>() => useService<T>('ITaskService'),
    useEvidence: <T>() => useService<T>('IEvidenceService'),
    useCommunication: <T>() => useService<T>('ICommunicationService'),
    useMotion: <T>() => useService<T>('IMotionService'),
  };
};

/**
 * Hook for typed service access with infrastructure services
 */
export const useInfrastructureServices = () => {
  return {
    useAuth: <T>() => useService<T>('IAuthenticationService'),
    useCache: <T>() => useService<T>('ICacheService'),
    useLogging: <T>() => useService<T>('ILoggingService'),
    useNotification: <T>() => useService<T>('INotificationService'),
    useAnalytics: <T>() => useService<T>('IAnalyticsService'),
    useConfig: <T>() => useService<T>('IConfigurationService'),
    useFileStorage: <T>() => useService<T>('IFileStorageService'),
    useSearch: <T>() => useService<T>('ISearchService'),
  };
};