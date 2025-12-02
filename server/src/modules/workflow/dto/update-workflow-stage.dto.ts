import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsDate,
  IsBoolean,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WorkflowStageStatus } from './create-workflow-stage.dto';

export class UpdateWorkflowStageDto {
  @ApiPropertyOptional({
    example: 'Discovery',
    description: 'Stage name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Document discovery and depositions',
    description: 'Stage description',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'discovery',
    description: 'Stage type (e.g., discovery, pleading, trial)',
  })
  @IsOptional()
  @IsString()
  stage_type?: string;

  @ApiPropertyOptional({
    example: 'Active',
    description: 'Stage status',
    enum: WorkflowStageStatus,
  })
  @IsOptional()
  @IsEnum(WorkflowStageStatus)
  status?: WorkflowStageStatus;

  @ApiPropertyOptional({
    example: 1,
    description: 'Stage order/sequence number',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  order_index?: number;

  @ApiPropertyOptional({
    example: '2024-01-15T00:00:00Z',
    description: 'Stage start date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  start_date?: Date;

  @ApiPropertyOptional({
    example: '2024-03-15T00:00:00Z',
    description: 'Expected completion date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expected_completion?: Date;

  @ApiPropertyOptional({
    example: '2024-03-10T00:00:00Z',
    description: 'Actual completion date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completed_date?: Date;

  @ApiPropertyOptional({
    example: 75,
    description: 'Completion progress (0-100)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({
    example: 'Additional notes about the stage',
    description: 'Stage notes',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether this stage is a milestone',
  })
  @IsOptional()
  @IsBoolean()
  is_milestone?: boolean;

  @ApiPropertyOptional({
    example: 'stage-456',
    description: 'ID of the predecessor stage',
  })
  @IsOptional()
  @IsUUID()
  predecessor_stage_id?: string;

  @ApiPropertyOptional({
    example: 'user-123',
    description: 'Assigned user ID',
  })
  @IsOptional()
  @IsUUID()
  assigned_to?: string;
}
