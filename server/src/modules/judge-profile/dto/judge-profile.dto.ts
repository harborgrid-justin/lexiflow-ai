import { IsString, IsOptional, IsArray, Length } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateJudgeProfileDto {
  @ApiProperty({ description: 'Judge name', minLength: 1, maxLength: 255 })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({ description: 'Court name', required: false })
  @IsOptional()
  @IsString()
  court?: string;

  @ApiProperty({ description: 'Jurisdiction', required: false })
  @IsOptional()
  @IsString()
  jurisdiction?: string;

  @ApiProperty({ description: 'Judge specialties', required: false })
  @IsOptional()
  @IsString()
  specialties?: string;

  @ApiProperty({ description: 'Background information', required: false })
  @IsOptional()
  @IsString()
  background?: string;

  @ApiProperty({ description: 'Notable tendencies', required: false })
  @IsOptional()
  @IsString()
  tendencies?: string;

  @ApiProperty({ description: 'Contact information', required: false })
  @IsOptional()
  @IsString()
  contactInfo?: string;

  @ApiProperty({ description: 'Array of decision patterns', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  rulingPatterns?: string[];

  @ApiProperty({ description: 'Preferred case types', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredCaseTypes?: string[];

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class UpdateJudgeProfileDto extends PartialType(CreateJudgeProfileDto) {}