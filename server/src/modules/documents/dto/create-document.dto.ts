import { IsString, IsOptional, IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({ example: 'contract-v1.pdf', description: 'Document filename' })
  @IsString()
  filename: string;

  @ApiProperty({ example: 'Software License Agreement', description: 'Document title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Contract', description: 'Document type' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: 'draft', description: 'Document status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: '/storage/documents/doc-123.pdf', description: 'File storage path' })
  @IsString()
  file_path: string;

  @ApiPropertyOptional({ example: 'application/pdf', description: 'File MIME type' })
  @IsOptional()
  @IsString()
  mime_type?: string;

  @ApiPropertyOptional({ example: 1048576, description: 'File size in bytes' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  file_size?: number;

  @ApiPropertyOptional({ example: 'Initial draft of license agreement', description: 'Document description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'contract,license,agreement', description: 'Comma-separated tags' })
  @IsOptional()
  @IsString()
  tags?: string;

  @ApiPropertyOptional({ example: 'Confidential', description: 'Security classification' })
  @IsOptional()
  @IsString()
  classification?: string;

  @ApiPropertyOptional({ example: 'case-123', description: 'Associated case ID' })
  @IsOptional()
  @IsUUID()
  case_id?: string;
}
