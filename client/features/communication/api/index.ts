/**
 * Communication API Exports
 *
 * Re-exports all communication API hooks and types for clean imports.
 */

// Types
export * from './communication.types';

// Message API Hooks
export {
  messageKeys,
  useConversations,
  useConversation,
  useConversationMessages,
  useUnreadCount as useMessageUnreadCount,
  useSearchMessages,
  useCreateConversation,
  useUpdateConversation,
  useDeleteConversation,
  useSendMessage,
  useMarkAsRead,
  useDeleteMessage,
  useEditMessage,
  useReactToMessage,
} from './messages.api';

// Notification API Hooks
export {
  notificationKeys,
  activityKeys,
  useNotifications,
  useUnreadCount as useNotificationUnreadCount,
  useNotificationPreferences,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useClearNotification,
  useClearNotifications,
  useUpdateNotificationPreferences,
  useActivityFeed,
  useCaseActivity,
  useUserActivity,
  useGlobalActivity,
  useCreateActivity,
  useDeleteActivity,
} from './notifications.api';
