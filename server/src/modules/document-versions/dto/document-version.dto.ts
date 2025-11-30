import { IsString, IsOptional, IsNumber, IsDateString, Length } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateDocumentVersionDto {
  @ApiProperty({ description: 'Document ID' })
  @IsNumber()
  documentId: number;

  @ApiProperty({ description: 'Version number' })
  @IsNumber()
  versionNumber: number;

  @ApiProperty({ description: 'File name', minLength: 1, maxLength: 255 })
  @IsString()
  @Length(1, 255)
  fileName: string;

  @ApiProperty({ description: 'File path', required: false })
  @IsOptional()
  @IsString()
  filePath?: string;

  @ApiProperty({ description: 'File size in bytes', required: false })
  @IsOptional()
  @IsNumber()
  fileSize?: number;

  @ApiProperty({ description: 'MIME type', required: false })
  @IsOptional()
  @IsString()
  mimeType?: string;

  @ApiProperty({ description: 'MD5 hash', required: false })
  @IsOptional()
  @IsString()
  hash?: string;

  @ApiProperty({ description: 'Change description', required: false })
  @IsOptional()
  @IsString()
  changeDescription?: string;

  @ApiProperty({ description: 'Upload date', required: false })
  @IsOptional()
  @IsDateString()
  uploadDate?: Date;

  @ApiProperty({ description: 'Whether this is the current version', required: false })
  @IsOptional()
  isCurrent?: boolean;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class UpdateDocumentVersionDto extends PartialType(CreateDocumentVersionDto) {}