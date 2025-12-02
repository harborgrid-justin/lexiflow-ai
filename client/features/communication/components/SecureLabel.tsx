/**
 * SecureLabel Component
 *
 * Displays security level and privilege labels for messages and documents.
 * Critical for maintaining attorney-client privilege visibility.
 */

import React from 'react';
import { Shield, Lock, AlertTriangle, FileCheck } from 'lucide-react';
import { SecurityLevel } from '../api/communication.types';

interface SecureLabelProps {
  level: SecurityLevel;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}

const securityConfig = {
  standard: {
    icon: FileCheck,
    label: 'Standard',
    color: 'text-slate-600 bg-slate-100',
    iconColor: 'text-slate-600',
    description: 'Standard communication',
  },
  privileged: {
    icon: Shield,
    label: 'Privileged',
    color: 'text-blue-700 bg-blue-100',
    iconColor: 'text-blue-700',
    description: 'Attorney work product',
  },
  confidential: {
    icon: Lock,
    label: 'Confidential',
    color: 'text-amber-700 bg-amber-100',
    iconColor: 'text-amber-700',
    description: 'Confidential information',
  },
  'attorney-client': {
    icon: AlertTriangle,
    label: 'Attorney-Client',
    color: 'text-red-700 bg-red-100 border border-red-300',
    iconColor: 'text-red-700',
    description: 'Attorney-client privileged',
  },
};

const sizeConfig = {
  sm: {
    container: 'px-1.5 py-0.5 text-xs',
    icon: 'w-3 h-3',
  },
  md: {
    container: 'px-2 py-1 text-sm',
    icon: 'w-4 h-4',
  },
  lg: {
    container: 'px-3 py-1.5 text-base',
    icon: 'w-5 h-5',
  },
};

export const SecureLabel: React.FC<SecureLabelProps> = ({
  level,
  size = 'md',
  showIcon = true,
  showText = true,
  className = '',
}) => {
  const config = securityConfig[level];
  const sizeStyles = sizeConfig[size];
  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-md font-medium ${config.color} ${sizeStyles.container} ${className}`}
      title={config.description}
    >
      {showIcon && <Icon className={`${sizeStyles.icon} ${config.iconColor}`} />}
      {showText && <span>{config.label}</span>}
    </div>
  );
};

interface SecurityBannerProps {
  level: SecurityLevel;
  message?: string;
  onDismiss?: () => void;
}

/**
 * Security Banner
 *
 * Prominent banner for high-security communications
 */
export const SecurityBanner: React.FC<SecurityBannerProps> = ({ level, message, onDismiss }) => {
  if (level === 'standard') return null;

  const config = securityConfig[level];
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border ${config.color}`}
      role="alert"
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
      <div className="flex-1">
        <div className="font-semibold">{config.label}</div>
        {message && <div className="text-sm mt-0.5">{message}</div>}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-current hover:opacity-70 transition-opacity"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};
