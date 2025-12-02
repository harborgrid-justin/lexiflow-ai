/**
 * ENZYME MIGRATION - useSecureMessenger Hook
 *
 * This hook manages real-time messaging with optimistic updates for the SecureMessenger component.
 * It provides conversation management, message sending, file attachments, and contact/file views.
 *
 * Enzyme Features Implemented:
 * ✅ useSafeState - Replaced useState with useSafeState for async-safe state management
 * ✅ useApiRequest - Migrated data fetching to useApiRequest with automatic caching and error handling
 * ✅ useOptimisticUpdate - Implemented optimistic message sending with automatic rollback on failure
 * ✅ useLatestCallback - Wrapped all event handlers for stable references without stale closures
 * ✅ useIsMounted - Added guards for async operations to prevent memory leaks
 * ✅ useOnlineStatus - Network-aware messaging with offline detection
 *
 * Migration Date: December 2, 2025
 * Migrated By: Agent 34 (Wave 5 - Hooks Migration)
 *
 * @see /client/enzyme/MIGRATION_PLAN.md
 * @see /client/enzyme/LESSONS_LEARNED.md
 */

import React, { useMemo, useEffect, useCallback } from 'react';
import { Conversation, Message, Attachment } from '../types';
import { ApiService, ApiError } from '../services/apiService';
import {
  useSafeState,
  useApiRequest,
  useOptimisticUpdate,
  useLatestCallback,
  useIsMounted,
  useOnlineStatus,
} from '../enzyme';

