import { useState, useEffect } from 'react';
import { Briefcase, FileText, Clock, AlertTriangle } from 'lucide-react';
import { ApiService } from '../services/apiService';
import { useWorkflowEngine } from './useWorkflowEngine';

export const useDashboard = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [slaBreaches, setSlaBreaches] = useState({ warnings: 0, breaches: 0 });

  const { checkSLABreaches } = useWorkflowEngine();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await ApiService.getDashboard();
        if (!data) return;

        // Map icon strings back to components
        const mappedStats = (data.stats || []).map((s: any) => ({
          ...s,
          icon: s.icon === 'Briefcase' ? Briefcase : s.icon === 'FileText' ? FileText : s.icon === 'Clock' ? Clock : AlertTriangle
        }));
        setStats(mappedStats);
        setChartData(data.chartData || []);
        setAlerts(data.alerts || []);

        // Load SLA breach data
        const breachData = await checkSLABreaches();
        if (breachData) {
          setSlaBreaches({
            warnings: breachData.warnings?.length || 0,
            breaches: breachData.breaches?.length || 0
          });
        }
      } catch (e) {
        console.error("Failed to fetch dashboard", e);
        setStats([]);
        setChartData([]);
        setAlerts([]);
      }
    };
    fetchDashboard();
  }, [checkSLABreaches]);

  return {
    stats,
    chartData,
    alerts,
    slaBreaches
  };
};