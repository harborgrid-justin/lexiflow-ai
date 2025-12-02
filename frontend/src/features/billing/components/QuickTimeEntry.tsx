// Quick Time Entry - Inline quick entry for fast time tracking
import React, { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import { useCreateTimeEntry } from '../api/timeEntries.api';
import { ActivityType } from '../api/billing.types';
import { ActivityTypeSelect } from './ActivityTypeSelect';
import { useBillingStore } from '../store/billing.store';
import { parseDurationToMinutes } from '../utils/formatters';

interface QuickTimeEntryProps {
  caseId?: string;
  onSuccess?: () => void;
}

export const QuickTimeEntry: React.FC<QuickTimeEntryProps> = ({ caseId, onSuccess }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const preferences = useBillingStore((state) => state.preferences);
  const createMutation = useCreateTimeEntry();

  const [formData, setFormData] = useState({
    caseId: caseId || '',
    activityType: 'research' as ActivityType,
    description: '',
    duration: '',
    rate: preferences.defaultBillableRate,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim() || !formData.duration) {
      return;
    }

    const durationMinutes = parseDurationToMinutes(formData.duration);

    try {
      await createMutation.mutateAsync({
        caseId: formData.caseId,
        date: new Date().toISOString().split('T')[0],
        duration: durationMinutes,
        activityType: formData.activityType,
        description: formData.description,
        isBillable: true,
        rate: formData.rate,
      });

      // Reset form
      setFormData({
        ...formData,
        description: '',
        duration: '',
      });
      setIsExpanded(false);
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create time entry:', error);
    }
  };

  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center gap-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-lg transition-colors text-slate-600 hover:text-slate-900"
      >
        <Plus className="w-5 h-5" />
        <span className="text-sm font-medium">Quick Time Entry</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-2 border-blue-200 rounded-lg p-4 shadow-sm"
    >
      <div className="grid grid-cols-12 gap-3">
        {/* Activity Type */}
        <div className="col-span-3">
          <ActivityTypeSelect
            value={formData.activityType}
            onChange={(value) => setFormData({ ...formData, activityType: value })}
          />
        </div>

        {/* Description */}
        <div className="col-span-5">
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="What did you work on?"
            autoFocus
          />
        </div>

        {/* Duration */}
        <div className="col-span-2">
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="1h 30m"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="col-span-2 flex items-center gap-2">
          <button
            type="submit"
            disabled={createMutation.isPending || !formData.description || !formData.duration}
            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? 'Adding...' : 'Add'}
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="px-3 py-2 text-slate-600 hover:bg-slate-100 text-sm rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Tip: Enter duration as "1.5" (hours), "90" (minutes), or "1h 30m"
      </p>
    </form>
  );
};
