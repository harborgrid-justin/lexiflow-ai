import { useApiRequest, useApiMutation } from '../services/hooks';
import { DefenseStrategy } from '../types';
import { enzymeDefenseService } from '../services/defense.service';

export const useDefense = (caseId?: string) => {
  const { data: strategies = [], isLoading, refetch } = useApiRequest<DefenseStrategy[]>({
    endpoint: '/defense/strategies',
    options: {
      enabled: !!caseId,
      params: { caseId },
    },
  });

  const { data: vulnerabilities = [] } = useApiRequest<any[]>({
    endpoint: `/defense/cases/${caseId}/vulnerabilities`,
    options: {
      enabled: !!caseId,
    },
  });

  const { data: riskAssessment } = useApiRequest<any>({
    endpoint: `/defense/cases/${caseId}/risk-assessment`,
    options: {
      enabled: !!caseId,
    },
  });

  const { mutateAsync: createStrategy } = useApiMutation<DefenseStrategy, Partial<DefenseStrategy>>({
    mutationFn: (data) => enzymeDefenseService.createStrategy(data),
    invalidateQueries: ['/defense/strategies'],
  });

  const { mutateAsync: generateCounterArguments } = useApiMutation<string[], string>({
    mutationFn: (claim) => enzymeDefenseService.generateCounterArguments(claim),
  });

  return {
    strategies,
    vulnerabilities,
    riskAssessment,
    isLoading,
    refetch,
    createStrategy,
    generateCounterArguments,
  };
};
