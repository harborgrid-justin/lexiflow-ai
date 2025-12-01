
import React, { useState } from 'react';
import { PageHeader } from './common/PageHeader';
import { Tabs } from './common/Tabs';
import { JudgeAnalytics } from './analytics/JudgeAnalytics';
import { CounselAnalytics } from './analytics/CounselAnalytics';
import { CasePrediction } from './analytics/CasePrediction';
import { useAnalyticsDashboard } from '../hooks/useAnalyticsDashboard';

export const AnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('judge');
  const { judgeData, counselData } = useAnalyticsDashboard();

  if (!judgeData || !counselData) return <div className="p-8 text-center text-slate-500">Loading analytics...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Litigation Analytics" 
        subtitle="Data-driven insights for strategy and negotiation."
        actions={
          <Tabs 
            tabs={['judge', 'counsel', 'prediction']} 
            activeTab={activeTab} 
            onChange={setActiveTab} 
          />
        }
      />

      {activeTab === 'judge' && <JudgeAnalytics judge={judgeData.profile} stats={judgeData.stats} />}
      {activeTab === 'counsel' && <CounselAnalytics counsel={counselData.profile} />}
      {activeTab === 'prediction' && <CasePrediction outcomeData={counselData.outcomes} />}
    </div>
  );
};
