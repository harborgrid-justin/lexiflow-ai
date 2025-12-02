import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID, IsArray } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ example: 'Case Discussion - Smith v. Jones', description: 'Conversation title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'case', description: 'Type of conversation' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ example: 'case-123', description: 'Related case ID', required: false })
  @IsOptional()
  @IsUUID()
  case_id?: string;

  @ApiProperty({ example: 'user-123', description: 'Conversation creator ID' })
  @IsNotEmpty()
  @IsUUID()
  created_by: string;

  @ApiProperty({ example: ['user-123', 'user-456'], description: 'List of participant user IDs' })
  @IsNotEmpty()
  @IsArray()
  participants: string[];

  @ApiProperty({ example: 'active', description: 'Conversation status', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
