import { IsString, IsOptional, IsNumber, IsObject, Min, Max, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchFilters {
  @ApiPropertyOptional({
    description: 'Filter by case ID',
    example: 'case-uuid-123',
  })
  case_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by document type',
    example: 'contract',
  })
  document_type?: string;

  @ApiPropertyOptional({
    description: 'Filter by organization ID',
    example: 'org-uuid-123',
  })
  org_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by date range',
    example: { start: '2024-01-01', end: '2024-12-31' },
  })
  date_range?: {
    start?: string;
    end?: string;
  };

  @ApiPropertyOptional({
    description: 'Filter by document status',
    example: 'final',
  })
  status?: string;
}

export class HybridSearchDto {
  @ApiProperty({
    description: 'Search query text',
    example: 'contract liability clauses',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  query: string;

  @ApiPropertyOptional({
    description: 'Weight for keyword matching (0-1)',
    example: 0.3,
    default: 0.3,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  keyword_weight?: number = 0.3;

  @ApiPropertyOptional({
    description: 'Weight for semantic matching (0-1)',
    example: 0.7,
    default: 0.7,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  semantic_weight?: number = 0.7;

  @ApiPropertyOptional({
    description: 'Maximum number of results to return',
    example: 10,
    default: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search filters',
    type: SearchFilters,
  })
  @IsOptional()
  @IsObject()
  filters?: SearchFilters;
}
