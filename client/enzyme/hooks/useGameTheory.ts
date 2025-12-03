import { useApiRequest, useApiMutation } from '../services/hooks';
import { Simulation } from '../types';
import { enzymeGameTheoryService } from '../services/gametheory.service';

export const useGameTheory = (caseId?: string) => {
  const { data: simulations = [], isLoading, refetch } = useApiRequest<Simulation[]>({
    endpoint: '/game-theory/simulations',
    options: {
      enabled: !!caseId,
      params: { caseId },
    },
  });

  const { data: predictedOutcomes = [] } = useApiRequest<any[]>({
    endpoint: `/game-theory/cases/${caseId}/outcomes`,
    options: {
      enabled: !!caseId,
    },
  });

  const { data: nashEquilibrium } = useApiRequest<any>({
    endpoint: `/game-theory/cases/${caseId}/nash-equilibrium`,
    options: {
      enabled: !!caseId,
    },
  });

  const { mutateAsync: runSimulation } = useApiMutation<Simulation, { caseId: string; parameters: any }>({
    mutationFn: (data) => enzymeGameTheoryService.runSimulation(data),
    invalidateQueries: ['/game-theory/simulations'],
  });

  const { mutateAsync: runMonteCarlo } = useApiMutation<any, { caseId: string; iterations: number }>({
    mutationFn: ({ caseId, iterations }) => enzymeGameTheoryService.runMonteCarloSimulation(caseId, iterations),
  });

  const { data: decisionTree } = useApiRequest<any>({
    endpoint: `/game-theory/cases/${caseId}/decision-tree`,
    options: { enabled: !!caseId },
  });

  const { data: optimalSettlement } = useApiRequest<any>({
    endpoint: `/game-theory/cases/${caseId}/settlement-calculator`,
    options: { enabled: !!caseId },
  });

  const { mutateAsync: runSensitivity } = useApiMutation<any, { caseId: string; variables: string[] }>({
    mutationFn: ({ caseId, variables }) => enzymeGameTheoryService.runSensitivityAnalysis(caseId, variables),
  });

  return {
    simulations,
    predictedOutcomes,
    nashEquilibrium,
    isLoading,
    refetch,
    runSimulation,
    runMonteCarlo,
    decisionTree,
    optimalSettlement,
    runSensitivity,
  };
};
