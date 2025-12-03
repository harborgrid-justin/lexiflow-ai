// Defense Service using Enzyme API Client
import { enzymeClient } from './client';
import { DefenseStrategy, OpponentProfile } from '../types';

const DEFENSE_ENDPOINTS = {
  strategies: '/defense/strategies',
  strategyDetail: (id: string) => `/defense/strategies/${id}`,
  vulnerabilities: (caseId: string) => `/defense/cases/${caseId}/vulnerabilities`,
  counterArguments: '/defense/counter-arguments',
  riskAssessment: (caseId: string) => `/defense/cases/${caseId}/risk-assessment`,
  scenarios: (caseId: string) => `/defense/cases/${caseId}/scenarios`,
  weaknessHeatmap: (caseId: string) => `/defense/cases/${caseId}/weakness-heatmap`,
  opponentProfile: (name: string) => `/defense/opponents/${encodeURIComponent(name)}`,
  juryImpact: (strategyId: string) => `/defense/strategies/${strategyId}/jury-impact`,
} as const;

export const enzymeDefenseService = {
  async getStrategies(caseId: string): Promise<DefenseStrategy[]> {
    const response = await enzymeClient.get<DefenseStrategy[]>(DEFENSE_ENDPOINTS.strategies, {
      params: { caseId },
    });
    return response.data || [];
  },

  async getStrategyById(id: string): Promise<DefenseStrategy> {
    const response = await enzymeClient.get<DefenseStrategy>(DEFENSE_ENDPOINTS.strategyDetail(id));
    return response.data;
  },

  async createStrategy(data: Partial<DefenseStrategy>): Promise<DefenseStrategy> {
    const response = await enzymeClient.post<DefenseStrategy>(DEFENSE_ENDPOINTS.strategies, {
      body: data as Record<string, unknown>,
    });
    return response.data;
  },

  async getVulnerabilities(caseId: string): Promise<any[]> {
    const response = await enzymeClient.get<any[]>(DEFENSE_ENDPOINTS.vulnerabilities(caseId));
    return response.data || [];
  },

  async generateCounterArguments(claim: string): Promise<string[]> {
    const response = await enzymeClient.post<{ arguments: string[] }>(DEFENSE_ENDPOINTS.counterArguments, {
      body: { claim },
    });
    return response.data.arguments;
  },

  async getRiskAssessment(caseId: string): Promise<any> {
    const response = await enzymeClient.get<any>(DEFENSE_ENDPOINTS.riskAssessment(caseId));
    return response.data;
  },

  async runScenarioPlanning(caseId: string, parameters: any): Promise<any> {
    const response = await enzymeClient.post<any>(DEFENSE_ENDPOINTS.scenarios(caseId), {
      body: parameters,
    });
    return response.data;
  },

  async getWeaknessHeatmap(caseId: string): Promise<any> {
    const response = await enzymeClient.get<any>(DEFENSE_ENDPOINTS.weaknessHeatmap(caseId));
    return response.data;
  },

  async getOpponentProfile(name: string): Promise<OpponentProfile> {
    const response = await enzymeClient.get<OpponentProfile>(DEFENSE_ENDPOINTS.opponentProfile(name));
    return response.data;
  },

  async predictJuryImpact(strategyId: string): Promise<any> {
    const response = await enzymeClient.get<any>(DEFENSE_ENDPOINTS.juryImpact(strategyId));
    return response.data;
  },
};
