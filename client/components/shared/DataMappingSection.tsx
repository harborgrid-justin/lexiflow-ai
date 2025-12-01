import React, { useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface FieldMapping {
  sourceField: string;
  targetField: string;
  confidence: number;
}

interface DataMappingSectionProps {
  title?: string;
  description?: string;
  mappings: FieldMapping[];
  onMappingChange: (index: number, mapping: FieldMapping) => void;
  onAddMapping: () => void;
  onRemoveMapping: (index: number) => void;
  availableSourceFields: string[];
  availableTargetFields: string[];
  className?: string;
}

export const DataMappingSection: React.FC<DataMappingSectionProps> = ({
  title = "Field Mapping",
  description = "Map source fields to target fields for data import",
  mappings,
  onMappingChange,
  onAddMapping,
  onRemoveMapping,
  availableSourceFields,
  availableTargetFields,
  className = ""
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      const newMappings = [...mappings];
      const [draggedItem] = newMappings.splice(draggedIndex, 1);
      newMappings.splice(dropIndex, 0, draggedItem);
      // Note: This would need to be handled by parent component
      // For now, we'll just reset the drag state
    }
    setDraggedIndex(null);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 text-green-800';
    if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            {title}
          </h3>
          {description && (
            <p className="text-sm text-slate-600 mt-1">{description}</p>
          )}
        </div>
        <Button
          onClick={onAddMapping}
          variant="outline"
          size="sm"
        >
          Add Mapping
        </Button>
      </div>

      <div className="space-y-3">
        {mappings.map((mapping, index) => (
          <div
            key={index}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-move"
          >
            <div className="flex-1">
              <select
                value={mapping.sourceField}
                onChange={(e) => onMappingChange(index, { ...mapping, sourceField: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select source field</option>
                {availableSourceFields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />

            <div className="flex-1">
              <select
                value={mapping.targetField}
                onChange={(e) => onMappingChange(index, { ...mapping, targetField: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select target field</option>
                {availableTargetFields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={getConfidenceColor(mapping.confidence)}>
                {Math.round(mapping.confidence * 100)}%
              </Badge>
              <Button
                onClick={() => onRemoveMapping(index)}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      {mappings.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No field mappings configured yet.</p>
          <p className="text-sm mt-1">Click "Add Mapping" to get started.</p>
        </div>
      )}
    </div>
  );
};