import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsUUID, IsArray } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'conv-123', description: 'Conversation ID' })
  @IsNotEmpty()
  @IsUUID()
  conversation_id: string;

  @ApiProperty({ example: 'user-123', description: 'Message sender ID' })
  @IsNotEmpty()
  @IsUUID()
  sender_id: string;

  @ApiProperty({ example: 'Hello, can we discuss the Smith case?', description: 'Message content' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ example: 'text', description: 'Message type', required: false })
  @IsOptional()
  @IsString()
  message_type?: string;

  @ApiProperty({ example: ['doc-123'], description: 'Attached document IDs', required: false })
  @IsOptional()
  @IsArray()
  attachments?: string[];

  @ApiProperty({ example: 'sent', description: 'Message status', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
