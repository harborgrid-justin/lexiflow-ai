
import React, { useState } from 'react';
import { PageHeader } from './common/PageHeader';
import { Landmark, Map, Gavel, Globe, ScrollText, Scale, Building2, Lock } from 'lucide-react';
import { JurisdictionFederal } from './jurisdiction/JurisdictionFederal';
import { JurisdictionState } from './jurisdiction/JurisdictionState';
import { JurisdictionRegulatory } from './jurisdiction/JurisdictionRegulatory';
import { JurisdictionInternational } from './jurisdiction/JurisdictionInternational';
import { JurisdictionArbitration } from './jurisdiction/JurisdictionArbitration';
import { JurisdictionLocalRules } from './jurisdiction/JurisdictionLocalRules';
import { JurisdictionGeoMap } from './jurisdiction/JurisdictionGeoMap';
import { User } from '../types';

type JurisdictionView = 'federal' | 'state' | 'regulatory' | 'international' | 'arbitration' | 'local' | 'map';

interface JurisdictionManagerProps {
  currentUser?: User;
}

export const JurisdictionManager: React.FC<JurisdictionManagerProps> = ({ currentUser }) => {
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
    <div className="h-full flex flex-col bg-slate-50">
      <PageHeader 
        title="Jurisdiction & Venues" 
        subtitle="Manage courts, regulatory bodies, and jurisdictional rules."
        actions={
          currentUser ? (
            <div className="flex items-center text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
              <span className={`w-2 h-2 rounded-full mr-2 ${currentUser.role === 'Senior Partner' ? 'bg-purple-500' : 'bg-blue-500'}`}></span>
              Viewing as: <span className="font-bold ml-1">{currentUser.role}</span>
            </div>
          ) : undefined
        }
      />

      <div className="border-b border-slate-200 mb-6 bg-white px-4 rounded-lg shadow-sm">
        <nav className="flex space-x-6 overflow-x-auto">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setView(item.id as JurisdictionView)}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${
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

      <div className="flex-1 overflow-y-auto min-h-[400px]">
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
