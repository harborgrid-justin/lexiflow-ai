/**
 * AnalyticsDashboard - Litigation Analytics Component
 *
 * Provides data-driven insights for legal strategy and negotiation,
 * including judge analytics, opposing counsel analysis, and case predictions.
 *
 * ENZYME MIGRATION:
 * - Uses useAnalyticsDashboard hook with useApiRequest
 * - Added useLatestCallback for stable tab change handler
 * - Added useTrackEvent for analytics tracking on tab changes
 * - Added usePageView for page tracking
 * - Added HydrationBoundary for progressive hydration of analytics sub-components
 * - Lazy loading for JudgeAnalytics, CounselAnalytics, and CasePrediction
 */

import React, { useState, Suspense, lazy } from 'react';
import { PageHeader, Tabs } from './common';
import { useAnalyticsDashboard } from '../hooks/useAnalyticsDashboard';
import {
  useLatestCallback,
  useTrackEvent,
  usePageView,
  HydrationBoundary
} from '../enzyme';

// Lazy load heavy analytics sub-components for better performance
const JudgeAnalytics = lazy(() =>
  import('./analytics/JudgeAnalytics').then(m => ({ default: m.JudgeAnalytics }))
);
const CounselAnalytics = lazy(() =>
  import('./analytics/CounselAnalytics').then(m => ({ default: m.CounselAnalytics }))
);
const CasePrediction = lazy(() =>
  import('./analytics/CasePrediction').then(m => ({ default: m.CasePrediction }))
);

type AnalyticsTab = 'judge' | 'counsel' | 'prediction';

// Loading fallback for lazy components
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-slate-200">
    <div className="animate-pulse text-slate-400">Loading analytics...</div>
  </div>
);

export const AnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('judge');
  const { judgeData, counselData } = useAnalyticsDashboard();

  // ENZYME: Analytics tracking
  const trackEvent = useTrackEvent();
  usePageView('analytics_dashboard');

  // ENZYME: Stable callback with useLatestCallback for tab changes
  const handleTabChange = useLatestCallback((tab: string) => {
    const newTab = tab as AnalyticsTab;
    setActiveTab(newTab);

    // Track tab change event
    trackEvent('analytics_tab_change', {
      tab: newTab,
      previousTab: activeTab
    });
  });

  if (!judgeData || !counselData) {
    return (
      <div className="p-8 text-center text-slate-500">
        Loading analytics...
      </div>
    );
  }

  // Render the active analytics view with hydration boundaries
  const renderAnalyticsView = () => {
    switch (activeTab) {
      case 'judge':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <HydrationBoundary id="judge-analytics" priority="normal" trigger="visible">
              <JudgeAnalytics judge={judgeData.profile} stats={judgeData.stats} />
            </HydrationBoundary>
          </Suspense>
        );
      case 'counsel':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <HydrationBoundary id="counsel-analytics" priority="normal" trigger="visible">
              <CounselAnalytics counsel={counselData.profile} />
            </HydrationBoundary>
          </Suspense>
        );
      case 'prediction':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <HydrationBoundary id="case-prediction" priority="normal" trigger="visible">
              <CasePrediction outcomeData={counselData.outcomes} />
            </HydrationBoundary>
          </Suspense>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Litigation Analytics"
        subtitle="Data-driven insights for strategy and negotiation."
        actions={
          <Tabs
            tabs={['judge', 'counsel', 'prediction']}
            activeTab={activeTab}
            onChange={handleTabChange}
          />
        }
      />

      <div className="min-h-[400px]">
        {renderAnalyticsView()}
      </div>
    </div>
  );
};
