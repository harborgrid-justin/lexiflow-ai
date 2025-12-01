/**
 * CalendarView - Master Calendar Component
 *
 * Manages deadlines, court filings, and compliance schedules with
 * multiple calendar views (master, deadlines, team, hearings, SOL, rules, sync).
 *
 * ENZYME MIGRATION:
 * - Added usePageView for page tracking ('calendar_view')
 * - Added useTrackEvent for analytics on tab changes
 * - Added useLatestCallback for stable setActiveTab handler
 * - Added HydrationBoundary for progressive hydration of heavy sub-components
 * - Uses React.lazy() and Suspense for code-splitting calendar components
 */

import React, { useState, Suspense, lazy } from 'react';
import { PageHeader, TabNavigation } from './common';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Gavel,
  AlertOctagon,
  Settings,
  RefreshCw
} from 'lucide-react';
import {
  useLatestCallback,
  useTrackEvent,
  usePageView,
  useIsMounted,
  HydrationBoundary,
  LazyHydration
} from '../enzyme';

// Lazy load heavy calendar components for better performance
const CalendarMaster = lazy(() => import('./calendar/CalendarMaster').then(m => ({ default: m.CalendarMaster })));
const CalendarDeadlines = lazy(() => import('./calendar/CalendarDeadlines').then(m => ({ default: m.CalendarDeadlines })));
const CalendarTeam = lazy(() => import('./calendar/CalendarTeam').then(m => ({ default: m.CalendarTeam })));
const CalendarHearings = lazy(() => import('./calendar/CalendarHearings').then(m => ({ default: m.CalendarHearings })));
const CalendarSOL = lazy(() => import('./calendar/CalendarSOL').then(m => ({ default: m.CalendarSOL })));
const CalendarRules = lazy(() => import('./calendar/CalendarRules').then(m => ({ default: m.CalendarRules })));
const CalendarSync = lazy(() => import('./calendar/CalendarSync').then(m => ({ default: m.CalendarSync })));

type CalendarTab = 'master' | 'deadlines' | 'team' | 'hearings' | 'sol' | 'rules' | 'sync';

interface CalendarViewProps {
  onNavigateToCase?: (caseId: string) => void;
}

// Loading fallback for lazy components
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-slate-200">
    <div className="animate-pulse text-slate-400">Loading calendar...</div>
  </div>
);

export const CalendarView: React.FC<CalendarViewProps> = ({ onNavigateToCase }) => {
  const [activeTab, setActiveTab] = useState<CalendarTab>('master');
  const isMounted = useIsMounted();

  // ENZYME: Analytics tracking
  const trackEvent = useTrackEvent();
  usePageView('calendar_view');

  const tabs: TabItem[] = [
    { id: 'master', label: 'Master Schedule', icon: CalendarIcon },
    { id: 'deadlines', label: 'Court Deadlines', icon: Clock },
    { id: 'team', label: 'Team Availability', icon: Users },
    { id: 'hearings', label: 'Hearing Docket', icon: Gavel },
    { id: 'sol', label: 'Statute Watch', icon: AlertOctagon },
    { id: 'rules', label: 'Rule Sets', icon: Settings },
    { id: 'sync', label: 'Sync & Feeds', icon: RefreshCw },
  ];

  // ENZYME: Stable callback for tab changes with tracking
  const handleTabChange = useLatestCallback((tabId: string) => {
    const newTab = tabId as CalendarTab;
    setActiveTab(newTab);

    // Track tab change event
    trackEvent('calendar_tab_change', {
      from_tab: activeTab,
      to_tab: newTab
    });
  });

  // ENZYME: Render tab content with HydrationBoundary wrappers
  const renderTabContent = () => {
    switch (activeTab) {
      case 'master':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <HydrationBoundary id="calendar-master" priority="high" trigger="immediate">
              <CalendarMaster onNavigateToCase={onNavigateToCase} />
            </HydrationBoundary>
          </Suspense>
        );
      case 'deadlines':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <HydrationBoundary id="calendar-deadlines" priority="high" trigger="visible">
              <CalendarDeadlines />
            </HydrationBoundary>
          </Suspense>
        );
      case 'team':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <LazyHydration priority="normal" trigger="visible">
              <CalendarTeam />
            </LazyHydration>
          </Suspense>
        );
      case 'hearings':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <HydrationBoundary id="calendar-hearings" priority="high" trigger="visible">
              <CalendarHearings />
            </HydrationBoundary>
          </Suspense>
        );
      case 'sol':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <LazyHydration priority="normal" trigger="visible">
              <CalendarSOL />
            </LazyHydration>
          </Suspense>
        );
      case 'rules':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <LazyHydration priority="low" trigger="idle">
              <CalendarRules />
            </LazyHydration>
          </Suspense>
        );
      case 'sync':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <LazyHydration priority="low" trigger="idle">
              <CalendarSync />
            </LazyHydration>
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingFallback />}>
            <HydrationBoundary id="calendar-master-default" priority="high" trigger="immediate">
              <CalendarMaster onNavigateToCase={onNavigateToCase} />
            </HydrationBoundary>
          </Suspense>
        );
    }
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <PageHeader
        title="Master Calendar"
        subtitle="Deadlines, Court Filings, and Compliance Schedules."
      />

      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        className="mb-6 bg-white rounded-t-lg"
      />

      <div className="flex-1 overflow-y-auto">
        {renderTabContent()}
      </div>
    </div>
  );
};
