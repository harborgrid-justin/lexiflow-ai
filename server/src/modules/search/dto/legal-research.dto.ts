import { IsString, IsOptional, IsBoolean, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LegalResearchDto {
  @ApiProperty({
    description: 'Legal research query',
    example: 'contract breach remedies',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  query: string;

  @ApiPropertyOptional({
    description: 'Jurisdiction to search within',
    example: 'California',
  })
  @IsOptional()
  @IsString()
  jurisdiction?: string;

  @ApiPropertyOptional({
    description: 'Include case law in results',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  include_case_law?: boolean = true;

  @ApiPropertyOptional({
    description: 'Include statutes in results',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  include_statutes?: boolean = true;

  @ApiPropertyOptional({
    description: 'Include legal articles in results',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  include_articles?: boolean = false;

  @ApiPropertyOptional({
    description: 'Include legal news in results',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  include_news?: boolean = false;
}

export class CaseLawSearchDto {
  @ApiProperty({
    description: 'Case law search query',
    example: 'negligence medical malpractice',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  query: string;

  @ApiPropertyOptional({
    description: 'Jurisdiction to search within',
    example: 'Federal',
  })
  @IsOptional()
  @IsString()
  jurisdiction?: string;
}

export class StatuteSearchDto {
  @ApiProperty({
    description: 'Statute search query',
    example: 'consumer protection privacy',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  query: string;

  @ApiPropertyOptional({
    description: 'Jurisdiction to search within',
    example: 'California',
  })
  @IsOptional()
  @IsString()
  jurisdiction?: string;
}

export class LegalNewsSearchDto {
  @ApiProperty({
    description: 'Legal news search query',
    example: 'supreme court decisions',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  query: string;

  @ApiPropertyOptional({
    description: 'Number of days to look back',
    example: 30,
    default: 30,
  })
  @IsOptional()
  @IsString()
  days_back?: number = 30;
}
