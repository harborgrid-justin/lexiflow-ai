/**
 * ConversationList Component
 *
 * Left sidebar showing all conversations with search and filters
 */

import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, X } from 'lucide-react';
import { Conversation } from '../api/communication.types';
import { ConversationItem } from './ConversationItem';
import { Button, LoadingSpinner } from '../../../components/common';

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  isLoading?: boolean;
  onSelectConversation: (conversationId: string) => void;
  onCreateConversation?: () => void;
  onArchiveConversation?: (conversationId: string) => void;
  onPinConversation?: (conversationId: string) => void;
  typingUsers?: Record<string, string[]>; // conversationId -> userIds
  className?: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  activeConversationId,
  isLoading = false,
  onSelectConversation,
  onCreateConversation,
  onArchiveConversation,
  onPinConversation,
  typingUsers = {},
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    unreadOnly: false,
    type: 'all' as 'all' | 'direct' | 'group' | 'case',
    securityLevel: 'all' as 'all' | 'standard' | 'privileged' | 'confidential' | 'attorney-client',
  });

  // Filter and sort conversations
  const filteredConversations = useMemo(() => {
    let result = [...conversations];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((conv) => {
        const name = (conv.name || conv.caseName || '').toLowerCase();
        const lastMessage = (conv.lastMessage?.content || '').toLowerCase();
        const participants = conv.participants.map(p => p.name.toLowerCase()).join(' ');
        return name.includes(query) || lastMessage.includes(query) || participants.includes(query);
      });
    }

    // Unread filter
    if (filters.unreadOnly) {
      result = result.filter((conv) => conv.unreadCount > 0);
    }

    // Type filter
    if (filters.type !== 'all') {
      result = result.filter((conv) => conv.type === filters.type);
    }

    // Security level filter
    if (filters.securityLevel !== 'all') {
      result = result.filter((conv) => conv.securityLevel === filters.securityLevel);
    }

    // Sort: pinned first, then by last message time
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      const aTime = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bTime = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bTime - aTime;
    });

    return result;
  }, [conversations, searchQuery, filters]);

  const hasActiveFilters = filters.unreadOnly || filters.type !== 'all' || filters.securityLevel !== 'all';

  return (
    <div className={`flex flex-col h-full bg-white border-r border-slate-200 ${className}`}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-slate-900">Messages</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors relative ${
                hasActiveFilters
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title="Filters"
            >
              <Filter className="w-5 h-5" />
              {hasActiveFilters && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
              )}
            </button>
            {onCreateConversation && (
              <button
                onClick={onCreateConversation}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="New conversation"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-3 p-3 bg-slate-50 rounded-lg space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.unreadOnly}
                onChange={(e) => setFilters({ ...filters, unreadOnly: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-700">Show unread only</span>
            </label>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value as any })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All types</option>
                <option value="direct">Direct messages</option>
                <option value="group">Group conversations</option>
                <option value="case">Case discussions</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">Security Level</label>
              <select
                value={filters.securityLevel}
                onChange={(e) => setFilters({ ...filters, securityLevel: e.target.value as any })}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All levels</option>
                <option value="standard">Standard</option>
                <option value="privileged">Privileged</option>
                <option value="confidential">Confidential</option>
                <option value="attorney-client">Attorney-Client</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={() => setFilters({
                  unreadOnly: false,
                  type: 'all',
                  securityLevel: 'all',
                })}
                className="w-full px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 mb-1">
              {searchQuery || hasActiveFilters ? 'No conversations found' : 'No conversations yet'}
            </p>
            <p className="text-sm text-slate-500">
              {searchQuery || hasActiveFilters
                ? 'Try adjusting your search or filters'
                : 'Start a new conversation to get started'
              }
            </p>
            {onCreateConversation && !searchQuery && !hasActiveFilters && (
              <Button
                onClick={onCreateConversation}
                variant="primary"
                className="mt-4"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Conversation
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                isTyping={typingUsers[conversation.id]?.length > 0}
                onClick={() => onSelectConversation(conversation.id)}
                onArchive={onArchiveConversation ? () => onArchiveConversation(conversation.id) : undefined}
                onPin={onPinConversation ? () => onPinConversation(conversation.id) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
