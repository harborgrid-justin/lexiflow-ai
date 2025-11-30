import { PartialType } from '@nestjs/swagger';
import { CreateDocumentDto } from './create-document.dto';
import { IsOptional, IsNumber, IsString, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @ApiPropertyOptional({ example: 2, description: 'Version number' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  version?: number;

  @ApiPropertyOptional({ example: 'Updated terms in section 5', description: 'Version notes' })
  @IsOptional()
  @IsString()
  version_notes?: string;
}
