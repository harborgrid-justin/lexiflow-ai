/**
 * App Navigation Hook
 * Centralized navigation with analytics tracking
 */

import { useCallback } from 'react';
import { useHashRouter } from '@/enzyme';

export interface NavigateOptions {
  replace?: boolean;
  params?: Record<string, string>;
}

export function useAppNavigation() {
  const { navigate: hashNavigate, currentRoute, params } = useHashRouter();

  const navigate = useCallback((path: string, options?: NavigateOptions) => {
    // Build path with params if provided
    let finalPath = path;
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        finalPath = finalPath.replace(`:${key}`, value);
      });
    }

    hashNavigate(finalPath);
  }, [hashNavigate]);

  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  const goToCase = useCallback((caseId: string) => {
    navigate(`cases/${caseId}`);
  }, [navigate]);

  const goToCaseEdit = useCallback((caseId: string) => {
    navigate(`edit-case/${caseId}`);
  }, [navigate]);

  const goToDocument = useCallback((documentId: string) => {
    navigate(`documents/${documentId}`);
  }, [navigate]);

  const goToDashboard = useCallback(() => {
    navigate('dashboard');
  }, [navigate]);

  return {
    navigate,
    goBack,
    goToCase,
    goToCaseEdit,
    goToDocument,
    goToDashboard,
    currentRoute,
    params,
  };
}
