/**
 * TimeEntryModal Component
 *
 * Modal for logging billable time with AI-powered description refinement.
 */

import React from 'react';
import { Clock, Wand2, DollarSign } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import { Button } from '@/components/common/Button';
import { Input, TextArea } from '@/components/common/Inputs';
import { FormSection } from '@/components/common/FormSection';
import { FormFieldGroup } from '@/components/common/FormFieldGroup';
import { useTimeEntryModal } from '../hooks/useTimeEntryModal';

interface TimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId?: string;
  onSave: (entry: any) => void;
}

export const TimeEntryModal: React.FC<TimeEntryModalProps> = ({
  isOpen,
  onClose,
  caseId,
  onSave,
}) => {
  const {
    desc,
    setDesc,
    duration,
    setDuration,
    isRefining,
    handleRefine,
    handleSave,
  } = useTimeEntryModal();

  const onSaveEntry = () => {
    handleSave(onSave, caseId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" /> Log Billable Time
        </span>
      }
      size="sm"
    >
      <div className="p-6 space-y-5">
        <FormSection>
          <FormFieldGroup columns={1}>
            <Input
              label="Matter / Case"
              value={caseId || 'General / Non-Billable'}
              disabled
            />
          </FormFieldGroup>

          <FormFieldGroup columns={2} className="mt-4">
            <Input
              label="Duration (Hours)"
              type="number"
              step="0.1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                Value Est.
              </label>
              <div className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono flex items-center text-slate-700">
                <DollarSign className="h-3 w-3 mr-1 text-slate-400" />
                {(parseFloat(duration || '0') * 450).toFixed(2)}
              </div>
            </div>
          </FormFieldGroup>

          <FormFieldGroup columns={1} className="mt-4">
            <div>
              <TextArea
                label="Description"
                placeholder="e.g. Call with client re: settlement strategy..."
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <div className="mt-2 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefine}
                  disabled={isRefining || !desc}
                  icon={Wand2}
                  isLoading={isRefining}
                  className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                >
                  AI Refine & Expand
                </Button>
              </div>
            </div>
          </FormFieldGroup>
        </FormSection>

        <div className="pt-2">
          <Button variant="primary" className="w-full" onClick={onSaveEntry}>
            Save Time Entry
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TimeEntryModal;
