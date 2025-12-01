import { IsString, IsOptional, IsNumber, IsDateString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCaseDto {
  @ApiProperty({ example: 'Smith vs. Jones Corporation', description: 'Case title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'ABC Corporation', description: 'Client name' })
  @IsString()
  client_name: string;

  @ApiPropertyOptional({ example: 'Johnson & Associates', description: 'Opposing counsel' })
  @IsOptional()
  @IsString()
  opposing_counsel?: string;

  @ApiPropertyOptional({ example: 'Active', description: 'Case status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: '2024-01-15T00:00:00Z', description: 'Case filing date' })
  @IsOptional()
  @IsDateString()
  filing_date?: string;

  @ApiPropertyOptional({ example: 'Contract dispute regarding software licensing', description: 'Case description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 500000, description: 'Case monetary value' })
  @IsOptional()
  @IsNumber()
  value?: number;

  @ApiPropertyOptional({ example: 'Commercial Litigation', description: 'Type of legal matter' })
  @IsOptional()
  @IsString()
  matter_type?: string;

  @ApiPropertyOptional({ example: 'Federal', description: 'Legal jurisdiction' })
  @IsOptional()
  @IsString()
  jurisdiction?: string;

  @ApiPropertyOptional({ example: 'US District Court', description: 'Court name' })
  @IsOptional()
  @IsString()
  court?: string;

  @ApiPropertyOptional({ example: 'Hourly', description: 'Billing model for the case' })
  @IsOptional()
  @IsString()
  billing_model?: string;

  @ApiPropertyOptional({ example: 'Hon. Jane Smith', description: 'Presiding judge' })
  @IsOptional()
  @IsString()
  judge?: string;

  @ApiPropertyOptional({ example: 'org-123', description: 'Owner organization ID' })
  @IsOptional()
  @IsUUID()
  owner_org_id?: string;
}