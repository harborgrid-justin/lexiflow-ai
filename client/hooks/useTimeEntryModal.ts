import { useState } from 'react';
import { OpenAIService } from '../services/openAIService';

export const useTimeEntryModal = () => {
  const [desc, setDesc] = useState('');
  const [duration, setDuration] = useState('0.5');
  const [isRefining, setIsRefining] = useState(false);

  const handleRefine = async () => {
    if (!desc) return;
    setIsRefining(true);
    const polished = await OpenAIService.refineTimeEntry(desc);
    setDesc(polished);
    setIsRefining(false);
  };

  const handleSave = (onSave: (entry: any) => void, caseId?: string) => {
    onSave({
      caseId: caseId || 'General',
      date: new Date().toISOString().split('T')[0],
      duration: parseFloat(duration) * 60,
      description: desc,
      rate: 450,
      total: parseFloat(duration) * 450,
      status: 'Unbilled'
    });
    setDesc('');
  };

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