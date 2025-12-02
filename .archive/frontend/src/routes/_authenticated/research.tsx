import { createFileRoute } from '@tanstack/react-router';
import { useAppStore } from '@stores/app.store';
import { useEffect } from 'react';

export const Route = createFileRoute('/_authenticated/research')({
  component: ResearchPage,
});

function ResearchPage() {
  const { setPageTitle, setBreadcrumbs } = useAppStore();

  useEffect(() => {
    setPageTitle('Research');
    setBreadcrumbs([{ label: 'Research' }]);
  }, [setPageTitle, setBreadcrumbs]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-dark-text">Legal Research</h1>
        <p className="text-dark-text-muted mt-2">
          AI-powered legal research exceeding LexisNexis and Westlaw
        </p>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-enterprise p-6">
        <p className="text-dark-text-muted">Research interface coming soon</p>
      </div>
    </div>
  );
}
