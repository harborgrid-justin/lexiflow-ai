/**
 * MessagesPage Component
 *
 * Main messages page with three-column layout:
 * - Left: Conversation list
 * - Center: Active conversation
 * - Right: Conversation details
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Settings,
  MoreVertical,
  Archive,
  Pin,
  Users,
  Paperclip,
  Info,
  X,
  Plus,
  Search,
} from 'lucide-react';
import {
  useConversations,
  useConversationMessages,
  useSendMessage,
  useMarkAsRead,
  useUpdateConversation,
} from '../api/messages.api';
import { useCommunicationStore } from '../store/communication.store';
import { ConversationList } from '../components/ConversationList';
import { MessageBubble, SystemMessage } from '../components/MessageBubble';
import { MessageComposer } from '../components/MessageComposer';
import { ParticipantList } from '../components/ParticipantList';
import { TypingIndicator } from '../components/TypingIndicator';
import { SecurityBanner } from '../components/SecureLabel';
import { PageLayout, LoadingSpinner, Button, Modal } from '../../../components/common';
import { SendMessageInput } from '../api/communication.types';

export const MessagesPage: React.FC = () => {
  const {
    activeConversationId,
    setActiveConversationId,
    typingUsers,
    getDraft,
    saveDraft,
    clearDraft,
  } = useCommunicationStore();

  const [showRightPanel, setShowRightPanel] = useState(true);
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [messageSearchQuery, setMessageSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Queries
  const { data: conversationsData, isLoading: isLoadingConversations } = useConversations();
  const { data: messagesData, isLoading: isLoadingMessages } = useConversationMessages(
    activeConversationId || undefined,
    { limit: 100 }
  );

  // Mutations
  const sendMessageMutation = useSendMessage();
  const markAsReadMutation = useMarkAsRead();
  const updateConversationMutation = useUpdateConversation(activeConversationId || '');

  const conversations = conversationsData?.conversations || [];
  const messages = messagesData?.messages || [];
  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  // Mark messages as read when conversation is opened
  useEffect(() => {
    if (activeConversationId && activeConversation?.unreadCount > 0) {
      const timer = setTimeout(() => {
        markAsReadMutation.mutate({
          conversationId: activeConversationId,
          readAll: true,
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [activeConversationId, activeConversation?.unreadCount]);

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
  };

  const handleSendMessage = async (input: SendMessageInput) => {
    await sendMessageMutation.mutateAsync(input);
    clearDraft(input.conversationId);
  };

  const handleArchiveConversation = (conversationId: string) => {
    updateConversationMutation.mutate({
      isArchived: true,
    });
  };

  const handlePinConversation = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    if (conversation) {
      updateConversationMutation.mutate({
        isPinned: !conversation.isPinned,
      });
    }
  };

  const filteredMessages = messages.filter((message) => {
    if (!messageSearchQuery.trim()) return true;
    const query = messageSearchQuery.toLowerCase();
    return message.content.toLowerCase().includes(query);
  });

  const typingUsersInActiveConv = activeConversationId && typingUsers[activeConversationId]
    ? activeConversation?.participants.filter((p) => typingUsers[activeConversationId].includes(p.userId)) || []
    : [];

  return (
    <PageLayout>
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Panel - Conversation List */}
        <div className="w-80 flex-shrink-0">
          <ConversationList
            conversations={conversations}
            activeConversationId={activeConversationId}
            isLoading={isLoadingConversations}
            onSelectConversation={handleSelectConversation}
            onCreateConversation={() => setShowNewConversationModal(true)}
            onArchiveConversation={handleArchiveConversation}
            onPinConversation={handlePinConversation}
            typingUsers={typingUsers}
          />
        </div>

        {/* Center Panel - Active Conversation */}
        <div className="flex-1 flex flex-col border-r border-slate-200">
          {activeConversation ? (
            <>
              {/* Conversation Header */}
              <div className="flex-shrink-0 h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-slate-900 truncate">
                      {activeConversation.name || activeConversation.caseName || 'Conversation'}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      {activeConversation.type === 'group' && (
                        <>
                          <Users className="w-4 h-4" />
                          <span>{activeConversation.participants.length} participants</span>
                        </>
                      )}
                      {activeConversation.type === 'case' && activeConversation.caseName && (
                        <>
                          <span>Case Discussion</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Message Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search messages..."
                      value={messageSearchQuery}
                      onChange={(e) => setMessageSearchQuery(e.target.value)}
                      className="w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    {messageSearchQuery && (
                      <button
                        onClick={() => setMessageSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Toggle Right Panel */}
                  <button
                    onClick={() => setShowRightPanel(!showRightPanel)}
                    className={`p-2 rounded-lg transition-colors ${
                      showRightPanel ? 'bg-blue-50 text-blue-600' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    title="Conversation details"
                  >
                    <Info className="w-5 h-5" />
                  </button>

                  {/* More Options */}
                  <button
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="More options"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Security Banner */}
              {activeConversation.securityLevel !== 'standard' && (
                <div className="flex-shrink-0 p-4 bg-slate-50 border-b border-slate-200">
                  <SecurityBanner
                    level={activeConversation.securityLevel}
                    message="This conversation is protected. All messages are encrypted and logged."
                  />
                </div>
              )}

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <LoadingSpinner />
                  </div>
                ) : filteredMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-3">
                      <Users className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 mb-1">
                      {messageSearchQuery ? 'No messages found' : 'No messages yet'}
                    </p>
                    <p className="text-sm text-slate-500">
                      {messageSearchQuery
                        ? 'Try a different search term'
                        : 'Send a message to start the conversation'
                      }
                    </p>
                  </div>
                ) : (
                  <>
                    {filteredMessages.map((message, index) => {
                      const isOwn = message.senderId === 'current-user'; // Would come from auth context
                      const showAvatar = index === 0 || filteredMessages[index - 1].senderId !== message.senderId;

                      if (message.type === 'system') {
                        return (
                          <SystemMessage
                            key={message.id}
                            message={message.content}
                            timestamp={message.createdAt}
                          />
                        );
                      }

                      return (
                        <MessageBubble
                          key={message.id}
                          message={message}
                          isOwn={isOwn}
                          showAvatar={showAvatar}
                        />
                      );
                    })}

                    {/* Typing Indicator */}
                    {typingUsersInActiveConv.length > 0 && (
                      <TypingIndicator
                        users={typingUsersInActiveConv.map((p) => ({ id: p.userId, name: p.name }))}
                      />
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Composer */}
              <MessageComposer
                conversationId={activeConversationId}
                securityLevel={activeConversation.securityLevel}
                onSend={handleSendMessage}
              />
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Select a conversation
              </h3>
              <p className="text-slate-600 mb-6 max-w-md">
                Choose a conversation from the left panel or start a new one to begin messaging
              </p>
              <Button
                onClick={() => setShowNewConversationModal(true)}
                variant="primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Conversation
              </Button>
            </div>
          )}
        </div>

        {/* Right Panel - Conversation Details */}
        {showRightPanel && activeConversation && (
          <div className="w-80 flex-shrink-0 bg-white overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Conversation Info */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Details</h3>
                  <button
                    onClick={() => setShowRightPanel(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {activeConversation.description && (
                  <p className="text-sm text-slate-600 mb-4">
                    {activeConversation.description}
                  </p>
                )}

                {/* Case Link */}
                {activeConversation.caseName && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Linked Case</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      {activeConversation.caseName}
                    </p>
                  </div>
                )}
              </div>

              {/* Participants */}
              <ParticipantList
                participants={activeConversation.participants}
                showRole
              />

              {/* Files & Attachments */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Paperclip className="w-4 h-4 text-slate-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Files</h3>
                </div>
                <div className="text-sm text-slate-500">
                  No files shared yet
                </div>
              </div>

              {/* Conversation Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => handlePinConversation(activeConversation.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Pin className="w-4 h-4" />
                  <span>{activeConversation.isPinned ? 'Unpin' : 'Pin'} conversation</span>
                </button>
                <button
                  onClick={() => handleArchiveConversation(activeConversation.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Archive className="w-4 h-4" />
                  <span>Archive conversation</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                  <Settings className="w-4 h-4" />
                  <span>Conversation settings</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewConversationModal && (
        <Modal isOpen={showNewConversationModal} onClose={() => setShowNewConversationModal(false)}>
          <div className="w-full max-w-md p-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              New Conversation
            </h2>
            <p className="text-slate-600 mb-6">
              Create a new conversation to collaborate with your team
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowNewConversationModal(false)}
                variant="secondary"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  // TODO: Implement create conversation
                  setShowNewConversationModal(false);
                }}
                variant="primary"
                className="flex-1"
              >
                Create
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </PageLayout>
  );
};
