/**
 * Service Registry
 * 
 * Central registry for all application services. Provides a global access point
 * for service resolution and manages the application's service dependencies.
 */

import { ServiceContainer } from './ServiceContainer';
import { SERVICE_KEYS, ServiceKey } from '../contracts';

/**
 * Global service container instance
 */
const container = new ServiceContainer();

/**
 * Service Registry class for managing application services
 */
export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private container: ServiceContainer;

  private constructor() {
    this.container = container;
    this.registerDefaultServices();
  }

  /**
   * Get the singleton instance of the service registry
   */
  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  /**
   * Register a service with the registry
   */
  register<T>(key: ServiceKey | string, implementation: T | (() => T), options?: {
    singleton?: boolean;
    dependencies?: string[];
  }): void {
    this.container.register(key, implementation, options);
  }

  /**
   * Register a singleton service
   */
  registerSingleton<T>(key: ServiceKey | string, factory: () => T, dependencies?: string[]): void {
    this.container.registerSingleton(key, factory, dependencies);
  }

  /**
   * Register a transient service
   */
  registerTransient<T>(key: ServiceKey | string, factory: () => T, dependencies?: string[]): void {
    this.container.registerTransient(key, factory, dependencies);
  }

  /**
   * Resolve a service from the registry
   */
  resolve<T>(key: ServiceKey | string): T {
    return this.container.resolve<T>(key);
  }

  /**
   * Check if a service is registered
   */
  isRegistered(key: ServiceKey | string): boolean {
    return this.container.isRegistered(key);
  }

  /**
   * Unregister a service
   */
  unregister(key: ServiceKey | string): void {
    this.container.unregister(key);
  }

  /**
   * Get all registered service keys
   */
  getRegisteredServices(): string[] {
    return this.container.getRegisteredServices();
  }

  /**
   * Create a scoped registry (useful for testing or feature modules)
   */
  createScope(): ServiceContainer {
    return this.container.createScope();
  }

  /**
   * Register default services with the container
   */
  private registerDefaultServices(): void {
    // Register infrastructure services first (dependencies for domain services)
    this.registerSingleton(SERVICE_KEYS.LOGGING_SERVICE, () => {
      const { LoggingService } = require('../services/LoggingService');
      return new LoggingService();
    });

    this.registerSingleton(SERVICE_KEYS.CACHE_SERVICE, () => {
      const { CacheService } = require('../services/CacheService');
      return new CacheService();
    });

    this.registerSingleton(SERVICE_KEYS.CONFIG_SERVICE, () => {
      const { ConfigurationService } = require('../services/ConfigurationService');
      return new ConfigurationService();
    });

    // Register domain services with their concrete implementations
    this.registerSingleton(SERVICE_KEYS.CASE_SERVICE, () => {
      const { CaseService } = require('../services/CaseService');
      return new CaseService();
    });

    this.registerSingleton(SERVICE_KEYS.COMPLIANCE_SERVICE, () => {
      const { ComplianceService } = require('../services/ComplianceService');
      return new ComplianceService();
    });

    this.registerSingleton(SERVICE_KEYS.DOCUMENT_SERVICE, () => {
      const { DocumentService } = require('../services/DocumentService');
      return new DocumentService();
    });

    this.registerSingleton(SERVICE_KEYS.BILLING_SERVICE, () => {
      const { BillingService } = require('../services/BillingService');
      return new BillingService();
    });

    this.registerSingleton(SERVICE_KEYS.TASK_SERVICE, () => {
      const { TaskService } = require('../services/TaskService');
      return new TaskService();
    });

    // Additional services for future implementation
    // Evidence, Communication, Motion services can be added as needed
  }

  /**
   * Initialize the service registry with all required services
   * This should be called during application bootstrap
   */
  static async initialize(): Promise<void> {
    const registry = ServiceRegistry.getInstance();
    
    // Load configuration
    // Initialize logging
    // Set up infrastructure services
    // Register domain services
    
    console.log('Service registry initialized with services:', registry.getRegisteredServices());
  }

  /**
   * Get service health status
   */
  async getHealthStatus(): Promise<Record<string, any>> {
    const services = this.getRegisteredServices();
    const health: Record<string, any> = {};
    
    for (const serviceKey of services) {
      try {
        const service = this.resolve<any>(serviceKey);
        if (service && typeof service.getHealth === 'function') {
          health[serviceKey] = await service.getHealth();
        } else {
          health[serviceKey] = { status: 'unknown', message: 'No health check available' };
        }
      } catch (error) {
        health[serviceKey] = {
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        };
      }
    }
    
    return health;
  }
}

/**
 * Convenience function to get a service from the global registry
 */
export function getService<T>(key: ServiceKey | string): T {
  return ServiceRegistry.getInstance().resolve<T>(key);
}

/**
 * Convenience function to register a service with the global registry
 */
export function registerService<T>(
  key: ServiceKey | string,
  implementation: T | (() => T),
  options?: { singleton?: boolean; dependencies?: string[] }
): void {
  ServiceRegistry.getInstance().register(key, implementation, options);
}

/**
 * Convenience function to check if a service is registered
 */
export function isServiceRegistered(key: ServiceKey | string): boolean {
  return ServiceRegistry.getInstance().isRegistered(key);
}

// Export the global instance for direct access if needed
export const serviceRegistry = ServiceRegistry.getInstance();