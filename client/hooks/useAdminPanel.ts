import { useApiRequest } from '../enzyme';
import { AuditLogEntry } from '../types';

export const useAdminPanel = (activeTab: string) => {
  // Fetch audit logs with Enzyme - only when logs tab is active
  const { data: logs = [] } = useApiRequest<AuditLogEntry[]>({
    endpoint: '/api/v1/audit/logs',
    options: { 
      staleTime: 2 * 60 * 1000, // 2 min cache
      enabled: activeTab === 'logs' // Conditional fetching
    }
  });

  return {
    logs
  };
};