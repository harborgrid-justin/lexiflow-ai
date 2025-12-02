/**
 * NewFolderDialog Component
 * Dialog for creating new folders
 */

import React, { useState } from 'react';
import { Folder } from 'lucide-react';
import { Modal, Button, Input } from '../../../components/common';

interface NewFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, color: string, parentId?: string) => void;
  parentFolderName?: string;
  parentFolderId?: string;
}

export const NewFolderDialog: React.FC<NewFolderDialogProps> = ({
  isOpen,
  onClose,
  onCreate,
  parentFolderName,
  parentFolderId,
}) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#64748b');

  const colors = [
    { value: '#64748b', label: 'Slate' },
    { value: '#3b82f6', label: 'Blue' },
    { value: '#10b981', label: 'Green' },
    { value: '#f59e0b', label: 'Amber' },
    { value: '#ef4444', label: 'Red' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#ec4899', label: 'Pink' },
    { value: '#06b6d4', label: 'Cyan' },
  ];

  const handleCreate = () => {
    if (name.trim()) {
      onCreate(name.trim(), selectedColor, parentFolderId);
      setName('');
      setSelectedColor('#64748b');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      handleCreate();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Folder" size="sm">
      <div className="p-6">
        {parentFolderName && (
          <div className="mb-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 mb-1">Creating folder in:</p>
            <p className="text-sm font-medium text-slate-900">{parentFolderName}</p>
          </div>
        )}

        {/* Folder Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-1">Folder Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter folder name"
            autoFocus
          />
        </div>

        {/* Color Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Folder Color</label>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                  selectedColor === color.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <Folder className="h-6 w-6" style={{ color: color.value }} />
                <span className="text-xs text-slate-600">{color.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="mb-6 p-4 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-500 mb-2">Preview:</p>
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5" style={{ color: selectedColor }} />
            <span className="text-sm font-medium text-slate-900">
              {name || 'New Folder'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCreate}
            variant="primary"
            className="flex-1"
            disabled={!name.trim()}
          >
            Create Folder
          </Button>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};
