
import React, { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import { PageHeader, StatCard, Card, Button, StatusCard } from './common';
import { useDashboard } from '../hooks/useDashboard';
import { useTrackEvent, useLatestCallback } from '@missionfabric-js/enzyme/hooks';

interface DashboardProps {
  onSelectCase: (caseId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onSelectCase }) => {
  const CHART_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#10b981', '#f59e0b'];
  const { stats, chartData, alerts, slaBreaches, loading } = useDashboard();
  
  // ✅ ENZYME HOOK: Track analytics events
  const trackEvent = useTrackEvent();
  
  useEffect(() => {
    trackEvent('dashboard_viewed', { 
      totalCases: stats.find(s => s.label === 'Total Cases')?.value || 0 
    });
  }, [trackEvent, stats]);

  // ✅ ENZYME HOOK: Stable callback with latest values
  const handleCaseSelect = useLatestCallback((caseId: string) => {
    trackEvent('dashboard_case_clicked', { caseId });
    onSelectCase(caseId);
  });

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
        <StatusCard
          title="SLA Warnings"
          value={slaBreaches.warnings}
          subtitle="Tasks approaching deadline"
          status="warning"
          icon={Clock}
        />

        <StatusCard
          title="SLA Breaches"
          value={slaBreaches.breaches}
          subtitle="Overdue tasks"
          status="error"
          icon={AlertTriangle}
        />

        <StatusCard
          title="Workflow Efficiency"
          value="87%"
          subtitle="On-time completion rate"
          status="success"
          icon={CheckCircle2}
        />
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
                onClick={() => alert.caseId && handleCaseSelect(alert.caseId)}
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
      
      {/* Enzyme Features Indicator */}
      {!loading && (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-4 text-white text-sm">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="font-medium">Powered by Enzyme Framework:</span>
            <span className="opacity-90">TanStack Query caching • useLatestCallback • useTrackEvent analytics</span>
          </div>
        </div>
      )}
    </div>
  );
};
