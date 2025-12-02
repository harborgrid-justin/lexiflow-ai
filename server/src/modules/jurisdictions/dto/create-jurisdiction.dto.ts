import { IsString, IsOptional, IsUUID, IsIn, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateJurisdictionDto {
  @ApiProperty({ example: 'California', description: 'Jurisdiction name' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'state',
    description: 'Jurisdiction type',
    enum: ['federal', 'state', 'county', 'city', 'district'],
  })
  @IsString()
  @IsIn(['federal', 'state', 'county', 'city', 'district'])
  type: string;

  @ApiProperty({ example: 'CA', description: 'Jurisdiction code (unique identifier)' })
  @IsString()
  code: string;

  @ApiPropertyOptional({ example: 'State of California jurisdiction', description: 'Jurisdiction description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'US', description: 'Country code' })
  @IsString()
  country: string;

  @ApiPropertyOptional({ example: 'jur-usa', description: 'Parent jurisdiction ID' })
  @IsOptional()
  @IsUUID()
  parent_id?: string;

  @ApiPropertyOptional({
    example: { 'statute_of_limitations': '2 years' },
    description: 'Jurisdiction-specific rules (JSONB)',
  })
  @IsOptional()
  @IsObject()
  rules?: Record<string, unknown>;

  @ApiPropertyOptional({ example: 'https://courts.ca.gov', description: 'Court system website' })
  @IsOptional()
  @IsString()
  court_website?: string;

  @ApiPropertyOptional({
    example: 'active',
    description: 'Jurisdiction status',
    enum: ['active', 'inactive'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['active', 'inactive'])
  status?: string;

  @ApiPropertyOptional({ example: 'org-123', description: 'Owner organization ID' })
  @IsOptional()
  @IsUUID()
  owner_org_id?: string;
}
