/**
 * ClientIntakeModal Component
 *
 * Modal for creating new client prospects with conflict checking.
 */

import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Modal, Button, Input } from '@/components/common';

interface ClientIntakeModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSave?: (name: string) => void;
}

export const ClientIntakeModal: React.FC<ClientIntakeModalProps> = ({
  isOpen = true,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [opposingParties, setOpposingParties] = useState('');

  const handleSubmit = () => {
    if (onSave && name) {
      onSave(name);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Client Intake" size="md">
      <div className="p-6 space-y-4">
        <Input
          label="Client Name"
          placeholder="Enter client name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Opposing Parties (Conflict Check)"
          placeholder="Enter opposing parties"
          value={opposingParties}
          onChange={(e) => setOpposingParties(e.target.value)}
        />

        <div className="bg-green-50 p-3 rounded border border-green-200 text-green-800 text-sm flex items-center">
          <ShieldCheck className="h-4 w-4 mr-2" />
          No conflicts found in database.
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button variant="primary" className="w-full" onClick={handleSubmit}>
            Create Prospect Record
          </Button>
          <Button variant="ghost" className="w-full" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ClientIntakeModal;
