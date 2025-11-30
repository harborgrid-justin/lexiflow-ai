import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsOptional, IsDateString, IsNumber, IsInt, IsString, Min, Max } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiPropertyOptional({ example: '2024-02-12T15:30:00Z', description: 'Completion date' })
  @IsOptional()
  @IsDateString()
  completed_date?: string;

  @ApiPropertyOptional({ example: 3.5, description: 'Actual hours spent' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  actual_hours?: number;

  @ApiPropertyOptional({ example: 75, description: 'Progress percentage' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;

  @ApiPropertyOptional({ example: 'Completed review of sections 1-5', description: 'Task notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
