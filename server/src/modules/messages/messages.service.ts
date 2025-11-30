import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message, Conversation } from '../../models/message.model';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message)
    private messageModel: typeof Message,
    @InjectModel(Conversation)
    private conversationModel: typeof Conversation,
  ) {}

  async createConversation(createConversationData: Partial<Conversation>): Promise<Conversation> {
    return this.conversationModel.create(createConversationData);
  }

  async createMessage(createMessageData: Partial<Message>): Promise<Message> {
    return this.messageModel.create(createMessageData);
  }

  async findConversations(caseId?: string, userId?: string): Promise<Conversation[]> {
    const whereClause: Record<string, string> = {};
    if (caseId) {whereClause.case_id = caseId;}
    if (userId) {whereClause.created_by = userId;}

    return this.conversationModel.findAll({
      where: whereClause,
      include: ['case', 'creator', 'organization'],
    });
  }

  async findMessages(conversationId: string): Promise<Message[]> {
    return this.messageModel.findAll({
      where: { conversation_id: conversationId },
      include: ['conversation', 'sender'],
      order: [['created_at', 'ASC']],
    });
  }

  async findConversation(id: string): Promise<Conversation> {
    const conversation = await this.conversationModel.findByPk(id, {
      include: ['case', 'creator', 'organization'],
    });

    if (!conversation) {
      throw new NotFoundException(`Conversation with ID ${id} not found`);
    }

    return conversation;
  }

  async findMessage(id: string): Promise<Message> {
    const message = await this.messageModel.findByPk(id, {
      include: ['conversation', 'sender'],
    });

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
}