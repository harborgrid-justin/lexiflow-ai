// Rate Selector - Select or input rate with presets
import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';

interface RateSelectorProps {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  presets?: number[];
  className?: string;
}

export const RateSelector: React.FC<RateSelectorProps> = ({
  value,
  onChange,
  label = 'Hourly Rate',
  presets = [150, 200, 250, 300, 350, 400, 500],
  className = '',
}) => {
  const [isCustom, setIsCustom] = useState(!presets.includes(value));

  const handlePresetClick = (preset: number) => {
    setIsCustom(false);
    onChange(preset);
  };

  const handleCustomChange = (customValue: number) => {
    setIsCustom(true);
    onChange(customValue);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      )}

      {/* Preset Rates */}
      <div className="flex flex-wrap gap-2 mb-3">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => handlePresetClick(preset)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              value === preset && !isCustom
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            ${preset}
          </button>
        ))}
      </div>

      {/* Custom Rate Input */}
      <div>
        <label className="flex items-center gap-2 text-sm text-slate-600 mb-1">
          <input
            type="checkbox"
            checked={isCustom}
            onChange={(e) => setIsCustom(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span>Custom rate</span>
        </label>
        {isCustom && (
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="number"
              value={value}
              onChange={(e) => handleCustomChange(parseFloat(e.target.value) || 0)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter custom rate"
              min="0"
              step="0.01"
            />
          </div>
        )}
      </div>
    </div>
  );
};
