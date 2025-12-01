// Recovery and Error Handling Service
// Manages retry logic and recovery states

import { Injectable, Logger } from '@nestjs/common';
import { CircuitBreaker } from '../circuit-breaker';
import { AuditService } from '../audit.service';
import { WorkflowEngineError } from '../errors';

export interface RecoveryState {
  taskId: string;
  operation: string;
  startedAt: Date;
  retryCount: number;
  lastError?: string;
}

@Injectable()
export class RecoveryService {
  private readonly logger = new Logger(RecoveryService.name);
  private readonly circuitBreaker = new CircuitBreaker({
    failureThreshold: 5,
    successThreshold: 2,
    timeout: 30000,
  });
  private readonly recoveryStates = new Map<string, RecoveryState>();
  private readonly maxRetries = 3;

  constructor(private auditService: AuditService) {}

  async executeWithRecovery<T>(
    taskId: string,
    operation: string,
    fn: () => Promise<T>,
  ): Promise<T> {
    const recoveryKey = `${taskId}:${operation}`;
    let state = this.recoveryStates.get(recoveryKey);

    if (!state) {
      state = {
        taskId,
        operation,
        startedAt: new Date(),
        retryCount: 0,
      };
      this.recoveryStates.set(recoveryKey, state);
    }

    try {
      const result = await this.circuitBreaker.execute(fn);

      // Success - clean up recovery state
      this.recoveryStates.delete(recoveryKey);

      return result;
    } catch (error) {
      state.retryCount++;
      state.lastError = error instanceof Error ? error.message : String(error);

      this.logger.error(
        `Operation ${operation} failed for task ${taskId} (attempt ${state.retryCount})`,
        error,
      );

      // Log failure to audit
      this.auditService.log('task', taskId, `${operation}_failed`, 'system', {
        metadata: {
          error: state.lastError,
          retryCount: state.retryCount,
        },
      });

      if (state.retryCount >= this.maxRetries) {
        this.recoveryStates.delete(recoveryKey);
        throw new WorkflowEngineError(
          `Operation ${operation} failed after ${this.maxRetries} retries`,
          'MAX_RETRIES_EXCEEDED',
          { taskId, operation, lastError: state.lastError },
        );
      }

      throw error;
    }
  }

  async retryFailedOperation(taskId: string, operation: string): Promise<boolean> {
    const recoveryKey = `${taskId}:${operation}`;
    const state = this.recoveryStates.get(recoveryKey);

    if (!state) {
      this.logger.warn(`No recovery state found for ${recoveryKey}`);
      return false;
    }

    // Reset retry count for manual retry
    state.retryCount = 0;

    this.logger.log(`Manual retry initiated for ${recoveryKey}`);

    return true;
  }

  getRecoveryStates(): RecoveryState[] {
    return Array.from(this.recoveryStates.values());
  }

  getCircuitBreakerStatus(): { state: string; failures: number } {
    return {
      state: this.circuitBreaker.getState(),
      failures: 0,
    };
  }
}
