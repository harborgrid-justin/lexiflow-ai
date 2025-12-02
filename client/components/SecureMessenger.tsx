/**
 * SecureMessenger Component
 *
 * ENZYME MIGRATION: This component has been migrated to use the Enzyme framework
 * for progressive hydration, analytics tracking, and stable callbacks.
 *
 * Enzyme features implemented:
 * - usePageView: Tracks page view for 'secure_messenger'
 * - useTrackEvent: Tracks messenger events (conversation_selected, message_sent, file_attached, view_changed)
 * - useLatestCallback: Stable callbacks for conversation selection, message sending, file attachment, view changes
 * - React.lazy: Lazy loading for MessengerChatList, MessengerChatWindow, MessengerContacts, MessengerFiles
 * - HydrationBoundary: Progressive hydration for active chats (high priority) and other views (normal priority)
 * - Suspense: Loading states for lazy-loaded components
 *
 * @migration-date 2025-12-01
 * @migrated-by Agent 9
 */

import React, { Suspense } from 'react';
import {
  MessageSquare, Users, FileText, Archive
} from 'lucide-react';
import { PageHeader, Button, TabNavigation } from './common';
import { useSecureMessenger } from '../hooks/useSecureMessenger';
import {
  useLatestCallback,
  useTrackEvent,
  usePageView,
  useIsMounted,
  HydrationBoundary
} from '../enzyme';

// Lazy load messenger sub-components
const MessengerChatList = React.lazy(() => import('./messenger/MessengerChatList').then(m => ({ default: m.MessengerChatList })));
const MessengerChatWindow = React.lazy(() => import('./messenger/MessengerChatWindow').then(m => ({ default: m.MessengerChatWindow })));
const MessengerContacts = React.lazy(() => import('./messenger/MessengerContacts').then(m => ({ default: m.MessengerContacts })));
const MessengerFiles = React.lazy(() => import('./messenger/MessengerFiles').then(m => ({ default: m.MessengerFiles })));

// Loading fallback for lazy-loaded components
const LoadingFallback = () => (
  <div className="w-full flex items-center justify-center p-12">
    <div className="animate-pulse text-slate-400">Loading...</div>
  </div>
);

interface SecureMessengerProps {
  currentUserId?: string;
}

export const SecureMessenger: React.FC<SecureMessengerProps> = ({ currentUserId }) => {
  // Analytics tracking
  usePageView('secure_messenger');
  const trackEvent = useTrackEvent();

  const {
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
    activeConversation,
    filteredConversations,
    handleSelectConversation: originalHandleSelectConversation,
    handleSendMessage: originalHandleSendMessage,
    handleFileSelect: originalHandleFileSelect,
    formatTime,
    contacts,
    allFiles
  } = useSecureMessenger(currentUserId);

  // Wrap handlers with useLatestCallback and add tracking
  const handleSelectConversation = useLatestCallback((id: string) => {
    originalHandleSelectConversation(id);
    trackEvent('messenger_conversation_selected', { conversationId: id });
  });

  const handleSendMessage = useLatestCallback(async () => {
    const hasText = inputText.trim().length > 0;
    const hasAttachments = pendingAttachments.length > 0;

    await originalHandleSendMessage();

    if (hasText || hasAttachments) {
      trackEvent('messenger_message_sent', {
        conversationId: activeConvId,
        hasText,
        hasAttachments,
        attachmentCount: pendingAttachments.length,
        isPrivileged: isPrivilegedMode
      });
    }
  });

  const handleFileSelect = useLatestCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    originalHandleFileSelect(e);
    if (e.target.files && e.target.files[0]) {
      trackEvent('messenger_file_attached', {
        conversationId: activeConvId,
        fileName: e.target.files[0].name,
        fileType: e.target.files[0].type
      });
    }
  });

  const handleViewChange = useLatestCallback((id: string) => {
    const previousView = view;
    setView(id as any);
    trackEvent('messenger_view_changed', {
      fromView: previousView,
      toView: id
    });
  });

  const tabs = [
    { id: 'chats', label: 'Active Chats', icon: MessageSquare },
    { id: 'contacts', label: 'Firm Directory', icon: Users },
    { id: 'files', label: 'Shared Files', icon: FileText },
    { id: 'archived', label: 'Archived', icon: Archive },
  ];

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <PageHeader
        title="Secure Messenger"
        subtitle="End-to-End Encrypted Communication Channel."
      />

      <TabNavigation
        tabs={tabs}
        activeTab={view}
        onTabChange={handleViewChange}
        className="mb-4 bg-white rounded-t-lg md:bg-transparent"
      />

      <div className="flex-1 flex flex-col md:flex-row bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden min-h-0">

        {view === 'chats' && (
          <HydrationBoundary id="messenger-chats" priority="high" trigger="immediate">
            <Suspense fallback={<LoadingFallback />}>
              <MessengerChatList
                conversations={filteredConversations}
                activeConvId={activeConvId}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                handleSelectConversation={handleSelectConversation}
                formatTime={formatTime}
              />
              <MessengerChatWindow
                activeConversation={activeConversation}
                activeConvId={activeConvId}
                setActiveConvId={setActiveConvId}
                inputText={inputText}
                setInputText={setInputText}
                pendingAttachments={pendingAttachments}
                setPendingAttachments={setPendingAttachments}
                isPrivilegedMode={isPrivilegedMode}
                setIsPrivilegedMode={setIsPrivilegedMode}
                handleSendMessage={handleSendMessage}
                handleFileSelect={handleFileSelect}
                formatTime={formatTime}
              />
            </Suspense>
          </HydrationBoundary>
        )}

        {view === 'contacts' && (
          <HydrationBoundary id="messenger-contacts" priority="normal" trigger="visible">
            <Suspense fallback={<LoadingFallback />}>
              <MessengerContacts
                contacts={contacts}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onMessageClick={() => handleViewChange('chats')}
              />
            </Suspense>
          </HydrationBoundary>
        )}

        {view === 'files' && (
          <HydrationBoundary id="messenger-files" priority="normal" trigger="visible">
            <Suspense fallback={<LoadingFallback />}>
              <MessengerFiles
                files={allFiles}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            </Suspense>
          </HydrationBoundary>
        )}

        {view === 'archived' && (
          <div className="w-full flex flex-col items-center justify-center p-12 text-slate-400">
            <Archive className="h-16 w-16 mb-4 opacity-20"/>
            <h3 className="text-lg font-medium text-slate-600">Archived Conversations</h3>
            <p className="text-sm mt-2">No archived threads found in the last 90 days.</p>
            <Button variant="outline" className="mt-6">Search Server Archives</Button>
          </div>
        )}

      </div>
    </div>
  );
};
