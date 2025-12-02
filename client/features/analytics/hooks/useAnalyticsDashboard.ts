/**
 * Analytics Dashboard Hook
 *
 * Provides analytics data fetching for judge profiles and opposing counsel analysis.
 * Uses shared API hooks for consistent data fetching patterns.
 *
 * @module features/analytics/hooks
 */

import { useApi } from '@/shared/hooks';
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
  // Use shared API hooks for consistent data fetching
  const { data: judgeData = null, loading: judgeLoading, error: judgeError, refetch: refetchJudge } = useApi<JudgeAnalyticsData | null>(
    () => fetch('/api/v1/analytics/judges').then(r => r.json()),
    []
  );

  const { data: counselData = null, loading: counselLoading, error: counselError, refetch: refetchCounsel } = useApi<CounselAnalyticsData | null>(
    () => fetch('/api/v1/analytics/counsel').then(r => r.json()),
    []
  );

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
