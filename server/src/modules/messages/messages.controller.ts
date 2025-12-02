import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message, Conversation } from '../../models/message.model';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @ApiOperation({ summary: 'Alias for GET /messages/conversations' })
  @ApiQuery({ name: 'caseId', required: false, description: 'Filter by case ID' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiResponse({ status: 200, description: 'Conversations retrieved successfully', type: [Conversation] })
  findAll(@Query('caseId') caseId?: string, @Query('userId') userId?: string): Promise<Conversation[]> {
    return this.messagesService.findAllConversations(caseId, userId);
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations' })
  @ApiQuery({ name: 'caseId', required: false, description: 'Filter by case ID' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiResponse({ status: 200, description: 'Conversations retrieved successfully', type: [Conversation] })
  findConversations(@Query('caseId') caseId?: string, @Query('userId') userId?: string): Promise<Conversation[]> {
    return this.messagesService.findAllConversations(caseId, userId);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get conversation by ID' })
  @ApiResponse({ status: 200, description: 'Conversation retrieved successfully', type: Conversation })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  findConversation(@Param('id') id: string): Promise<Conversation> {
    return this.messagesService.findConversation(id);
  }

  @Post('conversations')
  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiResponse({ status: 201, description: 'Conversation created successfully', type: Conversation })
  createConversation(@Body() createDto: CreateConversationDto): Promise<Conversation> {
    return this.messagesService.createConversation(createDto);
  }

  @Patch('conversations/:id')
  @ApiOperation({ summary: 'Update conversation' })
  @ApiResponse({ status: 200, description: 'Conversation updated successfully', type: Conversation })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  updateConversation(
    @Param('id') id: string,
    @Body() updateDto: UpdateConversationDto,
  ): Promise<Conversation> {
    return this.messagesService.updateConversation(id, updateDto);
  }

  @Get('conversations/:id/messages')
  @ApiOperation({ summary: 'Get messages in a conversation' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully', type: [Message] })
  findMessages(@Param('id') conversationId: string): Promise<Message[]> {
    return this.messagesService.findMessages(conversationId);
  }

  @Post(':conversationId/send')
  @ApiOperation({ summary: 'Send a message to a conversation' })
  @ApiResponse({ status: 201, description: 'Message sent successfully', type: Message })
  sendMessage(
    @Param('conversationId') conversationId: string,
    @Body() createDto: CreateMessageDto,
  ): Promise<Message> {
    return this.messagesService.sendMessage(conversationId, createDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get message by ID' })
  @ApiResponse({ status: 200, description: 'Message retrieved successfully', type: Message })
  @ApiResponse({ status: 404, description: 'Message not found' })
  findMessage(@Param('id') id: string): Promise<Message> {
    return this.messagesService.findMessage(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new message' })
  @ApiResponse({ status: 201, description: 'Message created successfully', type: Message })
  createMessage(@Body() createDto: CreateMessageDto): Promise<Message> {
    return this.messagesService.createMessage(createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update message' })
  @ApiResponse({ status: 200, description: 'Message updated successfully', type: Message })
  @ApiResponse({ status: 404, description: 'Message not found' })
  updateMessage(
    @Param('id') id: string,
    @Body() updateDto: UpdateMessageDto,
  ): Promise<Message> {
    return this.messagesService.updateMessage(id, updateDto);
  }

  // ==================== REAL-TIME ENDPOINTS ====================

  @Post('users/:userId/online')
  @ApiOperation({ summary: 'Set user online status' })
  @ApiResponse({ status: 200, description: 'User status set to online' })
  async setUserOnline(@Param('userId') userId: string): Promise<{ success: boolean }> {
    await this.messagesService.setUserOnline(userId);
    return { success: true };
  }

  @Post('users/:userId/offline')
  @ApiOperation({ summary: 'Set user offline status' })
  @ApiResponse({ status: 200, description: 'User status set to offline' })
  async setUserOffline(@Param('userId') userId: string): Promise<{ success: boolean }> {
    await this.messagesService.setUserOffline(userId);
    return { success: true };
  }

  @Get('users/online')
  @ApiOperation({ summary: 'Get list of online users' })
  @ApiResponse({ status: 200, description: 'Online users retrieved successfully' })
  async getOnlineUsers(): Promise<{ users: string[] }> {
    const users = await this.messagesService.getOnlineUsers();
    return { users };
  }

  @Get('users/:userId/online-status')
  @ApiOperation({ summary: 'Check if user is online' })
  @ApiResponse({ status: 200, description: 'User online status retrieved' })
  async isUserOnline(@Param('userId') userId: string): Promise<{ online: boolean }> {
    const online = await this.messagesService.isUserOnline(userId);
    return { online };
  }

  @Post('conversations/:id/typing')
  @ApiOperation({ summary: 'Set typing indicator' })
  @ApiResponse({ status: 200, description: 'Typing indicator set' })
  async setTyping(
    @Param('id') conversationId: string,
    @Body() body: { userId: string; isTyping: boolean },
  ): Promise<{ success: boolean }> {
    await this.messagesService.setTyping(conversationId, body.userId, body.isTyping);
    return { success: true };
  }

  @Get('conversations/:id/typing')
  @ApiOperation({ summary: 'Get users typing in conversation' })
  @ApiResponse({ status: 200, description: 'Typing users retrieved' })
  async getTypingUsers(@Param('id') conversationId: string): Promise<{ users: string[] }> {
    const users = await this.messagesService.getTypingUsers(conversationId);
    return { users };
  }

  @Post('messages/:id/read')
  @ApiOperation({ summary: 'Mark message as read' })
  @ApiResponse({ status: 200, description: 'Message marked as read' })
  async markMessageAsRead(
    @Param('id') messageId: string,
    @Body() body: { userId: string },
  ): Promise<{ success: boolean }> {
    await this.messagesService.markMessageAsRead(messageId, body.userId);
    return { success: true };
  }

  @Get('users/:userId/unread-count')
  @ApiOperation({ summary: 'Get unread message count for user' })
  @ApiResponse({ status: 200, description: 'Unread count retrieved' })
  async getUnreadCount(@Param('userId') userId: string): Promise<{ count: number }> {
    const count = await this.messagesService.getUnreadCount(userId);
    return { count };
  }

  @Post('conversations/:id/system-message')
  @ApiOperation({ summary: 'Send system message to conversation' })
  @ApiResponse({ status: 200, description: 'System message sent' })
  async sendSystemMessage(
    @Param('id') conversationId: string,
    @Body() body: { content: string },
  ): Promise<{ success: boolean }> {
    await this.messagesService.sendSystemMessage(conversationId, body.content);
    return { success: true };
  }
}