/**
 * MessageBubble Component
 *
 * Displays individual message in conversation
 */

import React, { useState } from 'react';
import { MoreVertical, Reply, Edit, Trash2, Copy } from 'lucide-react';
import { Message } from '../api/communication.types';
import { SecureLabel } from './SecureLabel';
import { ReadReceipts } from './ReadReceipts';
import { FileAttachment } from './FileAttachment';
import { UserAvatar } from '../../../components/common';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  showTimestamp?: boolean;
  onReply?: (message: Message) => void;
  onEdit?: (message: Message) => void;
  onDelete?: (message: Message) => void;
  className?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwn,
  showAvatar = true,
  showTimestamp = true,
  onReply,
  onEdit,
  onDelete,
  className = '',
}) => {
  const [showActions, setShowActions] = useState(false);
  const [showReadReceipts, setShowReadReceipts] = useState(false);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div
      className={`flex gap-3 group ${isOwn ? 'flex-row-reverse' : ''} ${className}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <div className="flex-shrink-0">
          <UserAvatar name={message.senderName} src={message.senderAvatar} size="sm" />
        </div>
      )}

      {/* Message Content */}
      <div className={`flex-1 max-w-2xl ${isOwn ? 'flex flex-col items-end' : ''}`}>
        {/* Sender Name & Time */}
        {!isOwn && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-slate-700">{message.senderName}</span>
            {showTimestamp && (
              <span className="text-xs text-slate-500">{formatTime(message.createdAt)}</span>
            )}
          </div>
        )}

        {/* Message Bubble */}
        <div
          className={`
            relative rounded-lg px-4 py-2.5
            ${isOwn
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-900'
            }
            ${message.isDeleted ? 'opacity-60 italic' : ''}
          `}
        >
          {/* Security Label */}
          {message.securityLevel !== 'standard' && (
            <div className="mb-2">
              <SecureLabel level={message.securityLevel} size="sm" />
            </div>
          )}

          {/* Parent Message (if reply) */}
          {message.parentMessageId && (
            <div className={`mb-2 pb-2 border-l-2 pl-3 ${isOwn ? 'border-white/30' : 'border-slate-300'}`}>
              <div className={`text-xs ${isOwn ? 'text-white/80' : 'text-slate-600'}`}>
                Replying to previous message
              </div>
            </div>
          )}

          {/* Message Content */}
          <div className="break-words whitespace-pre-wrap">
            {message.isDeleted ? 'This message was deleted' : message.content}
          </div>

          {/* Edited Indicator */}
          {message.isEdited && !message.isDeleted && (
            <span className={`text-xs ml-2 ${isOwn ? 'text-white/70' : 'text-slate-500'}`}>
              (edited)
            </span>
          )}

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {message.attachments.map((attachment) => (
                <FileAttachment
                  key={attachment.id}
                  attachment={attachment}
                  variant={isOwn ? 'dark' : 'light'}
                />
              ))}
            </div>
          )}

          {/* Action Menu */}
          {showActions && !message.isDeleted && (
            <div
              className={`
                absolute top-0 -mt-6
                ${isOwn ? 'right-0' : 'left-0'}
                flex items-center gap-1 bg-white rounded-lg shadow-lg border border-slate-200 p-1
              `}
            >
              {onReply && (
                <button
                  onClick={() => onReply(message)}
                  className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                  title="Reply"
                >
                  <Reply className="w-4 h-4 text-slate-600" />
                </button>
              )}
              {isOwn && onEdit && (
                <button
                  onClick={() => onEdit(message)}
                  className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4 text-slate-600" />
                </button>
              )}
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-slate-100 rounded transition-colors"
                title="Copy"
              >
                <Copy className="w-4 h-4 text-slate-600" />
              </button>
              {isOwn && onDelete && (
                <button
                  onClick={() => onDelete(message)}
                  className="p-1.5 hover:bg-red-50 rounded transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Read Receipts & Time for Own Messages */}
        {isOwn && (
          <div className="flex items-center gap-2 mt-1">
            {showTimestamp && (
              <span className="text-xs text-slate-500">{formatTime(message.createdAt)}</span>
            )}
            <button
              onClick={() => setShowReadReceipts(!showReadReceipts)}
              className="focus:outline-none"
            >
              <ReadReceipts
                status={message.status}
                readBy={message.readBy}
              />
            </button>
          </div>
        )}

        {/* Read Receipts Detail Popup */}
        {showReadReceipts && message.readBy && message.readBy.length > 0 && (
          <div className="mt-2 p-3 bg-white border border-slate-200 rounded-lg shadow-lg">
            <div className="text-xs font-medium text-slate-700 mb-2">Read by:</div>
            <div className="space-y-1">
              {message.readBy.map((receipt) => (
                <div key={receipt.userId} className="text-xs text-slate-600">
                  {formatTime(receipt.readAt)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface SystemMessageProps {
  message: string;
  timestamp: string;
  className?: string;
}

/**
 * System Message Bubble
 *
 * For system notifications like "User joined", "User left", etc.
 */
export const SystemMessage: React.FC<SystemMessageProps> = ({ message, timestamp, className = '' }) => {
  const formatTime = (ts: string) => {
    const date = new Date(ts);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <div className={`flex items-center justify-center gap-2 py-3 ${className}`}>
      <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
        <span>{message}</span>
        <span className="text-slate-400">•</span>
        <span>{formatTime(timestamp)}</span>
      </div>
    </div>
  );
};
