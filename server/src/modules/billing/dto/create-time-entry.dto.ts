import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateTimeEntryDto {
  @ApiProperty({ example: 'case-123', description: 'Associated case ID' })
  @IsNotEmpty()
  @IsUUID()
  case_id: string;

  @ApiProperty({ example: 'user-123', description: 'User who logged time' })
  @IsNotEmpty()
  @IsUUID()
  user_id: string;

  @ApiProperty({ example: '2024-01-15', description: 'Date of work' })
  @IsNotEmpty()
  @IsString()
  date: string;

  @ApiProperty({ example: 3.5, description: 'Hours worked' })
  @IsNotEmpty()
  @IsNumber()
  hours: number;

  @ApiProperty({ example: 'Document review and analysis', description: 'Description of work performed' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 'billable', description: 'Entry type', required: false })
  @IsOptional()
  @IsString()
  entry_type?: string;

  @ApiProperty({ example: 350.00, description: 'Billable rate per hour', required: false })
  @IsOptional()
  @IsNumber()
  rate?: number;

  @ApiProperty({ example: 'draft', description: 'Entry status', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: '2024-01-15T09:00:00Z', description: 'Start time', required: false })
  @IsOptional()
  @IsDateString()
  start_time?: string;

  @ApiProperty({ example: '2024-01-15T12:30:00Z', description: 'End time', required: false })
  @IsOptional()
  @IsDateString()
  end_time?: string;

  @ApiProperty({ example: 'INV-001', description: 'Invoice ID if billed', required: false })
  @IsOptional()
  @IsString()
  invoice_id?: string;
}
