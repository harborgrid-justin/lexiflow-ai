import { ApiProperty } from '@nestjs/swagger';

/**
 * Base Response DTO for consistent API responses
 */
export class BaseResponseDto<T> {
  @ApiProperty()
  data: T;

  @ApiProperty({ required: false })
  message?: string;

  @ApiProperty({ enum: ['success', 'error'] })
  status: 'success' | 'error';
}

/**
 * Paginated Response DTO
 */
export class PaginatedResponseDto<T> {
  @ApiProperty({ isArray: true })
  data: T[];

  @ApiProperty({ example: 100 })
  total: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}

/**
 * Generic success response helper
 */
export function createSuccessResponse<T>(data: T, message?: string): BaseResponseDto<T> {
  return {
    data,
    message,
    status: 'success',
  };
}

/**
 * Generic error response helper
 */
export function createErrorResponse<T = null>(message: string, data?: T): BaseResponseDto<T> {
  return {
    data: data as T,
    message,
    status: 'error',
  };
}
