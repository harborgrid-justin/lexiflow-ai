import { useState, useMemo, useEffect } from 'react';
import { Case, LegalDocument, WorkflowStage, TimeEntry, TimelineEvent, Party, Motion } from '../types';
import { GeminiService } from '../services/geminiService';
import { ApiService } from '../services/apiService';

export const useCaseDetail = (caseData: Case) => {
  const [activeTab, setActiveTab] = useState('Overview');
  
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [stages, setStages] = useState<WorkflowStage[]>([]);
  const [parties, setParties] = useState<Party[]>(caseData.parties || []);
  const [billingEntries, setBillingEntries] = useState<TimeEntry[]>([]);
  const [motions, setMotions] = useState<Motion[]>([]);

  const [generatingWorkflow, setGeneratingWorkflow] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [draftPrompt, setDraftPrompt] = useState('');
  const [draftResult, setDraftResult] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!caseData?.id) return;
      try {
        const [docs, wf, bill, mots] = await Promise.all([
          ApiService.getCaseDocuments(caseData.id),
          ApiService.getCaseWorkflow(caseData.id),
          ApiService.getCaseBilling(caseData.id),
          ApiService.getCaseMotions(caseData.id)
        ]);
        setDocuments(docs);
        setStages(wf);
        setBillingEntries(bill);
        setMotions(mots);
      } catch (error) {
        console.error("Failed to fetch case details", error);
      }
    };
    fetchData();
  }, [caseData.id]);

  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];
    if (caseData.filingDate) {
        events.push({ id: 'init', date: caseData.filingDate, title: 'Case Filed', type: 'milestone', description: `Filed in ${caseData.court}` });
    }
    
    // Documents
    documents.forEach(d => {
        events.push({ id: d.id, date: d.uploadDate, title: `Doc Upload: ${d.title}`, type: 'document', description: d.summary || d.type, relatedId: d.id });
    });
    
    // Tasks
    stages.forEach(s => {
        s.tasks.forEach(t => {
            if(t.status === 'Done') events.push({ id: t.id, date: t.dueDate, title: `Task Completed: ${t.title}`, type: 'task', description: `Assigned to ${t.assignee}`, relatedId: t.id });
        });
    });
    
    // Billing
    billingEntries.forEach(b => {
        events.push({ id: b.id, date: b.date, title: 'Billable Time Logged', type: 'billing', description: `${(b.duration/60).toFixed(1)}h - ${b.description}`, relatedId: b.id });
    });

    // Motions & Hearings
    motions.forEach(m => {
        if(m.filingDate) {
            events.push({ id: `mot-file-${m.id}`, date: m.filingDate, title: `Motion Filed: ${m.title}`, type: 'motion', description: `Type: ${m.type} | Status: ${m.status}`, relatedId: m.id });
        }
        if(m.hearingDate) {
            events.push({ id: `mot-hear-${m.id}`, date: m.hearingDate, title: `Hearing Scheduled: ${m.title}`, type: 'hearing', description: `Court Appearance Required`, relatedId: m.id });
        }
    });

    return events.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [caseData, documents, stages, billingEntries, motions]);

  const handleAnalyze = async (doc: LegalDocument) => {
    setAnalyzingId(doc.id);
    try {
      const result = await GeminiService.analyzeDocument(doc.content);
      await ApiService.updateDocument(doc.id, { summary: result.summary, riskScore: result.riskScore });
      setDocuments(docs => docs.map(d => d.id === doc.id ? { ...d, summary: result.summary, riskScore: result.riskScore } : d));
    } catch (error) {
      console.error("Failed to analyze document", error);
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleDraft = async () => {
    if(!draftPrompt.trim()) return;
    setIsDrafting(true);
    const text = await GeminiService.generateDraft(`${draftPrompt}\n\nCase: ${caseData.title}\nClient: ${caseData.client}`, 'Motion/Clause');
    setDraftResult(text);
    setIsDrafting(false);
  };

  const createDocument = async (doc: Partial<LegalDocument>) => {
    try {
      const newDoc = await ApiService.createDocument(doc);
      setDocuments([...documents, newDoc]);
      return newDoc;
    } catch (error) {
      console.error("Failed to create document", error);
      throw error;
    }
  };

  const handleGenerateWorkflow = async () => {
    setGeneratingWorkflow(true);
    const suggestedStages = await GeminiService.generateWorkflow(caseData.description);
    const newStages: WorkflowStage[] = suggestedStages.map((s, idx) => ({
      id: `gen-stage-${idx}`, title: s.title, status: idx === 0 ? 'Active' : 'Pending',
      tasks: s.tasks.map((t, tIdx) => ({ id: `gen-task-${idx}-${tIdx}`, title: t, status: 'Pending', assignee: 'Unassigned', dueDate: '2024-05-01', priority: 'Medium' }))
    }));
    setStages([...stages, ...newStages]);
    setGeneratingWorkflow(false);
  };

  const addTimeEntry = async (entry: Partial<TimeEntry>) => {
    try {
      const newEntry = await ApiService.createTimeEntry(entry);
      setBillingEntries([newEntry, ...billingEntries]);
    } catch (error) {
      console.error("Failed to add time entry", error);
    }
  };

  const toggleTask = async (taskId: string, status: 'Pending' | 'In Progress' | 'Done') => {
    try {
      await ApiService.updateTask(taskId, { status });
      setStages(prevStages => prevStages.map(stage => ({
        ...stage,
        tasks: stage.tasks.map(t => t.id === taskId ? { ...t, status } : t)
      })));
    } catch (error) {
      console.error("Failed to update task", error);
    }
  };

  return {
    activeTab,
    setActiveTab,
    documents,
    setDocuments,
    stages,
    setStages,
    parties,
    setParties,
    billingEntries,
    setBillingEntries,
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
  };
};
