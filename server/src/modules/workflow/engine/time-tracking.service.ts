// Time Tracking Service
// Integrates time entries with workflow tasks

import { Injectable } from '@nestjs/common';
import { TimeEntry, TimeTrackingConfig } from './types';
import { InMemoryStore } from './store';

@Injectable()
export class TimeTrackingService {
  private entries = new InMemoryStore<TimeEntry>();
  private configs = new InMemoryStore<TimeTrackingConfig>();
  private activeTimers = new Map<string, { taskId: string; startTime: Date }>();

  setConfig(taskId: string, config: TimeTrackingConfig): void {
    this.configs.set(taskId, { ...config, taskId });
  }

  getConfig(taskId: string): TimeTrackingConfig | undefined {
    return this.configs.get(taskId);
  }

  startTimer(taskId: string, userId: string): string {
    const timerId = `timer_${taskId}_${userId}`;

    if (this.activeTimers.has(timerId)) {
      return timerId; // Already running
    }

    this.activeTimers.set(timerId, { taskId, startTime: new Date() });
    return timerId;
  }

  stopTimer(
    taskId: string,
    userId: string,
    description?: string,
  ): TimeEntry | null {
    const timerId = `timer_${taskId}_${userId}`;
    const timer = this.activeTimers.get(timerId);

    if (!timer) {
      return null;
    }

    const endTime = new Date();
    const durationMinutes = Math.round(
      (endTime.getTime() - timer.startTime.getTime()) / 60000,
    );

    this.activeTimers.delete(timerId);

    const entry = this.addTimeEntry({
      taskId,
      userId,
      startTime: timer.startTime,
      endTime,
      durationMinutes,
      description: description || 'Auto-tracked time',
      billable: this.configs.get(taskId)?.autoTrack ?? true,
    });

    return entry;
  }

  addTimeEntry(
    entry: Omit<TimeEntry, 'id' | 'createdAt'>,
  ): TimeEntry {
    const fullEntry: TimeEntry = {
      ...entry,
      id: this.generateId(),
      createdAt: new Date(),
    };
    this.entries.set(fullEntry.id, fullEntry);
    return fullEntry;
  }

  getTaskTimeEntries(taskId: string): TimeEntry[] {
    return this.entries.filter(e => e.taskId === taskId);
  }

  getUserTimeEntries(userId: string, since?: Date): TimeEntry[] {
    return this.entries.filter(e => {
      if (e.userId !== userId) {
        return false;
      }
      if (since && e.createdAt < since) {
        return false;
      }
      return true;
    });
  }

  getTaskTotalTime(taskId: string): number {
    const taskEntries = this.getTaskTimeEntries(taskId);
    return taskEntries.reduce((sum, e) => sum + e.durationMinutes, 0);
  }

  getBillableTime(taskId: string): number {
    const taskEntries = this.getTaskTimeEntries(taskId);
    return taskEntries
      .filter(e => e.billable)
      .reduce((sum, e) => sum + e.durationMinutes, 0);
  }

  isTimerActive(taskId: string, userId: string): boolean {
    const timerId = `timer_${taskId}_${userId}`;
    return this.activeTimers.has(timerId);
  }

  getActiveTimerDuration(taskId: string, userId: string): number | null {
    const timerId = `timer_${taskId}_${userId}`;
    const timer = this.activeTimers.get(timerId);
    if (!timer) {
      return null;
    }

    return Math.round(
      (new Date().getTime() - timer.startTime.getTime()) / 60000,
    );
  }

  deleteTimeEntry(entryId: string): boolean {
    return this.entries.delete(entryId);
  }

  private generateId(): string {
    return `time_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}
