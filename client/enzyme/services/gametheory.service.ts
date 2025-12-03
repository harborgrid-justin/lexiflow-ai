// Game Theory Service using Enzyme API Client
import { enzymeClient } from './client';
import { Simulation } from '../types';

const GAME_THEORY_ENDPOINTS = {
  simulations: '/game-theory/simulations',
  simulationDetail: (id: string) => `/game-theory/simulations/${id}`,
  runSimulation: '/game-theory/simulations/run',
  outcomes: (caseId: string) => `/game-theory/cases/${caseId}/outcomes`,
  nashEquilibrium: (caseId: string) => `/game-theory/cases/${caseId}/nash-equilibrium`,
  payoffMatrix: (caseId: string) => `/game-theory/cases/${caseId}/payoff-matrix`,
  monteCarlo: (caseId: string) => `/game-theory/cases/${caseId}/monte-carlo`,
  settlement: (caseId: string) => `/game-theory/cases/${caseId}/settlement-calculator`,
  decisionTree: (caseId: string) => `/game-theory/cases/${caseId}/decision-tree`,
  sensitivity: (caseId: string) => `/game-theory/cases/${caseId}/sensitivity-analysis`,
} as const;

export const enzymeGameTheoryService = {
  async getSimulations(caseId: string): Promise<Simulation[]> {
    const response = await enzymeClient.get<Simulation[]>(GAME_THEORY_ENDPOINTS.simulations, {
      params: { caseId },
    });
    return response.data || [];
  },

  async getSimulationById(id: string): Promise<Simulation> {
    const response = await enzymeClient.get<Simulation>(GAME_THEORY_ENDPOINTS.simulationDetail(id));
    return response.data;
  },

  async runSimulation(data: { caseId: string; parameters: any }): Promise<Simulation> {
    const response = await enzymeClient.post<Simulation>(GAME_THEORY_ENDPOINTS.runSimulation, {
      body: data,
    });
    return response.data;
  },

  async getPredictedOutcomes(caseId: string): Promise<any[]> {
    const response = await enzymeClient.get<any[]>(GAME_THEORY_ENDPOINTS.outcomes(caseId));
    return response.data || [];
  },

  async getNashEquilibrium(caseId: string): Promise<any> {
    const response = await enzymeClient.get<any>(GAME_THEORY_ENDPOINTS.nashEquilibrium(caseId));
    return response.data;
  },

  async getPayoffMatrix(caseId: string): Promise<any> {
    const response = await enzymeClient.get<any>(GAME_THEORY_ENDPOINTS.payoffMatrix(caseId));
    return response.data;
  },

  async runMonteCarloSimulation(caseId: string, iterations: number = 1000): Promise<any> {
    const response = await enzymeClient.post<any>(GAME_THEORY_ENDPOINTS.monteCarlo(caseId), {
      body: { iterations },
    });
    return response.data;
  },

  async calculateOptimalSettlement(caseId: string): Promise<any> {
    const response = await enzymeClient.get<any>(GAME_THEORY_ENDPOINTS.settlement(caseId));
    return response.data;
  },

  async getDecisionTree(caseId: string): Promise<any> {
    const response = await enzymeClient.get<any>(GAME_THEORY_ENDPOINTS.decisionTree(caseId));
    return response.data;
  },

  async runSensitivityAnalysis(caseId: string, variables: string[]): Promise<any> {
    const response = await enzymeClient.post<any>(GAME_THEORY_ENDPOINTS.sensitivity(caseId), {
      body: { variables },
    });
    return response.data;
  },
};
