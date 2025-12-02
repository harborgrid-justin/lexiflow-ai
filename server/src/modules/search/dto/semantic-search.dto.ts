import { IsString, IsOptional, IsNumber, IsArray, Min, Max, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SemanticSearchDto {
  @ApiProperty({
    description: 'Search query text',
    example: 'contract liability clauses',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  query: string;

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
    description: 'Minimum similarity threshold (0-1)',
    example: 0.7,
    default: 0.7,
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  threshold?: number = 0.7;

  @ApiPropertyOptional({
    description: 'Filter by case ID',
    example: 'case-uuid-123',
  })
  @IsOptional()
  @IsString()
  case_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by document type',
    example: 'contract',
  })
  @IsOptional()
  @IsString()
  document_type?: string;

  @ApiPropertyOptional({
    description: 'Filter by organization ID',
    example: 'org-uuid-123',
  })
  @IsOptional()
  @IsString()
  org_id?: string;

  @ApiPropertyOptional({
    description: 'Pre-computed embedding vector (1536 dimensions for ada-002)',
    example: [0.1, 0.2, 0.3],
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  embedding?: number[];
}
