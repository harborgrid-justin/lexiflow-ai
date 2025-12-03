/**
 * Jurisdiction Feature - API Service
 */

import { enzymeJurisdictionsService } from '../../../enzyme/services/misc.service';
import type { Court, RegulatoryBody, ArbitrationOrganization, LocalRule } from './jurisdiction.types';

export const JurisdictionApi = {
  // Federal Courts
  getFederalCourts: async (): Promise<Court[]> => {
    return enzymeJurisdictionsService.getFederalCourts() as Promise<Court[]>;
  },

  // State Courts
  getStateCourts: async (state?: string): Promise<Court[]> => {
    return enzymeJurisdictionsService.getStateCourts(state) as Promise<Court[]>;
  },

  // Regulatory Bodies
  getRegulatoryBodies: async (): Promise<RegulatoryBody[]> => {
    return enzymeJurisdictionsService.getRegulatoryBodies() as Promise<RegulatoryBody[]>;
  },

  // Arbitration Organizations
  getArbitrationOrgs: async (): Promise<ArbitrationOrganization[]> => {
    return enzymeJurisdictionsService.getArbitrationOrgs() as Promise<ArbitrationOrganization[]>;
  },

  // Local Rules
  getLocalRules: async (courtId: string): Promise<LocalRule[]> => {
    return enzymeJurisdictionsService.getLocalRules(courtId) as Promise<LocalRule[]>;
  },

  // Search
  search: async (query: string): Promise<Court[]> => {
    return enzymeJurisdictionsService.search(query) as Promise<Court[]>;
  }
};

export default JurisdictionApi;
