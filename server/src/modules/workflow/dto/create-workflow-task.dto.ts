import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export enum WorkflowTaskStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  DONE = 'Done',
  BLOCKED = 'Blocked',
  CANCELLED = 'Cancelled',
}

export enum WorkflowTaskPriority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  URGENT = 'Urgent',
}

export class CreateWorkflowTaskDto {
  @ApiProperty({
    example: 'stage-123',
    description: 'Workflow stage ID',
  })
  @IsUUID()
  stage_id: string;

  @ApiProperty({
    example: 'Review discovery documents',
    description: 'Task title',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'document_review',
    description: 'Task type',
  })
  @IsString()
  type: string;

  @ApiPropertyOptional({
    example: 'Review all discovery documents from opposing counsel',
    description: 'Task description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'Pending',
    description: 'Task status',
    enum: WorkflowTaskStatus,
    default: WorkflowTaskStatus.PENDING,
  })
  @IsEnum(WorkflowTaskStatus)
  status: WorkflowTaskStatus;

  @ApiProperty({
    example: 'High',
    description: 'Task priority',
    enum: WorkflowTaskPriority,
    default: WorkflowTaskPriority.MEDIUM,
  })
  @IsEnum(WorkflowTaskPriority)
  priority: WorkflowTaskPriority;

  @ApiPropertyOptional({
    example: '2024-01-20T00:00:00Z',
    description: 'Task due date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  due_date?: Date;

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
    example: ['task-456', 'task-789'],
    description: 'Array of task IDs this task depends on',
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  depends_on?: string[];

  @ApiPropertyOptional({
    example: 'case-123',
    description: 'Associated case ID',
  })
  @IsOptional()
  @IsUUID()
  case_id?: string;

  @ApiPropertyOptional({
    example: 'Additional task notes',
    description: 'Task notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    example: 'user-456',
    description: 'User who created this task',
  })
  @IsOptional()
  @IsUUID()
  created_by?: string;
}
