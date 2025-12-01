// API Error Handling
// Interfaces and classes for API error management

export interface ValidationFieldError {
  field: string;
  message: string;
  value?: any;
}

export interface BackendErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
  fieldErrors?: ValidationFieldError[];
}

export class ApiError extends Error {
  statusCode: number;
  error?: string;
  fieldErrors?: ValidationFieldError[];
  originalResponse?: BackendErrorResponse;

  constructor(
    message: string,
    statusCode: number,
    error?: string,
    fieldErrors?: ValidationFieldError[],
    originalResponse?: BackendErrorResponse
  ) {
    const formattedMessage = ApiError.formatErrorMessage(message, fieldErrors);
    super(formattedMessage);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.error = error;
    this.fieldErrors = fieldErrors;
    this.originalResponse = originalResponse;

    Object.setPrototypeOf(this, ApiError.prototype);
  }

  private static formatErrorMessage(message: string | string[], fieldErrors?: ValidationFieldError[]): string {
    let baseMessage = Array.isArray(message) ? message.join(', ') : message;

    if (fieldErrors && fieldErrors.length > 0) {
      const fieldMessages = fieldErrors.map(fe => `${fe.field}: ${fe.message}`).join('; ');
      baseMessage = `${baseMessage} - ${fieldMessages}`;
    }

    return baseMessage;
  }

  static isApiError(error: any): error is ApiError {
    return error instanceof ApiError || (error?.name === 'ApiError' && 'statusCode' in error);
  }

  isValidationError(): boolean {
    return this.statusCode === 400 && !!this.fieldErrors && this.fieldErrors.length > 0;
  }

  isAuthError(): boolean {
    return this.statusCode === 401;
  }

  isForbidden(): boolean {
    return this.statusCode === 403;
  }

  isNotFound(): boolean {
    return this.statusCode === 404;
  }

  isConflict(): boolean {
    return this.statusCode === 409;
  }

  isServerError(): boolean {
    return this.statusCode >= 500;
  }

  getFieldError(fieldName: string): ValidationFieldError | undefined {
    return this.fieldErrors?.find(fe => fe.field === fieldName);
  }

  hasFieldError(fieldName: string): boolean {
    return !!this.getFieldError(fieldName);
  }

  getUserFriendlyMessage(): string {
    if (this.isValidationError()) {
      return 'Please check your input and try again.';
    }
    if (this.isAuthError()) {
      return 'Your session has expired. Please log in again.';
    }
    if (this.isForbidden()) {
      return 'You do not have permission to perform this action.';
    }
    if (this.isNotFound()) {
      return 'The requested resource was not found.';
    }
    if (this.isServerError()) {
      return 'A server error occurred. Please try again later.';
    }
    return this.message;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      error: this.error,
      fieldErrors: this.fieldErrors,
      stack: this.stack,
    };
  }
}

export interface SemanticSearchResult {
  id: string;
  content: string;
  similarity: number;
  document_id: string;
  metadata?: Record<string, unknown>;
}

export interface DocumentUploadMetadata {
  title?: string;
  type?: string;
  caseId?: string;
  description?: string;
  tags?: string[];
  classification?: string;
}
