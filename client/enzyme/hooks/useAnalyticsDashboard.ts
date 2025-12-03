/**
 * useAnalyticsDashboard Hook - Legal Analytics
 *
 * Manages analytics data for judges and opposing counsel.
 *
 * @see /client/enzyme/ENZYME_COMPLETE_GUIDE.md
 */

import { useApiRequest } from '../services/hooks';
import type { JudgeProfile, OpposingCounselProfile } from '../../types';

interface JudgeAnalytics {
  profile: JudgeProfile;
  stats: any[];
}

interface CounselAnalytics {
  profile: OpposingCounselProfile;
  outcomes: any[];
}

export const useAnalyticsDashboard = () => {
  // Parallel API requests with Enzyme - automatic caching
  const { data: judgeData = null, isLoading: loadingJudge } = useApiRequest<JudgeAnalytics | null>({
    endpoint: '/analytics/judges',
    options: {
      staleTime: 10 * 60 * 1000,
    },
  });

  const { data: counselData = null, isLoading: loadingCounsel } = useApiRequest<CounselAnalytics | null>({
    endpoint: '/analytics/counsel',
    options: {
      staleTime: 10 * 60 * 1000,
    },
  });

  return {
    judgeData,
    counselData,
    loading: loadingJudge || loadingCounsel,
  };
};

export default useAnalyticsDashboard;
