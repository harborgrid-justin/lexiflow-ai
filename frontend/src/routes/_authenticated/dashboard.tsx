import { createFileRoute } from '@tanstack/react-router';
import { useAppStore } from '@stores/app.store';
import { useEffect } from 'react';

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const { setPageTitle, setBreadcrumbs } = useAppStore();

  useEffect(() => {
    setPageTitle('Dashboard');
    setBreadcrumbs([{ label: 'Dashboard' }]);
  }, [setPageTitle, setBreadcrumbs]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark-text">Dashboard</h1>
        <p className="text-dark-text-muted mt-2">
          Welcome to LexiFlow AI - Enterprise Legal Research Platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Active Cases"
          value="24"
          change="+12%"
          changeType="positive"
        />
        <DashboardCard
          title="Documents"
          value="1,429"
          change="+8%"
          changeType="positive"
        />
        <DashboardCard
          title="Research Queries"
          value="89"
          change="+23%"
          changeType="positive"
        />
        <DashboardCard
          title="Billable Hours"
          value="342"
          change="-5%"
          changeType="negative"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-surface border border-dark-border rounded-enterprise p-6">
          <h2 className="text-xl font-semibold text-dark-text mb-4">Recent Cases</h2>
          <div className="space-y-3">
            <p className="text-dark-text-muted">No recent cases to display</p>
          </div>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-enterprise p-6">
          <h2 className="text-xl font-semibold text-dark-text mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <p className="text-dark-text-muted">No recent activity to display</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
}

function DashboardCard({ title, value, change, changeType }: DashboardCardProps) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-enterprise p-6">
      <h3 className="text-sm font-medium text-dark-text-muted">{title}</h3>
      <div className="mt-2 flex items-baseline justify-between">
        <p className="text-3xl font-bold text-dark-text">{value}</p>
        <span
          className={`text-sm font-medium ${
            changeType === 'positive' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {change}
        </span>
      </div>
    </div>
  );
}
