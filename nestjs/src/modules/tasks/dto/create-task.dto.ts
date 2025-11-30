import { IsString, IsOptional, IsUUID, IsDateString, IsNumber, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Review contract provisions', description: 'Task title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'document_review', description: 'Task type' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: 'Review all licensing clauses', description: 'Task description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'pending', description: 'Task status' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'high', description: 'Task priority' })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiPropertyOptional({ example: '2024-02-15T17:00:00Z', description: 'Due date' })
  @IsOptional()
  @IsDateString()
  due_date?: string;

  @ApiPropertyOptional({ example: '2024-02-10T09:00:00Z', description: 'Start date' })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ example: 4, description: 'Estimated hours' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimated_hours?: number;

  @ApiPropertyOptional({ example: 'case-123', description: 'Associated case ID' })
  @IsOptional()
  @IsUUID()
  case_id?: string;

  @ApiPropertyOptional({ example: 'user-123', description: 'Assignee user ID' })
  @IsOptional()
  @IsUUID()
  assignee_id?: string;
}
