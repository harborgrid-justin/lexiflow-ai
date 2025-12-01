import { useState, useEffect } from 'react';
import { ApiService } from '../services/apiService';
import { JudgeProfile, OpposingCounselProfile } from '../types';

export const useAnalyticsDashboard = () => {
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

  return {
    judgeData,
    counselData
  };
};