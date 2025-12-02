/**
 * DocumentMetadata Component
 * Metadata editor for documents
 */

import React, { useState } from 'react';
import type { LegalDocument } from '../../../types';
import { Button, Input, TextArea } from '../../../components/common';
import { Save, X } from 'lucide-react';

interface DocumentMetadataProps {
  document: LegalDocument;
  onSave: (updates: Partial<LegalDocument>) => void;
  onCancel: () => void;
}

export const DocumentMetadata: React.FC<DocumentMetadataProps> = ({
  document,
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(document.title);
  const [description, setDescription] = useState(document.description || '');
  const [type, setType] = useState(document.type);
  const [classification, setClassification] = useState(document.classification || '');

  const handleSave = () => {
    onSave({
      title,
      description,
      type,
      classification,
    });
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Document Metadata</h3>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Document Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Contract">Contract</option>
            <option value="Brief">Brief</option>
            <option value="Motion">Motion</option>
            <option value="Evidence">Evidence</option>
            <option value="Discovery">Discovery</option>
            <option value="Correspondence">Correspondence</option>
            <option value="General">General</option>
          </select>
        </div>

        {/* Classification */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Classification</label>
          <select
            value={classification}
            onChange={(e) => setClassification(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select classification</option>
            <option value="Public">Public</option>
            <option value="Internal">Internal</option>
            <option value="Confidential">Confidential</option>
            <option value="Privileged">Attorney-Client Privileged</option>
            <option value="WorkProduct">Work Product</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Add a description..."
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-200">
        <Button onClick={handleSave} icon={Save} variant="primary">
          Save Changes
        </Button>
        <Button onClick={onCancel} icon={X} variant="secondary">
          Cancel
        </Button>
      </div>
    </div>
  );
};
