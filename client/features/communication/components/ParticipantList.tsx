/**
 * ParticipantList Component
 *
 * Displays conversation participants with presence indicators
 */

import React from 'react';
import { UserPlus, Crown, User } from 'lucide-react';
import { ConversationParticipant } from '../api/communication.types';
import { UserAvatar } from '../../../components/common';
import { UserPresence } from './UserPresence';

interface ParticipantListProps {
  participants: ConversationParticipant[];
  onAddParticipant?: () => void;
  onRemoveParticipant?: (userId: string) => void;
  currentUserId?: string;
  showRole?: boolean;
  className?: string;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  onAddParticipant,
  onRemoveParticipant,
  currentUserId,
  showRole = true,
  className = '',
}) => {
  const formatLastActive = (timestamp?: string) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">
          Participants ({participants.length})
        </h3>
        {onAddParticipant && (
          <button
            onClick={onAddParticipant}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Add participant"
          >
            <UserPlus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Participants */}
      <div className="space-y-2">
        {participants.map((participant) => {
          const isCurrentUser = participant.userId === currentUserId;
          const status = participant.isOnline ? 'online' : 'offline';

          return (
            <div
              key={participant.userId}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors group"
            >
              {/* Avatar with presence */}
              <div className="relative flex-shrink-0">
                <UserAvatar
                  name={participant.name}
                  src={participant.avatar}
                  size="sm"
                />
                <div className="absolute bottom-0 right-0">
                  <UserPresence status={status} size="sm" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-900 truncate">
                    {participant.name}
                    {isCurrentUser && (
                      <span className="ml-1 text-xs text-slate-500">(You)</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  {showRole && participant.role && (
                    <span>{participant.role}</span>
                  )}
                  {participant.isOnline ? (
                    <span className="text-green-600">Online</span>
                  ) : (
                    <span>Last active {formatLastActive(participant.lastActiveAt)}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              {onRemoveParticipant && !isCurrentUser && (
                <button
                  onClick={() => onRemoveParticipant(participant.userId)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-red-600 hover:bg-red-50 rounded transition-all"
                  title="Remove participant"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface CompactParticipantListProps {
  participants: ConversationParticipant[];
  max?: number;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Compact participant list showing avatars only
 */
export const CompactParticipantList: React.FC<CompactParticipantListProps> = ({
  participants,
  max = 3,
  size = 'sm',
  className = '',
}) => {
  const visible = participants.slice(0, max);
  const remaining = Math.max(0, participants.length - max);

  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex -space-x-2">
        {visible.map((participant) => (
          <div
            key={participant.userId}
            className="relative ring-2 ring-white rounded-full"
            title={participant.name}
          >
            <UserAvatar
              name={participant.name}
              src={participant.avatar}
              size={size}
            />
            {participant.isOnline && (
              <div className="absolute bottom-0 right-0">
                <UserPresence status="online" size="sm" />
              </div>
            )}
          </div>
        ))}
      </div>
      {remaining > 0 && (
        <div
          className={`
            flex items-center justify-center ml-1 rounded-full bg-slate-200 text-slate-600 font-medium
            ${size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'}
          `}
          title={`${remaining} more participants`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
};

interface ParticipantSelectorProps {
  availableUsers: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
  selectedUserIds: string[];
  onToggleUser: (userId: string) => void;
  className?: string;
}

/**
 * Participant selector for creating/editing conversations
 */
export const ParticipantSelector: React.FC<ParticipantSelectorProps> = ({
  availableUsers,
  selectedUserIds,
  onToggleUser,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredUsers = availableUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search */}
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* User List */}
      <div className="max-h-64 overflow-y-auto space-y-1">
        {filteredUsers.map((user) => {
          const isSelected = selectedUserIds.includes(user.id);

          return (
            <button
              key={user.id}
              onClick={() => onToggleUser(user.id)}
              className={`
                w-full flex items-center gap-3 p-2 rounded-lg transition-colors text-left
                ${isSelected
                  ? 'bg-blue-50 border-2 border-blue-500'
                  : 'hover:bg-slate-50 border-2 border-transparent'
                }
              `}
            >
              <UserAvatar name={user.name} src={user.avatar} size="sm" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">
                  {user.name}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {user.email}
                </div>
              </div>
              {isSelected && (
                <div className="flex-shrink-0 text-blue-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          No users found
        </div>
      )}
    </div>
  );
};
