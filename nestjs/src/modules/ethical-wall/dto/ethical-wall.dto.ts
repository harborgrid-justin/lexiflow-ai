import { IsString, IsOptional, IsNumber, IsArray, IsBoolean, Length } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateEthicalWallDto {
  @ApiProperty({ description: 'Name of the ethical wall', minLength: 1, maxLength: 255 })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({ description: 'Organization ID' })
  @IsNumber()
  organizationId: number;

  @ApiProperty({ description: 'Reason for the ethical wall', required: false })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ description: 'Description of the ethical wall', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Array of affected user IDs', required: false })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  affectedUsers?: number[];

  @ApiProperty({ description: 'Array of affected case IDs', required: false })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  affectedCases?: number[];

  @ApiProperty({ description: 'Array of restricted access areas', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  restrictions?: string[];

  @ApiProperty({ description: 'Whether the ethical wall is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Additional settings as JSON', required: false })
  @IsOptional()
  settings?: Record<string, unknown>;
}

export class UpdateEthicalWallDto extends PartialType(CreateEthicalWallDto) {}