/**
 * Case Analysis Page
 * AI-powered detailed case analysis with citation network
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Download,
  BookmarkPlus,
  BookmarkCheck,
  Share2,
  Sparkles,
  Scale,
  Calendar,
  MapPin,
  Users,
  FileText,
  Network,
  TrendingUp,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { useCaseAnalysis, useAIAnalysis, useCitationGraph, useSimilarCases } from '../api';
import { CitationGraph } from '../components/CitationGraph';
import { AIInsightList } from '../components/AIInsightCard';
import { ResultCard } from '../components/ResultCard';
import { KeyciteIndicator } from '../components/KeyciteIndicator';
import { useResearchStore } from '../store/research.store';

export const CaseAnalysisPage: React.FC = () => {
  const { caseId = '' } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'citations' | 'similar' | 'ai'>('overview');
  const [_showCitationGraph, _setShowCitationGraph] = useState(false);

  const { savedResultIds, addSavedResult, removeSavedResult } = useResearchStore();
  const isSaved = savedResultIds.has(caseId);

  const { data: caseAnalysis, isLoading: loadingCase } = useCaseAnalysis(caseId);
  const { data: aiAnalysis, isLoading: loadingAI } = useAIAnalysis(caseId);
  const { data: citationGraph, isLoading: loadingGraph } = useCitationGraph(caseId, 2);
  const { data: similarCases = [], isLoading: loadingSimilar } = useSimilarCases(caseId, 10);

  const handleSave = () => {
    if (isSaved) {
      removeSavedResult(caseId);
    } else {
      addSavedResult(caseId);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loadingCase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Loading case analysis...</p>
        </div>
      </div>
    );
  }

  if (!caseAnalysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Case Not Found</h2>
          <p className="text-gray-600 mb-6">The case you're looking for doesn't exist</p>
          <button
            onClick={() => navigate('/research')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Research
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between gap-6 mb-6">
            <div className="flex items-start gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors mt-1"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    Case Law
                  </span>
                  <KeyciteIndicator status={caseAnalysis.summary.holding ? 'valid' : 'valid'} size="sm" />
                  {caseAnalysis.aiGenerated && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      <Sparkles className="w-3 h-3" />
                      <span>AI Enhanced</span>
                    </div>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{caseAnalysis.title}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <span className="font-mono font-medium text-blue-600">{caseAnalysis.citation}</span>
                  <span className="text-gray-300">•</span>
                  <span>{caseAnalysis.court}</span>
                  <span className="text-gray-300">•</span>
                  <span>{formatDate(caseAnalysis.date)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className={`
                  p-2 rounded-lg transition-colors
                  ${isSaved ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
                title={isSaved ? 'Remove from saved' : 'Save case'}
              >
                {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <BookmarkPlus className="w-5 h-5" />}
              </button>
              <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
              </button>
              {caseAnalysis.fullTextUrl && (
                <a
                  href={caseAnalysis.fullTextUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Full Text</span>
                </a>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-6 text-sm">
            {caseAnalysis.judges && caseAnalysis.judges.length > 0 && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Judges:</span>
                <span className="font-medium text-gray-900">{caseAnalysis.judges.join(', ')}</span>
              </div>
            )}
            {caseAnalysis.practiceAreas && caseAnalysis.practiceAreas.length > 0 && (
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Practice Areas:</span>
                <span className="font-medium text-gray-900">{caseAnalysis.practiceAreas.join(', ')}</span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 mt-6 border-b border-gray-200">
            {[
              { id: 'overview', label: 'Overview', icon: FileText },
              { id: 'citations', label: 'Citations', icon: Network },
              { id: 'similar', label: 'Similar Cases', icon: TrendingUp },
              { id: 'ai', label: 'AI Insights', icon: Sparkles },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`
                  flex items-center gap-2 px-4 py-3 border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                  }
                `}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Case Summary */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Case Summary</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Facts</h3>
                    <p className="text-gray-700 leading-relaxed">{caseAnalysis.summary.facts}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Issue</h3>
                    <p className="text-gray-700 leading-relaxed">{caseAnalysis.summary.issue}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Holding</h3>
                    <p className="text-gray-700 leading-relaxed">{caseAnalysis.summary.holding}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Reasoning</h3>
                    <p className="text-gray-700 leading-relaxed">{caseAnalysis.summary.reasoning}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Outcome</h3>
                    <p className="text-gray-700 leading-relaxed">{caseAnalysis.summary.outcome}</p>
                  </div>
                  {caseAnalysis.summary.significance && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Significance</h3>
                      <p className="text-gray-700 leading-relaxed">{caseAnalysis.summary.significance}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Holdings */}
              {caseAnalysis.keyHoldings && caseAnalysis.keyHoldings.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Holdings</h2>
                  <div className="space-y-3">
                    {caseAnalysis.keyHoldings.map(holding => (
                      <div key={holding.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-3">
                          <Scale className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-gray-900 leading-relaxed">{holding.text}</p>
                            {holding.tags && holding.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {holding.tags.map(tag => (
                                  <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Procedural History */}
              {caseAnalysis.proceduralHistory && caseAnalysis.proceduralHistory.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Procedural History</h2>
                  <div className="space-y-3">
                    {caseAnalysis.proceduralHistory.map(history => (
                      <div key={history.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-sm text-gray-500">{formatDate(history.date)}</span>
                            <span className="font-medium text-gray-900">{history.court}</span>
                          </div>
                          <p className="text-gray-700">{history.action}</p>
                          {history.outcome && (
                            <p className="text-sm text-gray-600 mt-1">{history.outcome}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Citing Cases</span>
                    <span className="font-semibold text-gray-900">{caseAnalysis.citingCases.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Cited Cases</span>
                    <span className="font-semibold text-gray-900">{caseAnalysis.citedCases.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Statutes Referenced</span>
                    <span className="font-semibold text-gray-900">{caseAnalysis.statutes.length}</span>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              {caseAnalysis.keywords && caseAnalysis.keywords.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {caseAnalysis.keywords.map(keyword => (
                      <span
                        key={keyword}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Attorneys */}
              {caseAnalysis.attorneys && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Attorneys</h3>
                  <div className="space-y-3">
                    {caseAnalysis.attorneys.petitioner && caseAnalysis.attorneys.petitioner.length > 0 && (
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">Petitioner</div>
                        {caseAnalysis.attorneys.petitioner.map((attorney, i) => (
                          <div key={i} className="text-sm text-gray-900">{attorney}</div>
                        ))}
                      </div>
                    )}
                    {caseAnalysis.attorneys.respondent && caseAnalysis.attorneys.respondent.length > 0 && (
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">Respondent</div>
                        {caseAnalysis.attorneys.respondent.map((attorney, i) => (
                          <div key={i} className="text-sm text-gray-900">{attorney}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Citations Tab */}
        {activeTab === 'citations' && (
          <div className="space-y-6">
            {loadingGraph ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              </div>
            ) : citationGraph ? (
              <CitationGraph
                graph={citationGraph}
                onNodeClick={(nodeId) => navigate(`/research/cases/${nodeId}`)}
              />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Network className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No citation network available</p>
              </div>
            )}

            {/* Citing and Cited Cases Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Citing Cases ({caseAnalysis.citingCases.length})
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {caseAnalysis.citingCases.slice(0, 10).map(relatedCase => (
                    <button
                      key={relatedCase.id}
                      onClick={() => navigate(`/research/cases/${relatedCase.id}`)}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="font-medium text-gray-900 text-sm mb-1">{relatedCase.title}</div>
                      <div className="font-mono text-xs text-gray-600">{relatedCase.citation}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Cited Cases ({caseAnalysis.citedCases.length})
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {caseAnalysis.citedCases.slice(0, 10).map(relatedCase => (
                    <button
                      key={relatedCase.id}
                      onClick={() => navigate(`/research/cases/${relatedCase.id}`)}
                      className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="font-medium text-gray-900 text-sm mb-1">{relatedCase.title}</div>
                      <div className="font-mono text-xs text-gray-600">{relatedCase.citation}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Similar Cases Tab */}
        {activeTab === 'similar' && (
          <div className="space-y-4">
            {loadingSimilar ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              </div>
            ) : similarCases.length > 0 ? (
              similarCases.map(result => (
                <ResultCard
                  key={result.id}
                  result={result}
                  onViewCase={(id) => navigate(`/research/cases/${id}`)}
                />
              ))
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No similar cases found</p>
              </div>
            )}
          </div>
        )}

        {/* AI Insights Tab */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            {loadingAI ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
                <p className="text-lg font-medium text-gray-700">Generating AI insights...</p>
              </div>
            ) : aiAnalysis ? (
              <>
                {aiAnalysis.insights && aiAnalysis.insights.length > 0 && (
                  <AIInsightList insights={aiAnalysis.insights} />
                )}

                {/* Strengths & Weaknesses */}
                {aiAnalysis.strengthsWeaknesses && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <h3 className="font-semibold text-green-900 mb-4">Strengths</h3>
                      <ul className="space-y-2">
                        {aiAnalysis.strengthsWeaknesses.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start gap-2 text-green-800">
                            <span className="text-green-500 mt-1">✓</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <h3 className="font-semibold text-red-900 mb-4">Weaknesses</h3>
                      <ul className="space-y-2">
                        {aiAnalysis.strengthsWeaknesses.weaknesses.map((weakness, i) => (
                          <li key={i} className="flex items-start gap-2 text-red-800">
                            <AlertTriangle className="w-4 h-4 mt-1 flex-shrink-0" />
                            <span>{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Strategic Recommendations */}
                {aiAnalysis.strategicRecommendations && aiAnalysis.strategicRecommendations.length > 0 && (
                  <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
                    <h3 className="font-semibold text-indigo-900 mb-4">Strategic Recommendations</h3>
                    <ul className="space-y-3">
                      {aiAnalysis.strategicRecommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3 text-indigo-900">
                          <span className="flex-shrink-0 w-6 h-6 bg-indigo-200 text-indigo-700 rounded-full flex items-center justify-center text-sm font-medium">
                            {i + 1}
                          </span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No AI insights available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
