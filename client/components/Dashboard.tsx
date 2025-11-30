
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ApiService } from '../services/apiService';
import { Briefcase, Clock, FileText, AlertTriangle } from 'lucide-react';
import { PageHeader } from './common/PageHeader';
import { StatCard } from './common/Stats';
import { Card } from './common/Card';
import { Button } from './common/Button';

interface DashboardProps {
  onSelectCase: (caseId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectCase }) => {
  const CHART_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#10b981', '#f59e0b'];
  const [stats, setStats] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
        try {
            const data = await ApiService.getDashboard();
            // Map icon strings back to components
            const mappedStats = data.stats.map((s: any) => ({
                ...s,
                icon: s.icon === 'Briefcase' ? Briefcase : s.icon === 'FileText' ? FileText : s.icon === 'Clock' ? Clock : AlertTriangle
            }));
            setStats(mappedStats);
            setChartData(data.chartData);
            setAlerts(data.alerts);
        } catch (e) {
            console.error("Failed to fetch dashboard", e);
        }
    };
    fetchDashboard();
  }, []);

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
