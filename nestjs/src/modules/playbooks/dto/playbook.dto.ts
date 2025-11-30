import { IsString, IsOptional, IsNumber, IsArray, IsBoolean, Length } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreatePlaybookDto {
  @ApiProperty({ description: 'Playbook title', minLength: 1, maxLength: 255 })
  @IsString()
  @Length(1, 255)
  title: string;

  @ApiProperty({ description: 'Organization ID' })
  @IsNumber()
  organizationId: number;

  @ApiProperty({ description: 'Playbook description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Playbook category', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: 'Playbook content in JSON format', required: false })
  @IsOptional()
  content?: Record<string, unknown>;

  @ApiProperty({ description: 'Array of steps or procedures', required: false })
  @IsOptional()
  @IsArray()
  steps?: Array<Record<string, unknown>>;

  @ApiProperty({ description: 'Array of tags for categorization', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: 'Required permissions to access', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissions?: string[];

  @ApiProperty({ description: 'Metadata for the playbook', required: false })
  @IsOptional()
  metadata?: Record<string, unknown>;

  @ApiProperty({ description: 'Whether the playbook is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Whether the playbook is public', default: false })
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  @ApiProperty({ description: 'Version number', required: false })
  @IsOptional()
  @IsString()
  version?: string;
}

export class UpdatePlaybookDto extends PartialType(CreatePlaybookDto) {}