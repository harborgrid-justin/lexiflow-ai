/**
 * Feature Guard
 * Protects routes based on feature flags
 */

import React from 'react';

interface FeatureGuardProps {
  children: React.ReactNode;
  featureId: string;
  fallback?: React.ReactNode;
}

// Feature flags configuration - can be moved to config or fetched from API
const FEATURE_FLAGS: Record<string, boolean> = {
  'analytics': true,
  'compliance': true,
  'discovery': true,
  'evidence': true,
  'ai-research': true,
  'ai-drafting': true,
  'pacer-import': true,
  'calendar-sync': false,
  'email-integration': false,
  'mobile-app': false,
};

export const isFeatureEnabled = (featureId: string): boolean => {
  return FEATURE_FLAGS[featureId] ?? false;
};

export const FeatureGuard: React.FC<FeatureGuardProps> = ({ 
  children, 
  featureId,
  fallback 
}) => {
  const isEnabled = isFeatureEnabled(featureId);

  if (!isEnabled) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="text-slate-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Coming Soon</h2>
        <p className="text-slate-600">
          This feature is currently in development.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
