/**
 * Analytics Dashboard Hook
 *
 * Provides analytics data fetching for judge profiles and opposing counsel analysis.
 * Uses shared API hooks for consistent data fetching patterns.
 *
 * @module features/analytics/hooks
 */

import { useApiRequest } from '@/enzyme';
import { JudgeProfile, OpposingCounselProfile } from '@/types';

export interface JudgeAnalyticsData {
  profile: JudgeProfile;
  stats: Array<{
    metric: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
  }>;
}

export interface CounselAnalyticsData {
  profile: OpposingCounselProfile;
  outcomes: Array<{
    caseType: string;
    wins: number;
    losses: number;
    settlements: number;
  }>;
}

export const useAnalyticsDashboard = () => {
  // Use Enzyme API hooks for consistent data fetching
  const { 
    data: judgeData = null, 
    isLoading: judgeLoading, 
    error: judgeError, 
    refetch: refetchJudge 
  } = useApiRequest<JudgeAnalyticsData | null>({
    endpoint: '/analytics/judges',
    options: { staleTime: 5 * 60 * 1000 }
  });

  const { 
    data: counselData = null, 
    isLoading: counselLoading, 
    error: counselError, 
    refetch: refetchCounsel 
  } = useApiRequest<CounselAnalyticsData | null>({
    endpoint: '/analytics/counsel',
    options: { staleTime: 5 * 60 * 1000 }
  });

  return {
    judgeData,
    counselData,
    isLoading: judgeLoading || counselLoading,
    error: judgeError || counselError,
    refetch: () => {
      refetchJudge();
      refetchCounsel();
    }
  };
};