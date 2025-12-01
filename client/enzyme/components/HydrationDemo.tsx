import React, { useState } from 'react';
import {
  HydrationProvider,
  HydrationBoundary,
  useHydrationMetrics,
  useHydrationStatus,
} from '@missionfabric-js/enzyme/hydration';
import { Droplets, Zap, Clock, CheckCircle, AlertCircle, ArrowLeft, TrendingUp, Users, FileText, DollarSign, Loader2, Eye } from 'lucide-react';
import { Case } from '../../types';
import { useApiRequest } from '../services';

// Metrics Dashboard Component
function HydrationMetricsDashboard() {
  const metrics = useHydrationMetrics();

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Droplets className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-slate-900">Hydration Metrics</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {metrics.hydrationProgress?.toFixed(0) || 0}%
          </div>
          <div className="text-sm text-slate-600">Progress</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {metrics.hydratedCount || 0}/{metrics.totalBoundaries || 0}
          </div>
          <div className="text-sm text-slate-600">Hydrated</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {metrics.averageHydrationDuration?.toFixed(0) || 0}ms
          </div>
          <div className="text-sm text-slate-600">Avg Duration</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {metrics.p95HydrationDuration?.toFixed(0) || 0}ms
          </div>
          <div className="text-sm text-slate-600">P95 Duration</div>
        </div>
      </div>

      {metrics.isFullyHydrated && (
        <div className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 rounded-lg p-3">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm font-medium">All components fully hydrated!</span>
        </div>
      )}
    </div>
  );
}

