/**
 * Service Container
 * 
 * Implements dependency injection container for enterprise SOA architecture.
 * Provides service registration, resolution, and lifecycle management.
 */

import { IServiceContainer } from '../contracts';

type ServiceFactory<T = any> = () => T;
type ServiceInstance<T = any> = T;

interface ServiceRegistration<T = any> {
  instance?: ServiceInstance<T>;
  factory?: ServiceFactory<T>;
  singleton?: boolean;
  dependencies?: string[];
}

export class ServiceContainer implements IServiceContainer {
  private services = new Map<string, ServiceRegistration>();
  private instances = new Map<string, any>();
  private resolving = new Set<string>();

  /**
   * Register a service with the container
   */
  register<T>(key: string, implementationOrFactory: T | ServiceFactory<T>, options?: {
    singleton?: boolean;
    dependencies?: string[];
  }): void {
    if (typeof implementationOrFactory === 'function') {
      this.services.set(key, {
        factory: implementationOrFactory as ServiceFactory<T>,
        singleton: options?.singleton ?? true,
        dependencies: options?.dependencies ?? []
      });
    } else {
      this.services.set(key, {
        instance: implementationOrFactory,
        singleton: true
      });
      this.instances.set(key, implementationOrFactory);
    }
  }

  /**
   * Register a singleton service
   */
  registerSingleton<T>(key: string, factory: ServiceFactory<T>, dependencies?: string[]): void {
    this.register(key, factory, { singleton: true, dependencies });
  }

  /**
   * Register a transient service
   */
  registerTransient<T>(key: string, factory: ServiceFactory<T>, dependencies?: string[]): void {
    this.register(key, factory, { singleton: false, dependencies });
  }

  /**
   * Resolve a service from the container
   */
  resolve<T>(key: string): T {
    if (this.resolving.has(key)) {
      throw new Error(`Circular dependency detected while resolving service '${key}'`);
    }

    const registration = this.services.get(key);
    if (!registration) {
      throw new Error(`Service '${key}' is not registered`);
    }

    // Return existing instance if singleton and already created
    if (registration.singleton && this.instances.has(key)) {
      return this.instances.get(key);
    }

    // Return direct instance if provided
    if (registration.instance) {
      return registration.instance;
    }

    // Create new instance using factory
    if (registration.factory) {
      this.resolving.add(key);
      
      try {
        // Resolve dependencies first
        const dependencies = registration.dependencies || [];
        const resolvedDependencies = dependencies.map(dep => this.resolve(dep));
        
        // Create instance
        const instance = registration.factory();
        
        // Store instance if singleton
        if (registration.singleton) {
          this.instances.set(key, instance);
        }
        
        return instance;
      } finally {
        this.resolving.delete(key);
      }
    }

    throw new Error(`Unable to resolve service '${key}': no instance or factory provided`);
  }

  /**
   * Check if a service is registered
   */
  isRegistered(key: string): boolean {
    return this.services.has(key);
  }

  /**
   * Unregister a service
   */
  unregister(key: string): void {
    this.services.delete(key);
    this.instances.delete(key);
  }

  /**
   * Clear all services
   */
  clear(): void {
    this.services.clear();
    this.instances.clear();
    this.resolving.clear();
  }

  /**
   * Get all registered service keys
   */
  getRegisteredServices(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * Get service registration info
   */
  getServiceInfo(key: string): {
    isRegistered: boolean;
    isSingleton: boolean;
    hasInstance: boolean;
    dependencies: string[];
  } {
    const registration = this.services.get(key);
    return {
      isRegistered: !!registration,
      isSingleton: registration?.singleton ?? false,
      hasInstance: this.instances.has(key),
      dependencies: registration?.dependencies ?? []
    };
  }

  /**
   * Create a scoped container (child container)
   */
  createScope(): ServiceContainer {
    const scope = new ServiceContainer();
    
    // Copy all service registrations to the scope
    for (const [key, registration] of this.services.entries()) {
      scope.services.set(key, { ...registration });
    }
    
    return scope;
  }
}