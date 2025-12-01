// Messaging and Client Transformers
// Transform ApiMessage, ApiConversation, ApiClient

import { ApiMessage, ApiConversation } from '../../shared-types';
import { Message, Conversation, Client } from '../../types';

export function transformApiMessage(apiMessage: ApiMessage): Message {
  return {
    id: apiMessage.id,
    senderId: apiMessage.sender_id,
    text: apiMessage.content,
    timestamp: typeof apiMessage.created_at === 'string'
      ? apiMessage.created_at
      : apiMessage.created_at?.toISOString() || new Date().toISOString(),
    status: apiMessage.status as 'sent' | 'delivered' | 'read',
    attachments: apiMessage.attachments,
    isPrivileged: false,
  };
}

export function transformApiConversation(
  apiConv: ApiConversation,
  messages: ApiMessage[] = []
): Conversation {
  return {
    id: apiConv.id,
    name: apiConv.title || 'Untitled Conversation',
    role: apiConv.type || 'Case Discussion',
    isExternal: apiConv.type === 'external',
    unread: 0,
    status: apiConv.status === 'active' ? 'online' : 'offline',
    messages: messages.map(transformApiMessage),
    draft: undefined,
  };
}

export function transformApiClient(apiClient: any): Client {
  return {
    id: apiClient.id,
    name: apiClient.name,
    industry: apiClient.industry || '',
    status: apiClient.status as any,
    totalBilled: 0,
    matters: [],
  };
}
