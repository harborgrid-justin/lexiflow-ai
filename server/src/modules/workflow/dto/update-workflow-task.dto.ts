import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDate,
  IsUUID,
  IsArray,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WorkflowTaskStatus, WorkflowTaskPriority } from './create-workflow-task.dto';

export class UpdateWorkflowTaskDto {
  @ApiPropertyOptional({
    example: 'Review discovery documents',
    description: 'Task title',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: 'document_review',
    description: 'Task type',
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({
    example: 'Review all discovery documents from opposing counsel',
    description: 'Task description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'In Progress',
    description: 'Task status',
    enum: WorkflowTaskStatus,
  })
  @IsOptional()
  @IsEnum(WorkflowTaskStatus)
  status?: WorkflowTaskStatus;

  @ApiPropertyOptional({
    example: 'High',
    description: 'Task priority',
    enum: WorkflowTaskPriority,
  })
  @IsOptional()
  @IsEnum(WorkflowTaskPriority)
  priority?: WorkflowTaskPriority;

  @ApiPropertyOptional({
    example: '2024-01-20T00:00:00Z',
    description: 'Task due date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  due_date?: Date;

  @ApiPropertyOptional({
    example: '2024-01-19T00:00:00Z',
    description: 'Task completion date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completed_date?: Date;

  @ApiPropertyOptional({
    example: 'user-123',
    description: 'Assigned user ID',
  })
  @IsOptional()
  @IsUUID()
  assignee_id?: string;

  @ApiPropertyOptional({
    example: 4.5,
    description: 'Estimated hours to complete',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  estimated_hours?: number;

  @ApiPropertyOptional({
    example: 3.8,
    description: 'Actual hours spent',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  actual_hours?: number;

  @ApiPropertyOptional({
    example: ['task-456', 'task-789'],
    description: 'Array of task IDs this task depends on',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  depends_on?: string[];

  @ApiPropertyOptional({
    example: 'Additional task notes',
    description: 'Task notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    example: 'stage-789',
    description: 'Workflow stage ID',
  })
  @IsOptional()
  @IsUUID()
  stage_id?: string;
}
