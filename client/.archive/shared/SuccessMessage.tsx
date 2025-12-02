import React from 'react';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
  title?: string;
  message: string;
  className?: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title = "Success",
  message,
  className = ""
}) => {
  return (
    <div className={`flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg ${className}`}>
      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-green-900">{title}</p>
        <p className="text-sm text-green-700 mt-1">{message}</p>
      </div>
    </div>
  );
};