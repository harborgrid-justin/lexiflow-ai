import { useState, useCallback } from 'react';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';

export const useConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<{
    title?: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  } | null>(null);

  const confirm = useCallback((options: {
    title?: string;
    message: string;
    onConfirm: () => void;
    variant?: 'danger' | 'warning' | 'info';
  }) => {
    setConfig(options);
    setIsOpen(true);
  }, []);

  const handleConfirm = useCallback(() => {
    if (config?.onConfirm) {
      config.onConfirm();
    }
    setIsOpen(false);
    setConfig(null);
  }, [config]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setConfig(null);
  }, []);

  return {
    confirm,
    confirmationModal: config ? (
      <ConfirmationModal
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={config.title}
        message={config.message}
        variant={config.variant}
      />
    ) : null
  };
};