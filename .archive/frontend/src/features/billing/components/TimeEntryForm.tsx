// Time Entry Form - Full form for creating/editing time entries
import React, { useState } from 'react';
import { X, Clock, DollarSign } from 'lucide-react';
import { useCreateTimeEntry } from '../api/timeEntries.api';
import { ActivityType } from '../api/billing.types';
import { ActivityTypeSelect } from './ActivityTypeSelect';
import { useBillingStore } from '../store/billing.store';
import { formatCurrency, minutesToHours } from '../utils/formatters';

interface TimeEntryFormProps {
  caseId?: string;
  caseName?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const TimeEntryForm: React.FC<TimeEntryFormProps> = ({
  caseId: initialCaseId,
  caseName,
  onClose,
  onSuccess,
}) => {
  const preferences = useBillingStore((state) => state.preferences);
  const createMutation = useCreateTimeEntry();

  const [formData, setFormData] = useState({
    caseId: initialCaseId || '',
    date: new Date().toISOString().split('T')[0],
    duration: 0,
    activityType: 'research' as ActivityType,
    description: '',
    isBillable: true,
    rate: preferences.defaultBillableRate,
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.caseId) newErrors.caseId = 'Case is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (formData.duration <= 0) newErrors.duration = 'Duration must be greater than 0';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createMutation.mutateAsync({
        caseId: formData.caseId,
        date: formData.date,
        duration: formData.duration,
        activityType: formData.activityType,
        description: formData.description,
        isBillable: formData.isBillable,
        rate: formData.rate,
        notes: formData.notes,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to create time entry:', error);
    }
  };

  const calculatedAmount = (formData.duration / 60) * formData.rate;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-900">Add Time Entry</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Case Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Case <span className="text-red-500">*</span>
            </label>
            {caseName ? (
              <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900">
                {caseName}
              </div>
            ) : (
              <input
                type="text"
                value={formData.caseId}
                onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Select or enter case ID"
              />
            )}
            {errors.caseId && <p className="mt-1 text-sm text-red-600">{errors.caseId}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
          </div>

          {/* Activity Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Activity Type <span className="text-red-500">*</span>
            </label>
            <ActivityTypeSelect
              value={formData.activityType}
              onChange={(value) => setFormData({ ...formData, activityType: value })}
            />
          </div>

          {/* Duration & Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  value={formData.duration || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {minutesToHours(formData.duration)} hours
              </p>
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Hourly Rate
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="number"
                  value={formData.rate || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, rate: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              placeholder="Describe the work performed..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Internal Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={2}
              placeholder="Additional notes (not shown on invoice)"
            />
          </div>

          {/* Billable Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-slate-900">Billable</label>
              <p className="text-xs text-slate-500">
                Include this time entry in client invoices
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isBillable: !formData.isBillable })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.isBillable ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isBillable ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Amount Preview */}
          {formData.isBillable && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-900">Billable Amount</span>
                <span className="text-2xl font-bold text-green-700">
                  {formatCurrency(calculatedAmount)}
                </span>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={createMutation.isPending}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? 'Saving...' : 'Save Time Entry'}
          </button>
        </div>
      </div>
    </div>
  );
};
