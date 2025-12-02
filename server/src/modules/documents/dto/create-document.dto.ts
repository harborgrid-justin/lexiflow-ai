import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({ example: 'Software License Agreement', description: 'Document title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'contract-v1.pdf', description: 'Document filename' })
  @IsOptional()
  @IsString()
  filename?: string;

  @ApiProperty({ example: 'Contract', description: 'Document type (e.g., Contract, Brief, Motion, Evidence)' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: 'Initial draft of license agreement', description: 'Document description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'case-123', description: 'Associated case ID' })
  @IsOptional()
  @IsUUID()
  case_id?: string;

  @ApiPropertyOptional({ example: 'contract,license,agreement', description: 'Comma-separated tags' })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({ example: 'Confidential', description: 'Security classification' })
  @IsOptional()
  @IsString()
  classification?: string;

  @ApiPropertyOptional({ example: 'This document contains the terms...', description: 'Document text content' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: '/storage/documents/doc-123.pdf', description: 'File storage path' })
  @IsOptional()
  @IsString()
  file_path?: string;
}
