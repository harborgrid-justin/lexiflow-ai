import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID, IsDateString } from 'class-validator';

export class CreateComplianceDto {
  @ApiProperty({ example: 'Document Review Compliance', description: 'Compliance title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'document_review', description: 'Compliance type' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ example: 'Federal Rule 26(f) compliance check', description: 'Compliance description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'Federal Rules of Civil Procedure', description: 'Regulation source', required: false })
  @IsOptional()
  @IsString()
  regulation?: string;

  @ApiProperty({ example: 'Rule 26(f)', description: 'Specific rule reference', required: false })
  @IsOptional()
  @IsString()
  rule_reference?: string;

  @ApiProperty({ example: '2024-02-15T00:00:00Z', description: 'Compliance deadline', required: false })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiProperty({ example: 'high', description: 'Risk level assessment', required: false })
  @IsOptional()
  @IsString()
  risk_level?: string;

  @ApiProperty({ example: 'case-123', description: 'Associated case ID', required: false })
  @IsOptional()
  @IsUUID()
  case_id?: string;

  @ApiProperty({ example: 'user-123', description: 'Compliance officer ID', required: false })
  @IsOptional()
  @IsUUID()
  officer_id?: string;

  @ApiProperty({ example: 'org-123', description: 'Owner organization ID', required: false })
  @IsOptional()
  @IsUUID()
  owner_org_id?: string;
}
