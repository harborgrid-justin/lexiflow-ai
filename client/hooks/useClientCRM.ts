import { useState, useEffect } from 'react';
import { Client } from '../types';
import { ApiService } from '../services/apiService';

export const useClientCRM = () => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await ApiService.getClients();
        setClients(data || []);
      } catch (e) {
        console.error("Failed to fetch clients", e);
        setClients([]);
      }
    };
    fetchClients();
  }, []);

  const handleAddClient = (clientName: string) => {
    const newClient: Client = {
      id: `cli-${Date.now()}`,
      name: clientName,
      industry: 'General',
      status: 'Prospect',
      totalBilled: 0,
      matters: []
    };
    setClients([...clients, newClient]);
  };

  return {
    clients,
    setClients,
    handleAddClient
  };
};