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
    unread: '/messages/unread-count',
    search: '/messages/search',
    markRead: '/messages/mark-read',
    react: (id: string) => `/messages/${id}/react`,
  },
  conversations: {
    list: '/messages/conversations',
    detail: (id: string) => `/messages/conversations/${id}`,
    messages: (id: string) => `/messages/conversations/${id}/messages`,
  },
} as const;

export interface ConversationFilters {
  status?: 'active' | 'archived' | 'spam';
  priority?: 'high' | 'medium' | 'low';
  assignedTo?: string;
  search?: string;
  page?: number;
  limit?: number;
  caseId?: string;
  userId?: string;
}

export interface MessageSearchParams {
  query: string;
  conversationId?: string;
  senderId?: string;
  dateFrom?: string;
  dateTo?: string;
  hasAttachments?: boolean;
  page?: number;
  limit?: number;
}

export interface SendMessageInput {
  conversationId: string;
  content: string;
  type?: 'text' | 'image' | 'file' | 'system';
  attachments?: File[];
  parentMessageId?: string;
  mentions?: string[];
  securityLevel?: 'standard' | 'confidential' | 'privileged';
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
     */
    async getAll(params?: ConversationFilters): Promise<{ conversations: Conversation[]; total: number; hasMore: boolean; page: number; limit: number }> {
      try {
        const response = await enzymeClient.get<any>(ENDPOINTS.conversations.list, {
          params: params as Record<string, string | number | boolean>,
        });
      
        const apiConversations = response.data.conversations || response.data || [];
        const list = Array.isArray(apiConversations) ? apiConversations : [];

        // Fetch messages for each conversation
        const conversationsWithMessages = await Promise.all(
          list.map(async (conv: ApiConversation) => {
            try {
              const messagesResponse = await enzymeClient.get<any>(
                ENDPOINTS.conversations.messages(conv.id)
              );
              const msgs = messagesResponse.data.messages || messagesResponse.data || [];
              return transformApiConversation(conv, Array.isArray(msgs) ? msgs : []);
            } catch {
              return transformApiConversation(conv, []);
            }
          })
        );
        
        return {
          conversations: conversationsWithMessages,
          total: response.data.total || conversationsWithMessages.length,
          hasMore: response.data.hasMore || response.data.has_more || false,
          page: response.data.page || 1,
          limit: response.data.limit || 20
        };
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
        return { conversations: [], total: 0, hasMore: false, page: 1, limit: 20 };
      }
    },

    /**
     * Get a single conversation by ID with messages
     */
    async getById(id: string): Promise<Conversation> {
      const [convResponse, messagesResponse] = await Promise.all([
        enzymeClient.get<ApiConversation>(ENDPOINTS.conversations.detail(id)),
        enzymeClient.get<any>(ENDPOINTS.conversations.messages(id)),
      ]);
      
      const msgs = messagesResponse.data.messages || messagesResponse.data || [];
      return transformApiConversation(convResponse.data, Array.isArray(msgs) ? msgs : []);
    },

    /**
     * Create a new conversation
     */
    async create(data: Partial<Conversation>): Promise<Conversation> {
      const response = await enzymeClient.post<ApiConversation>(ENDPOINTS.conversations.list, {
        body: data as Record<string, unknown>,
      });
      return transformApiConversation(response.data, []);
    },

    /**
     * Update a conversation
     */
    async update(id: string, data: Partial<Conversation>): Promise<Conversation> {
      const response = await enzymeClient.put<ApiConversation>(ENDPOINTS.conversations.detail(id), {
        body: data as Record<string, unknown>,
      });
      return transformApiConversation(response.data, []);
    },

