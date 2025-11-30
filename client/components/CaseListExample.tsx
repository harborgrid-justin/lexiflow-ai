import React, { useState } from 'react';
import { Case } from '../types';

// Example component showing how to use the API integration
export const CaseListExample: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseClient, setNewCaseClient] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      // Using dynamic import to avoid circular dependencies
      const { ApiService } = await import('../services/apiService');
      const fetchedCases = await ApiService.cases.getAll();
      setCases(fetchedCases);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch cases');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCase = async () => {
    if (!newCaseTitle.trim() || !newCaseClient.trim()) return;

    try {
      setCreating(true);
      setCreateError(null);
      const { ApiService } = await import('../services/apiService');

      await ApiService.cases.create({
        title: newCaseTitle,
        client: newCaseClient,
        status: 'Discovery',
        filingDate: new Date().toISOString(),
        description: `New case for ${newCaseClient}`,
      });

      setNewCaseTitle('');
      setNewCaseClient('');
      setShowCreateForm(false);
      refetch();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create case');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <span className="ml-2">Loading cases...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50 text-red-700">
        <div className="flex items-center">
          <span>Error loading cases: {error}</span>
        </div>
        <button
          onClick={refetch}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cases</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          New Case
        </button>
      </div>

      {showCreateForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Create New Case</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Case Title"
              value={newCaseTitle}
              onChange={(e) => setNewCaseTitle(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Client Name"
              value={newCaseClient}
              onChange={(e) => setNewCaseClient(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {createError && (
            <p className="text-red-600 text-sm mt-2">{createError}</p>
          )}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCreateCase}
              disabled={creating || !newCaseTitle.trim() || !newCaseClient.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Case'}
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cases?.map((caseItem: Case) => (
          <div key={caseItem.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium mb-2">{caseItem.title}</h3>
            <p className="text-gray-600 mb-2">{caseItem.client || caseItem.description}</p>
            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 rounded text-sm ${
                caseItem.status === 'Discovery' ? 'bg-green-100 text-green-800' :
                caseItem.status === 'Closed' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {caseItem.status}
              </span>
              <span className="text-sm text-gray-500">
                {caseItem.filingDate}
              </span>
            </div>
          </div>
        ))}
      </div>

      {cases?.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No cases found</p>
          <p>Create your first case to get started</p>
        </div>
      )}
    </div>
  );
};
