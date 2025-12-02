/**
 * TimeTrackingPanel Component
 *
 * ENZYME MIGRATION - Agent 30 (Wave 4)
 * =======================================
 *
 * Migration Summary:
 * - Added useTrackEvent() for analytics tracking
 * - Added useIsMounted() for safe async state updates
 * - Wrapped handlers with useLatestCallback() for stable references
 *
 * Tracked Events:
 * - time_tracking_started: When user starts time tracking
 * - time_tracking_stopped: When user stops time tracking (with duration)
 * - time_tracking_entries_loaded: When time entries are loaded successfully
 *
 * Hooks Used:
 * - useTrackEvent: Event analytics tracking
 * - useIsMounted: Safe async state updates
 * - useLatestCallback: Stable callback references
 *
 * Performance:
 * - useLatestCallback ensures handlers don't cause unnecessary re-renders
 * - useIsMounted prevents state updates on unmounted components
 *
 * @see /workspaces/lexiflow-ai/client/enzyme/MIGRATION_SCRATCHPAD.md
 */

import React, { useState, useEffect } from 'react';
import { Play, Pause, Clock } from 'lucide-react';
import { useWorkflowEngine } from '../../hooks/useWorkflowEngine';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import type { TaskTimeEntry } from '../../types/workflow-engine';
import {
  useLatestCallback,
  useTrackEvent,
  useIsMounted
} from '../../enzyme';

interface TimeTrackingPanelProps {
  taskId: string;
  taskTitle: string;
  userId: string;
  onUpdate?: () => void;
}

export const TimeTrackingPanel: React.FC<TimeTrackingPanelProps> = ({
  taskId,
  taskTitle: _taskTitle,
  userId,
  onUpdate
}) => {
  const {
    startTimeTracking,
    stopTimeTracking,
    getTimeEntries,
    loading
  } = useWorkflowEngine();

  // Enzyme hooks
  const trackEvent = useTrackEvent();
  const isMounted = useIsMounted();

  const [timeEntries, setTimeEntries] = useState<TaskTimeEntry[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [description, setDescription] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);

  const loadTimeEntries = useLatestCallback(async () => {
    const entries = await getTimeEntries(taskId);
    if (entries && isMounted()) {
      setTimeEntries(entries);
      const activeEntry = entries.find(e => e.userId === userId && !e.endTime);
      if (activeEntry) {
        setIsTracking(true);
        const startTime = new Date(activeEntry.startTime).getTime();
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }

      // Track successful load
      trackEvent('time_tracking_entries_loaded', {
        taskId,
        userId,
        entryCount: entries.length,
        hasActiveEntry: !!activeEntry
      });
    }
  });

  useEffect(() => {
    loadTimeEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const handleStart = useLatestCallback(async () => {
    await startTimeTracking(taskId, userId);
    if (isMounted()) {
      setIsTracking(true);
      setElapsedTime(0);

      // Track time tracking start
      trackEvent('time_tracking_started', {
        taskId,
        userId
      });

      onUpdate?.();
    }
  });

  const handleStop = useLatestCallback(async () => {
    const duration = elapsedTime;
    await stopTimeTracking(taskId, userId, description);
    if (isMounted()) {
      setIsTracking(false);
      setElapsedTime(0);
      setDescription('');

      // Track time tracking stop
      trackEvent('time_tracking_stopped', {
        taskId,
        userId,
        duration,
        hasDescription: !!description
      });

      await loadTimeEntries();
      onUpdate?.();
    }
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const totalTime = timeEntries
    .filter(e => e.endTime && e.duration)
    .reduce((sum, e) => sum + (e.duration || 0), 0);

  return (
    <Card>
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-slate-500" />
          <h3 className="font-semibold text-slate-900">Time Tracking</h3>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Timer Display */}
        <div className={`p-4 rounded-lg ${isTracking ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 border border-slate-200'}`}>
          <div className="text-center">
            <div className="text-3xl font-mono font-bold text-slate-900 mb-2">
              {formatTime(elapsedTime)}
            </div>
            <div className="text-sm text-slate-600">
              {isTracking ? 'Time tracking active' : 'Not tracking'}
            </div>
          </div>
        </div>

        {/* Controls */}
        {isTracking ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description (optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                placeholder="What are you working on?"
              />
            </div>
            <Button
              variant="danger"
              onClick={handleStop}
              disabled={loading}
              icon={Pause}
              className="w-full"
            >
              Stop Tracking
            </Button>
          </div>
        ) : (
          <Button
            variant="primary"
            onClick={handleStart}
            disabled={loading}
            icon={Play}
            className="w-full"
          >
            Start Tracking
          </Button>
        )}

        {/* Summary */}
        <div className="pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Total Time Logged</span>
            <span className="font-semibold text-slate-900">
              {formatDuration(totalTime)}
            </span>
          </div>
        </div>

        {/* Time Entries List */}
        {timeEntries.length > 0 && (
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-sm font-medium text-slate-700 mb-2">Recent Entries</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {timeEntries.filter(e => e.endTime).slice(-5).reverse().map((entry, index) => (
                <div key={index} className="p-2 bg-slate-50 rounded border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600">
                      {new Date(entry.startTime).toLocaleDateString()}
                    </span>
                    <span className="text-sm font-medium text-slate-900">
                      {formatDuration(entry.duration || 0)}
                    </span>
                  </div>
                  {entry.description && (
                    <p className="text-xs text-slate-500 mt-1">{entry.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
