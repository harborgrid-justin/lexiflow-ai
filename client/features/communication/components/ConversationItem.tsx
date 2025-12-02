/**
 * ConversationItem Component
 *
 * Single conversation preview in the conversation list
 */

import React from 'react';
import { Pin, Archive, Users, Briefcase } from 'lucide-react';
import { Conversation } from '../api/communication.types';
import { UserAvatar } from '../../../components/common';
import { SecureLabel } from './SecureLabel';
import { NotificationBadge, UnreadDot } from './NotificationBadge';
import { CompactTypingIndicator } from './TypingIndicator';
import { CompactFileAttachment } from './FileAttachment';
import { CompactParticipantList } from './ParticipantList';

interface ConversationItemProps {
  conversation: Conversation;
  isActive?: boolean;
  isTyping?: boolean;
  onClick: () => void;
  onArchive?: () => void;
  onPin?: () => void;
  className?: string;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isActive = false,
  isTyping = false,
  onClick,
  onArchive,
  onPin,
  className = '',
}) => {
  const formatLastMessageTime = (timestamp?: string) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;

    const diffDays = Math.floor(diffMins / 1440);
    if (diffDays < 7) return `${diffDays}d`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getConversationName = () => {
    if (conversation.name) return conversation.name;
    if (conversation.caseName) return conversation.caseName;
    if (conversation.type === 'direct' && conversation.participants.length === 2) {
      // For direct conversations, show the other person's name
      return conversation.participants[0]?.name || 'Unknown';
    }
    return 'Unnamed Conversation';
  };

  const getConversationIcon = () => {
    if (conversation.type === 'case') return <Briefcase className="w-4 h-4 text-blue-600" />;
    if (conversation.type === 'group') return <Users className="w-4 h-4 text-slate-600" />;
    return null;
  };

  const lastMessagePreview = conversation.lastMessage?.content
    ? conversation.lastMessage.content.substring(0, 60) + (conversation.lastMessage.content.length > 60 ? '...' : '')
    : 'No messages yet';

  const hasAttachments = conversation.lastMessage?.attachments && conversation.lastMessage.attachments.length > 0;

  return (
    <div
      onClick={onClick}
      className={`
        relative flex items-start gap-3 p-3 cursor-pointer transition-all
        hover:bg-slate-50 border-l-4
        ${isActive
          ? 'bg-blue-50 border-blue-600'
          : conversation.unreadCount > 0
            ? 'bg-slate-50 border-slate-300'
            : 'border-transparent'
        }
        ${conversation.isPinned ? 'bg-amber-50/50' : ''}
        ${className}
      `}
    >
      {/* Avatar / Icon */}
      <div className="flex-shrink-0 relative mt-0.5">
        {conversation.type === 'direct' && conversation.participants[0] ? (
          <UserAvatar
            name={conversation.participants[0].name}
            src={conversation.participants[0].avatar}
            size="md"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
            {getConversationIcon()}
          </div>
        )}
        {conversation.unreadCount > 0 && (
          <UnreadDot visible position="absolute" variant="danger" className="top-0 right-0" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              {conversation.isPinned && <Pin className="w-3 h-3 text-amber-600 flex-shrink-0" />}
              <h3 className={`text-sm font-medium truncate ${isActive ? 'text-blue-900' : 'text-slate-900'}`}>
                {getConversationName()}
              </h3>
            </div>
            {conversation.type === 'group' && (
              <CompactParticipantList
                participants={conversation.participants}
                max={3}
                size="sm"
                className="mb-1"
              />
            )}
          </div>

          {/* Time & Badge */}
          <div className="flex flex-col items-end gap-1 flex-shrink-0">
            <span className="text-xs text-slate-500">
              {formatLastMessageTime(conversation.lastMessageAt)}
            </span>
            {conversation.unreadCount > 0 && (
              <NotificationBadge count={conversation.unreadCount} size="sm" />
            )}
          </div>
        </div>

        {/* Last Message Preview */}
        <div className="space-y-1">
          {isTyping ? (
            <CompactTypingIndicator />
          ) : (
            <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'font-medium text-slate-900' : 'text-slate-600'}`}>
              {conversation.lastMessage?.senderName && conversation.type !== 'direct' && (
                <span className="font-medium">{conversation.lastMessage.senderName}: </span>
              )}
              {lastMessagePreview}
            </p>
          )}

          {/* Meta Info Row */}
          <div className="flex items-center gap-2">
            {conversation.securityLevel !== 'standard' && (
              <SecureLabel level={conversation.securityLevel} size="sm" showIcon={false} />
            )}
            {hasAttachments && (
              <CompactFileAttachment count={conversation.lastMessage!.attachments!.length} />
            )}
            {conversation.caseId && !conversation.caseName && (
              <div className="flex items-center gap-1 text-xs text-slate-500">
                <Briefcase className="w-3 h-3" />
                <span>Case</span>
              </div>
            )}
            {conversation.isMuted && (
              <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions (on hover) */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        {onPin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPin();
            }}
            className={`p-1.5 rounded hover:bg-white transition-colors ${conversation.isPinned ? 'text-amber-600' : 'text-slate-400'}`}
            title={conversation.isPinned ? 'Unpin' : 'Pin'}
          >
            <Pin className="w-4 h-4" />
          </button>
        )}
        {onArchive && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onArchive();
            }}
            className="p-1.5 text-slate-400 rounded hover:bg-white transition-colors"
            title="Archive"
          >
            <Archive className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