// Critical Content (Immediate Hydration)
function CriticalHeroSection() {
  const { isHydrated, isHydrating } = useHydrationStatus('hero-section');
  const { data: stats } = useApiRequest<any>('/cases/stats');

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-6 h-6" />
        <h2 className="text-2xl font-bold">Critical Content - Immediate Hydration</h2>
      </div>
      <p className="text-blue-100 mb-4">
        This section uses <code className="bg-blue-800 px-2 py-1 rounded">priority="critical"</code> and{' '}
        <code className="bg-blue-800 px-2 py-1 rounded">trigger="immediate"</code>. Data loads instantly for above-the-fold content.
      </p>
      
      {/* Real-time stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4" />
              <span className="text-xs text-blue-200">Total Cases</span>
            </div>
            <div className="text-3xl font-bold">{stats.total || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-xs text-blue-200">Active</span>
            </div>
            <div className="text-3xl font-bold text-green-300">{stats.active || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs text-blue-200">Pending</span>
            </div>
            <div className="text-3xl font-bold text-yellow-300">{stats.pending || 0}</div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs text-blue-200">Closed</span>
            </div>
            <div className="text-3xl font-bold text-slate-300">{stats.closed || 0}</div>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2 text-sm mt-6">
        <div className={`w-2 h-2 rounded-full ${
          isHydrated ? 'bg-green-400' : isHydrating ? 'bg-yellow-400' : 'bg-red-400'
        }`} />
        <span>
          Status: {isHydrated ? 'Hydrated ✓' : isHydrating ? 'Hydrating...' : 'Not Hydrated'}
        </span>
      </div>
    </div>
  );
}

// Normal Content (Visible Hydration)
function NormalCasesList() {
  const { isHydrated } = useHydrationStatus('cases-list');
  const { data: cases, isLoading } = useApiRequest<Case[]>('/cases');
  const [visibleCount, setVisibleCount] = useState(5);

  if (!isHydrated) {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-700 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            SSR content visible, waiting for scroll/viewport trigger...
          </p>
        </div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-slate-200 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-slate-200 rounded w-1/3" />
              <div className="h-5 bg-slate-200 rounded w-20" />
            </div>
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-2" />
            <div className="h-4 bg-slate-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-slate-600">Loading cases from API...</span>
      </div>
    );
  }

  const displayedCases = cases?.slice(0, visibleCount) || [];
  const hasMore = (cases?.length || 0) > visibleCount;

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Hydrated! Showing {displayedCases.length} of {cases?.length || 0} cases
        </p>
      </div>
      
      {displayedCases.map((caseItem) => (
        <div key={caseItem.id} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900">{caseItem.title}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              caseItem.status === 'Active' ? 'bg-green-100 text-green-800' :
              caseItem.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
              caseItem.status === 'Closed' ? 'bg-slate-100 text-slate-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {caseItem.status}
            </span>
          </div>
          <div className="text-sm text-slate-600 space-y-1">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{caseItem.client || 'No client'}</span>
            </div>
            {caseItem.value && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>${caseItem.value.toLocaleString()}</span>
              </div>
            )}
            {caseItem.description && (
              <p className="text-slate-500 mt-2 line-clamp-2">{caseItem.description}</p>
            )}
          </div>
        </div>
      ))}
      
      {hasMore && (
        <button
          onClick={() => setVisibleCount(visibleCount + 5)}
          className="w-full py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium"
        >
          Load More ({(cases?.length || 0) - visibleCount} remaining)
        </button>
      )}
    </div>
  );
}

// Low Priority Content (Idle Hydration)
function LowPriorityFooter() {
  const { isHydrated } = useHydrationStatus('footer-section');
  const [interactionCount, setInteractionCount] = useState(0);

  return (
    <div className="bg-slate-100 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-900">
          Low Priority - Idle Hydration
        </h3>
      </div>
      <p className="text-sm text-slate-600 mb-4">
        This section uses <code className="bg-slate-200 px-2 py-1 rounded">priority="low"</code> and{' '}
        <code className="bg-slate-200 px-2 py-1 rounded">trigger="idle"</code>
      </p>
      {isHydrated ? (
        <button
          onClick={() => setInteractionCount(interactionCount + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Interactive Button (Clicked {interactionCount} times)
        </button>
      ) : (
        <div className="px-4 py-2 bg-slate-300 text-slate-500 rounded-lg">
          Button (Not yet hydrated)
        </div>
      )}
    </div>
  );
}

// Lazy Clients Section
function LazyClientsSection() {
  const { isHydrated } = useHydrationStatus('lazy-clients');
  const { data: clients, isLoading } = useApiRequest<any[]>('/clients');
  const [selectedClient, setSelectedClient] = useState<any>(null);

  if (!isHydrated) {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-purple-200 rounded w-1/3" />
          <div className="h-4 bg-purple-200 rounded w-2/3" />
          <div className="h-4 bg-purple-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
          <span className="ml-3 text-purple-600">Loading clients...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-purple-900">
          Interactive Clients List - Hydrated on Scroll
        </h3>
      </div>
      <p className="text-purple-700 mb-4">
        This section loaded only when scrolled into view using{' '}
        <code className="bg-purple-100 px-2 py-1 rounded">trigger="visible"</code>
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clients?.slice(0, 6).map((client) => (
          <button
            key={client.id}
            onClick={() => setSelectedClient(client)}
            className="bg-white border border-purple-200 rounded-lg p-4 text-left hover:shadow-md transition-shadow"
          >
            <div className="font-medium text-slate-900">{client.name}</div>
            {client.company && (
              <div className="text-sm text-slate-600 mt-1">{client.company}</div>
            )}
            {client.email && (
              <div className="text-xs text-slate-400 mt-1">{client.email}</div>
            )}
          </button>
        ))}
      </div>
      
      {selectedClient && (
        <div className="mt-4 bg-purple-100 rounded-lg p-4">
          <p className="text-sm text-purple-900">
            Selected: <strong>{selectedClient.name}</strong>
          </p>
          <p className="text-xs text-purple-700 mt-1">
            This interaction works because the component is now fully hydrated!
          </p>
        </div>
      )}
      
      {clients && clients.length > 6 && (
        <p className="text-sm text-purple-600 mt-4">
          +{clients.length - 6} more clients available
        </p>
      )}
    </div>
  );
}

// Main Hydration Demo
export function HydrationDemo() {
  return (
    <HydrationProvider
      config={{
        debug: import.meta.env.DEV,
      }}
    >
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.location.hash = '#enzyme-demo'}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Enzyme Demo</span>
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Droplets className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              Enzyme Hydration Demo
            </h1>
          </div>
          <p className="text-slate-600">
            Progressive hydration with priority-based loading using native Enzyme features
          </p>
        </div>

        {/* Metrics Dashboard */}
        <HydrationMetricsDashboard />

        {/* Critical Content - Immediate Hydration */}
        <HydrationBoundary
          priority="critical"
          trigger="immediate"
          aboveTheFold
          id="hero-section"
        >
          <CriticalHeroSection />
        </HydrationBoundary>

        {/* Normal Content - Visible Hydration */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-slate-600" />
            <h2 className="text-xl font-semibold text-slate-900">
              Normal Priority - Visible Hydration
            </h2>
          </div>
          <HydrationBoundary
            priority="normal"
            trigger="visible"
            id="cases-list"
          >
            <NormalCasesList />
          </HydrationBoundary>
        </div>

        {/* Low Priority - Idle Hydration */}
        <HydrationBoundary
          priority="low"
          trigger="idle"
          id="footer-section"
        >
          <LowPriorityFooter />
        </HydrationBoundary>

        {/* LazyHydration Example with Client Data */}
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Lazy Loaded Clients - Viewport Trigger
          </h2>
          <HydrationBoundary
            priority="low"
            trigger="visible"
            id="lazy-clients"
          >
            <LazyClientsSection />
          </HydrationBoundary>
        </div>
      </div>
    </HydrationProvider>
  );
}
