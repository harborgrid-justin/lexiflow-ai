/**
 * Messages API Hooks
 *
 * TanStack Query hooks for message and conversation operations.
 * Uses Enzyme framework for enhanced performance and analytics.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enzymeMessagesService, ConversationFilters, MessageSearchParams, SendMessageInput } from '../../../enzyme/services/messages.service';
import {
  Conversation,
  Message,
  ConversationsResponse,
  MessagesResponse,
  CreateConversationInput,
  UpdateConversationInput,
  MarkMessagesReadInput,
} from './communication.types';

// ============================================================================
// Query Keys
// ============================================================================

export const messageKeys = {
  all: ['messages'] as const,
  conversations: () => [...messageKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...messageKeys.conversations(), id] as const,
  conversationMessages: (id: string) => [...messageKeys.conversation(id), 'messages'] as const,
  search: (params: MessageSearchParams) => [...messageKeys.all, 'search', params] as const,
  unreadCount: () => [...messageKeys.all, 'unread-count'] as const,
};

// ============================================================================
// Conversation Queries
// ============================================================================

/**
 * Fetch all conversations with optional filtering
 */
export function useConversations(filters?: ConversationFilters) {
  return useQuery({
    queryKey: [...messageKeys.conversations(), filters],
    queryFn: async () => {
      return enzymeMessagesService.conversations.getAll(filters);
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });
}

/**
 * Fetch a single conversation with its details
 */
export function useConversation(id: string | undefined) {
  return useQuery({
    queryKey: messageKeys.conversation(id || ''),
    queryFn: async () => {
      if (!id) throw new Error('Conversation ID is required');
      return enzymeMessagesService.conversations.getById(id);
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Fetch messages for a specific conversation
 */
export function useConversationMessages(
  conversationId: string | undefined,
  options?: {
    limit?: number;
    cursor?: string;
  }
) {
  return useQuery({
    queryKey: [...messageKeys.conversationMessages(conversationId || ''), options],
    queryFn: async () => {
      if (!conversationId) throw new Error('Conversation ID is required');
      return enzymeMessagesService.messages.getMessages(conversationId, options);
    },
    enabled: !!conversationId,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 10, // Refetch every 10 seconds for real-time feel
    refetchOnWindowFocus: true,
  });
}

/**
 * Get unread message count across all conversations
 */
export function useUnreadCount() {
  return useQuery({
    queryKey: messageKeys.unreadCount(),
    queryFn: () => enzymeMessagesService.messages.getUnreadCount(),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });
}

/**
 * Search messages across conversations
 */
export function useSearchMessages(params: MessageSearchParams) {
  return useQuery({
    queryKey: messageKeys.search(params),
    queryFn: async () => {
      return enzymeMessagesService.messages.search(params);
    },
    enabled: !!params.query && params.query.length >= 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// ============================================================================
// Conversation Mutations
// ============================================================================

/**
 * Create a new conversation
 */
export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateConversationInput) => {
      return enzymeMessagesService.conversations.create(input);
    },
    onSuccess: (newConversation) => {
      // Invalidate conversations list
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });

      // Set new conversation in cache
      queryClient.setQueryData(messageKeys.conversation(newConversation.id), newConversation);
    },
  });
}

/**
 * Update an existing conversation
 */
export function useUpdateConversation(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateConversationInput) => {
      return enzymeMessagesService.conversations.update(conversationId, input);
    },
    onSuccess: (updatedConversation) => {
      // Update conversation in cache
      queryClient.setQueryData(messageKeys.conversation(conversationId), updatedConversation);

      // Invalidate conversations list to show updated data
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
    },
  });
}

/**
 * Delete/archive a conversation
 */
export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      return enzymeMessagesService.conversations.delete(conversationId);
    },
    onSuccess: (_, conversationId) => {
      // Remove conversation from cache
      queryClient.removeQueries({ queryKey: messageKeys.conversation(conversationId) });

      // Invalidate conversations list
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
    },
  });
}

// ============================================================================
// Message Mutations
// ============================================================================

/**
 * Send a new message in a conversation
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: SendMessageInput) => {
      // If there are attachments, handle file upload separately
      if (input.attachments && input.attachments.length > 0) {
        // First upload attachments
        const formData = new FormData();
        input.attachments.forEach((file) => {
          formData.append('files', file);
        });

        // For now, send without attachments (would need separate upload endpoint)
        // enzymeMessagesService.messages.send will strip attachments anyway
        return enzymeMessagesService.messages.send(input);
      }

      return enzymeMessagesService.messages.send(input);
    },
    onMutate: async (input) => {
      // Cancel outgoing queries for the conversation messages
      await queryClient.cancelQueries({
        queryKey: messageKeys.conversationMessages(input.conversationId)
      });

      // Snapshot previous value
      const previousMessages = queryClient.getQueryData(
        messageKeys.conversationMessages(input.conversationId)
      );

      // Optimistically update with new message
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        conversationId: input.conversationId,
        senderId: 'current-user', // Would come from auth context
        senderName: 'You',
        type: input.type || 'text',
        content: input.content,
        status: 'sending',
        securityLevel: input.securityLevel || 'standard',
        createdAt: new Date().toISOString(),
        parentMessageId: input.parentMessageId,
        mentions: input.mentions,
      };

      queryClient.setQueryData<MessagesResponse>(
        messageKeys.conversationMessages(input.conversationId),
        (old) => {
          if (!old) return { messages: [optimisticMessage], total: 1, hasMore: false };
          return {
            ...old,
            messages: [...old.messages, optimisticMessage],
            total: old.total + 1,
          };
        }
      );

      return { previousMessages };
    },
    onError: (err, input, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(
          messageKeys.conversationMessages(input.conversationId),
          context.previousMessages
        );
      }
    },
    onSuccess: (newMessage, input) => {
      // Replace optimistic update with real message
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversationMessages(input.conversationId)
      });

      // Update conversation's last message
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversation(input.conversationId)
      });

      // Update conversations list
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });

      // Update unread count
      queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount() });
    },
  });
}

/**
 * Mark messages as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: MarkMessagesReadInput) => {
      return enzymeMessagesService.messages.markRead(input);
    },
    onSuccess: (_, input) => {
      // Update unread count
      queryClient.invalidateQueries({ queryKey: messageKeys.unreadCount() });

      // Update conversation
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversation(input.conversationId)
      });

      // Update conversations list
      queryClient.invalidateQueries({ queryKey: messageKeys.conversations() });
    },
  });
}

/**
 * Delete a message
 */
export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, conversationId }: { messageId: string; conversationId: string }) => {
      return enzymeMessagesService.messages.delete(messageId);
    },
    onSuccess: (_, { conversationId }) => {
      // Refresh messages for the conversation
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversationMessages(conversationId)
      });
    },
  });
}

/**
 * Edit a message
 */
export function useEditMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      messageId,
      conversationId,
      content
    }: {
      messageId: string;
      conversationId: string;
      content: string;
    }) => {
      return enzymeMessagesService.messages.update(messageId, { content });
    },
    onSuccess: (_, { conversationId }) => {
      // Refresh messages for the conversation
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversationMessages(conversationId)
      });
    },
  });
}

/**
 * React to a message (like/emoji)
 */
export function useReactToMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      messageId,
      conversationId,
      reaction
    }: {
      messageId: string;
      conversationId: string;
      reaction: string;
    }) => {
      return enzymeMessagesService.messages.react(messageId, reaction);
    },
    onSuccess: (_, { conversationId }) => {
      // Refresh messages for the conversation
      queryClient.invalidateQueries({
        queryKey: messageKeys.conversationMessages(conversationId)
      });
    },
  });
}
