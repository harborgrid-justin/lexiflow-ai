import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message, Conversation } from '../../models/message.model';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message)
    private messageModel: typeof Message,
    @InjectModel(Conversation)
    private conversationModel: typeof Conversation,
    private redisService: RedisService,
  ) {}

  async findAllConversations(caseId?: string, userId?: string): Promise<Conversation[]> {
    const whereClause: any = {};
    if (caseId) {whereClause.case_id = caseId;}
    if (userId) {whereClause.created_by = userId;}

    return this.conversationModel.findAll({
      where: whereClause,
      include: ['case', 'creator'],
      order: [['last_message_at', 'DESC']],
    });
  }

  async findConversation(id: string): Promise<Conversation> {
    const conversation = await this.conversationModel.findByPk(id, {
      include: ['case', 'creator', 'messages'],
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    return conversation;
  }

  async createConversation(createDto: CreateConversationDto): Promise<Conversation> {
    const conversation = await this.conversationModel.create({
      ...createDto,
      status: createDto.status || 'active',
    });

    return this.findConversation(conversation.id);
  }

  async updateConversation(id: string, updateDto: UpdateConversationDto): Promise<Conversation> {
    const conversation = await this.findConversation(id);
    await conversation.update(updateDto);
    return this.findConversation(id);
  }

  async findMessages(conversationId: string): Promise<Message[]> {
    // Try to get from Redis cache first
    const cachedMessages = await this.redisService.getConversationMessages(conversationId, 100);

    if (cachedMessages && cachedMessages.length > 0) {
      return cachedMessages;
    }

    // Otherwise fetch from database and cache
    const messages = await this.messageModel.findAll({
      where: { conversation_id: conversationId },
      include: ['sender', 'conversation'],
      order: [['created_at', 'ASC']],
    });

    // Cache the messages in Redis
    for (const msg of messages) {
      await this.redisService.addMessageToConversation(conversationId, {
        id: msg.id,
        content: msg.content,
        sender_id: msg.sender_id,
        created_at: msg.created_at,
      });
    }

    return messages;
  }

  async findMessage(id: string): Promise<Message> {
    const message = await this.messageModel.findByPk(id, {
      include: ['sender', 'conversation'],
    });

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return message;
  }

  async sendMessage(conversationId: string, createDto: CreateMessageDto): Promise<Message> {
    return this.createMessage({
      ...createDto,
      conversation_id: conversationId,
    });
  }

  async createMessage(createDto: CreateMessageDto): Promise<Message> {
    // Save to database
    const message = await this.messageModel.create({
      ...createDto,
      message_type: createDto.message_type || 'text',
      status: createDto.status || 'sent',
    });
    
    // Cache in Redis for real-time access
    if (message.conversation_id) {
      await this.redisService.addMessageToConversation(
        message.conversation_id,
        {
          id: message.id,
          content: message.content,
          sender_id: message.sender_id,
          created_at: message.created_at,
        },
      );
      
      // Publish real-time event
      await this.redisService.publish(
        `conversation:${message.conversation_id}`,
        JSON.stringify({
          event: 'new_message',
          message: {
            id: message.id,
            content: message.content,
            sender_id: message.sender_id,
            created_at: message.created_at,
          },
        }),
      );
    }
    
    // Update last message timestamp
    await this.conversationModel.update(
      { last_message_at: new Date() },
      { where: { id: message.conversation_id } },
    );

    return this.findMessage(message.id);
  }

  async updateMessage(id: string, updateDto: UpdateMessageDto): Promise<Message> {
    const message = await this.findMessage(id);
    await message.update(updateDto);
    return this.findMessage(id);
  }

  // ==================== REAL-TIME FEATURES ====================

  /**
   * Set user online status
   */
  async setUserOnline(userId: string): Promise<void> {
    await this.redisService.setUserOnline(userId);
  }

  /**
   * Set user offline status
   */
  async setUserOffline(userId: string): Promise<void> {
    await this.redisService.setUserOffline(userId);
  }

  /**
   * Get list of online users
   */
  async getOnlineUsers(): Promise<string[]> {
    return this.redisService.getOnlineUsers();
  }

  /**
   * Check if a user is online
   */
  async isUserOnline(userId: string): Promise<boolean> {
    return this.redisService.isUserOnline(userId);
  }

  /**
   * Set typing indicator for a user in a conversation
   */
  async setTyping(conversationId: string, userId: string, isTyping: boolean): Promise<void> {
    await this.redisService.setTypingIndicator(conversationId, userId, isTyping);
    
    // Publish typing event
    await this.redisService.publish(
      `conversation:${conversationId}`,
      JSON.stringify({
        event: 'typing',
        userId,
        isTyping,
      }),
    );
  }

  /**
   * Get users currently typing in a conversation
   */
  async getTypingUsers(conversationId: string): Promise<string[]> {
    return this.redisService.getTypingUsers(conversationId);
  }

  /**
   * Subscribe to conversation events
   */
  async subscribeToConversation(
    conversationId: string,
    callback: (event: any) => void,
  ): Promise<void> {
    await this.redisService.subscribe(
      `conversation:${conversationId}`,
      (message) => {
        try {
          const event = JSON.parse(message);
          callback(event);
        } catch (error) {
          console.error('Error parsing conversation event:', error);
        }
      },
    );
  }

  /**
   * Mark message as read
   */
  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    const message = await this.messageModel.findByPk(messageId);
    
    if (message && message.conversation_id) {
      await message.update({ status: 'read' });
      
      // Publish read receipt event
      await this.redisService.publish(
        `conversation:${message.conversation_id}`,
        JSON.stringify({
          event: 'message_read',
          messageId,
          userId,
        }),
      );
    }
  }

  /**
   * Get unread message count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    const count = await this.messageModel.count({
      where: {
        status: { $ne: 'read' },
      },
      include: [
        {
          model: Conversation,
          where: {
            created_by: userId,
          },
        },
      ],
    });
    
    return count;
  }

  /**
   * Publish a system message to a conversation
   */
  async sendSystemMessage(conversationId: string, content: string): Promise<void> {
    await this.redisService.publish(
      `conversation:${conversationId}`,
      JSON.stringify({
        event: 'system_message',
        content,
        timestamp: new Date().toISOString(),
      }),
    );
  }
}