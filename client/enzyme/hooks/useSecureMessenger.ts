/**
 * useSecureMessenger Hook - Secure Messaging System
 *
 * Manages real-time messaging with optimistic updates, file attachments,
 * and contact management.
 *
 * @see /client/enzyme/ENZYME_COMPLETE_GUIDE.md
 */

import { useState } from 'react';
import { enzymeClient } from '../services/client';
import { useApiRequest } from '../services/hooks';
import { useIsMounted, useLatestCallback, useOnlineStatus } from '@missionfabric-js/enzyme/hooks';
import type { Conversation, Message, Attachment } from '../../types';

export const useSecureMessenger = (currentUserId?: string) => {
  const isOnline = useOnlineStatus();
  const isMounted = useIsMounted();

  // UI State
  const [view, setView] = useState<'chats' | 'contacts' | 'files' | 'archived'>('chats');
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputText, setInputText] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [isPrivilegedMode, setIsPrivilegedMode] = useState(false);

  // Data State
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [contactsList, setContactsList] = useState<any[]>([]);

  // Fetch Conversations
  const {
    isLoading: conversationsLoading,
    error: conversationsError,
    refetch: refetchConversations,
  } = useApiRequest<Conversation[]>({
    endpoint: '/api/v1/messages/conversations',
    options: {
      enabled: !!currentUserId,
      staleTime: 30000,
      params: currentUserId ? { userId: currentUserId } : undefined,
      onSuccess: (data) => {
        if (isMounted()) setConversations(data);
      },
    },
  });

  // Fetch Contacts
  const {
    isLoading: usersLoading,
    error: usersError,
  } = useApiRequest<any[]>({
    endpoint: '/api/v1/users',
    options: {
      staleTime: 300000,
      onSuccess: (data) => {
        if (isMounted()) {
          setContactsList(
            data.map((u) => ({
              id: u.id,
              name: u.name,
              role: u.role,
              status: u.status || 'offline',
              avatar: u.avatar,
            }))
          );
        }
      },
    },
  });

  // Derived State
  const activeConversation = conversations.find((c) => c.id === activeConvId);

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredContacts = contactsList.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Actions
  const sendMessage = useLatestCallback(async () => {
    if ((!inputText.trim() && pendingAttachments.length === 0) || !activeConvId) return;

    const tempId = `temp-${Date.now()}`;
    const newMessage: Message = {
      id: tempId,
      senderId: 'Me', // Should be current user ID
      text: inputText,
      timestamp: new Date().toISOString(),
      status: 'sent',
      attachments: pendingAttachments,
      isPrivileged: isPrivilegedMode,
    };

    // Optimistic Update
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvId
          ? {
              ...c,
              messages: [...c.messages, newMessage],
              draft: undefined,
            }
          : c
      )
    );

    const textToSend = inputText;
    const attachmentsToSend = pendingAttachments;
    setInputText('');
    setPendingAttachments([]);

    try {
      const response = await enzymeClient.post<Message>(
        `/api/v1/messages/conversations/${activeConvId}/messages`,
        {
          body: {
            content: textToSend,
            attachments: attachmentsToSend,
            isPrivileged: isPrivilegedMode,
          },
        }
      );

      if (isMounted() && response.data) {
        // Replace temp message with real one
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  messages: c.messages.map((m) => (m.id === tempId ? response.data! : m)),
                }
              : c
          )
        );
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      if (isMounted()) {
        // Mark as failed - using 'sent' but maybe adding a local property if possible, 
        // or just removing it/showing error toast. 
        // Since 'failed' is not in Message type, we'll just log it for now or revert.
        // For now, let's revert the optimistic update to avoid type errors
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConvId
              ? {
                  ...c,
                  messages: c.messages.filter((m) => m.id !== tempId),
                }
              : c
          )
        );
      }
    }
  });

  const createConversation = useLatestCallback(async (contactId: string) => {
    try {
      const response = await enzymeClient.post<Conversation>('/api/v1/messages/conversations', {
        body: { participantIds: [contactId] },
      });

      if (isMounted() && response.data) {
        setConversations((prev) => [response.data!, ...prev]);
        setActiveConvId(response.data.id);
        setView('chats');
      }
    } catch (err) {
      console.error('Failed to create conversation:', err);
    }
  });

  const handleFileUpload = useLatestCallback(async (files: File[]) => {
    // Mock upload for now
    const newAttachments: Attachment[] = files.map((f) => ({
      name: f.name,
      type: f.type.includes('image') ? 'image' : 'doc',
      size: `${(f.size / 1024).toFixed(1)} KB`,
      date: new Date().toISOString(),
    }));
    setPendingAttachments((prev) => [...prev, ...newAttachments]);
  });

  return {
    // State
    view,
    setView,
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
    isOnline,

    // Data
    conversations: filteredConversations,
    contacts: filteredContacts,
    activeConversation,
    loading: conversationsLoading || usersLoading,
    error: conversationsError || usersError,

    // Actions
    sendMessage,
    createConversation,
    handleFileUpload,
    refetchConversations,
  };
};

export default useSecureMessenger;
