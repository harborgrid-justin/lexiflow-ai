import { IsString, IsNotEmpty, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuditLogEntryDto {
  @ApiProperty({ example: '2024-01-15T10:00:00Z', description: 'Action timestamp' })
  @IsDateString()
  @IsNotEmpty()
  timestamp: string;

  @ApiProperty({ example: 'user-123', description: 'User who performed the action' })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ example: 'CREATE', description: 'Action performed' })
  @IsString()
  @IsNotEmpty()
  action: string;

  @ApiProperty({ example: 'case', description: 'Resource type affected' })
  @IsString()
  @IsNotEmpty()
  resource: string;

  @ApiProperty({ example: 'case-456', description: 'Specific resource ID', required: false })
  @IsString()
  @IsOptional()
  resource_id?: string;

  @ApiProperty({ example: '192.168.1.100', description: 'IP address of user' })
  @IsString()
  @IsNotEmpty()
  ip_address: string;

  @ApiProperty({ example: 'Mozilla/5.0...', description: 'User agent string', required: false })
  @IsString()
  @IsOptional()
  user_agent?: string;

  @ApiProperty({ example: 'Created new case: Smith vs Jones', description: 'Action details', required: false })
  @IsString()
  @IsOptional()
  details?: string;
}