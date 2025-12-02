/**
 * Communication Hooks
 *
 * Composite hooks for communication features using Enzyme patterns.
 * These hooks combine API calls with analytics and state management.
 */

import { useState, useCallback, useMemo } from 'react';
import { usePageView, useTrackEvent, useLatestCallback, useIsMounted } from '@/enzyme';
import {
  useConversations,
  useConversation,
  useConversationMessages,
  useMessageUnreadCount,
  useNotifications,
  useNotificationUnreadCount,
  useSendMessage,
  useCreateConversation,
  useMarkAsRead,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  type Conversation,
  type Message,
  type Notification,
  type ConversationFilters,
  type SendMessageInput,
  type CreateConversationInput,
} from '../api';

/**
 * Hook for the secure messenger page
 * Provides conversations, messages, and messaging functionality
 */
export function useSecureMessenger(conversationId?: string) {
  const isMounted = useIsMounted();
  const trackEvent = useTrackEvent();

  // Track page view
  usePageView('secure_messenger', { conversationId });

  // Conversation filters state
  const [filters, setFilters] = useState<ConversationFilters>({});

  // Queries
  const conversationsQuery = useConversations(filters);
  const conversationQuery = useConversation(conversationId);
  const messagesQuery = useConversationMessages(conversationId);
  const unreadCountQuery = useMessageUnreadCount();

  // Mutations
  const sendMessageMutation = useSendMessage();
  const createConversationMutation = useCreateConversation();
  const markAsReadMutation = useMarkAsRead();

  // Stable callbacks
  const sendMessage = useLatestCallback(async (content: string, options?: Partial<SendMessageInput>) => {
    if (!conversationId) return;
    
    trackEvent('message_sent', { conversationId, hasAttachments: false });
    
    await sendMessageMutation.mutateAsync({
      conversationId,
      content,
      ...options,
    });
  });

  const createConversation = useLatestCallback(async (input: CreateConversationInput) => {
    trackEvent('conversation_created', { type: input.type, participantCount: input.participantIds.length });
    return createConversationMutation.mutateAsync(input);
  });

  const markConversationAsRead = useLatestCallback(async () => {
    if (!conversationId) return;
    
    await markAsReadMutation.mutateAsync({
      conversationId,
      readAll: true,
    });
  });

  const updateFilters = useLatestCallback((newFilters: Partial<ConversationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  });

  // Computed values
  const totalUnread = useMemo(() => unreadCountQuery.data?.count || 0, [unreadCountQuery.data]);

  const sortedConversations = useMemo(() => {
    const convos = conversationsQuery.data?.conversations || [];
    return [...convos].sort((a, b) => {
      // Pinned first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      // Then by last message date
      const aDate = new Date(a.lastMessageAt || a.createdAt);
      const bDate = new Date(b.lastMessageAt || b.createdAt);
      return bDate.getTime() - aDate.getTime();
    });
  }, [conversationsQuery.data?.conversations]);

  return {
    // State
    filters,
    
    // Queries
    conversations: sortedConversations,
    conversationsLoading: conversationsQuery.isLoading,
    currentConversation: conversationQuery.data,
    messages: messagesQuery.data?.messages || [],
    messagesLoading: messagesQuery.isLoading,
    totalUnread,
    
    // Actions
    sendMessage,
    createConversation,
    markConversationAsRead,
    updateFilters,
    
    // Mutation states
    isSending: sendMessageMutation.isPending,
    isCreating: createConversationMutation.isPending,
    
    // Errors
    error: conversationsQuery.error || messagesQuery.error,
  };
}

/**
 * Hook for notification management
 */
export function useNotificationCenter() {
  const isMounted = useIsMounted();
  const trackEvent = useTrackEvent();

  // Track page view
  usePageView('notification_center');

  // State
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  // Queries
  const notificationsQuery = useNotifications({ unreadOnly: showUnreadOnly });
  const unreadCountQuery = useNotificationUnreadCount();

  // Mutations
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  // Stable callbacks
  const markAsRead = useLatestCallback(async (notificationId: string) => {
    trackEvent('notification_read', { notificationId });
    await markReadMutation.mutateAsync(notificationId);
  });

  const markAllAsRead = useLatestCallback(async () => {
    trackEvent('all_notifications_read', { count: unreadCountQuery.data?.count });
    await markAllReadMutation.mutateAsync();
  });

  const toggleUnreadFilter = useLatestCallback(() => {
    setShowUnreadOnly(prev => !prev);
  });

  // Computed
  const unreadCount = useMemo(() => unreadCountQuery.data?.count || 0, [unreadCountQuery.data]);

  const groupedNotifications = useMemo(() => {
    const notifications = notificationsQuery.data?.notifications || [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const groups: Record<string, Notification[]> = {
      today: [],
      yesterday: [],
      older: [],
    };

    notifications.forEach(notification => {
      const date = new Date(notification.createdAt);
      date.setHours(0, 0, 0, 0);

      if (date.getTime() === today.getTime()) {
        groups.today.push(notification);
      } else if (date.getTime() === yesterday.getTime()) {
        groups.yesterday.push(notification);
      } else {
        groups.older.push(notification);
      }
    });

    return groups;
  }, [notificationsQuery.data?.notifications]);

  return {
    // State
    showUnreadOnly,
    
    // Data
    notifications: notificationsQuery.data?.notifications || [],
    groupedNotifications,
    unreadCount,
    isLoading: notificationsQuery.isLoading,
    
    // Actions
    markAsRead,
    markAllAsRead,
    toggleUnreadFilter,
    
    // Errors
    error: notificationsQuery.error,
  };
}

/**
 * Hook for real-time presence tracking
 */
export function usePresence(conversationId?: string) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // TODO: Integrate with WebSocket for real-time updates
  // This is a placeholder for the real-time functionality

  const setTyping = useLatestCallback((isTyping: boolean) => {
    // Send typing indicator to server
    console.log('Set typing:', isTyping, 'in conversation:', conversationId);
  });

  return {
    typingUsers,
    onlineUsers,
    setTyping,
  };
}

export type { Conversation, Message, Notification, ConversationFilters };
