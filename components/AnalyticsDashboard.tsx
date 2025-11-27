
import React, { useState } from 'react';
import { PageHeader } from './common/PageHeader';
import { Tabs } from './common/Tabs';
import { MOCK_JUDGE, MOCK_COUNSEL, MOCK_JUDGE_STATS, MOCK_OUTCOME_DATA } from '../data/mockAnalytics';
import { JudgeAnalytics } from './analytics/JudgeAnalytics';
import { CounselAnalytics } from './analytics/CounselAnalytics';
import { CasePrediction } from './analytics/CasePrediction';

export const AnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('judge');

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

      {activeTab === 'judge' && <JudgeAnalytics judge={MOCK_JUDGE} stats={MOCK_JUDGE_STATS} />}
      {activeTab === 'counsel' && <CounselAnalytics counsel={MOCK_COUNSEL} />}
      {activeTab === 'prediction' && <CasePrediction outcomeData={MOCK_OUTCOME_DATA} />}
    </div>
  );
};
