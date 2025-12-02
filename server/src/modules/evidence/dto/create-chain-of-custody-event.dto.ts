import { IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChainOfCustodyEventDto {
  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Event date and time' })
  @IsDateString()
  event_date: Date;

  @ApiProperty({ example: 'Collected from Client', description: 'Action performed' })
  @IsString()
  action: string;

  @ApiProperty({ example: 'Alexandra H.', description: 'Person who performed the action' })
  @IsString()
  actor: string;

  @ApiPropertyOptional({ example: 'Evidence sealed and tagged', description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'Office location', description: 'Where the action took place' })
  @IsOptional()
  @IsString()
  location?: string;
}
