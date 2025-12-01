import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false
}) => {
  const variantConfig = {
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      confirmButtonVariant: 'danger' as const
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-amber-600',
      confirmButtonVariant: 'secondary' as const
    },
    info: {
      icon: AlertTriangle,
      iconColor: 'text-blue-600',
      confirmButtonVariant: 'primary' as const
    }
  };

  const config = variantConfig[variant];
  const IconComponent = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full bg-slate-100`}>
            <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-600">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmButtonVariant}
            onClick={onConfirm}
            disabled={isLoading}
            loading={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};