export const useSecureMessenger = (currentUserId?: string) => {
  // Network awareness for messaging
  const isOnline = useOnlineStatus();

  // Safe state management (prevents setState on unmounted component)
  const [view, setView] = useSafeState<'chats' | 'contacts' | 'files' | 'archived'>('chats');
  const [activeConvId, setActiveConvId] = useSafeState<string | null>(null);
  const [searchTerm, setSearchTerm] = useSafeState('');
  const [inputText, setInputText] = useSafeState('');
  const [pendingAttachments, setPendingAttachments] = useSafeState<Attachment[]>([]);
  const [isPrivilegedMode, setIsPrivilegedMode] = useSafeState(false);

  // Local state for conversations and contacts (updated via refresh)
  const [conversations, setConversations] = useSafeState<Conversation[]>([]);
  const [contactsList, setContactsList] = useSafeState<any[]>([]);

  // useIsMounted for async operation safety
  const isMounted = useIsMounted();

  // API request for conversations with automatic caching
  const {
    data: conversationsData,
    isLoading: conversationsLoading,
    error: conversationsError,
    refetch: refetchConversations,
  } = useApiRequest({
    endpoint: `/api/v1/messages/conversations${currentUserId ? `?userId=${currentUserId}` : ''}`,
    options: {
      enabled: !!currentUserId,
      staleTime: 30000, // 30 seconds - conversations update frequently
      refetchInterval: isOnline ? 60000 : false, // Poll every 60s when online
    },
  });

  // API request for users/contacts with caching
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useApiRequest({
    endpoint: '/api/v1/users',
    options: {
      staleTime: 300000, // 5 minutes - contacts don't change often
    },
  });

  // Combine loading and error states
  const loading = conversationsLoading || usersLoading;
  const error = conversationsError
    ? `Failed to load messages: ${conversationsError instanceof ApiError ? conversationsError.statusText : 'Please try again.'}`
    : usersError
    ? `Failed to load contacts: ${usersError instanceof ApiError ? usersError.statusText : 'Please try again.'}`
    : null;

  // Update local state when API data changes
  useEffect(() => {
    if (conversationsData && isMounted()) {
      setConversations(conversationsData);
    }
  }, [conversationsData, isMounted, setConversations]);

  useEffect(() => {
    if (usersData && isMounted()) {
      setContactsList(
        usersData.map((u: any) => ({
          id: u.id,
          name: u.name,
          role: u.role,
          status: 'online', // Mock status for now
          email: u.email,
          department: u.role,
        }))
      );
    }
  }, [usersData, isMounted, setContactsList]);

  // Optimistic update for message sending
  const { mutate: sendMessageOptimistically, isLoading: isSending } = useOptimisticUpdate({
    mutationFn: async (newMessage: Message) => {
      return await ApiService.messages.create({
        conversationId: activeConvId!,
        senderId: currentUserId,
        text: newMessage.text,
        attachments: newMessage.attachments || [],
      });
    },
    onMutate: async (newMessage: Message) => {
      // Optimistically add message to conversation
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConvId) {
            return {
              ...c,
              messages: [...c.messages, newMessage],
              draft: '',
            };
          }
          return c;
        })
      );
      return { newMessage };
    },
    onSuccess: (data, newMessage) => {
      // Update message status to delivered
      if (isMounted()) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.id === newMessage.id ? { ...m, status: 'delivered' as const } : m
                  ),
                }
              : c
          )
        );
      }
    },
    onError: (error, newMessage) => {
      // Rollback: remove the optimistically added message
      if (isMounted()) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? { ...c, messages: c.messages.filter((m) => m.id !== newMessage.id) }
              : c
          )
        );
      }
    },
  });

  // Sorted conversations
  const sortedConversations = useMemo(() => {
    return [...(conversations || [])].sort((a, b) => {
      const messagesA = a.messages || [];
      const messagesB = b.messages || [];
      const lastMsgA = messagesA[messagesA.length - 1];
      const lastMsgB = messagesB[messagesB.length - 1];
      if (!lastMsgA) return 1;
      if (!lastMsgB) return -1;
      return new Date(lastMsgB.timestamp).getTime() - new Date(lastMsgA.timestamp).getTime();
    });
  }, [conversations]);

  // Filtered conversations based on search
  const filteredConversations = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return sortedConversations.filter(
      (c) =>
        (c.name || '').toLowerCase().includes(term) ||
        (c.role || '').toLowerCase().includes(term) ||
        (c.messages || []).some((m) => (m.text || '').toLowerCase().includes(term))
    );
  }, [sortedConversations, searchTerm]);

  // Filtered contacts based on search
  const contacts = useMemo(() => {
    return contactsList.filter(
      (c) =>
        (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.role || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contactsList, searchTerm]);

  // All files from conversations
  const allFiles = useMemo(() => {
    const files: Attachment[] = [];
    (conversations || []).forEach((c) => {
      (c.messages || []).forEach((m) => {
        if (m.attachments) {
          m.attachments.forEach((a) => {
            files.push({
              ...a,
              sender: m.senderId === 'me' ? 'Me' : c.name,
              date: m.timestamp,
            });
          });
        }
      });
    });
    return files.filter((f) => (f.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
  }, [conversations, searchTerm]);

  const activeConversation = conversations.find((c) => c.id === activeConvId);

  // Handler: Select conversation
  const handleSelectConversation = useLatestCallback((id: string) => {
    if (activeConvId === id) return;

    // Save draft for current conversation
    if (activeConvId) {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConvId ? { ...c, draft: inputText } : c))
      );
    }

    // Load draft and settings for new conversation
    const targetConv = conversations.find((c) => c.id === id);
    setInputText(targetConv?.draft || '');
    setPendingAttachments([]);
    setIsPrivilegedMode(targetConv?.role.includes('Client') || false);
    setActiveConvId(id);

    // Mark conversation as read
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  });

  // Handler: Send message with optimistic updates
  const handleSendMessage = useLatestCallback(async () => {
    if ((!inputText.trim() && pendingAttachments.length === 0) || !activeConvId) return;

    // Check network status
    if (!isOnline) {
      console.warn('Cannot send message while offline');
      // TODO: Queue message for sending when online
      return;
    }

    const newMessage: Message = {
      id: `new-${Date.now()}`,
      senderId: currentUserId || 'me',
      text: inputText,
      timestamp: new Date().toISOString(),
      status: 'sent',
      isPrivileged: isPrivilegedMode,
      attachments: pendingAttachments.length > 0 ? [...pendingAttachments] : undefined,
    };

    // Clear input immediately for better UX
    setInputText('');
    setPendingAttachments([]);

    // Send with optimistic update
    sendMessageOptimistically(newMessage);

    // Mock reply for demo purposes (only if online)
    if (activeConversation && activeConversation.status !== 'offline' && isOnline) {
      setTimeout(() => {
        const replyMsg: Message = {
          id: `rep-${Date.now()}`,
          senderId: 'other',
          text: 'I received your message securely. Will review shortly.',
          timestamp: new Date().toISOString(),
          status: 'read',
        };
        if (isMounted()) {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConvId
                ? {
                    ...c,
                    messages: [...c.messages, replyMsg],
                    unread: activeConvId === c.id ? 0 : c.unread + 1,
                  }
                : c
            )
          );
        }
      }, 5000);
    }
  });

  // Handler: File selection
  const handleFileSelect = useLatestCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newAtt: Attachment = {
        name: file.name,
        type: file.type.includes('image') ? 'image' : 'doc',
        size: '1.2 MB',
      };
      setPendingAttachments([...pendingAttachments, newAtt]);
    }
  });

  // Utility: Format time
  const formatTime = useLatestCallback((isoString: string | undefined | null) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  // Refresh data
  const refresh = useLatestCallback(async () => {
    await Promise.all([refetchConversations(), refetchUsers()]);
  });

  return {
    view,
    setView,
    conversations,
    activeConvId,
    setActiveConvId,
    searchTerm,
    setSearchTerm,
    inputText,
    setInputText,
    pendingAttachments,
    setPendingAttachments,
    isPrivilegedMode,
    setIsPrivilegedMode,
    activeConversation,
    filteredConversations,
    loading,
    error,
    isOnline,
    isSending,
    handleSelectConversation,
    handleSendMessage,
    handleFileSelect,
    formatTime,
    contacts,
    allFiles,
    refresh,
  };
};
