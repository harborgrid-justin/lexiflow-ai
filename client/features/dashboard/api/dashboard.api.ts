/**
 * Dashboard Feature - API Service
 */

export const DashboardApi = {
  getDashboardData: async () => {
    const response = await fetch('/api/v1/analytics/dashboard', {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch dashboard data');
    return response.json();
  },

  getSLAStatus: async () => {
    const response = await fetch('/api/v1/workflow/engine/sla/check', {
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) throw new Error('Failed to fetch SLA status');
    return response.json();
  }
};

export default DashboardApi;
