/**
 * JurisdictionManagerPage - Jurisdiction Manager Page Component
 *
 * Manages courts, regulatory bodies, and jurisdictional rules.
 */

import React, { useState } from 'react';
import { PageHeader, TabNavigation, TabItem } from '@/components/common';
import { Landmark, Map, Gavel, Globe, ScrollText, Scale, Building2 } from 'lucide-react';
import { usePageView, useTrackEvent, useLatestCallback } from '@/enzyme';
import type { User } from '@/types';
import type { JurisdictionView } from '../api/jurisdiction.types';

// Lazy load sub-components
const JurisdictionFederal = React.lazy(() =>
  import('@/components/jurisdiction').then(m => ({ default: m.JurisdictionFederal }))
);
const JurisdictionState = React.lazy(() =>
  import('@/components/jurisdiction').then(m => ({ default: m.JurisdictionState }))
);
const JurisdictionRegulatory = React.lazy(() =>
  import('@/components/jurisdiction').then(m => ({ default: m.JurisdictionRegulatory }))
);
const JurisdictionInternational = React.lazy(() =>
  import('@/components/jurisdiction').then(m => ({ default: m.JurisdictionInternational }))
);
const JurisdictionArbitration = React.lazy(() =>
  import('@/components/jurisdiction').then(m => ({ default: m.JurisdictionArbitration }))
);
const JurisdictionLocalRules = React.lazy(() =>
  import('@/components/jurisdiction').then(m => ({ default: m.JurisdictionLocalRules }))
);
const JurisdictionGeoMap = React.lazy(() =>
  import('@/components/jurisdiction').then(m => ({ default: m.JurisdictionGeoMap }))
);

interface JurisdictionManagerPageProps {
  currentUser?: User;
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-pulse text-slate-400">Loading jurisdiction data...</div>
  </div>
);

export const JurisdictionManagerPage: React.FC<JurisdictionManagerPageProps> = ({ currentUser }) => {
  const [view, setView] = useState<JurisdictionView>('federal');
  
  usePageView('jurisdiction_manager');
  const trackEvent = useTrackEvent();

  const menuItems: TabItem[] = [
    { id: 'federal', label: 'Federal Circuit', icon: Landmark },
    { id: 'state', label: 'State Venues', icon: Building2 },
    { id: 'regulatory', label: 'Regulatory', icon: Scale },
    { id: 'international', label: 'International', icon: Globe },
    { id: 'arbitration', label: 'Arbitration', icon: Gavel },
    { id: 'local', label: 'Local Rules', icon: ScrollText },
    { id: 'map', label: 'Geo Map', icon: Map },
  ];

  const handleViewChange = useLatestCallback((id: string) => {
    setView(id as JurisdictionView);
    trackEvent('jurisdiction_view_changed', { view: id });
  });

  const renderContent = () => {
    return (
      <React.Suspense fallback={<LoadingFallback />}>
        {view === 'federal' && <JurisdictionFederal />}
        {view === 'state' && <JurisdictionState />}
        {view === 'regulatory' && <JurisdictionRegulatory />}
        {view === 'international' && <JurisdictionInternational />}
        {view === 'arbitration' && <JurisdictionArbitration />}
        {view === 'local' && <JurisdictionLocalRules />}
        {view === 'map' && <JurisdictionGeoMap />}
      </React.Suspense>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <PageHeader
        title="Jurisdiction & Venues"
        subtitle="Manage courts, regulatory bodies, and jurisdictional rules."
        actions={
          currentUser ? (
            <div className="flex items-center text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
              <span className={`w-2 h-2 rounded-full mr-2 ${
                currentUser.role === 'Senior Partner' ? 'bg-purple-500' : 'bg-blue-500'
              }`} />
              Viewing as: <span className="font-bold ml-1">{currentUser.role}</span>
            </div>
          ) : undefined
        }
      />

      <TabNavigation
        tabs={menuItems}
        activeTab={view}
        onTabChange={handleViewChange}
        className="mb-6 bg-white rounded-lg shadow-sm"
      />

      <div className="flex-1 overflow-y-auto min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default JurisdictionManagerPage;
