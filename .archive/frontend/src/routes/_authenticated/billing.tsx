import { createFileRoute } from '@tanstack/react-router';
import { useAppStore } from '@stores/app.store';
import { useEffect } from 'react';

export const Route = createFileRoute('/_authenticated/billing')({
  component: BillingPage,
});

function BillingPage() {
  const { setPageTitle, setBreadcrumbs } = useAppStore();

  useEffect(() => {
    setPageTitle('Billing');
    setBreadcrumbs([{ label: 'Billing' }]);
  }, [setPageTitle, setBreadcrumbs]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark-text">Billing</h1>
        <p className="text-dark-text-muted mt-2">Track billable hours and invoices</p>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-enterprise p-6">
        <p className="text-dark-text-muted">No billing records to display</p>
      </div>
    </div>
  );
}
