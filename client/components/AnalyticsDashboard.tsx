
import React, { useState, useEffect } from 'react';
import { PageHeader } from './common/PageHeader';
import { Tabs } from './common/Tabs';
import { ApiService } from '../services/apiService';
import { JudgeAnalytics } from './analytics/JudgeAnalytics';
import { CounselAnalytics } from './analytics/CounselAnalytics';
import { CasePrediction } from './analytics/CasePrediction';
import { JudgeProfile, OpposingCounselProfile } from '../types';

export const AnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('judge');
  const [judgeData, setJudgeData] = useState<{profile: JudgeProfile, stats: any[]} | null>(null);
  const [counselData, setCounselData] = useState<{profile: OpposingCounselProfile, outcomes: any[]} | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [j, c] = await Promise.all([
                ApiService.getJudgeAnalytics(),
                ApiService.getCounselAnalytics()
            ]);
            setJudgeData(j);
            setCounselData(c);
        } catch (e) {
            console.error("Failed to fetch analytics", e);
        }
    };
    fetchData();
  }, []);

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
