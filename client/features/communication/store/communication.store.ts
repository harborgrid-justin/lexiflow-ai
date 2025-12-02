/**
 * Communication Store
 *
 * React Context-based state management for communication features.
 * Manages active conversations, unread counts, and notification preferences.
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { NotificationPreferences, NotificationType } from '../api/communication.types';

// ============================================================================
// Store Types
// ============================================================================

interface CommunicationState {
  // Active conversation
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;

  // Unread tracking
  totalUnreadMessages: number;
  setTotalUnreadMessages: (count: number) => void;
  totalUnreadNotifications: number;
  setTotalUnreadNotifications: (count: number) => void;

  // UI state
  isNotificationPanelOpen: boolean;
  setIsNotificationPanelOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  // Search
  messageSearchQuery: string;
  setMessageSearchQuery: (query: string) => void;

  // Filters
  conversationFilters: {
    showArchived: boolean;
    showUnreadOnly: boolean;
    securityLevel?: string;
  };
  setConversationFilters: (filters: Partial<CommunicationState['conversationFilters']>) => void;

  // Notification preferences (cached)
  notificationPreferences: NotificationPreferences | null;
  setNotificationPreferences: (prefs: NotificationPreferences | null) => void;

  // Typing indicators
  typingUsers: Record<string, string[]>; // conversationId -> userIds[]
  setTypingUsers: (conversationId: string, userIds: string[]) => void;

  // Draft messages
  draftMessages: Record<string, string>; // conversationId -> draft text
  saveDraft: (conversationId: string, text: string) => void;
  clearDraft: (conversationId: string) => void;
  getDraft: (conversationId: string) => string;

  // Helper actions
  incrementUnreadMessages: (count?: number) => void;
  decrementUnreadMessages: (count?: number) => void;
  incrementUnreadNotifications: (count?: number) => void;
  decrementUnreadNotifications: (count?: number) => void;
  toggleNotificationPanel: () => void;
  closeNotificationPanel: () => void;
  openNotificationPanel: () => void;
}

// ============================================================================
// Context
// ============================================================================

const CommunicationContext = createContext<CommunicationState | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

interface CommunicationProviderProps {
  children: ReactNode;
}

export function CommunicationProvider({ children }: CommunicationProviderProps) {
  // State
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);
  const [totalUnreadNotifications, setTotalUnreadNotifications] = useState(0);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const [conversationFilters, setConversationFiltersState] = useState({
    showArchived: false,
    showUnreadOnly: false,
    securityLevel: undefined,
  });
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences | null>(null);
  const [typingUsers, setTypingUsersState] = useState<Record<string, string[]>>({});
  const [draftMessages, setDraftMessages] = useState<Record<string, string>>({});

  // Actions
  const setConversationFilters = useCallback(
    (filters: Partial<CommunicationState['conversationFilters']>) => {
      setConversationFiltersState((prev) => ({ ...prev, ...filters }));
    },
    []
  );

  const setTypingUsers = useCallback((conversationId: string, userIds: string[]) => {
    setTypingUsersState((prev) => ({ ...prev, [conversationId]: userIds }));
  }, []);

  const saveDraft = useCallback((conversationId: string, text: string) => {
    setDraftMessages((prev) => ({ ...prev, [conversationId]: text }));
  }, []);

  const clearDraft = useCallback((conversationId: string) => {
    setDraftMessages((prev) => {
      const newDrafts = { ...prev };
      delete newDrafts[conversationId];
      return newDrafts;
    });
  }, []);

  const getDraft = useCallback(
    (conversationId: string) => {
      return draftMessages[conversationId] || '';
    },
    [draftMessages]
  );

  const incrementUnreadMessages = useCallback((count: number = 1) => {
    setTotalUnreadMessages((prev) => prev + count);
  }, []);

  const decrementUnreadMessages = useCallback((count: number = 1) => {
    setTotalUnreadMessages((prev) => Math.max(0, prev - count));
  }, []);

  const incrementUnreadNotifications = useCallback((count: number = 1) => {
    setTotalUnreadNotifications((prev) => prev + count);
  }, []);

  const decrementUnreadNotifications = useCallback((count: number = 1) => {
    setTotalUnreadNotifications((prev) => Math.max(0, prev - count));
  }, []);

  const toggleNotificationPanel = useCallback(() => {
    setIsNotificationPanelOpen((prev) => !prev);
  }, []);

  const closeNotificationPanel = useCallback(() => {
    setIsNotificationPanelOpen(false);
  }, []);

  const openNotificationPanel = useCallback(() => {
    setIsNotificationPanelOpen(true);
  }, []);

  const value: CommunicationState = {
    activeConversationId,
    setActiveConversationId,
    totalUnreadMessages,
    setTotalUnreadMessages,
    totalUnreadNotifications,
    setTotalUnreadNotifications,
    isNotificationPanelOpen,
    setIsNotificationPanelOpen,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    messageSearchQuery,
    setMessageSearchQuery,
    conversationFilters,
    setConversationFilters,
    notificationPreferences,
    setNotificationPreferences,
    typingUsers,
    setTypingUsers,
    draftMessages,
    saveDraft,
    clearDraft,
    getDraft,
    incrementUnreadMessages,
    decrementUnreadMessages,
    incrementUnreadNotifications,
    decrementUnreadNotifications,
    toggleNotificationPanel,
    closeNotificationPanel,
    openNotificationPanel,
  };

  return React.createElement(
    CommunicationContext.Provider,
    { value },
    children
  );
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access communication state and actions
 */
export function useCommunicationStore(): CommunicationState {
  const context = useContext(CommunicationContext);
  if (context === undefined) {
    throw new Error('useCommunicationStore must be used within a CommunicationProvider');
  }
  return context;
}

// ============================================================================
// Export Context for testing
// ============================================================================

export { CommunicationContext };
