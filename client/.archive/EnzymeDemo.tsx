// Enzyme Demo Page - Demonstrates ACTUAL @missionfabric-js/enzyme usage
// This page uses real Enzyme hooks and features, not simulations

import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, Trash2, Edit, CheckCircle, AlertCircle, Loader2, Zap, Activity,
  ExternalLink, Shield, Gauge, Radio, Flag, Palette, Database, GitBranch,
  Layers, Cpu, Wifi, Moon, Lock, BarChart2, BookOpen, Droplets, ArrowRight
} from 'lucide-react';
import { enzymeCasesService } from '../enzyme/services/cases.service';
import { useApiRequest, useApiMutation } from '../enzyme/services/hooks';
import type { ApiError } from '@missionfabric-js/enzyme/api';
import { Case } from '../types';
import { 
  useIsMounted, 
  useLatestCallback, 
  useBuffer,
  getNetworkInfo,
  isSlowConnection,
  shouldAllowPrefetch,
  useTrackEvent
} from '@missionfabric-js/enzyme/hooks';

// Enzyme documentation links
const ENZYME_DOCS = {
  github: 'https://github.com/harborgrid-justin/enzyme',
  api: 'https://github.com/harborgrid-justin/enzyme/tree/master/docs/api',
  auth: 'https://github.com/harborgrid-justin/enzyme/tree/master/docs/auth',
  state: 'https://github.com/harborgrid-justin/enzyme/tree/master/docs/STATE.md',
  flags: 'https://github.com/harborgrid-justin/enzyme/tree/master/docs/flags',
  performance: 'https://github.com/harborgrid-justin/enzyme/tree/master/docs/performance',
  realtime: 'https://github.com/harborgrid-justin/enzyme/tree/master/docs/realtime',
  streaming: 'https://github.com/harborgrid-justin/enzyme/tree/master/docs/streaming',
  hydration: 'https://github.com/harborgrid-justin/enzyme/tree/master/docs/HYDRATION.md',
  theme: 'https://github.com/harborgrid-justin/enzyme/tree/master/docs/DESIGN_SYSTEM.md',
  security: 'https://github.com/harborgrid-justin/enzyme/tree/master/docs/SECURITY.md',
  hooks: 'https://github.com/harborgrid-justin/enzyme/tree/master/docs/HOOKS_REFERENCE.md',
  queries: 'https://github.com/harborgrid-justin/enzyme/tree/master/docs/queries',
  monitoring: 'https://github.com/harborgrid-justin/enzyme/tree/master/docs/monitoring',
};

