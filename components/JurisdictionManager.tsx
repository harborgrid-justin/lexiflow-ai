
import React, { useState } from 'react';
import { PageHeader } from './common/PageHeader';
import { Landmark, Map, Gavel, Globe, ScrollText, Scale, Building2 } from 'lucide-react';
import { JurisdictionFederal } from './jurisdiction/JurisdictionFederal';
import { JurisdictionState } from './jurisdiction/JurisdictionState';
import { JurisdictionRegulatory } from './jurisdiction/JurisdictionRegulatory';
import { JurisdictionInternational } from './jurisdiction/JurisdictionInternational';
import { JurisdictionArbitration } from './jurisdiction/JurisdictionArbitration';
import { JurisdictionLocalRules } from './jurisdiction/JurisdictionLocalRules';
import { JurisdictionGeoMap } from './jurisdiction/JurisdictionGeoMap';

type JurisdictionView = 'federal' | 'state' | 'regulatory' | 'international' | 'arbitration' | 'local' | 'map';

export const JurisdictionManager: React.FC = () => {
  const [view, setView] = useState<JurisdictionView>('federal');

  const menuItems = [
    { id: 'federal', label: 'Federal Circuit', icon: Landmark },
    { id: 'state', label: 'State Venues', icon: Building2 },
    { id: 'regulatory', label: 'Regulatory', icon: Scale },
    { id: 'international', label: 'International', icon: Globe },
    { id: 'arbitration', label: 'Arbitration', icon: Gavel },
    { id: 'local', label: 'Local Rules', icon: ScrollText },
    { id: 'map', label: 'Geo Map', icon: Map },
  ];

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <PageHeader 
        title="Jurisdiction & Venues" 
        subtitle="Manage courts, regulatory bodies, and jurisdictional rules."
      />

      <div className="border-b border-slate-200 mb-6">
        <nav className="flex space-x-6 overflow-x-auto">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setView(item.id as JurisdictionView)}
              className={`pb-3 px-2 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${
                view === item.id 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto">
        {view === 'federal' && <JurisdictionFederal />}
        {view === 'state' && <JurisdictionState />}
        {view === 'regulatory' && <JurisdictionRegulatory />}
        {view === 'international' && <JurisdictionInternational />}
        {view === 'arbitration' && <JurisdictionArbitration />}
        {view === 'local' && <JurisdictionLocalRules />}
        {view === 'map' && <JurisdictionGeoMap />}
      </div>
    </div>
  );
};
