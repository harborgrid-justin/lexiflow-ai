
import React, { useState } from 'react';
import { PageHeader } from './common/PageHeader';
import { CalendarMaster } from './calendar/CalendarMaster';
import { CalendarDeadlines } from './calendar/CalendarDeadlines';
import { CalendarTeam } from './calendar/CalendarTeam';
import { CalendarHearings } from './calendar/CalendarHearings';
import { CalendarSOL } from './calendar/CalendarSOL';
import { CalendarRules } from './calendar/CalendarRules';
import { CalendarSync } from './calendar/CalendarSync';
import { Calendar as CalendarIcon, Clock, Users, Gavel, AlertOctagon, Settings, RefreshCw } from 'lucide-react';

type CalendarTab = 'master' | 'deadlines' | 'team' | 'hearings' | 'sol' | 'rules' | 'sync';

export const CalendarView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalendarTab>('master');

  const tabs = [
    { id: 'master', label: 'Master Schedule', icon: CalendarIcon },
    { id: 'deadlines', label: 'Court Deadlines', icon: Clock },
    { id: 'team', label: 'Team Availability', icon: Users },
    { id: 'hearings', label: 'Hearing Docket', icon: Gavel },
    { id: 'sol', label: 'Statute Watch', icon: AlertOctagon },
    { id: 'rules', label: 'Rule Sets', icon: Settings },
    { id: 'sync', label: 'Sync & Feeds', icon: RefreshCw },
  ];

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <PageHeader 
        title="Master Calendar" 
        subtitle="Deadlines, Court Filings, and Compliance Schedules."
      />

      <div className="border-b border-slate-200 mb-6">
        <nav className="flex space-x-1 overflow-x-auto pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as CalendarTab)}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                  ${activeTab === tab.id 
                    ? 'border-blue-600 text-blue-600 bg-blue-50/50' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }
                `}
              >
                <Icon className={`h-4 w-4 mr-2 ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'master' && <CalendarMaster />}
        {activeTab === 'deadlines' && <CalendarDeadlines />}
        {activeTab === 'team' && <CalendarTeam />}
        {activeTab === 'hearings' && <CalendarHearings />}
        {activeTab === 'sol' && <CalendarSOL />}
        {activeTab === 'rules' && <CalendarRules />}
        {activeTab === 'sync' && <CalendarSync />}
      </div>
    </div>
  );
};
