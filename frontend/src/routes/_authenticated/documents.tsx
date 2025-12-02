import { createFileRoute } from '@tanstack/react-router';
import { useAppStore } from '@stores/app.store';
import { useEffect } from 'react';

export const Route = createFileRoute('/_authenticated/documents')({
  component: DocumentsPage,
});

function DocumentsPage() {
  const { setPageTitle, setBreadcrumbs } = useAppStore();

  useEffect(() => {
    setPageTitle('Documents');
    setBreadcrumbs([{ label: 'Documents' }]);
  }, [setPageTitle, setBreadcrumbs]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark-text">Documents</h1>
          <p className="text-dark-text-muted mt-2">Manage all legal documents</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-enterprise font-medium transition-colors">
          Upload Document
        </button>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-enterprise p-6">
        <p className="text-dark-text-muted">No documents to display</p>
      </div>
    </div>
  );
}
