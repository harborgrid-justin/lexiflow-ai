import { IsString, IsOptional, IsUUID, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDocumentVersionDto {
  @ApiProperty({
    example: 'doc-123',
    description: 'Parent document ID',
  })
  @IsUUID()
  document_id: string;

  @ApiProperty({
    example: 'user-456',
    description: 'User who uploaded this version',
  })
  @IsUUID()
  uploaded_by: string;

  @ApiPropertyOptional({
    example: 'Added new clauses section',
    description: 'Version summary/change description',
  })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({
    example: 'This version contains the full text...',
    description: 'Content snapshot of this version',
  })
  @IsOptional()
  @IsString()
  content_snapshot?: string;

  @ApiPropertyOptional({
    example: '/storage/versions/doc-456-v1.pdf',
    description: 'File path for this version',
  })
  @IsOptional()
  @IsString()
  file_path?: string;

  @ApiPropertyOptional({
    example: 1024000,
    description: 'File size in bytes',
  })
  @IsOptional()
  @IsNumber()
  file_size?: number;
}
