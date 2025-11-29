import { IsString, IsOptional, IsUUID, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserProfileDto {
  @ApiProperty({ example: 'user-123', description: 'Associated user ID' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ example: 'Experienced corporate attorney with 10+ years...', description: 'User bio', required: false })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: '+1-555-0123', description: 'Phone number', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Contract Law,M&A,Corporate Governance', description: 'Skills (comma-separated)', required: false })
  @IsString()
  @IsOptional()
  skills?: string;

  @ApiProperty({ example: true, description: 'Email notifications enabled', required: false })
  @IsBoolean()
  @IsOptional()
  notifications_email?: boolean;

  @ApiProperty({ example: true, description: 'Push notifications enabled', required: false })
  @IsBoolean()
  @IsOptional()
  notifications_push?: boolean;

  @ApiProperty({ example: 'daily', description: 'Digest frequency', required: false })
  @IsString()
  @IsOptional()
  notifications_digest?: string;

  @ApiProperty({ example: 'system', description: 'Theme preference', required: false })
  @IsString()
  @IsOptional()
  theme_preference?: string;
}