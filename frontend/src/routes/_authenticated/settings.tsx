import { createFileRoute } from '@tanstack/react-router';
import { useAppStore } from '@stores/app.store';
import { useEffect } from 'react';

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsPage,
});

function SettingsPage() {
  const { setPageTitle, setBreadcrumbs } = useAppStore();

  useEffect(() => {
    setPageTitle('Settings');
    setBreadcrumbs([{ label: 'Settings' }]);
  }, [setPageTitle, setBreadcrumbs]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark-text">Settings</h1>
        <p className="text-dark-text-muted mt-2">Manage your account and preferences</p>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-enterprise p-6">
        <p className="text-dark-text-muted">Settings interface coming soon</p>
      </div>
    </div>
  );
}
