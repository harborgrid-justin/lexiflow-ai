/**
 * Dashboard Feature - API Service
 */
import { enzymeAnalyticsService } from '@/enzyme/services/misc.service';
import { enzymeWorkflowService } from '@/enzyme/services/workflow.service';

export const DashboardApi = {
  getDashboardData: async () => {
    return enzymeAnalyticsService.getDashboard();
  },

  getSLAStatus: async () => {
    return enzymeWorkflowService.engine.checkSLA();
  }
};

export default DashboardApi;
