// Workflow Engine Error Classes
// Custom errors with detailed context for debugging

export class WorkflowEngineError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly context?: Record<string, any>,
  ) {
    super(message);
    this.name = 'WorkflowEngineError';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
    };
  }
}

export class TaskNotFoundError extends WorkflowEngineError {
  constructor(taskId: string) {
    super(`Task ${taskId} not found`, 'TASK_NOT_FOUND', { taskId });
    this.name = 'TaskNotFoundError';
  }
}

export class StageNotFoundError extends WorkflowEngineError {
  constructor(stageId: string) {
    super(`Stage ${stageId} not found`, 'STAGE_NOT_FOUND', { stageId });
    this.name = 'StageNotFoundError';
  }
}

export class DependencyError extends WorkflowEngineError {
  constructor(taskId: string, blockedBy: string[]) {
    super(
      `Task ${taskId} is blocked by: ${blockedBy.join(', ')}`,
      'DEPENDENCY_BLOCKED',
      { taskId, blockedBy },
    );
    this.name = 'DependencyError';
  }
}

export class CircularDependencyError extends WorkflowEngineError {
  constructor(taskId: string, chain: string[]) {
    super(
      `Circular dependency detected for task ${taskId}`,
      'CIRCULAR_DEPENDENCY',
      { taskId, chain },
    );
    this.name = 'CircularDependencyError';
  }
}

export class ApprovalError extends WorkflowEngineError {
  constructor(message: string, taskId: string, approverId?: string) {
    super(message, 'APPROVAL_ERROR', { taskId, approverId });
    this.name = 'ApprovalError';
  }
}

export class SLAError extends WorkflowEngineError {
  constructor(taskId: string, status: string, hoursOverdue?: number) {
    super(
      `SLA ${status} for task ${taskId}`,
      'SLA_ERROR',
      { taskId, status, hoursOverdue },
    );
    this.name = 'SLAError';
  }
}

export class IntegrationError extends WorkflowEngineError {
  constructor(integrationId: string, message: string, cause?: Error) {
    super(
      `Integration ${integrationId} failed: ${message}`,
      'INTEGRATION_ERROR',
      { integrationId, cause: cause?.message },
    );
    this.name = 'IntegrationError';
  }
}

export class ValidationError extends WorkflowEngineError {
  constructor(field: string, message: string, value?: any) {
    super(message, 'VALIDATION_ERROR', { field, value });
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends WorkflowEngineError {
  constructor(operation: string, retryAfter: number) {
    super(
      `Rate limit exceeded for ${operation}. Retry after ${retryAfter}ms`,
      'RATE_LIMIT',
      { operation, retryAfter },
    );
    this.name = 'RateLimitError';
  }
}

// Error handler utility
export function handleWorkflowError(error: unknown): WorkflowEngineError {
  if (error instanceof WorkflowEngineError) {
    return error;
  }

  if (error instanceof Error) {
    return new WorkflowEngineError(error.message, 'UNKNOWN_ERROR', {
      originalError: error.name,
      stack: error.stack,
    });
  }

  return new WorkflowEngineError(
    'An unknown error occurred',
    'UNKNOWN_ERROR',
    { error },
  );
}

// Result type for operations that can fail
export type Result<T, E = WorkflowEngineError> =
  | { success: true; data: T }
  | { success: false; error: E };

export function ok<T>(data: T): Result<T> {
  return { success: true, data };
}

export function err<E extends WorkflowEngineError>(error: E): Result<never, E> {
  return { success: false, error };
}
