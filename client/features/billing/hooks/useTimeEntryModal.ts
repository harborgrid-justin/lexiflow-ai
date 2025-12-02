/**
 * useTimeEntryModal Hook
 *
 * State management for the time entry modal.
 * Uses Enzyme's advanced hooks for improved stability and analytics.
 *
 * Features:
 * - Safe async state updates with useSafeState
 * - AI-powered description refinement
 * - Analytics tracking for time entries
 */

import { OpenAIService } from '@/services/openAIService';
import {
  useLatestCallback,
  useSafeState,
  useIsMounted,
  useTrackEvent,
} from '@/enzyme';

export const useTimeEntryModal = () => {
  const trackEvent = useTrackEvent();
  const isMounted = useIsMounted();

  const [desc, setDesc] = useSafeState('');
  const [duration, setDuration] = useSafeState('0.5');
  const [isRefining, setIsRefining] = useSafeState(false);

  const handleRefine = useLatestCallback(async () => {
    if (!desc) return;
    const originalLength = desc.length;
    setIsRefining(true);

    try {
      const polished = await OpenAIService.refineTimeEntry(desc);

      if (isMounted()) {
        setDesc(polished);
        setIsRefining(false);
        trackEvent('time_entry_ai_refined', {
          originalLength,
          refinedLength: polished.length,
        });
      }
    } catch (error) {
      if (isMounted()) {
        setIsRefining(false);
      }
      throw error;
    }
  });

  const handleSave = useLatestCallback(
    (onSave: (entry: TimeEntryData) => void, caseId?: string) => {
      const durationValue = parseFloat(duration);

      onSave({
        caseId: caseId || 'General',
        date: new Date().toISOString().split('T')[0],
        duration: durationValue * 60,
        description: desc,
        rate: 450,
        total: durationValue * 450,
        status: 'Unbilled',
      });

      trackEvent('time_entry_saved', {
        duration: durationValue,
        hasCaseId: !!caseId,
      });

      setDesc('');
    }
  );

  return {
    desc,
    setDesc,
    duration,
    setDuration,
    isRefining,
    handleRefine,
    handleSave,
  };
};

interface TimeEntryData {
  caseId: string;
  date: string;
  duration: number;
  description: string;
  rate: number;
  total: number;
  status: 'Unbilled' | 'Billed';
}
