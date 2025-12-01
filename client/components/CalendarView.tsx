
import React, { useState } from 'react';
import { PageHeader } from './common/PageHeader';
import { TabNavigation, TabItem } from './common/TabNavigation';
import { CalendarMaster } from './calendar/CalendarMaster';
import { CalendarDeadlines } from './calendar/CalendarDeadlines';
import { CalendarTeam } from './calendar/CalendarTeam';
import { CalendarHearings } from './calendar/CalendarHearings';
import { CalendarSOL } from './calendar/CalendarSOL';
import { CalendarRules } from './calendar/CalendarRules';
import { CalendarSync } from './calendar/CalendarSync';
import { Calendar as CalendarIcon, Clock, Users, Gavel, AlertOctagon, Settings, RefreshCw } from 'lucide-react';

type CalendarTab = 'master' | 'deadlines' | 'team' | 'hearings' | 'sol' | 'rules' | 'sync';

interface CalendarViewProps {
  onNavigateToCase?: (caseId: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onNavigateToCase }) => {
  const [activeTab, setActiveTab] = useState<CalendarTab>('master');

  const tabs: TabItem[] = [
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

      <TabNavigation 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as CalendarTab)}
        className="mb-6 bg-white rounded-t-lg"
      />

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'master' && <CalendarMaster onNavigateToCase={onNavigateToCase} />}
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
