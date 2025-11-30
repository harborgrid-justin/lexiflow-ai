import { IsString, IsOptional, IsEmail, Length } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateOpposingCounselProfileDto {
  @ApiProperty({ description: 'Lawyer name', minLength: 1, maxLength: 255 })
  @IsString()
  @Length(1, 255)
  name: string;

  @ApiProperty({ description: 'Email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Firm name', required: false })
  @IsOptional()
  @IsString()
  firmName?: string;

  @ApiProperty({ description: 'Office address', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ description: 'Bar number', required: false })
  @IsOptional()
  @IsString()
  barNumber?: string;

  @ApiProperty({ description: 'Jurisdiction', required: false })
  @IsOptional()
  @IsString()
  jurisdiction?: string;

  @ApiProperty({ description: 'Specialties', required: false })
  @IsOptional()
  @IsString()
  specialties?: string;

  @ApiProperty({ description: 'Practice areas', required: false })
  @IsOptional()
  @IsString()
  practiceAreas?: string;

  @ApiProperty({ description: 'Negotiation style', required: false })
  @IsOptional()
  @IsString()
  negotiationStyle?: string;

  @ApiProperty({ description: 'Communication preferences', required: false })
  @IsOptional()
  @IsString()
  communicationPrefs?: string;

  @ApiProperty({ description: 'Professional reputation', required: false })
  @IsOptional()
  @IsString()
  reputation?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class UpdateOpposingCounselProfileDto extends PartialType(CreateOpposingCounselProfileDto) {}