// All Enzyme features with descriptions
const ENZYME_FEATURES = [
  {
    id: 'api',
    name: 'Enterprise API Client',
    description: 'Type-safe HTTP client with retry, rate limiting, deduplication, and interceptors',
    icon: Database,
    color: 'from-blue-500 to-cyan-500',
    docsKey: 'api' as keyof typeof ENZYME_DOCS,
    tags: ['Retry Logic', 'Rate Limiting', 'Request Deduplication', 'Interceptors'],
  },
  {
    id: 'auth',
    name: 'Authentication & RBAC',
    description: 'Full auth system with role-based access control, guards, and session management',
    icon: Shield,
    color: 'from-green-500 to-emerald-500',
    docsKey: 'auth' as keyof typeof ENZYME_DOCS,
    tags: ['useAuth', 'RequireRole', 'RequirePermission', 'AuthProvider'],
  },
  {
    id: 'state',
    name: 'Zustand State Management',
    description: 'Production-grade state with Immer, DevTools, memoized selectors, and persistence',
    icon: Layers,
    color: 'from-purple-500 to-violet-500',
    docsKey: 'state' as keyof typeof ENZYME_DOCS,
    tags: ['useStore', 'createSlice', 'Persistence', 'Multi-tab Sync'],
  },
  {
    id: 'flags',
    name: 'Feature Flags & A/B Testing',
    description: 'Runtime feature toggles with local/remote support and conditional rendering',
    icon: Flag,
    color: 'from-orange-500 to-amber-500',
    docsKey: 'flags' as keyof typeof ENZYME_DOCS,
    tags: ['useFeatureFlag', 'FlagGate', 'A/B Testing', 'Rollout Control'],
  },
  {
    id: 'performance',
    name: 'Performance Observatory',
    description: 'Built-in Core Web Vitals tracking, performance budgets, and memory monitoring',
    icon: Gauge,
    color: 'from-red-500 to-pink-500',
    docsKey: 'performance' as keyof typeof ENZYME_DOCS,
    tags: ['Web Vitals', 'LCP', 'INP', 'CLS', 'Performance Budgets'],
  },
  {
    id: 'realtime',
    name: 'Real-time & WebSocket',
    description: 'WebSocket and SSE integration with auto-reconnect and presence tracking',
    icon: Radio,
    color: 'from-indigo-500 to-blue-500',
    docsKey: 'realtime' as keyof typeof ENZYME_DOCS,
    tags: ['WebSocket', 'SSE', 'Auto-reconnect', 'Presence'],
  },
  {
    id: 'streaming',
    name: 'HTML Streaming',
    description: 'Progressive HTML streaming with priority-based rendering and suspense integration',
    icon: Wifi,
    color: 'from-teal-500 to-cyan-500',
    docsKey: 'streaming' as keyof typeof ENZYME_DOCS,
    tags: ['StreamBoundary', 'Priority Chunks', 'Progressive Loading'],
  },
  {
    id: 'hydration',
    name: 'Progressive Hydration',
    description: 'Smart hydration with priority scheduling and viewport-aware activation',
    icon: Cpu,
    color: 'from-fuchsia-500 to-pink-500',
    docsKey: 'hydration' as keyof typeof ENZYME_DOCS,
    tags: ['HydrationBoundary', 'Priority Scheduling', 'Lazy Hydration'],
  },
  {
    id: 'theme',
    name: 'Theme System',
    description: 'Dark/light mode with system preference detection and design tokens',
    icon: Moon,
    color: 'from-slate-600 to-slate-800',
    docsKey: 'theme' as keyof typeof ENZYME_DOCS,
    tags: ['useTheme', 'Dark Mode', 'System Preference', 'Design Tokens'],
  },
  {
    id: 'security',
    name: 'Security Module',
    description: 'CSP, CSRF protection, XSS prevention, and secure storage utilities',
    icon: Lock,
    color: 'from-rose-500 to-red-600',
    docsKey: 'security' as keyof typeof ENZYME_DOCS,
    tags: ['CSRF', 'XSS Prevention', 'Secure Storage', 'CSP'],
  },
  {
    id: 'queries',
    name: 'React Query Integration',
    description: 'TanStack Query utilities with query key factories and optimistic updates',
    icon: GitBranch,
    color: 'from-yellow-500 to-orange-500',
    docsKey: 'queries' as keyof typeof ENZYME_DOCS,
    tags: ['Query Keys', 'Prefetching', 'Optimistic Updates', 'Infinite Queries'],
  },
  {
    id: 'monitoring',
    name: 'Error Monitoring',
    description: 'Global error boundaries, crash analytics, and error reporting integration',
    icon: BarChart2,
    color: 'from-emerald-500 to-green-600',
    docsKey: 'monitoring' as keyof typeof ENZYME_DOCS,
    tags: ['ErrorBoundary', 'Crash Reporting', 'Breadcrumbs', 'Sentry Integration'],
  },
  {
    id: 'routing',
    name: 'Smart Route Discovery',
    description: 'File-system routing with auto-discovery, code-splitting, and type-safe navigation',
    icon: Palette,
    color: 'from-cyan-500 to-blue-600',
    docsKey: 'github' as keyof typeof ENZYME_DOCS,
    tags: ['File-based Routes', 'Code Splitting', 'Type-safe Links', 'Prefetching'],
  },
  {
    id: 'hooks',
    name: '60+ Custom Hooks',
    description: 'Comprehensive hook library for network, debounce, analytics, and more',
    icon: BookOpen,
    color: 'from-violet-500 to-purple-600',
    docsKey: 'hooks' as keyof typeof ENZYME_DOCS,
    tags: ['useIsMounted', 'useLatestCallback', 'useBuffer', 'useTrackEvent', 'Network Utils'],
  },
];

interface CaseStatsProps {
  stats: { total: number; active: number; closed: number; pending: number } | null;
  isLoading: boolean;
}

