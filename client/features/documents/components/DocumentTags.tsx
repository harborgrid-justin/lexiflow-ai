/**
 * DocumentTags Component
 * Tag management interface for documents
 */

import React, { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';
import { Modal, Button, Input } from '../../../components/common';

interface DocumentTagsProps {
  isOpen: boolean;
  onClose: () => void;
  currentTags: string[];
  availableTags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  documentTitle: string;
}

export const DocumentTags: React.FC<DocumentTagsProps> = ({
  isOpen,
  onClose,
  currentTags,
  availableTags,
  onAddTag,
  onRemoveTag,
  documentTitle,
}) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim() && !currentTags.includes(newTag.trim())) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      handleAddTag();
    }
  };

  const suggestedTags = availableTags
    .filter((tag) => !currentTags.includes(tag))
    .slice(0, 10);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Tags" size="sm">
      <div className="p-6">
        {/* Document Info */}
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-sm font-medium text-slate-900 truncate">{documentTitle}</p>
        </div>

        {/* Current Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Current Tags</label>
          {currentTags.length === 0 ? (
            <p className="text-sm text-slate-400 italic">No tags assigned</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {currentTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                  <button
                    onClick={() => onRemoveTag(tag)}
                    className="ml-2 hover:text-blue-900 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Add New Tag */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Add New Tag</label>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type tag name..."
              className="flex-1"
            />
            <Button onClick={handleAddTag} icon={Plus} variant="primary" disabled={!newTag.trim()}>
              Add
            </Button>
          </div>
        </div>

        {/* Suggested Tags */}
        {suggestedTags.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Suggested Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => onAddTag(tag)}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Common Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">Common Tags</label>
          <div className="flex flex-wrap gap-2">
            {['Contract', 'Confidential', 'Draft', 'Final', 'Urgent', 'Review'].map((tag) => (
              <button
                key={tag}
                onClick={() => !currentTags.includes(tag) && onAddTag(tag)}
                disabled={currentTags.includes(tag)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                  currentTags.includes(tag)
                    ? 'bg-blue-50 text-blue-700 border-blue-100 cursor-not-allowed'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {currentTags.includes(tag) ? (
                  <X className="h-3 w-3 mr-1" />
                ) : (
                  <Plus className="h-3 w-3 mr-1" />
                )}
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
          <Button onClick={onClose} variant="primary" className="flex-1">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
};
