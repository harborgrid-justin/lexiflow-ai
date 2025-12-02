/**
 * Communication Feature Exports
 *
 * Centralized exports for the communication and collaboration feature
 */

// API & Types
export * from './api/communication.types';
export * from './api/messages.api';
export * from './api/notifications.api';

// Store
export * from './store/communication.store';

// Components
export { SecureLabel, SecurityBanner } from './components/SecureLabel';
export { UserPresence, UserPresenceBadge } from './components/UserPresence';
export { TypingIndicator, CompactTypingIndicator } from './components/TypingIndicator';
export { ReadReceipts, ReadReceiptList } from './components/ReadReceipts';
export { NotificationBadge, UnreadDot } from './components/NotificationBadge';
export { MessageBubble, SystemMessage } from './components/MessageBubble';
export { FileAttachment, FileAttachmentList, CompactFileAttachment } from './components/FileAttachment';
export { ParticipantList, CompactParticipantList, ParticipantSelector } from './components/ParticipantList';
export { ConversationItem } from './components/ConversationItem';
export { ConversationList } from './components/ConversationList';
export { MessageComposer, QuickReplyComposer } from './components/MessageComposer';
export { NotificationItem, CompactNotificationItem } from './components/NotificationItem';
export { NotificationCenter, NotificationIcon } from './components/NotificationCenter';
export { ActivityItem, CompactActivityItem } from './components/ActivityItem';
export { ActivityFeed, ActivitySidebar } from './components/ActivityFeed';
export { ShareDialog } from './components/ShareDialog';

// Pages
export { MessagesPage } from './pages/MessagesPage';
