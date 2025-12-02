/**
 * TypingIndicator Component
 *
 * Shows when users are typing in a conversation
 */

import React from 'react';

interface TypingIndicatorProps {
  users: Array<{ id: string; name: string }>;
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ users, className = '' }) => {
  if (users.length === 0) return null;

  const displayText = (() => {
    if (users.length === 1) {
      return `${users[0].name} is typing...`;
    } else if (users.length === 2) {
      return `${users[0].name} and ${users[1].name} are typing...`;
    } else {
      return `${users[0].name} and ${users.length - 1} others are typing...`;
    }
  })();

  return (
    <div className={`flex items-center gap-2 text-sm text-slate-500 ${className}`}>
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="italic">{displayText}</span>
    </div>
  );
};

/**
 * Compact typing indicator for use in conversation lists
 */
export const CompactTypingIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
};
