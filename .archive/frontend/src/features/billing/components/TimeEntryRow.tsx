// Time Entry Row - Editable time entry in list view
import React, { useState } from 'react';
import { Clock, Edit2, Trash2, Check, X, DollarSign } from 'lucide-react';
import { TimeEntry } from '../api/billing.types';
import { useUpdateTimeEntry, useDeleteTimeEntry } from '../api/timeEntries.api';
import { formatHours, formatCurrency, formatDate } from '../utils/formatters';
import { ACTIVITY_TYPE_LABELS } from '../api/billing.types';
import { ActivityTypeSelect } from './ActivityTypeSelect';

interface TimeEntryRowProps {
  entry: TimeEntry;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  showCase?: boolean;
}

export const TimeEntryRow: React.FC<TimeEntryRowProps> = ({
  entry,
  isSelected,
  onToggleSelect,
  showCase = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntry, setEditedEntry] = useState(entry);

  const updateMutation = useUpdateTimeEntry();
  const deleteMutation = useDeleteTimeEntry();

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        id: entry.id,
        duration: editedEntry.duration,
        activityType: editedEntry.activityType,
        description: editedEntry.description,
        isBillable: editedEntry.isBillable,
        rate: editedEntry.rate,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update time entry:', error);
    }
  };

  const handleCancel = () => {
    setEditedEntry(entry);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this time entry?')) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(entry.id);
    } catch (error) {
      console.error('Failed to delete time entry:', error);
    }
  };

  const getStatusColor = (status: TimeEntry['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-slate-100 text-slate-700';
      case 'submitted':
        return 'bg-blue-100 text-blue-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'billed':
        return 'bg-purple-100 text-purple-700';
      case 'written-off':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white border border-blue-200 rounded-lg p-4 shadow-sm">
        <div className="grid grid-cols-12 gap-4">
          {/* Case */}
          {showCase && (
            <div className="col-span-3">
              <input
                type="text"
                value={editedEntry.caseName || ''}
                disabled
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm"
              />
            </div>
          )}

          {/* Activity Type */}
          <div className={showCase ? 'col-span-2' : 'col-span-3'}>
            <ActivityTypeSelect
              value={editedEntry.activityType}
              onChange={(value) => setEditedEntry({ ...editedEntry, activityType: value })}
            />
          </div>

          {/* Description */}
          <div className={showCase ? 'col-span-4' : 'col-span-5'}>
            <input
              type="text"
              value={editedEntry.description}
              onChange={(e) =>
                setEditedEntry({ ...editedEntry, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              placeholder="Description"
            />
          </div>

          {/* Duration */}
          <div className="col-span-1">
            <input
              type="number"
              value={editedEntry.duration}
              onChange={(e) =>
                setEditedEntry({ ...editedEntry, duration: parseInt(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              placeholder="Min"
              min="0"
            />
          </div>

          {/* Rate */}
          <div className="col-span-1">
            <input
              type="number"
              value={editedEntry.rate}
              onChange={(e) =>
                setEditedEntry({ ...editedEntry, rate: parseFloat(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              placeholder="Rate"
              min="0"
            />
          </div>

          {/* Actions */}
          <div className="col-span-1 flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
              title="Save"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={handleCancel}
              className="p-2 text-slate-600 hover:bg-slate-50 rounded transition-colors"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors group">
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Checkbox */}
        {onToggleSelect && (
          <div className="col-span-1 flex items-center">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(entry.id)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Date */}
        <div className={onToggleSelect ? 'col-span-2' : 'col-span-2'}>
          <div className="text-sm font-medium text-slate-900">
            {formatDate(entry.date)}
          </div>
          <div className="text-xs text-slate-500">{entry.userName}</div>
        </div>

        {/* Case */}
        {showCase && (
          <div className="col-span-2">
            <div className="text-sm font-medium text-slate-900 truncate">
              {entry.caseName || 'Unknown Case'}
            </div>
          </div>
        )}

        {/* Activity Type */}
        <div className={showCase ? 'col-span-2' : 'col-span-3'}>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            {ACTIVITY_TYPE_LABELS[entry.activityType]}
          </span>
        </div>

        {/* Description */}
        <div className={showCase ? 'col-span-3' : 'col-span-4'}>
          <p className="text-sm text-slate-700 truncate">{entry.description}</p>
        </div>

        {/* Duration & Amount */}
        <div className="col-span-2 text-right">
          <div className="flex items-center justify-end gap-2 text-sm">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="font-medium text-slate-900">
              {formatHours(entry.duration / 60)}
            </span>
          </div>
          <div className="flex items-center justify-end gap-2 text-xs text-slate-500">
            <DollarSign className="w-3 h-3" />
            <span>{formatCurrency(entry.amount)}</span>
          </div>
          {!entry.isBillable && (
            <span className="text-xs text-orange-600">Non-billable</span>
          )}
        </div>

        {/* Status & Actions */}
        <div className="col-span-2 flex items-center justify-end gap-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              entry.status
            )}`}
          >
            {entry.status}
          </span>
          {entry.status === 'draft' && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                title="Edit"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
