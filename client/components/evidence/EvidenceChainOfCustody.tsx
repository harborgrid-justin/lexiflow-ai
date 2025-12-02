
/**
 * ENZYME MIGRATION: Agent 28, Wave 4
 *
 * Migrated to use Enzyme framework hooks:
 * - useLatestCallback: Stable callback references for event handlers
 * - useTrackEvent: Analytics tracking for user interactions
 * - useIsMounted: Safe async operations and state updates
 *
 * Analytics events tracked:
 * - custody_modal_opened: When user opens the record event modal
 * - custody_modal_closed: When user closes the modal
 * - custody_action_type_changed: When user selects different action type
 * - custody_verification_toggled: When user toggles digital signature checkbox
 * - custody_event_saved: When custody event is successfully recorded
 */

import React, { useState } from 'react';
import { Button } from '../common/Button';
import { User, Layers, Plus, PenTool, CheckCircle } from 'lucide-react';
import { EvidenceItem, ChainOfCustodyEvent } from '../../types';
import { Modal } from '../common/Modal';
import { Input, TextArea } from '../common/Inputs';
import {
  useLatestCallback,
  useTrackEvent,
  useIsMounted
} from '../../enzyme';

interface EvidenceChainOfCustodyProps {
  selectedItem: EvidenceItem;
  onCustodyUpdate?: (event: ChainOfCustodyEvent) => void;
}

export const EvidenceChainOfCustody: React.FC<EvidenceChainOfCustodyProps> = ({ selectedItem, onCustodyUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    action: 'Transfer',
    actor: '',
    notes: '',
    verified: false
  });
  const [isSigning, setIsSigning] = useState(false);

  const trackEvent = useTrackEvent();
  const isMounted = useIsMounted();

  const handleSave = useLatestCallback(async () => {
    if (!formData.actor || !onCustodyUpdate) return;

    setIsSigning(true);
    trackEvent('custody_event_save_started', {
      action: formData.action,
      hasNotes: !!formData.notes,
      evidenceId: selectedItem.id
    });

    // Simulate digital signature delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!isMounted()) return;

    const newEvent: ChainOfCustodyEvent = {
      id: `cc-${Date.now()}`,
      date: new Date().toISOString(),
      action: formData.action,
      actor: formData.actor,
      notes: formData.notes
    };

    onCustodyUpdate(newEvent);
    setIsSigning(false);
    setIsModalOpen(false);
    setFormData({ action: 'Transfer', actor: '', notes: '', verified: false });

    trackEvent('custody_event_saved', {
      action: formData.action,
      hasNotes: !!formData.notes,
      evidenceId: selectedItem.id
    });
  });

  const handleOpenModal = useLatestCallback(() => {
    setIsModalOpen(true);
    trackEvent('custody_modal_opened', {
      evidenceId: selectedItem.id,
      evidenceType: selectedItem.type,
      currentCustodyCount: selectedItem.chainOfCustody?.length || 0
    });
  });

  const handleCloseModal = useLatestCallback(() => {
    setIsModalOpen(false);
    trackEvent('custody_modal_closed', {
      evidenceId: selectedItem.id,
      formCompleted: !!formData.actor && formData.verified
    });
  });

  const handleActionTypeChange = useLatestCallback((newAction: string) => {
    setFormData({...formData, action: newAction});
    trackEvent('custody_action_type_changed', {
      evidenceId: selectedItem.id,
      actionType: newAction
    });
  });

  const handleVerificationToggle = useLatestCallback((checked: boolean) => {
    setFormData({...formData, verified: checked});
    trackEvent('custody_verification_toggled', {
      evidenceId: selectedItem.id,
      verified: checked
    });
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Chain of Custody Log</h3>
          <p className="text-sm text-slate-500">Chronological history of evidence handling.</p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenModal}>Record Event</Button>
      </div>

      <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 py-4">
        {(selectedItem.chainOfCustody || []).map((event, idx) => (
          <div key={event.id} className="relative pl-8">
            <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white ${idx === 0 ? 'bg-green-500 ring-4 ring-green-100' : 'bg-slate-300'}`}></div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-slate-900 flex items-center">
                  {event.action}
                </span>
                <span className="text-xs font-mono text-slate-500">{event.date}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600 mb-2">
                <User className="h-4 w-4 mr-2 text-slate-400"/>
                Handled by <span className="font-semibold text-slate-900 ml-1">{event.actor}</span>
              </div>
              {event.notes && (
                <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded">
                  "{event.notes}"
                </p>
              )}
              <div className="mt-3 pt-3 border-t border-slate-100 flex gap-4 text-xs text-slate-400">
                <span className="flex items-center"><Layers className="h-3 w-3 mr-1"/> Hash: <span className="font-mono ml-1">{selectedItem.blockchainHash ? selectedItem.blockchainHash.substring(0,8) + '...' : 'sha256...8a2f'}</span></span>
                <span>Signature: <span className="text-green-600 font-medium">Verified</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Transfer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Record Custody Event"
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">Action Type</label>
            <select
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm bg-white"
              value={formData.action}
              onChange={(e) => handleActionTypeChange(e.target.value)}
            >
              <option value="Transfer">Transfer Custody</option>
              <option value="Check-In">Check-In to Storage</option>
              <option value="Check-Out">Check-Out for Analysis</option>
              <option value="Exhibit Prep">Preparation for Trial</option>
              <option value="Destruction">Authorized Destruction</option>
            </select>
          </div>

          <Input
            label="Actor / Handler"
            placeholder="Name of person taking possession"
            value={formData.actor}
            onChange={(e) => setFormData({...formData, actor: e.target.value})}
          />

          <TextArea
            label="Notes & Condition"
            placeholder="Describe condition of evidence, seals checked, destination..."
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows={3}
          />

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mt-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.verified ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'}`}>
                {formData.verified && <CheckCircle className="h-3.5 w-3.5"/>}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={formData.verified}
                onChange={(e) => handleVerificationToggle(e.target.checked)}
              />
              <div>
                <span className="text-sm font-bold text-slate-900 block">Digitally Sign & Verify</span>
                <span className="text-xs text-slate-500">I certify I am the user logged in and authorized to update this chain.</span>
              </div>
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-4">
            <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={!formData.actor || !formData.verified || isSigning}
              icon={isSigning ? undefined : PenTool}
              isLoading={isSigning}
            >
              {isSigning ? 'Cryptographic Signing...' : 'Sign & Record'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
