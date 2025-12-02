/**
 * Query Provider
 * TanStack React Query configuration
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client with enterprise-grade defaults
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't refetch on window focus in production for stability
      refetchOnWindowFocus: process.env.NODE_ENV === 'development',
      // Retry failed requests up to 2 times
      retry: 2,
      // Consider data stale after 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 30 minutes
      gcTime: 30 * 60 * 1000,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
