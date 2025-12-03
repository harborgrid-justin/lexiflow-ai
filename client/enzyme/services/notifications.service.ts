// Notifications Service using Enzyme API Client
// Provides type-safe notification and activity operations

import { enzymeClient } from './client';
import { Notification, NotificationPreferences } from '../../types';
import { NotificationsResponse, ActivityResponse, ActivityFilters, Activity } from '../../features/communication/api/communication.types';

/**
 * Endpoint definitions for notifications
 */
const ENDPOINTS = {
  notifications: {
    list: '/notifications',
    unread: '/notifications/unread-count',
    preferences: '/notifications/preferences',
    markAllRead: '/notifications/mark-all-read',
    detail: (id: string) => `/notifications/${id}`,
    markRead: (id: string) => `/notifications/${id}/read`,
  },
  activity: {
    list: '/activity',
  },
} as const;

export interface NotificationOptions {
  page?: number;
  limit?: number;
  type?: string[];
  unreadOnly?: boolean;
}

/**
 * Notifications service using Enzyme API client
 */
export const enzymeNotificationsService = {
  /**
   * Notification operations
   */
  notifications: {
    /**
     * Get all notifications with pagination
     */
    async getAll(options?: NotificationOptions): Promise<NotificationsResponse> {
      const response = await enzymeClient.get<NotificationsResponse>(ENDPOINTS.notifications.list, {
        params: options as Record<string, string | number | boolean | string[]>,
      });
      return response.data;
    },

    /**
     * Get unread notification count
     */
    async getUnreadCount(): Promise<{ count: number; byType: Record<string, number> }> {
      const response = await enzymeClient.get<{ count: number; byType: Record<string, number> }>(
        ENDPOINTS.notifications.unread
      );
      return response.data;
    },

    /**
     * Get notification preferences
     */
    async getPreferences(): Promise<NotificationPreferences> {
      const response = await enzymeClient.get<NotificationPreferences>(ENDPOINTS.notifications.preferences);
      return response.data;
    },

    /**
     * Update notification preferences
     */
    async updatePreferences(preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
      const response = await enzymeClient.put<NotificationPreferences>(ENDPOINTS.notifications.preferences, {
        body: preferences as Record<string, unknown>,
      });
      return response.data;
    },

    /**
     * Mark a notification as read
     */
    async markRead(id: string): Promise<Notification> {
      const response = await enzymeClient.put<Notification>(ENDPOINTS.notifications.markRead(id), {});
      return response.data;
    },

    /**
     * Mark all notifications as read
     */
    async markAllRead(): Promise<{ success: boolean; count: number }> {
      const response = await enzymeClient.post<{ success: boolean; count: number }>(
        ENDPOINTS.notifications.markAllRead,
        {}
      );
      return response.data;
    },

    /**
     * Delete a notification
     */
    async delete(id: string): Promise<void> {
      await enzymeClient.delete(ENDPOINTS.notifications.detail(id));
    },

    /**
     * Clear multiple notifications
     */
    async clear(options?: { olderThan?: string; type?: string[] }): Promise<void> {
      await enzymeClient.delete(ENDPOINTS.notifications.list, {
        params: options as Record<string, string | number | boolean | string[]>,
      });
    },
  },

  /**
   * Activity operations
   */
  activity: {
    /**
     * Get activity feed
     */
    async getAll(filters?: ActivityFilters): Promise<ActivityResponse> {
      const response = await enzymeClient.get<ActivityResponse>(ENDPOINTS.activity.list, {
        params: filters as Record<string, string | number | boolean>,
      });
      return response.data;
    },

    /**
     * Get case activity
     */
    async getCaseActivity(caseId: string, limit: number = 20): Promise<ActivityResponse> {
      const response = await enzymeClient.get<ActivityResponse>(`${ENDPOINTS.activity.list}/case/${caseId}`, {
        params: { limit },
      });
      return response.data;
    },

    /**
     * Get user activity
     */
    async getUserActivity(userId: string, limit: number = 20): Promise<ActivityResponse> {
      const response = await enzymeClient.get<ActivityResponse>(`${ENDPOINTS.activity.list}/user/${userId}`, {
        params: { limit },
      });
      return response.data;
    },

    /**
     * Get global activity
     */
    async getGlobalActivity(page: number = 1, limit: number = 50): Promise<ActivityResponse> {
      const response = await enzymeClient.get<ActivityResponse>(`${ENDPOINTS.activity.list}/global`, {
        params: { page, limit },
      });
      return response.data;
    },

    /**
     * Create activity
     */
    async create(activity: Partial<Activity>): Promise<Activity> {
      const response = await enzymeClient.post<Activity>(ENDPOINTS.activity.list, {
        body: activity as Record<string, unknown>,
      });
      return response.data;
    },

    /**
     * Delete activity
     */
    async delete(id: string): Promise<void> {
      await enzymeClient.delete(`${ENDPOINTS.activity.list}/${id}`);
    },
  },
};

export default enzymeNotificationsService;
