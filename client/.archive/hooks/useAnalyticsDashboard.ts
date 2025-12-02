import { useApiRequest } from '../enzyme';
import { JudgeProfile, OpposingCounselProfile } from '../types';

export const useAnalyticsDashboard = () => {
  // Parallel API requests with Enzyme - automatic caching
  const { data: judgeData = null } = useApiRequest<{profile: JudgeProfile, stats: any[]} | null>({
    endpoint: '/api/v1/analytics/judges',
    options: { staleTime: 10 * 60 * 1000 } // 10 min cache
  });

  const { data: counselData = null } = useApiRequest<{profile: OpposingCounselProfile, outcomes: any[]} | null>({
    endpoint: '/api/v1/analytics/counsel',
    options: { staleTime: 10 * 60 * 1000 } // 10 min cache
  });

  return {
    judgeData,
    counselData
  };
};