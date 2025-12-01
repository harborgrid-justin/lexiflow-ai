import { useState, useEffect } from 'react';
import { ApiService } from '../services/apiService';
import { Client } from '../types';

export const useBillingDashboard = () => {
  const [wipData, setWipData] = useState<any[]>([]);
  const [realizationData, setRealizationData] = useState<any[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stats, c] = await Promise.all([
          ApiService.getBillingStats(),
          ApiService.getClients()
        ]);
        if (stats && stats.wip) {
          setWipData(stats.wip.map((w: any) => ({ month: w.month, wip: w.amount })));
        }
        if (stats && stats.realization) {
          setRealizationData(stats.realization);
        }
        setClients(c || []);
      } catch (e) {
        console.error("Failed to fetch billing data", e);
        setWipData([]);
        setRealizationData([]);
        setClients([]);
      }
    };
    fetchData();
  }, []);

  const totalWip = wipData.reduce((acc, curr) => acc + curr.wip, 0);

  return {
    wipData,
    realizationData,
    clients,
    totalWip
  };
};