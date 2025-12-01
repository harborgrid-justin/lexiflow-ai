// Notification Service
// Event-based notification system

import { Injectable } from '@nestjs/common';
import { NotificationEvent, NotificationType } from './types';
import { ArrayStore, generateId } from './store';

@Injectable()
export class NotificationService {
  private notifications = new ArrayStore<NotificationEvent>();

  async create(
    type: NotificationType,
    recipientId: string,
    title: string,
    message: string,
    options?: {
      caseId?: string;
      taskId?: string;
      priority?: 'low' | 'normal' | 'high' | 'urgent';
      email?: string;
    },
  ): Promise<NotificationEvent> {
    const notification: NotificationEvent = {
      id: generateId('notif'),
      type,
      recipientId,
      recipientEmail: options?.email,
      title,
      message,
      caseId: options?.caseId,
      taskId: options?.taskId,
      priority: options?.priority || 'normal',
      read: false,
      createdAt: new Date(),
    };

    this.notifications.push(recipientId, notification);

    // Log for now - would integrate with email/push service
    console.log(`[NOTIFICATION] ${type}: ${title} -> ${recipientId}`);

    return notification;
  }

  getForUser(userId: string, unreadOnly = false): NotificationEvent[] {
    const notifications = this.notifications.get(userId);
    const filtered = unreadOnly
      ? notifications.filter(n => !n.read)
      : notifications;

    return filtered.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  markAsRead(notificationId: string, userId: string): boolean {
    const notifications = this.notifications.get(userId);
    const notification = notifications.find(n => n.id === notificationId);

    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  }

  markAllAsRead(userId: string): number {
    const notifications = this.notifications.get(userId);
    let count = 0;

    notifications.forEach(n => {
      if (!n.read) {
        n.read = true;
        count++;
      }
    });

    return count;
  }

  getUnreadCount(userId: string): number {
    return this.notifications.get(userId).filter(n => !n.read).length;
  }

  delete(notificationId: string, userId: string): boolean {
    const before = this.notifications.size(userId);
    this.notifications.remove(userId, n => n.id === notificationId);
    return this.notifications.size(userId) < before;
  }

  clearOld(daysOld: number): number {
    const cutoff = Date.now() - daysOld * 24 * 60 * 60 * 1000;
    let deleted = 0;

    // This is a simplified implementation
    const all = this.notifications.getAll();
    all.forEach(n => {
      if (n.createdAt.getTime() < cutoff) {
        this.delete(n.id, n.recipientId);
        deleted++;
      }
    });

    return deleted;
  }

  // Convenience methods for common notifications
  async notifyTaskAssigned(
    recipientId: string,
    taskTitle: string,
    taskId: string,
    caseId?: string,
  ): Promise<NotificationEvent> {
    return this.create(
      'task_assigned',
      recipientId,
      `Task Assigned: ${taskTitle}`,
      'A new task has been assigned to you',
      { taskId, caseId },
    );
  }

  async notifySLAWarning(
    recipientId: string,
    taskTitle: string,
    hoursRemaining: number,
    taskId: string,
  ): Promise<NotificationEvent> {
    return this.create(
      'sla_warning',
      recipientId,
      `SLA Warning: ${taskTitle}`,
      `Task is due in ${Math.round(hoursRemaining)} hours`,
      { taskId, priority: 'high' },
    );
  }

  async notifySLABreach(
    recipientId: string,
    taskTitle: string,
    hoursOverdue: number,
    taskId: string,
  ): Promise<NotificationEvent> {
    return this.create(
      'sla_breach',
      recipientId,
      `SLA Breach: ${taskTitle}`,
      `Task is ${Math.round(hoursOverdue)} hours overdue`,
      { taskId, priority: 'urgent' },
    );
  }

  async notifyApprovalRequired(
    recipientId: string,
    taskTitle: string,
    taskId: string,
  ): Promise<NotificationEvent> {
    return this.create(
      'approval_required',
      recipientId,
      `Approval Required: ${taskTitle}`,
      'Your approval is needed for this task',
      { taskId, priority: 'high' },
    );
  }
}
