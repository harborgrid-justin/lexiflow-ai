/**
 * Application Bootstrap
 * 
 * Initializes the enterprise SOA architecture including service registry,
 * dependency injection, and core infrastructure services.
 */

import { ServiceRegistry } from './registry';

/**
 * Bootstrap the application with SOA infrastructure
 */
export async function bootstrapApplication(): Promise<void> {
  try {
    console.log('🚀 Bootstrapping LexiFlow SOA Architecture...');
    
    // Initialize the service registry
    await ServiceRegistry.initialize();
    
    // Verify critical services are available
    const registry = ServiceRegistry.getInstance();
    const services = registry.getRegisteredServices();
    
    console.log('✅ Service Registry initialized with services:', services);
    
    // Get health status of all services
    const healthStatus = await registry.getHealthStatus();
    console.log('📊 Service Health Status:', healthStatus);
    
    // Log successful bootstrap
    console.log('✨ SOA Architecture bootstrap complete');
    
  } catch (error) {
    console.error('❌ Failed to bootstrap SOA architecture:', error);
    throw new Error('Application bootstrap failed');
  }
}

/**
 * Cleanup function for application shutdown
 */
export async function shutdownApplication(): Promise<void> {
  try {
    console.log('🔄 Shutting down SOA services...');
    
    // Cleanup services if they have shutdown methods
    const registry = ServiceRegistry.getInstance();
    const services = registry.getRegisteredServices();
    
    for (const serviceKey of services) {
      try {
        const service = registry.resolve<any>(serviceKey);
        if (service && typeof service.shutdown === 'function') {
          await service.shutdown();
        }
      } catch (error) {
        console.warn(`Failed to shutdown service ${serviceKey}:`, error);
      }
    }
    
    console.log('✅ SOA services shutdown complete');
    
  } catch (error) {
    console.error('❌ Failed to shutdown services:', error);
  }
}