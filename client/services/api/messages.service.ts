// Messages Service
import { Conversation } from '../../types';
import { ApiConversation, ApiMessage } from '../../shared-types';
import { transformApiConversation, transformApiMessage } from '../../utils/type-transformers';
import { fetchJson, postJson, putJson, buildQueryString } from '../http-client';

export const messagesService = {
  conversations: {
    getAll: async (caseId?: string, userId?: string): Promise<Conversation[]> => {
      const apiConversations = await fetchJson<ApiConversation[]>(
        `/messages/conversations${buildQueryString({ caseId, userId })}`
      );
      const conversationsWithMessages = await Promise.all(
        (apiConversations || []).map(async (conv) => {
          try {
            const messages = await fetchJson<ApiMessage[]>(
              `/messages/conversations/${conv.id}/messages`
            );
            return transformApiConversation(conv, messages);
          } catch {
            return transformApiConversation(conv, []);
          }
        })
      );
      return conversationsWithMessages;
    },

    getById: async (id: string): Promise<Conversation> => {
      const apiConv = await fetchJson<ApiConversation>(`/messages/conversations/${id}`);
      const messages = await fetchJson<ApiMessage[]>(`/messages/conversations/${id}/messages`);
      return transformApiConversation(apiConv, messages);
    },

    create: (data: Partial<Conversation>) =>
      postJson<Conversation>('/messages/conversations', data),

    update: (id: string, data: Partial<Conversation>) =>
      putJson<Conversation>(`/messages/conversations/${id}`, data),

    getMessages: async (conversationId: string) => {
      const messages = await fetchJson<ApiMessage[]>(
        `/messages/conversations/${conversationId}/messages`
      );
      return (messages || []).map(transformApiMessage);
    },
  },

  create: (data: any) =>
    postJson<any>('/messages', data),

  getById: (id: string) =>
    fetchJson<any>(`/messages/${id}`),

  update: (id: string, data: any) =>
    putJson<any>(`/messages/${id}`, data),

  sendMessage: (conversationId: string, text: string, senderId?: string) =>
    postJson<void>(`/messages/${conversationId}/send`, { text, senderId }),

  getConversations: async (): Promise<Conversation[]> => {
    const apiConversations = await fetchJson<ApiConversation[]>('/messages');
    return (apiConversations || []).map(conv => transformApiConversation(conv, []));
  },
};
