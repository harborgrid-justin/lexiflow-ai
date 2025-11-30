import { IsString, IsOptional, IsNumber, IsDateString, IsEnum, Length } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export enum ConflictStatus {
  PENDING = 'pending',
  CLEARED = 'cleared',
  CONFLICTED = 'conflicted',
  WAIVED = 'waived',
}

export class CreateConflictCheckDto {
  @ApiProperty({ description: 'Client name', minLength: 1, maxLength: 255 })
  @IsString()
  @Length(1, 255)
  clientName: string;

  @ApiProperty({ description: 'Matter description', required: false })
  @IsOptional()
  @IsString()
  matterDescription?: string;

  @ApiProperty({ description: 'Organization ID' })
  @IsNumber()
  organizationId: number;

  @ApiProperty({ description: 'Opposing parties', required: false })
  @IsOptional()
  @IsString()
  opposingParties?: string;

  @ApiProperty({ description: 'Matter type', required: false })
  @IsOptional()
  @IsString()
  matterType?: string;

  @ApiProperty({ 
    description: 'Conflict status', 
    enum: ConflictStatus, 
    default: ConflictStatus.PENDING, 
  })
  @IsOptional()
  @IsEnum(ConflictStatus)
  status?: ConflictStatus;

  @ApiProperty({ description: 'Conflict details', required: false })
  @IsOptional()
  @IsString()
  conflictDetails?: string;

  @ApiProperty({ description: 'Resolution notes', required: false })
  @IsOptional()
  @IsString()
  resolutionNotes?: string;

  @ApiProperty({ description: 'Check date', required: false })
  @IsOptional()
  @IsDateString()
  checkDate?: Date;

  @ApiProperty({ description: 'Resolved date', required: false })
  @IsOptional()
  @IsDateString()
  resolvedDate?: Date;
}

export class UpdateConflictCheckDto extends PartialType(CreateConflictCheckDto) {}