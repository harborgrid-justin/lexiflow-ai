import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateCalendarEventDto {
  @ApiProperty({ example: 'Case Smith vs Jones - Hearing', description: 'Event title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'hearing', description: 'Event type (deadline, hearing, statute-of-limitations, team)' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ example: 'Motion hearing for preliminary injunction', description: 'Event description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2024-02-15T14:00:00Z', description: 'Event start time' })
  @IsNotEmpty()
  @IsDateString()
  start_time: string;

  @ApiProperty({ example: '2024-02-15T16:00:00Z', description: 'Event end time' })
  @IsNotEmpty()
  @IsDateString()
  end_time: string;

  @ApiProperty({ example: 'US District Court, Room 201', description: 'Event location', required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ example: 'scheduled', description: 'Event status', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 'high', description: 'Event priority', required: false })
  @IsOptional()
  @IsString()
  priority?: string;

  @ApiProperty({ example: false, description: 'All-day event flag', required: false })
  @IsOptional()
  @IsBoolean()
  all_day?: boolean;

  @ApiProperty({ example: '30m', description: 'Reminder time before event', required: false })
  @IsOptional()
  @IsString()
  reminder?: string;

  @ApiProperty({ example: 'Hon. Jane Smith presiding', description: 'Event notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ example: 'case-123', description: 'Associated case ID', required: false })
  @IsOptional()
  @IsUUID()
  case_id?: string;

  @ApiProperty({ example: 'user-123', description: 'Event organizer ID', required: false })
  @IsOptional()
  @IsUUID()
  organizer_id?: string;

  @ApiProperty({ example: 'org-123', description: 'Owner organization ID', required: false })
  @IsOptional()
  @IsUUID()
  owner_org_id?: string;
}
