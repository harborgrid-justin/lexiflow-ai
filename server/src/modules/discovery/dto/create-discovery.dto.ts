import { IsString, IsOptional, IsUUID, IsDateString, IsNumber, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDiscoveryDto {
  @ApiProperty({ example: 'case-123', description: 'Associated case ID' })
  @IsUUID()
  case_id: string;

  @ApiProperty({
    example: 'Production',
    description: 'Type of discovery request',
    enum: ['Production', 'Interrogatory', 'Admission', 'Deposition', 'document_request']
  })
  @IsString()
  @IsIn(['Production', 'Interrogatory', 'Admission', 'Deposition', 'document_request'])
  discovery_type: string;

  @ApiProperty({ example: 'Request for Production of Documents #1', description: 'Discovery title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Request for all communications between parties', description: 'Discovery description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Draft',
    description: 'Discovery status',
    enum: ['Draft', 'Served', 'Responded', 'Overdue', 'Closed']
  })
  @IsString()
  @IsIn(['Draft', 'Served', 'Responded', 'Overdue', 'Closed'])
  status: string;

  @ApiPropertyOptional({ example: '2024-01-15T00:00:00Z', description: 'Date served' })
  @IsOptional()
  @IsDateString()
  served_date?: Date;

  @ApiPropertyOptional({ example: '2024-02-15T00:00:00Z', description: 'Response due date' })
  @IsOptional()
  @IsDateString()
  due_date?: Date;

  @ApiPropertyOptional({ example: '2024-02-10T00:00:00Z', description: 'Response received date' })
  @IsOptional()
  @IsDateString()
  response_date?: Date;

  @ApiProperty({ example: 'Plaintiff', description: 'Propounding party' })
  @IsString()
  propounding_party: string;

  @ApiProperty({ example: 'Defendant', description: 'Responding party' })
  @IsString()
  responding_party: string;

  @ApiPropertyOptional({ example: 25, description: 'Number of requests' })
  @IsOptional()
  @IsNumber()
  request_count?: number;

  @ApiPropertyOptional({ example: 'Partial response received', description: 'Response summary' })
  @IsOptional()
  @IsString()
  response_summary?: string;

  @ApiPropertyOptional({ example: 'Follow up required on items 5-10', description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
