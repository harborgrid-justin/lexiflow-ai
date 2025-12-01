import React from 'react';
import { Save, Download, Upload, FileText } from 'lucide-react';
import { Button } from '../common/Button';

interface TemplateActionsProps {
  templateName: string;
  onTemplateNameChange: (name: string) => void;
  onSave: () => void;
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isSaving?: boolean;
}

export const TemplateActions: React.FC<TemplateActionsProps> = ({
  templateName,
  onTemplateNameChange,
  onSave,
  onExport,
  onImport,
  isSaving = false
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Template Name
          </label>
          <input
            type="text"
            value={templateName}
            onChange={(e) => onTemplateNameChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
            placeholder="e.g., Commercial Litigation Workflow"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="primary"
            onClick={onSave}
            disabled={isSaving || !templateName.trim()}
            icon={Save}
          >
            {isSaving ? 'Saving...' : 'Save Template'}
          </Button>
          
          <Button
            variant="secondary"
            onClick={onExport}
            icon={Download}
          >
            Export
          </Button>

          <label className="inline-flex">
            <Button
              variant="secondary"
              icon={Upload}
              as="span"
            >
              Import
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={onImport}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
};
