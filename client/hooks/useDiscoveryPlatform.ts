import { useState, useEffect } from 'react';
import { DiscoveryRequest } from '../types';
import { ApiService } from '../services/apiService';

export const useDiscoveryPlatform = () => {
  const [requests, setRequests] = useState<DiscoveryRequest[]>([]);

  useEffect(() => {
    const fetchDiscovery = async () => {
      try {
        const data = await ApiService.getDiscovery();
        setRequests(data || []);
      } catch (e) {
        console.error("Failed to fetch discovery", e);
        setRequests([]);
      }
    };
    fetchDiscovery();
  }, []);

  return {
    requests
  };
};