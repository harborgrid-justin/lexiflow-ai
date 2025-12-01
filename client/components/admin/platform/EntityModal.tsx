import React from 'react';
import { Modal } from '../../common/Modal';
import { Button } from '../../common/Button';

interface EntityModalProps {
  isOpen: boolean;
  title: string;
  item: Record<string, any> | null;
  onClose: () => void;
  onChange: (key: string, value: string) => void;
  onSave: () => void;
}

const EXCLUDED_FIELDS = ['id', 'parties', 'versions', 'matters'];

export const EntityModal: React.FC<EntityModalProps> = ({
  isOpen,
  title,
  item,
  onClose,
  onChange,
  onSave,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title}>
    <div className="p-6">
      <div className="grid grid-cols-1 gap-1 max-h-[60vh] overflow-y-auto">
        {item &&
          Object.keys(item)
            .filter((key) => !EXCLUDED_FIELDS.includes(key))
            .map((key) => (
              <div key={key} className="mb-4">
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">
                  {key}
                </label>
                <input
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  value={item[key] ?? ''}
                  onChange={(e) => onChange(key, e.target.value)}
                />
              </div>
            ))}
      </div>
      <div className="pt-4 flex justify-end gap-3 border-t mt-4">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save Changes
        </Button>
      </div>
    </div>
  </Modal>
);
