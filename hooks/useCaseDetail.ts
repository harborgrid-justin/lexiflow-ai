
import { useState, useMemo } from 'react';
import { Case, LegalDocument, WorkflowStage, TimeEntry, TimelineEvent, Party } from '../types';
import { GeminiService } from '../services/geminiService';
import { MOCK_DOCUMENTS } from '../data/mockDocuments';
import { MOCK_STAGES } from '../data/mockWorkflow';
import { MOCK_TIME_ENTRIES } from '../data/mockBilling';

export const useCaseDetail = (caseData: Case) => {
  const [activeTab, setActiveTab] = useState('Overview');
  
  const [documents, setDocuments] = useState<LegalDocument[]>(() => {
    const docs = MOCK_DOCUMENTS.filter(d => d.caseId === caseData.id);
    return docs.length > 0 ? docs : MOCK_DOCUMENTS.slice(0, 1);
  });
  
  const [stages, setStages] = useState<WorkflowStage[]>(MOCK_STAGES);
  const [parties, setParties] = useState<Party[]>(caseData.parties || []);
  
  const [billingEntries, setBillingEntries] = useState<TimeEntry[]>(() => {
    const entries = MOCK_TIME_ENTRIES.filter(e => e.caseId === caseData.id);
    return entries.length > 0 ? entries : MOCK_TIME_ENTRIES.slice(0, 2);
  });

  const [generatingWorkflow, setGeneratingWorkflow] = useState(false);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [draftPrompt, setDraftPrompt] = useState('');
  const [draftResult, setDraftResult] = useState('');
  const [isDrafting, setIsDrafting] = useState(false);

  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [];
    events.push({ id: 'init', date: caseData.filingDate, title: 'Case Filed', type: 'milestone', description: `Filed in ${caseData.court}` });
    documents.forEach(d => {
        events.push({ id: d.id, date: d.uploadDate, title: `Doc Upload: ${d.title}`, type: 'document', description: d.summary || d.type });
    });
    stages.forEach(s => {
        s.tasks.forEach(t => {
            if(t.status === 'Done') events.push({ id: t.id, date: t.dueDate, title: `Task Completed: ${t.title}`, type: 'task', description: `Assigned to ${t.assignee}` });
        });
    });
    billingEntries.forEach(b => {
        events.push({ id: b.id, date: b.date, title: 'Billable Time Logged', type: 'billing', description: `${(b.duration/60).toFixed(1)}h - ${b.description}` });
    });
    return events.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [caseData, documents, stages, billingEntries]);

  const handleAnalyze = async (doc: LegalDocument) => {
    setAnalyzingId(doc.id);
    const result = await GeminiService.analyzeDocument(doc.content);
    setDocuments(docs => docs.map(d => d.id === doc.id ? { ...d, summary: result.summary, riskScore: result.riskScore } : d));
    setAnalyzingId(null);
  };

  const handleDraft = async () => {
    if(!draftPrompt.trim()) return;
    setIsDrafting(true);
    const text = await GeminiService.generateDraft(`${draftPrompt}\n\nCase: ${caseData.title}\nClient: ${caseData.client}`, 'Motion/Clause');
    setDraftResult(text);
    setIsDrafting(false);
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
    handleGenerateWorkflow
  };
};
