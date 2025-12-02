import { IsString, IsOptional, IsUUID, IsDateString, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMotionDto {
  @ApiProperty({ example: 'case-123', description: 'Associated case ID' })
  @IsUUID()
  case_id: string;

  @ApiProperty({ example: 'Motion for Summary Judgment', description: 'Motion title' })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Summary Judgment',
    description: 'Type of motion',
    enum: ['Dismiss', 'Summary Judgment', 'Compel Discovery', 'In Limine', 'Continuance', 'Sanctions'],
  })
  @IsString()
  @IsIn(['Dismiss', 'Summary Judgment', 'Compel Discovery', 'In Limine', 'Continuance', 'Sanctions'])
  motion_type: string;

  @ApiPropertyOptional({ example: 'Motion seeking summary judgment on all claims', description: 'Motion description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Draft',
    description: 'Motion status',
    enum: ['Draft', 'Filed', 'Opposition Served', 'Reply Served', 'Hearing Set', 'Submitted', 'Decided'],
  })
  @IsString()
  @IsIn(['Draft', 'Filed', 'Opposition Served', 'Reply Served', 'Hearing Set', 'Submitted', 'Decided'])
  status: string;

  @ApiProperty({ example: 'Plaintiff', description: 'Party filing the motion' })
  @IsString()
  filed_by: string;

  @ApiPropertyOptional({ example: '2024-02-01T00:00:00Z', description: 'Filing date' })
  @IsOptional()
  @IsDateString()
  filed_date?: Date;

  @ApiPropertyOptional({ example: '2024-02-15T00:00:00Z', description: 'Response due date' })
  @IsOptional()
  @IsDateString()
  response_due?: Date;

  @ApiPropertyOptional({ example: '2024-03-01T10:00:00Z', description: 'Hearing date' })
  @IsOptional()
  @IsDateString()
  hearing_date?: Date;

  @ApiPropertyOptional({ example: 'Judge Smith', description: 'Assigned judge' })
  @IsOptional()
  @IsString()
  judge?: string;

  @ApiPropertyOptional({ example: 'Granted', description: 'Motion outcome' })
  @IsOptional()
  @IsString()
  outcome?: string;

  @ApiPropertyOptional({ example: '/documents/motion-summary-judgment.pdf', description: 'Motion document path' })
  @IsOptional()
  @IsString()
  document_path?: string;

  @ApiPropertyOptional({ example: 'Motion granted with prejudice', description: 'Court notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
