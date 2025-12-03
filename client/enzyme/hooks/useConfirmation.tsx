import React, { useState } from 'react';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { useLatestCallback } from '../index';

interface UseConfirmationOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface UseConfirmationReturn {
  confirm: (options?: UseConfirmationOptions) => Promise<boolean>;
  confirmationModal: React.ReactNode;
}

export function useConfirmation(defaultOptions: UseConfirmationOptions = {}): UseConfirmationReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<UseConfirmationOptions>(defaultOptions);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = useLatestCallback((callOptions?: UseConfirmationOptions): Promise<boolean> => {
    setOptions({ ...defaultOptions, ...callOptions });
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  });

  const handleConfirm = useLatestCallback(async () => {
    if (options.onConfirm) {
      await options.onConfirm();
    }
    if (resolver) {
      resolver(true);
    }
    setIsOpen(false);
  });

  const handleCancel = useLatestCallback(() => {
    if (options.onCancel) {
      options.onCancel();
    }
    if (resolver) {
      resolver(false);
    }
    setIsOpen(false);
  });

  const confirmationModal = (
    <ConfirmationModal
      isOpen={isOpen}
      onClose={handleCancel}
      onConfirm={handleConfirm}
      title={options.title || 'Confirm Action'}
      message={options.message || 'Are you sure you want to proceed?'}
      confirmText={options.confirmText || 'Confirm'}
      cancelText={options.cancelText || 'Cancel'}
      variant={options.variant || 'warning'}
    />
  );

  return {
    confirm,
    confirmationModal,
  };
}
