/**
 * CaseDetail - Main Case Detail View Component
 *
 * This is the HEAVIEST component in the application with 13 tabs and
 * many sub-components. Uses progressive hydration for optimal performance.
 *
 * ENZYME MIGRATION:
 * - Uses useCaseDetail hook (already migrated with useApiRequest/useApiMutation)
 * - Added useLatestCallback for stable event handlers
 * - Added useTrackEvent for analytics tracking
 * - Added usePageView for page view tracking
 * - Added React.lazy() for ALL case-detail sub-components
 * - Added HydrationBoundary with priority-based hydration:
 *   - HIGH/IMMEDIATE: Overview, Documents, Workflow (most used tabs)
 *   - NORMAL/VISIBLE: Motions, Docket, Evidence
 *   - LOW/IDLE: Team, Parties, Discovery, Messages, Drafting, Contract Review, Billing
 * - CaseTimeline remains non-lazy as it's always visible in the sidebar
 */

import React, { Suspense, lazy } from 'react';
import { Case, TimelineEvent, User } from '../types';
import { ArrowLeft, MapPin, DollarSign } from 'lucide-react';
import { PageHeader, Button } from './common';
import { CaseTimeline } from './case-detail/CaseTimeline';
import { useCaseDetail } from '../hooks/useCaseDetail';
import { WorkflowQuickActions } from './workflow/WorkflowQuickActions';
import { TabNavigation } from './common/TabNavigation';
import {
  useLatestCallback,
  useTrackEvent,
  usePageView,
  useIsMounted,
  HydrationBoundary,
  LazyHydration
} from '../enzyme';

// Lazy load ALL case-detail sub-components for better initial load performance
const CaseOverview = lazy(() => import('./case-detail/CaseOverview').then(m => ({ default: m.CaseOverview })));
const CaseDocuments = lazy(() => import('./case-detail/CaseDocuments').then(m => ({ default: m.CaseDocuments })));
const CaseWorkflow = lazy(() => import('./case-detail/CaseWorkflow').then(m => ({ default: m.CaseWorkflow })));
const CaseDrafting = lazy(() => import('./case-detail/CaseDrafting').then(m => ({ default: m.CaseDrafting })));
const CaseBilling = lazy(() => import('./case-detail/CaseBilling').then(m => ({ default: m.CaseBilling })));
const CaseContractReview = lazy(() => import('./case-detail/CaseContractReview').then(m => ({ default: m.CaseContractReview })));
const CaseEvidence = lazy(() => import('./case-detail/CaseEvidence').then(m => ({ default: m.CaseEvidence })));
const CaseDiscovery = lazy(() => import('./case-detail/CaseDiscovery').then(m => ({ default: m.CaseDiscovery })));
const CaseMessages = lazy(() => import('./case-detail/CaseMessages').then(m => ({ default: m.CaseMessages })));
const CaseParties = lazy(() => import('./case-detail/CaseParties').then(m => ({ default: m.CaseParties })));
const CaseMotions = lazy(() => import('./case-detail/CaseMotions').then(m => ({ default: m.CaseMotions })));
const CaseTeam = lazy(() => import('./case-detail/CaseTeam').then(m => ({ default: m.CaseTeam })));
const CaseDocketEntries = lazy(() => import('./case-detail/CaseDocketEntries').then(m => ({ default: m.CaseDocketEntries })));

interface CaseDetailProps {
  caseData: Case;
  onBack: () => void;
  currentUser?: User;
  hideHeader?: boolean;
}

const TABS = ['Overview', 'Team', 'Motions', 'Parties', 'Docket', 'Documents', 'Evidence', 'Discovery', 'Messages', 'Workflow', 'Drafting', 'Contract Review', 'Billing'];

/**
 * Loading fallback component for Suspense boundaries
 * Shows a pulsing skeleton while lazy components load
 */
const LoadingFallback: React.FC<{ height?: string }> = ({ height = 'h-64' }) => (
  <div className={`flex items-center justify-center ${height} bg-white rounded-lg border border-slate-200`}>
    <div className="flex flex-col items-center gap-2">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      <div className="animate-pulse text-slate-400 text-sm">Loading...</div>
    </div>
  </div>
);

/**
 * Tab-specific loading fallback with appropriate heights
 */
const TabLoadingFallback: React.FC = () => (
  <LoadingFallback height="h-96" />
);

