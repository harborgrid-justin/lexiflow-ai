/**
 * Communication Types
 *
 * Comprehensive type definitions for secure communication and collaboration features.
 * Includes messages, conversations, notifications, and activity tracking.
 */

// ============================================================================
// Message & Conversation Types
// ============================================================================

export type MessageType = 'text' | 'file' | 'system' | 'mention';
export type ConversationType = 'direct' | 'group' | 'case';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type SecurityLevel = 'standard' | 'privileged' | 'confidential' | 'attorney-client';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  type: MessageType;
  content: string;
  status: MessageStatus;
  securityLevel: SecurityLevel;
  createdAt: string;
  updatedAt?: string;

  // Threading
  parentMessageId?: string;
  threadCount?: number;

  // Mentions
  mentions?: string[]; // User IDs
  mentionedUsers?: Array<{
    id: string;
    name: string;
  }>;

  // Attachments
  attachments?: MessageAttachment[];

  // Read receipts
  readBy?: Array<{
    userId: string;
    readAt: string;
  }>;

  // Metadata
  isEdited?: boolean;
  editedAt?: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string;
  description?: string;
  securityLevel: SecurityLevel;

  // Participants
  participantIds: string[];
  participants: ConversationParticipant[];

  // Case linkage
  caseId?: string;
  caseName?: string;

  // Last message info
  lastMessage?: Message;
  lastMessageAt?: string;

  // Unread tracking
  unreadCount: number;

  // Metadata
  createdAt: string;
  createdBy: string;
  updatedAt?: string;
  archivedAt?: string;
  isArchived: boolean;

  // Settings
  isMuted?: boolean;
  isPinned?: boolean;
}

export interface ConversationParticipant {
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  joinedAt: string;
  lastReadAt?: string;
  isOnline?: boolean;
  lastActiveAt?: string;
}

// ============================================================================
// Notification Types
// ============================================================================

export type NotificationType =
  | 'task_assigned'
  | 'mention'
  | 'deadline_reminder'
  | 'case_update'
  | 'document_shared'
  | 'approval_request'
  | 'comment'
  | 'message'
  | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;

  // Target resource
  resourceType?: 'case' | 'document' | 'task' | 'message' | 'conversation';
  resourceId?: string;
  resourceName?: string;

  // Actor
  actorId?: string;
  actorName?: string;
  actorAvatar?: string;

  // Status
  isRead: boolean;
  readAt?: string;

  // Actions
  actionUrl?: string;
  actionLabel?: string;

  // Metadata
  createdAt: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  userId: string;

  // Email notifications
  emailEnabled: boolean;
  emailTypes: NotificationType[];
  emailDigest: 'realtime' | 'hourly' | 'daily' | 'weekly' | 'never';

  // In-app notifications
  inAppEnabled: boolean;
  inAppTypes: NotificationType[];

  // Push notifications
  pushEnabled: boolean;
  pushTypes: NotificationType[];

  // Quiet hours
  quietHoursEnabled: boolean;
  quietHoursStart?: string; // e.g., "22:00"
  quietHoursEnd?: string; // e.g., "08:00"

  // Do not disturb
  doNotDisturb: boolean;
  doNotDisturbUntil?: string;
}

// ============================================================================
// Activity Feed Types
// ============================================================================

export type ActivityType =
  | 'case_created'
  | 'case_updated'
  | 'case_status_changed'
  | 'document_uploaded'
  | 'document_updated'
  | 'document_deleted'
  | 'task_created'
  | 'task_completed'
  | 'task_assigned'
  | 'time_entry_created'
  | 'comment_added'
  | 'mention'
  | 'user_joined'
  | 'user_left';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;

  // Actor
  actorId: string;
  actorName: string;
  actorAvatar?: string;
  actorRole?: string;

  // Target resource
  resourceType: 'case' | 'document' | 'task' | 'time_entry' | 'comment' | 'user';
  resourceId: string;
  resourceName?: string;

  // Related resources
  caseId?: string;
  caseName?: string;

  // Changes
  changes?: Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }>;

  // Metadata
  metadata?: Record<string, any>;
  createdAt: string;
}

// ============================================================================
// Secure Sharing Types
// ============================================================================

export type SharePermission = 'view' | 'comment' | 'edit';
export type ShareRecipientType = 'internal' | 'external_counsel' | 'client';

export interface ShareRecipient {
  id: string;
  type: ShareRecipientType;
  email: string;
  name: string;
  permission: SharePermission;
  expiresAt?: string;
  notifyOnAccess?: boolean;
}

export interface ShareSettings {
  resourceType: 'case' | 'document' | 'folder';
  resourceId: string;
  resourceName: string;

  recipients: ShareRecipient[];

  // Security
  requireLogin: boolean;
  requirePassword?: boolean;
  password?: string;

  // Expiration
  expiresAt?: string;
  maxAccesses?: number;

  // Tracking
  trackAccess: boolean;
  notifyOwner: boolean;

  // Restrictions
  allowDownload: boolean;
  allowPrint: boolean;
  allowCopy: boolean;

  // Watermark
  applyWatermark: boolean;
  watermarkText?: string;
}

export interface AccessLog {
  id: string;
  resourceType: string;
  resourceId: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  action: 'viewed' | 'downloaded' | 'printed' | 'copied' | 'shared';
  ipAddress?: string;
  userAgent?: string;
  accessedAt: string;
}

// ============================================================================
// Presence & Typing Indicators
// ============================================================================

export interface UserPresence {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastActiveAt: string;
  currentActivity?: string;
}

export interface TypingIndicator {
  conversationId: string;
  userId: string;
  userName: string;
  startedAt: string;
}

// ============================================================================
// Search & Filter Types
// ============================================================================

export interface MessageSearchParams {
  query: string;
  conversationId?: string;
  senderId?: string;
  dateFrom?: string;
  dateTo?: string;
  hasAttachments?: boolean;
  securityLevel?: SecurityLevel;
}

export interface ConversationFilters {
  type?: ConversationType;
  caseId?: string;
  participantId?: string;
  isArchived?: boolean;
  hasUnread?: boolean;
  securityLevel?: SecurityLevel;
}

export interface ActivityFilters {
  type?: ActivityType[];
  actorId?: string;
  caseId?: string;
  resourceType?: string;
  dateFrom?: string;
  dateTo?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ConversationsResponse {
  conversations: Conversation[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface MessagesResponse {
  messages: Message[];
  total: number;
  hasMore: boolean;
  cursor?: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  hasMore: boolean;
}

export interface ActivityResponse {
  activities: Activity[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================================================
// Mutation Input Types
// ============================================================================

export interface SendMessageInput {
  conversationId: string;
  content: string;
  type?: MessageType;
  securityLevel?: SecurityLevel;
  parentMessageId?: string;
  mentions?: string[];
  attachments?: File[];
}

export interface CreateConversationInput {
  type: ConversationType;
  name?: string;
  description?: string;
  participantIds: string[];
  caseId?: string;
  securityLevel?: SecurityLevel;
}

export interface UpdateConversationInput {
  name?: string;
  description?: string;
  participantIds?: string[];
  isArchived?: boolean;
  isMuted?: boolean;
  isPinned?: boolean;
}

export interface MarkMessagesReadInput {
  conversationId: string;
  messageIds?: string[];
  readAll?: boolean;
}

export interface CreateShareInput {
  resourceType: 'case' | 'document' | 'folder';
  resourceId: string;
  recipients: Array<{
    email: string;
    permission: SharePermission;
  }>;
  settings: Partial<ShareSettings>;
}
