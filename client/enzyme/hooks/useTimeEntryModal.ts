import { useState } from 'react';
import { OpenAIService } from '../../services/openAIService';
import {
  useLatestCallback,
  useIsMounted,
  useTrackEvent
} from '@missionfabric-js/enzyme/hooks';

export const useTimeEntryModal = () => {
  const trackEvent = useTrackEvent();
  const isMounted = useIsMounted();

  const [desc, setDesc] = useState('');
  const [duration, setDuration] = useState('0.5');
  const [isRefining, setIsRefining] = useState(false);

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