    /**
     * Delete a conversation
     */
    async delete(id: string): Promise<void> {
      await enzymeClient.delete(ENDPOINTS.conversations.detail(id));
    },
  },

  /**
   * Message operations
   */
  messages: {
    /**
     * Get messages for a conversation
     */
    async getMessages(conversationId: string, params?: any): Promise<{ messages: Message[]; total: number; hasMore: boolean; cursor?: string }> {
      const response = await enzymeClient.get<any>(
        ENDPOINTS.conversations.messages(conversationId),
        { params }
      );
      
      const msgs = response.data.messages || response.data || [];
      const messages = (Array.isArray(msgs) ? msgs : []).map(transformApiMessage);

      return {
        messages,
        total: response.data.total || messages.length,
        hasMore: response.data.hasMore || response.data.has_more || false,
        cursor: response.data.cursor
      };
    },

    /**
     * Send a message
     */
    async send(data: SendMessageInput): Promise<Message> {
      // Strip attachments for now as they need separate handling
      const { attachments, ...messageData } = data;
      const response = await enzymeClient.post<ApiMessage>(ENDPOINTS.messages.list, {
        body: messageData as Record<string, unknown>,
      });
      return transformApiMessage(response.data);
    },

    /**
     * Get unread count
     */
    async getUnreadCount(): Promise<{ count: number; conversationCounts: Record<string, number> }> {
      const response = await enzymeClient.get<{ count: number; conversationCounts: Record<string, number> }>(
        ENDPOINTS.messages.unread
      );
      return response.data;
    },

    /**
     * Search messages
     */
    async search(params: MessageSearchParams): Promise<{ messages: Message[]; total: number; hasMore: boolean }> {
      const response = await enzymeClient.get<any>(ENDPOINTS.messages.search, {
        params: params as unknown as Record<string, string | number | boolean>,
      });
      
      const msgs = response.data.messages || response.data || [];
      return {
        messages: (Array.isArray(msgs) ? msgs : []).map(transformApiMessage),
        total: response.data.total || (Array.isArray(msgs) ? msgs.length : 0),
        hasMore: response.data.hasMore || false
      };
    },

    /**
     * Mark messages as read
     */
    async markRead(data: { conversationId: string; messageIds?: string[] }): Promise<{ success: boolean }> {
      const response = await enzymeClient.post<{ success: boolean }>(ENDPOINTS.messages.markRead, {
        body: data as Record<string, unknown>,
      });
      return response.data;
    },

    /**
     * Delete a message
     */
    async delete(id: string): Promise<void> {
      await enzymeClient.delete(ENDPOINTS.messages.detail(id));
    },

    /**
     * Update a message
     */
    async update(id: string, data: Partial<Message>): Promise<Message> {
      const response = await enzymeClient.put<ApiMessage>(ENDPOINTS.messages.detail(id), {
        body: data as Record<string, unknown>,
      });
      return transformApiMessage(response.data);
    },

    /**
     * React to a message
     */
    async react(id: string, reaction: string): Promise<Message> {
      const response = await enzymeClient.post<ApiMessage>(ENDPOINTS.messages.react(id), {
        body: { reaction },
      });
      return transformApiMessage(response.data);
    },
  },

  // Legacy/Direct methods (kept for compatibility if needed, but prefer using sub-objects)
  
  /**
   * Create a new message (Legacy)
   */
  async create(data: Partial<Message> & { conversationId?: string }): Promise<Message> {
    const response = await enzymeClient.post<ApiMessage>(ENDPOINTS.messages.list, {
      body: data as Record<string, unknown>,
    });
    return transformApiMessage(response.data);
  },

  /**
   * Get a message by ID (Legacy)
   */
  async getById(id: string): Promise<Message> {
    const response = await enzymeClient.get<ApiMessage>(ENDPOINTS.messages.detail(id));
    return transformApiMessage(response.data);
  },

  /**
   * Update a message (Legacy)
   */
  async update(id: string, data: Partial<Message>): Promise<Message> {
    const response = await enzymeClient.put<ApiMessage>(ENDPOINTS.messages.detail(id), {
      body: data as Record<string, unknown>,
    });
    return transformApiMessage(response.data);
  },

  /**
   * Send a message to a conversation (Legacy)
   */
  async sendMessage(conversationId: string, text: string, senderId?: string): Promise<void> {
    await enzymeClient.post(ENDPOINTS.messages.send(conversationId), {
      body: { text, senderId },
    });
  },

  /**
   * Get all conversations (simplified) (Legacy)
   */
  async getConversations(): Promise<Conversation[]> {
    const response = await enzymeClient.get<ApiConversation[]>(ENDPOINTS.messages.list);
    return (response.data || []).map(conv => transformApiConversation(conv, []));
  },
};

export default enzymeMessagesService;
