import React, { useState, useEffect, useCallback } from 'react';
import { useLinking } from '../../enzyme/hooks/useLinking';
import { EntityLink } from '../../enzyme/types/services';
import { Network, Share2, AlertTriangle, CheckCircle, Search, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { useTrackEvent } from '../../enzyme';

interface CaseConnectionsProps {
  caseId: string;
}

export const CaseConnections: React.FC<CaseConnectionsProps> = ({ caseId }) => {
  const trackEvent = useTrackEvent();
  const { 
    checkLinkHealth, 
    getVisualizationData, 
    resolveEntities,
    findCrossMatterLinks
  } = useLinking();

  const [healthStats, setHealthStats] = useState<{ broken: number; total: number; details: any[] } | null>(null);
  const [graphData, setGraphData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'graph' | 'health' | 'discovery'>('graph');
  
  // Discovery State
  const [discoveryText, setDiscoveryText] = useState('');
  const [discoveredEntities, setDiscoveredEntities] = useState<any[]>([]);
  const [crossMatterLinks, setCrossMatterLinks] = useState<EntityLink[]>([]);

  const loadGraph = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getVisualizationData(caseId);
      setGraphData(data);
    } catch (e) {
      console.error("Failed to load graph", e);
    } finally {
      setLoading(false);
    }
  }, [caseId, getVisualizationData]);

  useEffect(() => {
    loadGraph();
  }, [loadGraph]);

  const runHealthCheck = async () => {
    setLoading(true);
    try {
      const stats = await checkLinkHealth(caseId);
      setHealthStats(stats);
      trackEvent('case_connections_health_check', { broken: stats.broken, total: stats.total });
    } catch (e) {
      console.error("Health check failed", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeText = async () => {
    if (!discoveryText) return;
    setLoading(true);
    try {
        const entities = await resolveEntities(discoveryText);
        setDiscoveredEntities(entities || []);
        trackEvent('case_connections_analyze_text', { length: discoveryText.length, entitiesFound: entities?.length });
    } catch (e) {
        console.error("Entity resolution failed", e);
    } finally {
        setLoading(false);
    }
  };

  const handleFindCrossMatter = async () => {
    setLoading(true);
    try {
        // In a real scenario, we might pass a specific entity ID, but here we'll try the caseId or a root entity
        const links = await findCrossMatterLinks(caseId);
        setCrossMatterLinks(links || []);
        trackEvent('case_connections_cross_matter', { linksFound: links?.length });
    } catch (e) {
        console.error("Cross matter search failed", e);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in pb-2">
      {/* Header / Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-1 flex space-x-1">
        <button
            onClick={() => setActiveTab('graph')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'graph' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
            <Network className="h-4 w-4"/> Knowledge Graph
        </button>
        <button
            onClick={() => setActiveTab('health')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'health' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
            <Share2 className="h-4 w-4"/> Link Health
        </button>
        <button
            onClick={() => setActiveTab('discovery')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeTab === 'discovery' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
        >
            <Search className="h-4 w-4"/> Entity Discovery
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden relative">
        {loading && (
            <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        )}

        {activeTab === 'graph' && (
            <div className="h-full flex items-center justify-center bg-slate-50">
                {graphData ? (
                    <div className="text-center">
                        <Network className="h-16 w-16 text-indigo-200 mx-auto mb-4"/>
                        <p className="text-slate-500 font-medium">Graph Visualization Placeholder</p>
                        <p className="text-xs text-slate-400 mt-2">Nodes: {graphData.nodes?.length || 0}, Edges: {graphData.edges?.length || 0}</p>
                        {/* In a real app, we'd render a D3 or Cytoscape graph here */}
                    </div>
                ) : (
                    <div className="text-center text-slate-400">
                        <p>No graph data available.</p>
                        <button onClick={loadGraph} className="mt-4 text-indigo-600 hover:underline text-sm">Retry Load</button>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'health' && (
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-800">Link Integrity Monitor</h3>
                    <button 
                        onClick={runHealthCheck}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Run Diagnostic
                    </button>
                </div>

                {healthStats ? (
                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                                <p className="text-xs text-green-600 font-medium uppercase">Total Links</p>
                                <p className="text-2xl font-bold text-green-700">{healthStats.total}</p>
                            </div>
                            <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                                <p className="text-xs text-red-600 font-medium uppercase">Broken Links</p>
                                <p className="text-2xl font-bold text-red-700">{healthStats.broken}</p>
                            </div>
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                                <p className="text-xs text-blue-600 font-medium uppercase">Health Score</p>
                                <p className="text-2xl font-bold text-blue-700">
                                    {healthStats.total > 0 ? Math.round(((healthStats.total - healthStats.broken) / healthStats.total) * 100) : 100}%
                                </p>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-3">Issues Detected</h4>
                            {healthStats.details && healthStats.details.length > 0 ? (
                                <div className="space-y-2">
                                    {healthStats.details.map((issue, idx) => (
                                        <div key={idx} className="flex items-start p-3 bg-slate-50 border border-slate-200 rounded-md">
                                            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-3 shrink-0"/>
                                            <div>
                                                <p className="text-sm font-medium text-slate-800">{issue.message || 'Unknown Issue'}</p>
                                                <p className="text-xs text-slate-500 mt-1">Source: {issue.sourceId} → Target: {issue.targetId}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center bg-slate-50 rounded-lg border border-slate-200 border-dashed">
                                    <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2"/>
                                    <p className="text-slate-500 text-sm">No issues detected. All links are healthy.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-400">
                        <p>Run a diagnostic to check for broken links and references.</p>
                    </div>
                )}
            </div>
        )}

        {activeTab === 'discovery' && (
            <div className="p-6 flex flex-col h-full overflow-y-auto">
                <div className="mb-8">
                    <h3 className="text-lg font-medium text-slate-900 mb-4">Text Analysis</h3>
                    <div className="flex gap-2 mb-4">
                        <textarea
                            value={discoveryText}
                            onChange={(e) => setDiscoveryText(e.target.value)}
                            placeholder="Paste text here to identify entities and potential links..."
                            className="flex-1 p-3 border border-slate-200 rounded-md text-sm h-32 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <button 
                        onClick={handleAnalyzeText}
                        disabled={!discoveryText}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                    >
                        Analyze Text
                    </button>

                    {discoveredEntities.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                            {discoveredEntities.map((entity, i) => (
                                <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                                    <span className="font-medium text-sm">{entity.name || entity.text}</span>
                                    <span className="text-xs bg-white px-2 py-1 rounded border border-slate-200 text-slate-500">{entity.type}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t border-slate-100 pt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-slate-900">Cross-Matter Intelligence</h3>
                        <button 
                            onClick={handleFindCrossMatter}
                            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50"
                        >
                            Find Related Matters
                        </button>
                    </div>
                    
                    {crossMatterLinks.length > 0 ? (
                        <div className="space-y-3">
                            {crossMatterLinks.map((link, i) => (
                                <div key={i} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm flex items-start gap-3">
                                    <LinkIcon className="h-5 w-5 text-indigo-500 mt-0.5"/>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">Linked to: {link.targetId}</p>
                                        <p className="text-xs text-slate-500 mt-1">{link.relationship} • Confidence: {Math.round((link.confidence || 0) * 100)}%</p>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-slate-400 ml-auto"/>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                            <p className="text-sm">No cross-matter links discovered yet.</p>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
