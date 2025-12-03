/**
 * Base Service Interface
 * 
 * Defines the fundamental contract that all services must implement
 * for enterprise SOA compliance. Includes common methods for CRUD operations,
 * error handling, and lifecycle management.
 */

export interface IBaseService<T, TKey = string> {
  /**
   * Get all entities with optional filtering and pagination
   */
  getAll(options?: QueryOptions): Promise<ServiceResponse<T[]>>;

  /**
   * Get a single entity by its identifier
   */
  getById(id: TKey): Promise<ServiceResponse<T>>;

  /**
   * Create a new entity
   */
  create(entity: Partial<T>): Promise<ServiceResponse<T>>;

  /**
   * Update an existing entity
   */
  update(id: TKey, entity: Partial<T>): Promise<ServiceResponse<T>>;

  /**
   * Delete an entity by its identifier
   */
  delete(id: TKey): Promise<ServiceResponse<void>>;

  /**
   * Validate entity data before operations
   */
  validate(entity: Partial<T>): ValidationResult;

  /**
   * Get service health status
   */
  getHealth(): Promise<HealthStatus>;
}

/**
 * Common query options for filtering and pagination
 */
export interface QueryOptions {
  filter?: Record<string, any>;
  sort?: string;
  page?: number;
  limit?: number;
  include?: string[];
}

/**
 * Standardized service response wrapper
 */
export interface ServiceResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
    hasNext?: boolean;
  };
}

/**
 * Validation result for entity operations
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Service health status
 */
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastChecked: Date;
  dependencies?: Record<string, 'up' | 'down'>;
  metrics?: Record<string, number>;
}