export const CaseDetail: React.FC<CaseDetailProps> = ({ caseData, onBack, currentUser, hideHeader = false }) => {
  const {
    activeTab,
    setActiveTab,
    documents,
    stages,
    parties,
    setParties,
    billingEntries,
    generatingWorkflow,
    analyzingId,
    draftPrompt,
    setDraftPrompt,
    draftResult,
    isDrafting,
    timelineEvents,
    handleAnalyze,
    handleDraft,
    handleGenerateWorkflow,
    addTimeEntry,
    toggleTask,
    createDocument
  } = useCaseDetail(caseData);

  // ENZYME: Track page view
  usePageView('case_detail');

  // ENZYME: Analytics tracking hook
  const trackEvent = useTrackEvent();

  // ENZYME: Mount state for safe async operations
  const isMounted = useIsMounted();

  const [teamMembers] = React.useState<Array<{ id: string; name: string; role: string }>>([
    { id: '1', name: 'John Smith', role: 'Senior Partner' },
    { id: '2', name: 'Jane Doe', role: 'Associate' },
    { id: '3', name: 'Bob Johnson', role: 'Paralegal' }
  ]);

  // ENZYME: Stable callback for tab changes with analytics tracking
  const handleTabChange = useLatestCallback((tab: string) => {
    setActiveTab(tab);
    trackEvent('case_detail_tab_change', {
      caseId: caseData.id,
      fromTab: activeTab,
      toTab: tab
    });
  });

  // ENZYME: Stable callback for timeline event clicks
  const handleTimelineClick = useLatestCallback((event: TimelineEvent) => {
    let targetTab: string;
    switch (event.type) {
      case 'motion':
      case 'hearing':
        targetTab = 'Motions';
        break;
      case 'document':
        targetTab = 'Documents';
        break;
      case 'task':
        targetTab = 'Workflow';
        break;
      case 'billing':
        targetTab = 'Billing';
        break;
      case 'milestone':
        targetTab = 'Overview';
        break;
      default:
        targetTab = 'Overview';
    }

    handleTabChange(targetTab);
    trackEvent('case_timeline_event_click', {
      caseId: caseData.id,
      eventType: event.type,
      targetTab
    });
  });

  // ENZYME: Stable callback for back navigation
  const handleBackClick = useLatestCallback(() => {
    trackEvent('case_detail_back', { caseId: caseData.id });
    onBack();
  });

  // ENZYME: Stable callback for document analysis
  const handleDocumentAnalyze = useLatestCallback((docId: string) => {
    trackEvent('case_document_analyze', { caseId: caseData.id, documentId: docId });
    handleAnalyze(docId);
  });

  // ENZYME: Stable callback for document creation
  const handleDocumentCreate = useLatestCallback((doc: any) => {
    trackEvent('case_document_create', { caseId: caseData.id });
    createDocument(doc);
    handleTabChange('Documents');
  });

  // ENZYME: Stable callback for party updates
  const handlePartiesUpdate = useLatestCallback((updatedParties: any) => {
    trackEvent('case_parties_update', { caseId: caseData.id, partyCount: updatedParties.length });
    setParties(updatedParties);
  });

  // ENZYME: Stable callback for workflow generation
  const handleWorkflowGenerate = useLatestCallback(() => {
    trackEvent('case_workflow_generate', { caseId: caseData.id });
    handleGenerateWorkflow();
  });

  // ENZYME: Stable callback for task toggle
  const handleTaskToggle = useLatestCallback((stageId: string, taskId: string) => {
    trackEvent('case_task_toggle', { caseId: caseData.id, stageId, taskId });
    toggleTask(stageId, taskId);
  });

  // ENZYME: Stable callback for module navigation from workflow
  const handleNavigateToModule = useLatestCallback((module: string) => {
    trackEvent('case_workflow_navigate_module', { caseId: caseData.id, module });
    handleTabChange(module);
  });

  /**
   * Render tab content with progressive hydration
   *
   * Priority strategy:
   * - HIGH/IMMEDIATE: Most frequently accessed tabs (Overview, Documents, Workflow)
   * - NORMAL/VISIBLE: Commonly used tabs (Motions, Docket, Evidence)
   * - LOW/IDLE: Less frequently accessed tabs (others)
   */
  const renderTabContent = () => {
    switch (activeTab) {
      // HIGH PRIORITY - Immediate hydration (most used tabs)
      case 'Overview':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <HydrationBoundary id="case-overview" priority="high" trigger="immediate">
              <CaseOverview
                caseData={{ ...caseData, parties }}
                onTimeEntryAdded={addTimeEntry}
                currentUser={currentUser}
              />
            </HydrationBoundary>
          </Suspense>
        );

      case 'Documents':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <HydrationBoundary id="case-documents" priority="high" trigger="immediate">
              <CaseDocuments
                documents={documents}
                analyzingId={analyzingId}
                onAnalyze={handleDocumentAnalyze}
                onDocumentCreated={handleDocumentCreate}
                currentUser={currentUser}
              />
            </HydrationBoundary>
          </Suspense>
        );

      case 'Workflow':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <HydrationBoundary id="case-workflow" priority="high" trigger="immediate">
              <CaseWorkflow
                stages={stages}
                caseId={caseData.id}
                currentUserId={currentUser?.id || '1'}
                users={teamMembers}
                generatingWorkflow={generatingWorkflow}
                onGenerateWorkflow={handleWorkflowGenerate}
                onNavigateToModule={handleNavigateToModule}
                onToggleTask={handleTaskToggle}
              />
            </HydrationBoundary>
          </Suspense>
        );

      // NORMAL PRIORITY - Visible trigger (commonly used)
      case 'Motions':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <HydrationBoundary id="case-motions" priority="normal" trigger="visible">
              <CaseMotions
                caseId={caseData.id}
                caseTitle={caseData.title}
                currentUser={currentUser}
              />
            </HydrationBoundary>
          </Suspense>
        );

      case 'Docket':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <HydrationBoundary id="case-docket" priority="normal" trigger="visible">
              <CaseDocketEntries caseId={caseData.id} />
            </HydrationBoundary>
          </Suspense>
        );

      case 'Evidence':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <HydrationBoundary id="case-evidence" priority="normal" trigger="visible">
              <CaseEvidence caseId={caseData.id} currentUser={currentUser} />
            </HydrationBoundary>
          </Suspense>
        );

      // LOW PRIORITY - Idle trigger (less frequently accessed)
      case 'Team':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <LazyHydration priority="low" trigger="idle">
              <CaseTeam caseId={caseData.id} />
            </LazyHydration>
          </Suspense>
        );

      case 'Parties':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <LazyHydration priority="low" trigger="idle">
              <CaseParties parties={parties} onUpdate={handlePartiesUpdate} />
            </LazyHydration>
          </Suspense>
        );

      case 'Discovery':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <LazyHydration priority="low" trigger="idle">
              <CaseDiscovery caseId={caseData.id} />
            </LazyHydration>
          </Suspense>
        );

      case 'Messages':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <LazyHydration priority="low" trigger="idle">
              <CaseMessages caseData={caseData} />
            </LazyHydration>
          </Suspense>
        );

      case 'Drafting':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <LazyHydration priority="low" trigger="idle">
              <CaseDrafting
                caseId={caseData.id}
                caseTitle={caseData.title}
                draftPrompt={draftPrompt}
                setDraftPrompt={setDraftPrompt}
                draftResult={draftResult}
                isDrafting={isDrafting}
                onDraft={handleDraft}
              />
            </LazyHydration>
          </Suspense>
        );

      case 'Contract Review':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <LazyHydration priority="low" trigger="idle">
              <CaseContractReview />
            </LazyHydration>
          </Suspense>
        );

      case 'Billing':
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <LazyHydration priority="low" trigger="idle">
              <CaseBilling
                billingModel={caseData.billingModel || 'Hourly'}
                value={caseData.value}
                entries={billingEntries}
              />
            </LazyHydration>
          </Suspense>
        );

      default:
        return (
          <Suspense fallback={<TabLoadingFallback />}>
            <HydrationBoundary id="case-overview-default" priority="high" trigger="immediate">
              <CaseOverview
                caseData={{ ...caseData, parties }}
                onTimeEntryAdded={addTimeEntry}
                currentUser={currentUser}
              />
            </HydrationBoundary>
          </Suspense>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {!hideHeader && (
        <PageHeader
          title={caseData.title}
          subtitle={
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-1">
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">{caseData.id}</span>
              <span className="hidden md:inline text-slate-300">|</span>
              <span className="line-clamp-1">{caseData.client}</span>
              {caseData.jurisdiction && (
                <>
                  <span className="hidden md:inline text-slate-300">|</span>
                  <span className="flex items-center text-slate-600"><MapPin className="h-3 w-3 mr-1"/> {caseData.jurisdiction}</span>
                </>
              )}
              <span className="hidden md:inline text-slate-300">|</span>
              <span className="flex items-center font-semibold text-slate-700 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                <DollarSign className="h-3 w-3 mr-0.5 text-green-600"/>
                {(caseData.value ?? 0).toLocaleString()}
              </span>
            </div>
          }
          actions={
            <>
              <WorkflowQuickActions
                userId={currentUser?.id || '1'}
                caseId={caseData.id}
                compact
              />
              <Button variant="secondary" icon={ArrowLeft} onClick={handleBackClick}>
                Back to Cases
              </Button>
            </>
          }
        />
      )}

      <TabNavigation
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        variant="underline"
        className="mb-6"
      />

      <div className="flex-1 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* Left Timeline Widget - Always visible, not lazy loaded */}
          <div className="hidden lg:block lg:col-span-3 h-full">
            <CaseTimeline events={timelineEvents} onEventClick={handleTimelineClick} />
          </div>

          {/* Main Content Area - Progressive hydration based on tab */}
          <div className="lg:col-span-9 h-full flex flex-col overflow-hidden pr-0 md:pr-2">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};