const CaseStats: React.FC<CaseStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-slate-200 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
            <div className="h-8 bg-slate-200 rounded w-12"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const statItems = [
    { label: 'Total Cases', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active', value: stats.active, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pending', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { label: 'Closed', value: stats.closed, color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {statItems.map((item) => (
        <div key={item.label} className={`${item.bg} rounded-lg p-4 shadow-sm border border-slate-200`}>
          <p className="text-sm text-slate-600">{item.label}</p>
          <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  );
};

// Feature Card Component
const FeatureCard: React.FC<{ feature: typeof ENZYME_FEATURES[0] }> = ({ feature }) => {
  const Icon = feature.icon;
  
  return (
    <a
      href={ENZYME_DOCS[feature.docsKey]}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-lg hover:border-slate-300 transition-all duration-200"
    >
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-lg bg-gradient-to-br ${feature.color} text-white shrink-0`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {feature.name}
            </h3>
            <ExternalLink className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <p className="text-sm text-slate-600 mt-1 line-clamp-2">
            {feature.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {feature.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded"
              >
                {tag}
              </span>
            ))}
            {feature.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-500 rounded">
                +{feature.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export const EnzymeDemo: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [stats, setStats] = useState<{ total: number; active: number; closed: number; pending: number } | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'demo' | 'features' | 'docs'>('demo');

  // ✅ ENZYME HOOK: useIsMounted - Prevents updates after component unmount
  const isMounted = useIsMounted();

  // ✅ ENZYME HOOK: useBuffer - Batch analytics events
  const analyticsBuffer = useBuffer<{ event: string; timestamp: number }>({
    maxSize: 10,
    flushInterval: 5000,
    onFlush: (events) => {
      console.log('📊 Flushing', events.length, 'analytics events:', events);
      // In production, send to analytics service
    },
  });

  // ✅ ENZYME HOOK: useTrackEvent - Analytics tracking
  const trackEvent = useTrackEvent();

  // ✅ ENZYME HOOK: Network awareness
  const [networkInfo, setNetworkInfo] = useState<string>('Checking...');
  const [slowConnection, setSlowConnection] = useState<boolean>(false);
  const [canPrefetch, setCanPrefetch] = useState<boolean>(false);

  useEffect(() => {
    const info = getNetworkInfo();
    const isSlow = isSlowConnection();
    const allowPrefetch = shouldAllowPrefetch({ minConnectionQuality: '3g' });

    setNetworkInfo(info ? `${info.effectiveType} (${info.downlink}Mbps)` : 'Unknown');
    setSlowConnection(isSlow);
    setCanPrefetch(allowPrefetch);
  }, []);

  // ✅ USING ENZYME: Health check using our configured enzymeClient
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'unhealthy' | 'checking'>('checking');
  
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/v1/health');
        const data = await response.json();
        // ✅ ENZYME HOOK: useIsMounted - Only update if still mounted
        if (isMounted()) {
          setHealthStatus(data.status === 'healthy' ? 'healthy' : 'unhealthy');
        }
      } catch {
        if (isMounted()) {
          setHealthStatus('unhealthy');
        }
      }
    };
    
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [isMounted]);

  // ✅ USING ENZYME: useApiRequest hook with our configured enzymeClient
  const { 
    data: casesData, 
    isLoading, 
    error: casesError,
    refetch 
  } = useApiRequest<Case[]>('/cases'); // Uses enzymeClient with /api/v1 baseURL

  // ✅ USING ENZYME: useApiMutation for delete operation
  const deleteCaseMutation = useApiMutation<Case, { id: string }>('/cases/:id', {
    method: 'DELETE',
    onSuccess: () => {
      refetch();
    },
  });

  const error = casesError ? (casesError as ApiError).message : null;

  // Handle success messages
  useEffect(() => {
    if (casesData && cases.length === 0) {
      setSuccessMessage('Cases loaded via Enzyme useGet hook!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  }, [casesData, cases.length]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const data = await enzymeCasesService.getStats();
      // ✅ ENZYME HOOK: useIsMounted - Only update if still mounted
      if (isMounted()) {
        setStats(data);
      }
    } catch (_err) {
      console.log('Stats endpoint not available');
    } finally {
      if (isMounted()) {
        setStatsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (casesData) {
      setCases(casesData);
      // ✅ ENZYME HOOK: Track analytics event
      trackEvent('cases_loaded', { count: casesData.length });
      // ✅ ENZYME HOOK: Add to analytics buffer
      analyticsBuffer.add({ event: 'cases_loaded', timestamp: Date.now() });
    }
  }, [casesData, trackEvent, analyticsBuffer]);

  // ✅ ENZYME HOOK: useLatestCallback - Stable callback with latest values
  const handleDelete = useLatestCallback(async (id: string) => {
    if (!confirm('Are you sure you want to delete this case?')) return;
    try {
      deleteCaseMutation.mutate({ id });
      setSuccessMessage('Case deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
      // ✅ ENZYME HOOK: Track delete event
      trackEvent('case_deleted', { caseId: id });
      analyticsBuffer.add({ event: 'case_deleted', timestamp: Date.now() });
    } catch (err) {
      console.error('Delete failed:', err);
    }
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-slate-100 text-slate-800';
      case 'on hold': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Enzyme Framework</h1>
              <p className="text-sm text-slate-500">Enterprise React Framework by @missionfabric-js</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.hash = '#hydration-demo'}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Droplets className="h-4 w-4" />
            <span>Hydration Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-slate-200 shadow-sm">
            <Activity className={`h-4 w-4 ${healthStatus === 'healthy' ? 'text-green-500' : healthStatus === 'degraded' ? 'text-yellow-500' : 'text-red-500'}`} />
            <span className="text-sm text-slate-600">API: {healthStatus || 'checking...'}</span>
          </div>
          <a href={ENZYME_DOCS.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
            <ExternalLink className="h-4 w-4" />
            GitHub
          </a>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        {[
          { id: 'demo' as const, label: 'Live Demo', icon: Activity },
          { id: 'features' as const, label: 'All Features', icon: Zap },
          { id: 'docs' as const, label: 'Documentation', icon: BookOpen },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          <CheckCircle className="h-5 w-5" />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {/* Demo Tab */}
      {activeTab === 'demo' && (
        <>
          <CaseStats stats={stats} isLoading={statsLoading} />

          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
            <h2 className="text-lg font-semibold mb-3">✅ Active Enzyme Features in this Page</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="bg-white/10 rounded-lg p-3">
                <p className="font-medium">useApiRequest Hook</p>
                <p className="text-white/70">Auto-fetching cases list</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="font-medium">useApiMutation Hook</p>
                <p className="text-white/70">Mutation with refetch</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="font-medium">useIsMounted Hook</p>
                <p className="text-white/70">Safe async updates</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="font-medium">useLatestCallback</p>
                <p className="text-white/70">Stable event handlers</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="font-medium">useBuffer Hook</p>
                <p className="text-white/70">Batched analytics</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="font-medium">useTrackEvent Hook</p>
                <p className="text-white/70">Event tracking</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="font-medium">Network Utils</p>
                <p className="text-white/70">{networkInfo}</p>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <p className="font-medium">Prefetch Guard</p>
                <p className="text-white/70">{canPrefetch ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
            {slowConnection && (
              <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-300/30 rounded-lg">
                <p className="text-sm font-medium">⚠️ Slow Connection Detected</p>
                <p className="text-xs text-white/80 mt-1">Enzyme is optimizing data loading for your connection speed</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Cases (via Enzyme useGet Hook)</h2>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">{cases.length} total</span>
                <button 
                  onClick={() => refetch()} 
                  disabled={isLoading} 
                  className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                <span className="ml-3 text-slate-600">Loading via Enzyme...</span>
              </div>
            ) : cases.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <p>No cases found</p>
                <p className="text-sm mt-1">Create a case to see it here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Case</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {cases.slice(0, 10).map((caseItem) => (
                      <tr key={caseItem.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-900">{caseItem.title}</p>
                            <p className="text-sm text-slate-500">{caseItem.caseNumber || caseItem.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{caseItem.client || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                            {caseItem.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{caseItem.matterType || 'General'}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => window.location.hash = `edit-case/${caseItem.id}`}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" 
                              title="Edit Case"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(caseItem.id)} 
                              disabled={deleteCaseMutation.isLoading}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50" 
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-slate-900 rounded-xl p-6 text-slate-100">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Usage Example - Actual Enzyme Hooks</h3>
            <pre className="text-sm overflow-x-auto"><code>{`import { useApiRequest, useApiMutation } from '@missionfabric-js/enzyme/api';
import { 
  useIsMounted, 
  useLatestCallback, 
  useBuffer,
  getNetworkInfo,
  isSlowConnection,
  shouldAllowPrefetch,
  useTrackEvent 
} from '@missionfabric-js/enzyme/hooks';

// ✅ Auto-fetch with retry, caching, and loading states
const { data: cases, isLoading, error, refetch } = useApiRequest('/cases');

// ✅ Safe async updates - prevents updates after unmount
const isMounted = useIsMounted();
const fetchData = async () => {
  const data = await api.get('/data');
  if (isMounted()) setData(data); // Only update if still mounted
};

// ✅ Stable callbacks that always use latest values
const handleSubmit = useLatestCallback(async () => {
  await submitForm(values);
  trackEvent('form_submitted', { formId });
});

// ✅ Batch analytics events before sending to server
const analyticsBuffer = useBuffer({
  maxSize: 10,
  flushInterval: 5000,
  onFlush: (events) => sendToAnalytics(events)
});
analyticsBuffer.add({ event: 'page_view', timestamp: Date.now() });

// ✅ Network-aware features
const networkInfo = getNetworkInfo(); // { effectiveType: '4g', downlink: 10 }
const isSlow = isSlowConnection(); // boolean
const canPrefetch = shouldAllowPrefetch({ minConnectionQuality: '3g' });

// ✅ Track user events
const trackEvent = useTrackEvent();
trackEvent('button_clicked', { buttonId: 'submit' });`}</code></pre>
          </div>
        </>
      )}

      {/* Features Tab */}
      {activeTab === 'features' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 text-white">
            <h2 className="text-xl font-bold mb-2">14 Enterprise Modules</h2>
            <p className="text-slate-300">Everything you need to build production-ready React applications. Click any feature to view its documentation.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ENZYME_FEATURES.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      )}

      {/* Documentation Tab */}
      {activeTab === 'docs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Getting Started', url: `${ENZYME_DOCS.github}#quick-start`, desc: 'Installation and setup' },
                { label: 'API Documentation', url: ENZYME_DOCS.api, desc: 'HTTP client and hooks' },
                { label: 'Authentication', url: ENZYME_DOCS.auth, desc: 'Auth providers and RBAC' },
                { label: 'State Management', url: ENZYME_DOCS.state, desc: 'Zustand integration' },
                { label: 'Feature Flags', url: ENZYME_DOCS.flags, desc: 'A/B testing and toggles' },
                { label: 'Performance', url: ENZYME_DOCS.performance, desc: 'Web Vitals and budgets' },
                { label: 'Real-time', url: ENZYME_DOCS.realtime, desc: 'WebSocket and SSE' },
                { label: 'Hooks Reference', url: ENZYME_DOCS.hooks, desc: '60+ custom hooks' },
                { label: 'Security', url: ENZYME_DOCS.security, desc: 'CSRF, XSS, CSP' },
              ].map((link) => (
                <a 
                  key={link.label} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 p-4 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                >
                  <BookOpen className="h-5 w-5 text-slate-400 group-hover:text-indigo-500" />
                  <div>
                    <p className="font-medium text-slate-900 group-hover:text-indigo-600">{link.label}</p>
                    <p className="text-sm text-slate-500">{link.desc}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-300 ml-auto" />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl p-6 text-slate-100">
            <h3 className="text-sm font-medium text-slate-400 mb-3">Installation</h3>
            <pre className="text-sm overflow-x-auto"><code>{`npm install @missionfabric-js/enzyme

# Import modules
import { createApiClient, useGet, usePost } from '@missionfabric-js/enzyme/api';
import { AuthProvider, useAuth } from '@missionfabric-js/enzyme/auth';
import { useStore, createSlice } from '@missionfabric-js/enzyme/state';
import { useFeatureFlag, FlagGate } from '@missionfabric-js/enzyme/flags';
import { HydrationProvider, HydrationBoundary } from '@missionfabric-js/enzyme/hydration';`}</code></pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnzymeDemo;
