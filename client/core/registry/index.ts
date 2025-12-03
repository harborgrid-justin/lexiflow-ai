/**
 * Service Registry - Index
 * 
 * Central export point for the service registry system.
 * Provides access to dependency injection container and service resolution.
 */

// Core Registry Classes
export { ServiceContainer } from './ServiceContainer';
export {
  ServiceRegistry,
  getService,
  registerService,
  isServiceRegistered,
  serviceRegistry
} from './ServiceRegistry';

// React Hooks
export {
  useService,
  useServiceOptional,
  useServiceAvailable,
  useServices,
  useDomainServices,
  useInfrastructureServices
} from './useService';