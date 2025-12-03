/**
 * Logging Service Implementation
 * 
 * Centralized logging service that implements ILoggingService contract.
 * Provides structured logging with metadata support and different log levels.
 */

import { ILoggingService, ILogger, LogMetadata } from '../contracts';

export class LoggingService implements ILoggingService {
  private loggers = new Map<string, Logger>();
  private isProduction = process.env.NODE_ENV === 'production';

  debug(message: string, meta?: LogMetadata): void {
    this.log('DEBUG', message, undefined, meta);
  }

  info(message: string, meta?: LogMetadata): void {
    this.log('INFO', message, undefined, meta);
  }

  warn(message: string, meta?: LogMetadata): void {
    this.log('WARN', message, undefined, meta);
  }

  error(message: string, error?: Error, meta?: LogMetadata): void {
    this.log('ERROR', message, error, meta);
  }

  fatal(message: string, error?: Error, meta?: LogMetadata): void {
    this.log('FATAL', message, error, meta);
  }

  createLogger(context: string): ILogger {
    if (!this.loggers.has(context)) {
      this.loggers.set(context, new Logger(context, this));
    }
    return this.loggers.get(context)!;
  }

  private log(level: string, message: string, error?: Error, meta?: LogMetadata): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined,
      meta
    };

    // Console logging (always enabled in development)
    if (!this.isProduction || level === 'ERROR' || level === 'FATAL') {
      this.consoleLog(level, logEntry);
    }

    // Send to external logging service in production
    if (this.isProduction) {
      this.sendToExternalLogger(logEntry);
    }
  }

  private consoleLog(level: string, entry: any): void {
    const style = this.getLogStyle(level);
    const formatted = `[${entry.timestamp}] ${level}: ${entry.message}`;
    
    switch (level) {
      case 'DEBUG':
        console.debug(`%c${formatted}`, style, entry.meta);
        break;
      case 'INFO':
        console.info(`%c${formatted}`, style, entry.meta);
        break;
      case 'WARN':
        console.warn(`%c${formatted}`, style, entry.meta);
        break;
      case 'ERROR':
      case 'FATAL':
        console.error(`%c${formatted}`, style, entry.error, entry.meta);
        break;
      default:
        console.log(`%c${formatted}`, style, entry.meta);
    }
  }

  private getLogStyle(level: string): string {
    switch (level) {
      case 'DEBUG': return 'color: #888';
      case 'INFO': return 'color: #0066cc';
      case 'WARN': return 'color: #ff8800';
      case 'ERROR': return 'color: #cc0000';
      case 'FATAL': return 'color: #ff0000; font-weight: bold';
      default: return 'color: inherit';
    }
  }

  private async sendToExternalLogger(entry: any): Promise<void> {
    try {
      // Send to external logging service (e.g., Datadog, LogRocket, etc.)
      // This is a placeholder - implement actual external logging as needed
      await fetch('/api/v1/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry)
      });
    } catch (error) {
      // Fallback to console if external logging fails
      console.error('Failed to send log to external service:', error);
    }
  }
}

class Logger implements ILogger {
  constructor(
    private context: string,
    private loggingService: LoggingService
  ) {}

  debug(message: string, meta?: LogMetadata): void {
    this.loggingService.debug(`[${this.context}] ${message}`, meta);
  }

  info(message: string, meta?: LogMetadata): void {
    this.loggingService.info(`[${this.context}] ${message}`, meta);
  }

  warn(message: string, meta?: LogMetadata): void {
    this.loggingService.warn(`[${this.context}] ${message}`, meta);
  }

  error(message: string, error?: Error, meta?: LogMetadata): void {
    this.loggingService.error(`[${this.context}] ${message}`, error, meta);
  }

  fatal(message: string, error?: Error, meta?: LogMetadata): void {
    this.loggingService.fatal(`[${this.context}] ${message}`, error, meta);
  }
}