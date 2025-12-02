/**
 * Notifications API Hooks
 *
 * TanStack Query hooks for notification operations.
 * Handles notifications, preferences, and activity feeds.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchJson, postJson, putJson, deleteJson, buildQueryString } from '../../../services/http-client';
import {
  Notification,
  NotificationsResponse,
  NotificationPreferences,
  NotificationType,
  Activity,
  ActivityResponse,
  ActivityFilters,
} from './communication.types';

// ============================================================================
// Query Keys
// ============================================================================

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (filters?: any) => [...notificationKeys.all, 'list', filters] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
  preferences: () => [...notificationKeys.all, 'preferences'] as const,
};

export const activityKeys = {
  all: ['activity'] as const,
  list: (filters?: ActivityFilters) => [...activityKeys.all, 'list', filters] as const,
  feed: (page: number, limit: number) => [...activityKeys.all, 'feed', page, limit] as const,
};

// ============================================================================
// Notification Queries
// ============================================================================

/**
 * Fetch all notifications with pagination
 */
export function useNotifications(options?: {
  page?: number;
  limit?: number;
  type?: NotificationType[];
  unreadOnly?: boolean;
}) {
  return useQuery({
    queryKey: notificationKeys.list(options),
    queryFn: async () => {
      const queryString = buildQueryString(options as any);
      return fetchJson<NotificationsResponse>(`/notifications${queryString}`);
    },
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });
}

/**
 * Get unread notification count
 */
export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => fetchJson<{ count: number; byType: Record<NotificationType, number> }>('/notifications/unread-count'),
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });
}

/**
 * Get notification preferences for current user
 */
export function useNotificationPreferences() {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: () => fetchJson<NotificationPreferences>('/notifications/preferences'),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// ============================================================================
// Notification Mutations
// ============================================================================

/**
 * Mark a single notification as read
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      return putJson<Notification>(`/notifications/${notificationId}/read`, {});
    },
    onMutate: async (notificationId) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: notificationKeys.list() });

      // Snapshot previous value
      const previousNotifications = queryClient.getQueryData(notificationKeys.list());

      // Optimistically update
      queryClient.setQueriesData<NotificationsResponse>(
        { queryKey: notificationKeys.list() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            notifications: old.notifications.map((n) =>
              n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
            ),
            unreadCount: Math.max(0, old.unreadCount - 1),
          };
        }
      );

      return { previousNotifications };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousNotifications) {
        queryClient.setQueryData(notificationKeys.list(), context.previousNotifications);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
}

/**
 * Mark all notifications as read
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return postJson<{ success: boolean; count: number }>('/notifications/mark-all-read', {});
    },
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Clear/dismiss a notification
 */
export function useClearNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      return deleteJson(`/notifications/${notificationId}`);
    },
    onSuccess: () => {
      // Invalidate notification queries
      queryClient.invalidateQueries({ queryKey: notificationKeys.list() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
}

/**
 * Clear all notifications
 */
export function useClearNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (options?: { olderThan?: string; type?: NotificationType[] }) => {
      const queryString = buildQueryString(options as any);
      return deleteJson(`/notifications${queryString}`);
    },
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Update notification preferences
 */
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (preferences: Partial<NotificationPreferences>) => {
      return putJson<NotificationPreferences>('/notifications/preferences', preferences);
    },
    onSuccess: (updatedPreferences) => {
      // Update preferences in cache
      queryClient.setQueryData(notificationKeys.preferences(), updatedPreferences);
    },
  });
}

// ============================================================================
// Activity Feed Queries
// ============================================================================

/**
 * Fetch activity feed with filtering
 */
export function useActivityFeed(
  filters?: ActivityFilters,
  options?: {
    page?: number;
    limit?: number;
  }
) {
  const page = options?.page || 1;
  const limit = options?.limit || 20;

  return useQuery({
    queryKey: activityKeys.list({ ...filters, page, limit }),
    queryFn: async () => {
      const queryString = buildQueryString({ ...filters, page, limit } as any);
      return fetchJson<ActivityResponse>(`/activity${queryString}`);
    },
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
  });
}

/**
 * Fetch recent activities for a specific case
 */
export function useCaseActivity(caseId: string | undefined, limit: number = 20) {
  return useQuery({
    queryKey: [...activityKeys.all, 'case', caseId, limit],
    queryFn: async () => {
      if (!caseId) throw new Error('Case ID is required');
      return fetchJson<ActivityResponse>(`/activity/case/${caseId}?limit=${limit}`);
    },
    enabled: !!caseId,
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Fetch activities for a specific user
 */
export function useUserActivity(userId: string | undefined, limit: number = 20) {
  return useQuery({
    queryKey: [...activityKeys.all, 'user', userId, limit],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');
      return fetchJson<ActivityResponse>(`/activity/user/${userId}?limit=${limit}`);
    },
    enabled: !!userId,
    staleTime: 1000 * 60, // 1 minute
  });
}

/**
 * Fetch global activity stream
 */
export function useGlobalActivity(page: number = 1, limit: number = 50) {
  return useQuery({
    queryKey: activityKeys.feed(page, limit),
    queryFn: async () => {
      return fetchJson<ActivityResponse>(`/activity/global?page=${page}&limit=${limit}`);
    },
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 60, // Refetch every minute
    refetchOnWindowFocus: true,
  });
}

// ============================================================================
// Activity Mutations
// ============================================================================

/**
 * Create a custom activity entry
 */
export function useCreateActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activity: Partial<Activity>) => {
      return postJson<Activity>('/activity', activity);
    },
    onSuccess: () => {
      // Invalidate activity queries to show new activity
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}

/**
 * Delete an activity entry
 */
export function useDeleteActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityId: string) => {
      return deleteJson(`/activity/${activityId}`);
    },
    onSuccess: () => {
      // Invalidate activity queries
      queryClient.invalidateQueries({ queryKey: activityKeys.all });
    },
  });
}
