import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue>({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
});

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
    };

    setToasts((prev) => [...prev, newToast]);

    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 right-0 z-[var(--z-toast)] flex flex-col gap-2 p-4 max-w-md w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast }> = ({ toast }) => {
  const { removeToast } = useToast();

  const variants = {
    default: {
      bg: 'bg-card border-border',
      icon: null,
      iconColor: '',
    },
    success: {
      bg: 'bg-card border-success',
      icon: CheckCircle,
      iconColor: 'text-success',
    },
    error: {
      bg: 'bg-card border-destructive',
      icon: AlertCircle,
      iconColor: 'text-destructive',
    },
    warning: {
      bg: 'bg-card border-warning',
      icon: AlertTriangle,
      iconColor: 'text-warning',
    },
    info: {
      bg: 'bg-card border-accent',
      icon: Info,
      iconColor: 'text-accent',
    },
  };

  const variant = variants[toast.variant || 'default'];
  const Icon = variant.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'pointer-events-auto relative flex w-full items-start gap-3 rounded-lg border-l-4',
        'p-4 shadow-lg backdrop-blur-sm',
        variant.bg
      )}
    >
      {Icon && <Icon className={cn('h-5 w-5 mt-0.5 flex-shrink-0', variant.iconColor)} />}
      <div className="flex-1 space-y-1">
        {toast.title && (
          <p className="text-sm font-semibold text-foreground">{toast.title}</p>
        )}
        {toast.description && (
          <p className="text-sm text-muted-foreground">{toast.description}</p>
        )}
        {toast.action && (
          <button
            className="mt-2 text-sm font-medium text-primary hover:underline"
            onClick={toast.action.onClick}
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        className={cn(
          'flex-shrink-0 rounded-sm opacity-70 transition-opacity',
          'hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring'
        )}
        onClick={() => removeToast(toast.id)}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </motion.div>
  );
};

// Helper function to create toasts
export const toast = {
  success: (title: string, description?: string) => {
    // This will be used with useToast hook
    return { title, description, variant: 'success' as const };
  },
  error: (title: string, description?: string) => {
    return { title, description, variant: 'error' as const };
  },
  warning: (title: string, description?: string) => {
    return { title, description, variant: 'warning' as const };
  },
  info: (title: string, description?: string) => {
    return { title, description, variant: 'info' as const };
  },
  default: (title: string, description?: string) => {
    return { title, description, variant: 'default' as const };
  },
};

export { Toast, ToastContainer };
