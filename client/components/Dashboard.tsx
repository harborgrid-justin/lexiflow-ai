
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ApiService } from '../services/apiService';
import { Briefcase, Clock, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { StatCard } from './common/Stats';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { useWorkflowEngine } from '../hooks/useWorkflowEngine';

interface DashboardProps {
  onSelectCase: (caseId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectCase }) => {
  const CHART_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#10b981', '#f59e0b'];
  const [stats, setStats] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [_currentUserId] = useState('1'); // Replace with actual current user ID
  const { checkSLABreaches } = useWorkflowEngine();
  const [slaBreaches, setSlaBreaches] = useState({ warnings: 0, breaches: 0 });

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

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Executive Dashboard" 
        subtitle="Welcome back, Senior Partner. Here is your firm's overview."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard 
            key={stat.label} 
            label={stat.label} 
            value={stat.value} 
            icon={stat.icon} 
            color={stat.color} 
            bg={stat.bg} 
          />
        ))}
      </div>

      {/* Workflow Status Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card title="SLA Warnings" className="bg-amber-50 border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-amber-600">{slaBreaches.warnings}</p>
              <p className="text-sm text-amber-700 mt-1">Tasks approaching deadline</p>
            </div>
            <Clock className="h-12 w-12 text-amber-400 opacity-50" />
          </div>
        </Card>

        <Card title="SLA Breaches" className="bg-red-50 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-red-600">{slaBreaches.breaches}</p>
              <p className="text-sm text-red-700 mt-1">Overdue tasks</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-red-400 opacity-50" />
          </div>
        </Card>

        <Card title="Workflow Efficiency" className="bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-green-600">87%</p>
              <p className="text-sm text-green-700 mt-1">On-time completion rate</p>
            </div>
            <CheckCircle2 className="h-12 w-12 text-green-400 opacity-50" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Case Distribution by Phase">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent Alerts">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`flex items-start p-3 rounded-md transition-colors border-l-4 border-l-blue-500 bg-slate-50/50 ${alert.caseId ? 'cursor-pointer hover:bg-blue-50' : ''}`}
                onClick={() => alert.caseId && onSelectCase(alert.caseId)}
              >
                <div className="flex-1">
                  <p className={`text-sm font-medium ${alert.caseId ? 'text-blue-700' : 'text-slate-900'}`}>{alert.message}</p>
                  <p className="text-xs text-slate-500 mt-1">{alert.detail}</p>
                </div>
                <span className="text-xs font-medium text-slate-400">{alert.time}</span>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4 text-blue-600 hover:text-blue-700">
            View All Notifications
          </Button>
        </Card>
      </div>
    </div>
  );
};
