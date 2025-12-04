/**
 * App Providers
 * Wraps the application with all necessary providers
 */

import React from 'react';
import { QueryProvider } from './QueryProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import { CommunicationProvider } from '@/features/communication/store/communication.store';
import { Toaster } from '@/components/ui/sonner';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryProvider>
      <AuthProvider>
        <CommunicationProvider>
          {children}
          <Toaster />
        </CommunicationProvider>
      </AuthProvider>
    </QueryProvider>
  );
};
