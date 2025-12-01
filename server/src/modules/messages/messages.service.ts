import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message, Conversation } from '../../models/message.model';
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

  async createConversation(createConversationData: Partial<Conversation>): Promise<Conversation> {
    return this.conversationModel.create(createConversationData);
  }

  async createMessage(createMessageData: Partial<Message>): Promise<Message> {
    // Save to database
    const message = await this.messageModel.create(createMessageData);
    
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
    
    return message;
  }

  async findConversations(caseId?: string, userId?: string): Promise<Conversation[]> {
    const whereClause: Record<string, string> = {};
    if (caseId) {whereClause.case_id = caseId;}
    if (userId) {whereClause.created_by = userId;}

    return this.conversationModel.findAll({
      where: whereClause,
    });
  }

  async findMessages(conversationId: string): Promise<Message[]> {
    // Try to get from Redis cache first
    const cachedMessages = await this.redisService.getConversationMessages(conversationId, 100);
    
    if (cachedMessages && cachedMessages.length > 0) {
      // Return cached messages if available
      return cachedMessages;
    }
    
    // Otherwise fetch from database and cache
    const messages = await this.messageModel.findAll({
      where: { conversation_id: conversationId },
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

  async findConversation(id: string): Promise<Conversation> {
    const conversation = await this.conversationModel.findByPk(id);

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    return conversation;
  }

  async findMessage(id: string): Promise<Message> {
    const message = await this.messageModel.findByPk(id);

    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return message;
  }

  async updateConversation(id: string, updateData: Partial<Conversation>): Promise<Conversation> {
    const [affectedCount, affectedRows] = await this.conversationModel.update(
      updateData,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    return affectedRows[0];
  }

  async updateMessage(id: string, updateData: Partial<Message>): Promise<Message> {
    const [affectedCount, affectedRows] = await this.messageModel.update(
      updateData,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }

    return affectedRows[0];
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