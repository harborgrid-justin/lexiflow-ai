/**
 * Keycite-style Treatment Indicator
 * Shows the legal treatment status of a case (like Westlaw's KeyCite)
 */

import React from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import type { TreatmentStatus } from '../api/research.types';

interface KeyciteIndicatorProps {
  status: TreatmentStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showTooltip?: boolean;
}

export const KeyciteIndicator: React.FC<KeyciteIndicatorProps> = ({
  status,
  size = 'md',
  showLabel = true,
  showTooltip = true,
}) => {
  const getStatusConfig = (status: TreatmentStatus) => {
    const configs = {
      valid: {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-100',
        label: 'Valid',
        description: 'Good law - no negative treatment',
      },
      followed: {
        icon: CheckCircle,
        color: 'text-green-600',
        bg: 'bg-green-100',
        label: 'Followed',
        description: 'Good law - followed by subsequent cases',
      },
      distinguished: {
        icon: Info,
        color: 'text-blue-600',
        bg: 'bg-blue-100',
        label: 'Distinguished',
        description: 'Distinguished from later cases',
      },
      questioned: {
        icon: AlertTriangle,
        color: 'text-yellow-600',
        bg: 'bg-yellow-100',
        label: 'Questioned',
        description: 'Validity questioned - review carefully',
      },
      limited: {
        icon: AlertCircle,
        color: 'text-orange-600',
        bg: 'bg-orange-100',
        label: 'Limited',
        description: 'Limited by subsequent cases',
      },
      overruled: {
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-100',
        label: 'Overruled',
        description: 'Overruled - no longer good law',
      },
      superseded: {
        icon: XCircle,
        color: 'text-red-600',
        bg: 'bg-red-100',
        label: 'Superseded',
        description: 'Superseded by statute - no longer valid',
      },
    };
    return configs[status] || configs.valid;
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      icon: 'w-3 h-3',
      text: 'text-xs',
      padding: 'px-2 py-0.5',
      gap: 'gap-1',
    },
    md: {
      icon: 'w-4 h-4',
      text: 'text-sm',
      padding: 'px-2.5 py-1',
      gap: 'gap-1.5',
    },
    lg: {
      icon: 'w-5 h-5',
      text: 'text-base',
      padding: 'px-3 py-1.5',
      gap: 'gap-2',
    },
  };

  const sizes = sizeClasses[size];

  const indicator = (
    <div
      className={`
        inline-flex items-center ${sizes.gap} ${sizes.padding} ${config.bg} rounded-full font-medium
      `}
      title={showTooltip ? config.description : undefined}
    >
      <Icon className={`${sizes.icon} ${config.color}`} />
      {showLabel && (
        <span className={`${sizes.text} ${config.color}`}>
          {config.label}
        </span>
      )}
    </div>
  );

  return indicator;
};

/**
 * KeyCite Status Badge - A simpler colored dot indicator
 */
export const KeyciteBadge: React.FC<{ status: TreatmentStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  const getColor = (status: TreatmentStatus) => {
    switch (status) {
      case 'valid':
      case 'followed':
        return 'bg-green-500';
      case 'distinguished':
        return 'bg-blue-500';
      case 'questioned':
        return 'bg-yellow-500';
      case 'limited':
        return 'bg-orange-500';
      case 'overruled':
      case 'superseded':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getLabel = (status: TreatmentStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${className}`}
      title={getLabel(status)}
    >
      <div className={`w-2 h-2 rounded-full ${getColor(status)}`} />
    </div>
  );
};
