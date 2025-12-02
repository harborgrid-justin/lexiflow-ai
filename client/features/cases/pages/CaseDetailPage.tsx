/**
 * Case Detail Page
 * Comprehensive case detail view with tabbed interface
 */

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  MoreVertical,
  FileText,
  Users,
  Clock,
  CheckSquare,
  DollarSign,
  StickyNote,
  Search,
  User,
  Calendar,
} from 'lucide-react';
import { useCase, useCaseTimeline, useCaseParties, useCaseDocuments, useCaseMetrics } from '../api/cases.api';
import { CaseStatusBadge } from '../components/CaseStatusBadge';
import { CaseSidebar } from '../components/CaseSidebar';
import { CaseTimeline } from '../components/CaseTimeline';
import { CaseParties } from '../components/CaseParties';

type TabType = 'overview' | 'documents' | 'parties' | 'timeline' | 'tasks' | 'billing' | 'notes' | 'discovery';

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // API hooks
  const { case: caseData, isLoading, error } = useCase(id);
  const { timeline, isLoading: timelineLoading } = useCaseTimeline(id);
  const { parties, isLoading: partiesLoading } = useCaseParties(id);
  const { documents, isLoading: documentsLoading } = useCaseDocuments(id);
  const { metrics } = useCaseMetrics(id);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-500">Loading case details...</p>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load case details</p>
          <button
            onClick={() => navigate('/cases')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Back to Cases
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview' as TabType, name: 'Overview', icon: FileText },
    { id: 'documents' as TabType, name: 'Documents', icon: FileText, count: documents?.length },
    { id: 'parties' as TabType, name: 'Parties', icon: Users, count: parties?.length },
    { id: 'timeline' as TabType, name: 'Timeline', icon: Clock, count: timeline?.length },
    { id: 'tasks' as TabType, name: 'Tasks', icon: CheckSquare },
    { id: 'billing' as TabType, name: 'Billing', icon: DollarSign },
    { id: 'notes' as TabType, name: 'Notes', icon: StickyNote },
    { id: 'discovery' as TabType, name: 'Discovery', icon: Search },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => navigate('/cases')}
            className="text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Cases</span>
          </button>
        </div>

        {/* Case Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900">{caseData.title}</h1>
              <CaseStatusBadge status={caseData.status} />
            </div>
            {caseData.docketNumber && (
              <p className="text-sm text-slate-500 font-mono mb-2">{caseData.docketNumber}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-slate-600">
              {caseData.client && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{caseData.client}</span>
                </div>
              )}
              {caseData.filingDate && (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Filed{' '}
                    {new Date(caseData.filingDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
              {caseData.matterType && (
                <span className="px-2 py-1 text-xs font-medium bg-indigo-50 text-indigo-700 rounded border border-indigo-200">
                  {caseData.matterType}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-md flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button className="px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 hover:bg-red-50 rounded-md flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button className="p-2 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-md">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mt-4 border-b border-slate-200 -mb-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg flex items-center gap-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600 bg-blue-50'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
                {tab.count !== undefined && (
                  <span className="px-1.5 py-0.5 text-xs bg-slate-200 text-slate-700 rounded">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              {metrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Documents</span>
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{metrics.totalDocuments || 0}</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Parties</span>
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{metrics.totalParties || 0}</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Tasks</span>
                      <CheckSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {metrics.completedTasks}/{metrics.totalTasks || 0}
                    </div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Hours</span>
                      <Clock className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900">{metrics.totalHours || 0}</div>
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
                <CaseTimeline timeline={timeline?.slice(0, 5) || []} isLoading={timelineLoading} />
                {timeline && timeline.length > 5 && (
                  <button
                    onClick={() => setActiveTab('timeline')}
                    className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all activity
                  </button>
                )}
              </div>

              {/* Description */}
              {caseData.description && (
                <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900 mb-3">Description</h2>
                  <p className="text-slate-700 leading-relaxed">{caseData.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Documents</h2>
              {documentsLoading ? (
                <div className="text-center py-8 text-slate-500">Loading documents...</div>
              ) : documents && documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900">{doc.title}</p>
                          <p className="text-xs text-slate-500">{doc.type}</p>
                        </div>
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-700">View</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">No documents yet</div>
              )}
            </div>
          )}

          {/* Parties Tab */}
          {activeTab === 'parties' && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Parties</h2>
              <CaseParties parties={parties || []} isEditable={true} />
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Activity Timeline</h2>
              <CaseTimeline timeline={timeline || []} isLoading={timelineLoading} />
            </div>
          )}

          {/* Other Tabs (Placeholder) */}
          {['tasks', 'billing', 'notes', 'discovery'].includes(activeTab) && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                {tabs.find((t) => t.id === activeTab)?.name}
              </h2>
              <div className="text-center py-12 text-slate-500">
                <p>This section is coming soon.</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-slate-200 bg-white overflow-y-auto p-4">
          <CaseSidebar case={caseData} metrics={metrics} />
        </div>
      </div>
    </div>
  );
};
