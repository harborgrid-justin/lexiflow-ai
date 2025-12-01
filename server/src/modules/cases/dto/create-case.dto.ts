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

  @ApiPropertyOptional({ example: '25-1229', description: 'Docket number' })
  @IsOptional()
  @IsString()
  docket_number?: string;

  @ApiPropertyOptional({ example: '1:24-cv-01442-LMB-IDD', description: 'Originating case number' })
  @IsOptional()
  @IsString()
  originating_case_number?: string;

  @ApiPropertyOptional({ example: '3422 Bankruptcy Appeals Rule', description: 'Nature of suit' })
  @IsOptional()
  @IsString()
  nature_of_suit?: string;

  @ApiPropertyOptional({ example: 'Bankruptcy-District Court', description: 'Case type' })
  @IsOptional()
  @IsString()
  case_type?: string;

  @ApiPropertyOptional({ example: '2025-02-26T00:00:00Z', description: 'Date order judgment' })
  @IsOptional()
  @IsDateString()
  date_order_judgment?: string;

  @ApiPropertyOptional({ example: '2025-03-07T00:00:00Z', description: 'Date NOA filed' })
  @IsOptional()
  @IsDateString()
  date_noa_filed?: string;

  @ApiPropertyOptional({ example: '2025-03-11T00:00:00Z', description: 'Date received COA' })
  @IsOptional()
  @IsDateString()
  date_recv_coa?: string;

  @ApiPropertyOptional({ example: 'fee paid', description: 'Fee status' })
  @IsOptional()
  @IsString()
  fee_status?: string;

  @ApiPropertyOptional({ example: 'Hourly', description: 'Billing model for the case' })
  @IsOptional()
  @IsString()
  billing_model?: string;

  @ApiPropertyOptional({ example: 'Hon. Jane Smith', description: 'Presiding judge' })
  @IsOptional()
  @IsString()
  judge?: string;

  @ApiPropertyOptional({ example: 'Leonie M. Brinkema', description: 'Presiding judge name' })
  @IsOptional()
  @IsString()
  presiding_judge?: string;

  @ApiPropertyOptional({ example: 'Ivan Darnell Davis', description: 'Ordering judge name' })
  @IsOptional()
  @IsString()
  ordering_judge?: string;

  @ApiPropertyOptional({ example: 'org-123', description: 'Owner organization ID' })
  @IsOptional()
  @IsUUID()
  owner_org_id?: string;
}