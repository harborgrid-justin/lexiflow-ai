import { useState, useEffect } from 'react';
import { ApiService } from '../services/apiService';
import { AuditLogEntry } from '../types';

export const useAdminPanel = (activeTab: string) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    if (activeTab === 'logs') {
      ApiService.getAuditLogs().then(setLogs).catch(console.error);
    }
  }, [activeTab]);

  return {
    logs
  };
};