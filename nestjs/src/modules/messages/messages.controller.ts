import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { Message, Conversation } from '../../models/message.model';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('conversations')
  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiResponse({ status: 201, description: 'Conversation created successfully', type: Conversation })
  createConversation(@Body() createConversationData: Partial<Conversation>): Promise<Conversation> {
    return this.messagesService.createConversation(createConversationData);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({ status: 201, description: 'Message created successfully', type: Message })
  createMessage(@Body() createMessageData: Partial<Message>): Promise<Message> {
    return this.messagesService.createMessage(createMessageData);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations' })
  @ApiQuery({ name: 'caseId', required: false, description: 'Case ID filter' })
  @ApiQuery({ name: 'userId', required: false, description: 'User ID filter' })
  @ApiResponse({ status: 200, description: 'Conversations retrieved successfully', type: [Conversation] })
  findConversations(@Query('caseId') caseId?: string, @Query('userId') userId?: string): Promise<Conversation[]> {
    return this.messagesService.findConversations(caseId, userId);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation by ID' })
  @ApiResponse({ status: 200, description: 'Conversation retrieved successfully', type: Conversation })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  findConversation(@Param('id') id: string): Promise<Conversation> {
    return this.messagesService.findConversation(id);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully', type: [Message] })
  findMessages(@Param('id') conversationId: string): Promise<Message[]> {
    return this.messagesService.findMessages(conversationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get message by ID' })
  @ApiResponse({ status: 200, description: 'Message retrieved successfully', type: Message })
  @ApiResponse({ status: 404, description: 'Message not found' })
  findMessage(@Param('id') id: string): Promise<Message> {
    return this.messagesService.findMessage(id);
  }

  @Patch('conversations/:id')
  @ApiOperation({ summary: 'Update conversation' })
  @ApiResponse({ status: 200, description: 'Conversation updated successfully', type: Conversation })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  updateConversation(
    @Param('id') id: string,
    @Body() updateData: Partial<Conversation>,
  ): Promise<Conversation> {
    return this.messagesService.updateConversation(id, updateData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update message' })
  @ApiResponse({ status: 200, description: 'Message updated successfully', type: Message })
  @ApiResponse({ status: 404, description: 'Message not found' })
  updateMessage(
    @Param('id') id: string,
    @Body() updateData: Partial<Message>,
  ): Promise<Message> {
    return this.messagesService.updateMessage(id, updateData);
  }
}