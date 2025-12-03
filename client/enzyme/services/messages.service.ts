// Messages Service using Enzyme API Client
// Provides type-safe messaging and conversation operations

import { enzymeClient } from './client';
import { Conversation, Message } from '../../types';
import { ApiConversation, ApiMessage } from '../../shared-types';
import { transformApiConversation, transformApiMessage } from '../../utils/type-transformers';

/**
 * Endpoint definitions for messages
 */
const ENDPOINTS = {
  messages: {
    list: '/messages',
    detail: (id: string) => `/messages/${id}`,
    send: (conversationId: string) => `/messages/${conversationId}/send`,
  },
  conversations: {
    list: '/messages/conversations',
    detail: (id: string) => `/messages/conversations/${id}`,
    messages: (id: string) => `/messages/conversations/${id}/messages`,
  },
} as const;

/**
 * Query parameters for listing conversations
 */
interface ConversationListParams {
  caseId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

/**
 * Messages service using Enzyme API client
 * Provides type-safe, retry-enabled, rate-limited API calls
 */
export const enzymeMessagesService = {
  /**
   * Conversation operations
   */
  conversations: {
    /**
     * Get all conversations with optional filtering
     * @example
     * const conversations = await enzymeMessagesService.conversations.getAll({ caseId: 'case-123' });
     */
    async getAll(params?: ConversationListParams): Promise<Conversation[]> {
      const response = await enzymeClient.get<ApiConversation[]>(ENDPOINTS.conversations.list, {
        params: params as Record<string, string | number | boolean>,
      });
      
      // Fetch messages for each conversation
      const conversationsWithMessages = await Promise.all(
        (response.data || []).map(async (conv) => {
          try {
            const messagesResponse = await enzymeClient.get<ApiMessage[]>(
              ENDPOINTS.conversations.messages(conv.id)
            );
            return transformApiConversation(conv, messagesResponse.data || []);
          } catch {
            return transformApiConversation(conv, []);
          }
        })
      );
      
      return conversationsWithMessages;
    },

    /**
     * Get a single conversation by ID with messages
     * @example
     * const conversation = await enzymeMessagesService.conversations.getById('conv-123');
     */
    async getById(id: string): Promise<Conversation> {
      const [convResponse, messagesResponse] = await Promise.all([
        enzymeClient.get<ApiConversation>(ENDPOINTS.conversations.detail(id)),
        enzymeClient.get<ApiMessage[]>(ENDPOINTS.conversations.messages(id)),
      ]);
      
      return transformApiConversation(convResponse.data, messagesResponse.data || []);
    },

    /**
     * Create a new conversation
     * @example
     * const conversation = await enzymeMessagesService.conversations.create({
     *   participants: ['user-1', 'user-2'],
     *   caseId: 'case-123'
     * });
     */
    async create(data: Partial<Conversation>): Promise<Conversation> {
      const response = await enzymeClient.post<ApiConversation>(ENDPOINTS.conversations.list, {
        body: data as Record<string, unknown>,
      });
      return transformApiConversation(response.data, []);
    },

    /**
     * Update a conversation
     * @example
     * const updated = await enzymeMessagesService.conversations.update('conv-123', { subject: 'New Subject' });
     */
    async update(id: string, data: Partial<Conversation>): Promise<Conversation> {
      const response = await enzymeClient.put<ApiConversation>(ENDPOINTS.conversations.detail(id), {
        body: data as Record<string, unknown>,
      });
      return transformApiConversation(response.data, []);
    },

    /**
     * Get messages for a conversation
     * @example
     * const messages = await enzymeMessagesService.conversations.getMessages('conv-123');
     */
    async getMessages(conversationId: string): Promise<Message[]> {
      const response = await enzymeClient.get<ApiMessage[]>(
        ENDPOINTS.conversations.messages(conversationId)
      );
      return (response.data || []).map(transformApiMessage);
    },
  },

  /**
   * Create a new message
   * @example
   * const message = await enzymeMessagesService.create({ text: 'Hello', conversationId: 'conv-123' });
   */
  async create(data: Partial<Message> & { conversationId?: string }): Promise<Message> {
    const response = await enzymeClient.post<ApiMessage>(ENDPOINTS.messages.list, {
      body: data as Record<string, unknown>,
    });
    return transformApiMessage(response.data);
  },

  /**
   * Get a message by ID
   * @example
   * const message = await enzymeMessagesService.getById('msg-123');
   */
  async getById(id: string): Promise<Message> {
    const response = await enzymeClient.get<ApiMessage>(ENDPOINTS.messages.detail(id));
    return transformApiMessage(response.data);
  },

  /**
   * Update a message
   * @example
   * const updated = await enzymeMessagesService.update('msg-123', { text: 'Updated message' });
   */
  async update(id: string, data: Partial<Message>): Promise<Message> {
    const response = await enzymeClient.put<ApiMessage>(ENDPOINTS.messages.detail(id), {
      body: data as Record<string, unknown>,
    });
    return transformApiMessage(response.data);
  },

  /**
   * Send a message to a conversation
   * @example
   * await enzymeMessagesService.sendMessage('conv-123', 'Hello!', 'user-123');
   */
  async sendMessage(conversationId: string, text: string, senderId?: string): Promise<void> {
    await enzymeClient.post(ENDPOINTS.messages.send(conversationId), {
      body: { text, senderId },
    });
  },

  /**
   * Get all conversations (simplified)
   * @example
   * const conversations = await enzymeMessagesService.getConversations();
   */
  async getConversations(): Promise<Conversation[]> {
    const response = await enzymeClient.get<ApiConversation[]>(ENDPOINTS.messages.list);
    return (response.data || []).map(conv => transformApiConversation(conv, []));
  },
};

export default enzymeMessagesService;
