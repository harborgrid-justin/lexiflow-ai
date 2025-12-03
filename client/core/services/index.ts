/**
 * Core Services - Index
 * 
 * Export point for standardized service implementations.
 * These services implement the SOA contracts and provide consistent
 * interfaces for domain and infrastructure operations.
 */

// Base Service
export { BaseService } from './BaseService';

// Domain Services
export { CaseService } from './CaseService';
export { ComplianceService } from './ComplianceService';
export { DocumentService } from './DocumentService';
export { BillingService } from './BillingService';
export { TaskService } from './TaskService';
export { UserService } from './UserService';

// Infrastructure Services
export { LoggingService } from './LoggingService';
export { CacheService } from './CacheService';
export { ConfigurationService } from './ConfigurationService';

// Service Factory Functions
export function createDomainServices() {
  return {
    caseService: new CaseService(),
    complianceService: new ComplianceService(),
    documentService: new DocumentService(),
    billingService: new BillingService(),
    taskService: new TaskService(),
    userService: new UserService(),
  };
}

export function createInfrastructureServices() {
  return {
    loggingService: new LoggingService(),
    cacheService: new CacheService(),
    configurationService: new ConfigurationService(),
  };
}

// Combined service factory
export function createAllServices() {
  return {
    ...createDomainServices(),
    ...createInfrastructureServices()
  };
}