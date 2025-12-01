import React from 'react';
import { CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface StepHeaderProps {
  stepId: string;
  index: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
  isActive: boolean;
  isCompleted: boolean;
  onClick?: () => void;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  stepId: _stepId,
  index,
  title,
  description,
  icon: _icon,
  isActive,
  isCompleted,
  onClick
}) => {
  return (
    <div
      className={`p-4 flex items-center justify-between cursor-pointer rounded-t-xl transition-colors ${
        isActive ? 'bg-white' : 'hover:bg-slate-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold ${
          isCompleted ? 'bg-green-100 border-green-500 text-green-700' :
          isActive ? 'bg-blue-100 border-blue-500 text-blue-700' :
          'bg-slate-50 border-slate-300 text-slate-400'
        }`}>
          {isCompleted ? <CheckCircle className="h-5 w-5"/> : index + 1}
        </div>
        <div>
          <h4 className={`font-bold text-lg ${isActive ? 'text-blue-900' : 'text-slate-800'}`}>{title}</h4>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className={`px-2 py-0.5 rounded-full ${isActive ? 'bg-blue-100 text-blue-700' : isCompleted ? 'bg-green-100 text-green-700' : 'bg-slate-100'}`}>
              {isCompleted ? 'Completed' : isActive ? 'In Progress' : 'Pending'}
            </span>
            <span>• {description}</span>
          </div>
        </div>
      </div>
      <button className="text-slate-400">
        {isActive ? <ChevronUp className="h-5 w-5"/> : <ChevronDown className="h-5 w-5"/>}
      </button>
    </div>
  );
};