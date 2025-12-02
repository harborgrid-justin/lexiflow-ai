/**
 * ENZYME MIGRATION: useTimeEntryModal
 *
 * Migrated to use Enzyme's advanced hooks for improved stability and analytics.
 *
 * Changes:
 * - Replaced useState with useSafeState to prevent updates on unmounted components
 * - Wrapped handleRefine with useLatestCallback and added useIsMounted guard
 * - Wrapped handleSave with useLatestCallback for stable reference
 * - Added useTrackEvent for analytics tracking:
 *   - time_entry_ai_refined: Tracks AI refinement with text length metrics
 *   - time_entry_saved: Tracks saves with duration and case association
 */

import { OpenAIService } from '../services/openAIService';
import {
  useLatestCallback,
  useSafeState,
  useIsMounted,
  useTrackEvent
} from '../enzyme';

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
          refinedLength: polished.length
        });
      }
    } catch (error) {
      if (isMounted()) {
        setIsRefining(false);
      }
      throw error;
    }
  });

  const handleSave = useLatestCallback((onSave: (entry: any) => void, caseId?: string) => {
    const durationValue = parseFloat(duration);

    onSave({
      caseId: caseId || 'General',
      date: new Date().toISOString().split('T')[0],
      duration: durationValue * 60,
      description: desc,
      rate: 450,
      total: durationValue * 450,
      status: 'Unbilled'
    });

    trackEvent('time_entry_saved', {
      duration: durationValue,
      hasCaseId: !!caseId
    });

    setDesc('');
  });

  return {
    desc,
    setDesc,
    duration,
    setDuration,
    isRefining,
    handleRefine,
    handleSave
  };
};