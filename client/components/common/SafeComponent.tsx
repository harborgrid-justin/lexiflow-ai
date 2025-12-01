import React, { Suspense, ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

interface LoadingFallbackProps {
  message?: string;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({ message = 'Loading...' }) => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-sm text-slate-600">{message}</p>
    </div>
  </div>
);

interface SafeComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  loadingMessage?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * SafeComponent - Wraps components with error boundary and suspense
 * Provides protection against DOM errors and async loading issues
 */
export const SafeComponent: React.FC<SafeComponentProps> = ({
  children,
  fallback,
  loadingMessage,
  onError
}) => {
  return (
    <ErrorBoundary fallback={fallback} onError={onError}>
      <Suspense fallback={<LoadingFallback message={loadingMessage} />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};
