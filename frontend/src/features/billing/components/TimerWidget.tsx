// Timer Widget - Persistent floating timer across the app
import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Clock, ChevronDown, ChevronUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRunningTimer, useStartTimer, useStopTimer } from '../api/timeEntries.api';
import { useBillingStore } from '../store/billing.store';
import { ACTIVITY_TYPE_LABELS } from '../api/billing.types';
import { formatDuration } from '../utils/formatters';

interface TimerWidgetProps {
  onOpenFullForm?: () => void;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({ onOpenFullForm }) => {
  const { data: runningTimer, isLoading } = useRunningTimer();
  const startTimerMutation = useStartTimer();
  const stopTimerMutation = useStopTimer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const preferences = useBillingStore((state) => state.preferences);

  // Update elapsed time every second when timer is running
  useEffect(() => {
    if (!runningTimer) {
      setElapsedSeconds(0);
      return;
    }

    const startTime = new Date(runningTimer.startTime).getTime();
    const updateElapsed = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000) + (runningTimer.elapsedSeconds || 0);
      setElapsedSeconds(elapsed);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [runningTimer]);

  const handleStop = async () => {
    try {
      await stopTimerMutation.mutateAsync();
      setIsExpanded(false);
    } catch (error) {
      console.error('Failed to stop timer:', error);
    }
  };

  if (!preferences.showTimerWidget && !runningTimer) {
    return null;
  }

  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={() => setIsMinimized(false)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg flex items-center justify-center transition-colors"
        >
          <Clock className="w-6 h-6" />
          {runningTimer && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      </motion.div>
    );
  }

  if (!runningTimer) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden w-80">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Timer Running</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Compact View */}
          <div className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {runningTimer.caseName || 'Unknown Case'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {ACTIVITY_TYPE_LABELS[runningTimer.activityType]}
                </p>
              </div>
              <div className="ml-3 text-right">
                <div className="text-2xl font-mono font-bold text-slate-900 tabular-nums">
                  {formatDuration(elapsedSeconds)}
                </div>
                <div className="text-xs text-slate-500">
                  ${((elapsedSeconds / 3600) * runningTimer.rate).toFixed(2)}
                </div>
              </div>
            </div>

            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-3"
              >
                <p className="text-sm text-slate-600 line-clamp-2">
                  {runningTimer.description || 'No description'}
                </p>
              </motion.div>
            )}

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleStop}
                disabled={stopTimerMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
              {onOpenFullForm && (
                <button
                  onClick={onOpenFullForm}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                >
                  Details
                </button>
              )}
            </div>
          </div>

          {/* Expanded Details */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="border-t border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Started</span>
                    <span className="text-slate-900 font-medium">
                      {new Date(runningTimer.startTime).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Rate</span>
                    <span className="text-slate-900 font-medium">
                      ${runningTimer.rate}/hr
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Billable</span>
                    <span className="text-slate-900 font-medium">
                      {runningTimer.isBillable ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Timer Button - Quick start timer button for case pages
interface TimerButtonProps {
  caseId: string;
  caseName: string;
  className?: string;
}

export const TimerButton: React.FC<TimerButtonProps> = ({
  caseId,
  caseName,
  className = '',
}) => {
  const { data: runningTimer } = useRunningTimer();
  const startTimerMutation = useStartTimer();
  const stopTimerMutation = useStopTimer();
  const preferences = useBillingStore((state) => state.preferences);

  const isThisCaseRunning = runningTimer?.caseId === caseId;
  const isAnotherCaseRunning = runningTimer && !isThisCaseRunning;

  const handleStartTimer = async () => {
    if (isAnotherCaseRunning) {
      const confirmed = window.confirm(
        `A timer is already running for "${runningTimer.caseName}". Stop that timer and start a new one?`
      );
      if (!confirmed) return;
      await stopTimerMutation.mutateAsync();
    }

    try {
      await startTimerMutation.mutateAsync({
        caseId,
        activityType: 'research',
        description: '',
        rate: preferences.defaultBillableRate,
        isBillable: true,
      });
    } catch (error) {
      console.error('Failed to start timer:', error);
    }
  };

  const handleStopTimer = async () => {
    try {
      await stopTimerMutation.mutateAsync();
    } catch (error) {
      console.error('Failed to stop timer:', error);
    }
  };

  if (isThisCaseRunning) {
    return (
      <button
        onClick={handleStopTimer}
        disabled={stopTimerMutation.isPending}
        className={`flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 ${className}`}
      >
        <Square className="w-4 h-4" />
        <span>Stop Timer</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleStartTimer}
      disabled={startTimerMutation.isPending}
      className={`flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 ${className}`}
    >
      <Play className="w-4 h-4" />
      <span>Start Timer</span>
    </button>
  );
};
