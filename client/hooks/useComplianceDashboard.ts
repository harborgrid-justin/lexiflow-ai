import { useState, useEffect } from 'react';
import { ApiService } from '../services/apiService';
import { ConflictCheck, EthicalWall } from '../types';

export const useComplianceDashboard = () => {
  const [conflicts, setConflicts] = useState<ConflictCheck[]>([]);
  const [walls, setWalls] = useState<EthicalWall[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [c, w] = await Promise.all([
          ApiService.getConflicts(),
          ApiService.getWalls()
        ]);
        setConflicts(c || []);
        setWalls(w || []);
      } catch (e) {
        console.error("Failed to fetch compliance data", e);
        setConflicts([]);
        setWalls([]);
      }
    };
    fetchData();
  }, []);

  return {
    conflicts,
    walls
  };
};