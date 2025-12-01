import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  message: string;
  className?: string;
  icon?: React.ReactNode;
}

const alertConfig = {
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-900',
    textSecondary: 'text-green-700',
    icon: CheckCircle,
    iconColor: 'text-green-600'
  },
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-900',
    textSecondary: 'text-red-700',
    icon: AlertCircle,
    iconColor: 'text-red-600'
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-900',
    textSecondary: 'text-amber-700',
    icon: AlertTriangle,
    iconColor: 'text-amber-600'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-900',
    textSecondary: 'text-blue-700',
    icon: Info,
    iconColor: 'text-blue-600'
  }
};

export const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  message,
  className = "",
  icon
}) => {
  const config = alertConfig[variant];
  const IconComponent = icon || config.icon;

  return (
    <div className={`flex items-start gap-3 p-4 ${config.bg} border ${config.border} rounded-lg ${className}`}>
      <IconComponent className={`w-5 h-5 ${config.iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        {title && <p className={`text-sm font-medium ${config.text}`}>{title}</p>}
        <p className={`text-sm ${title ? 'mt-1' : ''} ${config.textSecondary}`}>{message}</p>
      </div>
    </div>
  );
};

// Convenience components for backward compatibility
export const ErrorAlert: React.FC<{ title?: string; message: string; className?: string }> = (props) => (
  <Alert variant="error" {...props} />
);

export const SuccessAlert: React.FC<{ title?: string; message: string; className?: string }> = (props) => (
  <Alert variant="success" {...props} />
);

export const WarningAlert: React.FC<{ title?: string; message: string; className?: string }> = (props) => (
  <Alert variant="warning" {...props} />
);

export const InfoAlert: React.FC<{ title?: string; message: string; className?: string }> = (props) => (
  <Alert variant="info" {...props} />
);