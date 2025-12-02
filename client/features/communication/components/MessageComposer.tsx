/**
 * MessageComposer Component
 *
 * Rich text composer for sending messages with mentions, attachments, and formatting
 */

import React, { useState, useRef, KeyboardEvent } from 'react';
import {
  Send,
  Paperclip,
  Smile,
  Bold,
  Italic,
  Link as LinkIcon,
  X,
  Shield,
} from 'lucide-react';
import { SecurityLevel, SendMessageInput } from '../api/communication.types';
import { SecureLabel } from './SecureLabel';
import { FileAttachment } from './FileAttachment';

interface MessageComposerProps {
  conversationId: string;
  securityLevel?: SecurityLevel;
  placeholder?: string;
  onSend: (input: SendMessageInput) => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  conversationId,
  securityLevel = 'standard',
  placeholder = 'Type a message...',
  onSend,
  onTyping,
  disabled = false,
  className = '',
}) => {
  const [content, setContent] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showSecurityMenu, setShowSecurityMenu] = useState(false);
  const [selectedSecurityLevel, setSelectedSecurityLevel] = useState<SecurityLevel>(securityLevel);
  const [isSending, setIsSending] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleContentChange = (value: string) => {
    setContent(value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }

    // Typing indicator
    if (onTyping) {
      onTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 3000);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    const trimmedContent = content.trim();

    if (!trimmedContent && attachments.length === 0) return;
    if (isSending || disabled) return;

    setIsSending(true);

    try {
      await onSend({
        conversationId,
        content: trimmedContent,
        securityLevel: selectedSecurityLevel,
        attachments: attachments.length > 0 ? attachments : undefined,
      });

      // Clear composer
      setContent('');
      setAttachments([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      if (onTyping) {
        onTyping(false);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = (content.trim() || attachments.length > 0) && !isSending && !disabled;

  return (
    <div className={`border-t border-slate-200 bg-white ${className}`}>
      {/* Security Level Bar */}
      {selectedSecurityLevel !== 'standard' && (
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
          <SecureLabel level={selectedSecurityLevel} size="sm" />
        </div>
      )}

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-3 border-b border-slate-200 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Attachments ({attachments.length})
            </span>
            <button
              onClick={() => setAttachments([])}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Clear all
            </button>
          </div>
          {attachments.map((file, index) => (
            <div key={index} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
              <Paperclip className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">{file.name}</div>
                <div className="text-xs text-slate-500">
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>
              <button
                onClick={() => handleRemoveAttachment(index)}
                className="p-1 text-slate-400 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Composer */}
      <div className="px-4 py-3">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled || isSending}
          rows={1}
          className="w-full resize-none border-none focus:outline-none focus:ring-0 text-slate-900 placeholder-slate-400 max-h-40"
          style={{ minHeight: '24px', maxHeight: '160px' }}
        />
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 pb-3">
        <div className="flex items-center gap-1">
          {/* Attach File */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isSending}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Security Level */}
          <div className="relative">
            <button
              onClick={() => setShowSecurityMenu(!showSecurityMenu)}
              disabled={disabled || isSending}
              className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedSecurityLevel !== 'standard'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Set security level"
            >
              <Shield className="w-5 h-5" />
            </button>

            {/* Security Menu */}
            {showSecurityMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                {(['standard', 'privileged', 'confidential', 'attorney-client'] as SecurityLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      setSelectedSecurityLevel(level);
                      setShowSecurityMenu(false);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-50 transition-colors flex items-center justify-between"
                  >
                    <SecureLabel level={level} size="sm" />
                    {selectedSecurityLevel === level && (
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
            ${canSend
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }
          `}
        >
          {isSending ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send</span>
            </>
          )}
        </button>
      </div>

      {/* Keyboard Hint */}
      <div className="px-4 pb-2">
        <p className="text-xs text-slate-500">
          Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300">Enter</kbd> to send,
          <kbd className="px-1.5 py-0.5 bg-slate-100 rounded border border-slate-300 ml-1">Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
};

interface QuickReplyComposerProps {
  onSend: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Simplified composer for quick replies
 */
export const QuickReplyComposer: React.FC<QuickReplyComposerProps> = ({
  onSend,
  placeholder = 'Type a quick reply...',
  disabled = false,
  className = '',
}) => {
  const [content, setContent] = useState('');

  const handleSend = () => {
    const trimmed = content.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setContent('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={handleSend}
        disabled={!content.trim() || disabled}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
};
