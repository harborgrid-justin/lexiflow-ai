import React from 'react';
import { Card } from './Card';
import { Button } from './Button';

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
  description = "Map source fields to target fields",
  mappings,
  onMappingChange,
  onAddMapping,
  onRemoveMapping,
  availableSourceFields,
  availableTargetFields,
  className = ""
}) => {
  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>

      <div className="space-y-4">
        {mappings.map((mapping, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Source Field</label>
              <select
                value={mapping.sourceField}
                onChange={(e) => onMappingChange(index, { ...mapping, sourceField: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              >
                {availableSourceFields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <span className="text-gray-500">→</span>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Target Field</label>
              <select
                value={mapping.targetField}
                onChange={(e) => onMappingChange(index, { ...mapping, targetField: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
              >
                {availableTargetFields.map(field => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">{mapping.confidence}%</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemoveMapping(index)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}

        <Button onClick={onAddMapping} className="w-full">
          Add Mapping
        </Button>
      </div>
    </Card>
  );
};