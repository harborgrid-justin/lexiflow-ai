/**
 * useCaseDetail Hook - Case Detail Management
 *
 * Manages case detail view with documents, workflow stages, billing,
 * motions, docket entries, and timeline aggregation.
 *
 * @see /client/enzyme/ENZYME_COMPLETE_GUIDE.md
 */

import { useState, useMemo } from 'react';
import { Case, LegalDocument, WorkflowStage, TimeEntry, TimelineEvent, Party, Motion, DocketEntry } from '../../types';
import { OpenAIService } from '../../services/openAIService';
import { ApiService } from '../../services/apiService';
import { useApiRequest } from '../services/hooks';
import { useLatestCallback, useIsMounted } from '@missionfabric-js/enzyme/hooks';

export const useCaseDetail = (caseData: Case) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [parties, setParties] = useState<Party[]>(caseData.parties || []);
  const [draftPrompt, setDraftPrompt] = useState('');
  const [draftResult, setDraftResult] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [generatingWorkflow, setGeneratingWorkflow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useIsMounted();

  // Parallel fetching with automatic caching
  const { data: documents = [], isLoading: docsLoading, refetch: refetchDocs } = useApiRequest<LegalDocument[]>({
    endpoint: `/cases/${caseData.id}/documents`,
    options: {
      enabled: !!caseData?.id,
      staleTime: 5 * 60 * 1000,
    }
  });

  const { data: stages = [], isLoading: stagesLoading, refetch: refetchStages } = useApiRequest<WorkflowStage[]>({
    endpoint: `/cases/${caseData.id}/workflow/stages`,
    options: {
      enabled: !!caseData?.id,
      staleTime: 5 * 60 * 1000,
    }
  });

  const { data: billingEntries = [], isLoading: billingLoading, refetch: refetchBilling } = useApiRequest<TimeEntry[]>({
    endpoint: `/cases/${caseData.id}/billing/time-entries`,
    options: {
      enabled: !!caseData?.id,
      staleTime: 2 * 60 * 1000,
    }
  });

  const { data: motions = [], isLoading: motionsLoading, refetch: refetchMotions } = useApiRequest<Motion[]>({
    endpoint: `/cases/${caseData.id}/motions`,
    options: {
      enabled: !!caseData?.id,
      staleTime: 5 * 60 * 1000,
    }
  });

  const { data: docketEntries = [], isLoading: docketsLoading, refetch: refetchDockets } = useApiRequest<DocketEntry[]>({
    endpoint: `/cases/${caseData.id}/docket`,
    options: {
      enabled: !!caseData?.id,
      staleTime: 10 * 60 * 1000,
    }
  });

  const loading = docsLoading || stagesLoading || billingLoading || motionsLoading || docketsLoading;

  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];
    if (caseData.filingDate) {
      events.push({ 
        id: 'init', 
        date: caseData.filingDate, 
        title: 'Case Filed', 
        type: 'milestone', 
        description: `Filed in ${caseData.court}` 
      });
    }

    // Documents
    (documents || []).forEach(d => {
      events.push({ 
        id: d.id, 
        date: d.uploadDate, 
        title: `Doc Upload: ${d.title}`, 
        type: 'document', 
        description: d.summary || d.type, 
        relatedId: d.id 
      });
    });

    // Tasks
    (stages || []).forEach(s => {
      (s.tasks || []).forEach(t => {
        if (t.status === 'Done') {
          events.push({ 
            id: t.id, 
            date: t.dueDate, 
            title: `Task Completed: ${t.title}`, 
            type: 'task', 
            description: `Assigned to ${t.assignee}`, 
            relatedId: t.id 
          });
        }
      });
    });

    // Billing
    (billingEntries || []).forEach(b => {
      events.push({ 
        id: b.id, 
        date: b.date, 
        title: 'Billable Time Logged', 
        type: 'billing', 
        description: `${(b.duration / 60).toFixed(1)}h - ${b.description}`, 
        relatedId: b.id 
      });
    });

    // Motions & Hearings
    (motions || []).forEach(m => {
      if (m.filingDate) {
        events.push({ 
          id: `mot-file-${m.id}`, 
          date: m.filingDate, 
          title: `Motion Filed: ${m.title}`, 
          type: 'motion', 
          description: `Type: ${m.type} | Status: ${m.status}`, 
          relatedId: m.id 
        });
      }
      if (m.hearingDate) {
        events.push({ 
          id: `mot-hear-${m.id}`, 
          date: m.hearingDate, 
          title: `Hearing Scheduled: ${m.title}`, 
          type: 'hearing', 
          description: `Court Appearance Required`, 
          relatedId: m.id 
        });
      }
    });

    // Docket Entries
    (Array.isArray(docketEntries) ? docketEntries : []).forEach(d => {
      events.push({ 
        id: `docket-${d.id}`, 
        date: d.dateFiled, 
        title: d.text.length > 80 ? d.text.substring(0, 80) + '...' : d.text, 
        type: 'docket', 
        description: d.documentType || 'Court Filing',
        relatedId: d.id,
        docketEntryNumber: d.entryNumber,
        pacerLink: d.docLink
      });
    });

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [caseData, documents, stages, billingEntries, motions, docketEntries]);

  const handleAnalyze = useLatestCallback(async (doc: LegalDocument) => {
    setAnalyzingId(doc.id);
    try {
      const result = await OpenAIService.analyzeDocument(doc.content);
      await ApiService.documents.update(doc.id, { summary: result.summary, riskScore: result.riskScore });
      refetchDocs();
    } catch (err) {
      console.error('Failed to analyze document:', err);
      if (isMounted()) {
        setError('Failed to analyze document. Please try again.');
      }
    } finally {
      if (isMounted()) {
        setAnalyzingId(null);
      }
    }
  });

  const handleDraft = useLatestCallback(async () => {
    if (!draftPrompt.trim()) return;
    setIsDrafting(true);
    try {
      const text = await OpenAIService.generateDraft(
        `${draftPrompt}\n\nCase: ${caseData.title}\nClient: ${caseData.client}`, 
        'Motion/Clause'
      );
      if (isMounted()) {
        setDraftResult(text);
      }
    } finally {
      if (isMounted()) {
        setIsDrafting(false);
      }
    }
  });

  const createDocument = useLatestCallback(async (doc: Partial<LegalDocument>) => {
    try {
      const newDoc = await ApiService.documents.create(doc);
      refetchDocs();
      return newDoc;
    } catch (err) {
      console.error('Failed to create document:', err);
      if (isMounted()) {
        setError('Failed to create document. Please try again.');
      }
      throw err;
    }
  });

  const handleGenerateWorkflow = useLatestCallback(async () => {
    setGeneratingWorkflow(true);
    try {
      const suggestedStages = await OpenAIService.generateWorkflow(caseData.description);
      const newStages: WorkflowStage[] = suggestedStages.map((s, idx) => ({
        id: `gen-stage-${idx}`,
        title: s.title,
        status: idx === 0 ? 'Active' : 'Pending',
        tasks: s.tasks.map((t, tIdx) => ({
          id: `gen-task-${idx}-${tIdx}`,
          title: t,
          status: 'Pending',
          assignee: 'Unassigned',
          dueDate: '2024-05-01',
          priority: 'Medium'
        }))
      }));
      
      await Promise.all(newStages.map(stage => ApiService.workflow.stages.create(stage)));
      refetchStages();
    } catch (err) {
      console.error('Failed to generate workflow:', err);
      if (isMounted()) {
        setError('Failed to generate workflow. Please try again.');
      }
    } finally {
      if (isMounted()) {
        setGeneratingWorkflow(false);
      }
    }
  });

  const addTimeEntry = useLatestCallback(async (entry: Partial<TimeEntry>) => {
    try {
      const newEntry = await ApiService.billing.timeEntries.create(entry);
      refetchBilling();
      return newEntry;
    } catch (err) {
      console.error('Failed to add time entry:', err);
      if (isMounted()) {
        setError('Failed to add time entry. Please try again.');
      }
      throw err;
    }
  });

  const toggleTask = useLatestCallback(async (taskId: string, status: 'Pending' | 'In Progress' | 'Done') => {
    try {
      await ApiService.workflow.tasks.update(taskId, { status });
      refetchStages();
      
      const stageWithTask = stages.find(s => s.tasks.some(t => t.id === taskId));
      if (stageWithTask) {
        const updatedTasks = stageWithTask.tasks.map(t => t.id === taskId ? { ...t, status } : t);
        const allDone = updatedTasks.every(t => t.status === 'Done');
        if (allDone) {
          await ApiService.workflow.stages.update(stageWithTask.id, { status: 'Completed' });
          refetchStages();
        } else {
          await ApiService.workflow.stages.update(stageWithTask.id, { status: 'Active' });
        }
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      if (isMounted()) {
        setError('Failed to update task. Please try again.');
      }
      throw err;
    }
  });

  const refresh = useLatestCallback(() => {
    refetchDocs();
    refetchStages();
    refetchBilling();
    refetchMotions();
    refetchDockets();
  });

  return {
    activeTab,
    setActiveTab,
    documents,
    stages,
    parties,
    setParties,
    billingEntries,
    motions,
    docketEntries,
    loading,
    error,
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
    createDocument,
    refresh
  };
};
