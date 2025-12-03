/**
 * Base Service Implementation
 * 
 * Abstract base class that provides common functionality for all domain services.
 * Implements the IBaseService contract with standardized error handling,
 * validation, and response formatting.
 */

import {
  IBaseService,
  QueryOptions,
  ServiceResponse,
  ValidationResult,
  ValidationError,
  HealthStatus
} from '../contracts';

export abstract class BaseService<T, TKey = string> implements IBaseService<T, TKey> {
  protected serviceName: string;
  
  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  /**
   * Wrap API responses in standardized ServiceResponse format
   */
  protected wrapResponse<TData>(data: TData, message?: string): ServiceResponse<TData> {
    return {
      data,
      success: true,
      message
    };
  }

  /**
   * Handle errors and return standardized error response
   */
  protected handleError<TData>(error: any, defaultMessage?: string): ServiceResponse<TData> {
    console.error(`${this.serviceName} error:`, error);
    
    return {
      data: null as TData,
      success: false,
      message: error?.message || defaultMessage || 'An error occurred',
      errors: error?.errors || [error?.message || 'Unknown error']
    };
  }

  /**
   * Execute an async operation with error handling
   */
  protected async executeWithErrorHandling<TData>(
    operation: () => Promise<TData>,
    errorMessage?: string
  ): Promise<ServiceResponse<TData>> {
    try {
      const data = await operation();
      return this.wrapResponse(data);
    } catch (error) {
      return this.handleError(error, errorMessage);
    }
  }

  /**
   * Basic validation implementation - can be overridden
   */
  validate(entity: Partial<T>): ValidationResult {
    const errors: ValidationError[] = [];
    
    // Basic null/undefined checks
    if (!entity) {
      errors.push({
        field: 'entity',
        message: 'Entity cannot be null or undefined',
        code: 'REQUIRED'
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Default health check implementation
   */
  async getHealth(): Promise<HealthStatus> {
    return {
      status: 'healthy',
      lastChecked: new Date()
    };
  }

  // Abstract methods that must be implemented by concrete services
  abstract getAll(options?: QueryOptions): Promise<ServiceResponse<T[]>>;
  abstract getById(id: TKey): Promise<ServiceResponse<T>>;
  abstract create(entity: Partial<T>): Promise<ServiceResponse<T>>;
  abstract update(id: TKey, entity: Partial<T>): Promise<ServiceResponse<T>>;
  abstract delete(id: TKey): Promise<ServiceResponse<void>>;
}