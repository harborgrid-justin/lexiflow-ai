import React, { useState } from 'react';
import { Settings, Plus, Trash2, Save, ChevronRight, GripVertical, FileText, Zap, CheckSquare } from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface WorkflowTaskTemplate {
  id: string;
  title: string;
  description: string;
  role: string;
  priority: 'Low' | 'Medium' | 'High';
  automated: boolean;
}

interface WorkflowStageTemplate {
  id: string;
  title: string;
  tasks: WorkflowTaskTemplate[];
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  type: 'Case' | 'Administrative';
  stages: WorkflowStageTemplate[];
}

const DEFAULT_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'wt-1',
    name: 'Standard Litigation',
    description: 'Default workflow for civil litigation cases.',
    type: 'Case',
    stages: [
      {
        id: 's1',
        title: 'Intake & Assessment',
        tasks: [
          { id: 't1', title: 'Conflict Check', description: 'Run global conflict check', role: 'Admin', priority: 'High', automated: true },
          { id: 't2', title: 'Engagement Letter', description: 'Send and sign engagement letter', role: 'Partner', priority: 'High', automated: false },
        ]
      },
      {
        id: 's2',
        title: 'Discovery',
        tasks: [
          { id: 't3', title: 'Initial Disclosures', description: 'Prepare Rule 26(a) disclosures', role: 'Associate', priority: 'Medium', automated: false },
        ]
      }
    ]
  },
  {
    id: 'wt-2',
    name: 'Quick Settlement',
    description: 'Streamlined workflow for cases likely to settle early.',
    type: 'Case',
    stages: [
      {
        id: 's1',
        title: 'Initial Negotiation',
        tasks: [
          { id: 't1', title: 'Demand Letter', description: 'Draft and send demand letter', role: 'Associate', priority: 'High', automated: false },
        ]
      }
    ]
  },
  {
    id: 'wt-3',
    name: 'New Employee Onboarding',
    description: 'HR process for onboarding new staff.',
    type: 'Administrative',
    stages: [
      {
        id: 's1',
        title: 'Pre-Start',
        tasks: [
          { id: 't1', title: 'IT Setup', description: 'Provision accounts and hardware', role: 'IT', priority: 'Medium', automated: true },
        ]
      }
    ]
  },
  {
    id: 'bp1',
    name: 'New Client Onboarding',
    description: 'Standard procedure for welcoming and setting up new clients.',
    type: 'Administrative',
    stages: [
      {
        id: 's1',
        title: 'Intake',
        tasks: [
          { id: 't1', title: 'Verify ID', description: 'Check client identification documents', role: 'Admin Team', priority: 'High', automated: false },
          { id: 't2', title: 'Create CRM Entry', description: 'Enter client details into CRM', role: 'Admin Team', priority: 'Medium', automated: true },
          { id: 't3', title: 'Send Welcome Packet', description: 'Email welcome guide and portal access', role: 'Admin Team', priority: 'Medium', automated: true }
        ]
      }
    ]
  },
  {
    id: 'bp2',
    name: 'Month-End Billing',
    description: 'Monthly financial reconciliation and invoice generation.',
    type: 'Administrative',
    stages: [
      {
        id: 's1',
        title: 'Preparation',
        tasks: [
          { id: 't1', title: 'Generate WIP Reports', description: 'Pull work-in-progress for all matters', role: 'Finance', priority: 'High', automated: true },
          { id: 't2', title: 'Partner Review', description: 'Distribute pre-bills to partners', role: 'Finance', priority: 'High', automated: false },
          { id: 't3', title: 'Finalize Invoices', description: 'Apply edits and generate final PDFs', role: 'Finance', priority: 'High', automated: true }
        ]
      }
    ]
  },
  {
    id: 'bp3',
    name: 'Annual Conflict Audit',
    description: 'Yearly review of client list against corporate affiliations.',
    type: 'Administrative',
    stages: [
      {
        id: 's1',
        title: 'Audit',
        tasks: [
          { id: 't1', title: 'Review Client List', description: 'Export active client list', role: 'Compliance', priority: 'Medium', automated: true },
          { id: 't2', title: 'Check Corporate Affiliations', description: 'Cross-reference with subsidiary database', role: 'Compliance', priority: 'High', automated: true }
        ]
      }
    ]
  },
  {
    id: 'bp4',
    name: 'Associate Review Cycle',
    description: 'Performance review process for associates.',
    type: 'Administrative',
    stages: [
      {
        id: 's1',
        title: 'Review',
        tasks: [
          { id: 't1', title: 'Self-Evaluation', description: 'Associates complete self-assessment', role: 'HR', priority: 'Medium', automated: true },
          { id: 't2', title: 'Partner Feedback', description: 'Collect feedback from supervising partners', role: 'HR', priority: 'High', automated: false },
          { id: 't3', title: 'Compensation Meeting', description: 'Schedule salary review meetings', role: 'HR', priority: 'High', automated: false }
        ]
      }
    ]
  },
  {
    id: 'bp5',
    name: 'E-Discovery Processing',
    description: 'Workflow for processing large data sets for litigation.',
    type: 'Case',
    stages: [
      {
        id: 's1',
        title: 'Processing',
        tasks: [
          { id: 't1', title: 'Ingest Data', description: 'Upload raw data to processing engine', role: 'Litigation Support', priority: 'High', automated: true },
          { id: 't2', title: 'Deduplication', description: 'Remove duplicate files', role: 'Litigation Support', priority: 'Medium', automated: true },
          { id: 't3', title: 'OCR & Indexing', description: 'Make documents searchable', role: 'Litigation Support', priority: 'High', automated: true }
        ]
      }
    ]
  },
  {
    id: 'bp6',
    name: 'Evidence Chain Audit',
    description: 'Verification of physical and digital evidence custody.',
    type: 'Case',
    stages: [
      {
        id: 's1',
        title: 'Audit',
        tasks: [
          { id: 't1', title: 'Verify Custody Logs', description: 'Check digital signatures on chain of custody', role: 'Risk Committee', priority: 'High', automated: true },
          { id: 't2', title: 'Physical Inspection', description: 'Audit physical evidence locker', role: 'Risk Committee', priority: 'High', automated: false }
        ]
      }
    ]
  },
  {
    id: 'bp7',
    name: 'Pro Hac Vice Admission',
    description: 'Process for admitting out-of-state attorneys.',
    type: 'Case',
    stages: [
      {
        id: 's1',
        title: 'Application',
        tasks: [
          { id: 't1', title: 'Obtain Certificate', description: 'Get Certificate of Good Standing', role: 'Managing Partner', priority: 'Medium', automated: false },
          { id: 't2', title: 'File Motion', description: 'File motion for admission', role: 'Managing Partner', priority: 'High', automated: false },
          { id: 't3', title: 'Pay Fees', description: 'Process admission fees', role: 'Managing Partner', priority: 'Medium', automated: true }
        ]
      }
    ]
  },
  {
    id: 'bp8',
    name: 'Pre-Bill Review Cycle',
    description: 'Reviewing draft bills before sending to clients.',
    type: 'Administrative',
    stages: [
      {
        id: 's1',
        title: 'Review',
        tasks: [
          { id: 't1', title: 'Distribute Pre-bills', description: 'Send drafts to billing partners', role: 'Billing Dept', priority: 'High', automated: true },
          { id: 't2', title: 'Apply Write-downs', description: 'Adjust hours and rates', role: 'Billing Dept', priority: 'Medium', automated: false },
          { id: 't3', title: 'Approve', description: 'Final approval for invoice generation', role: 'Billing Dept', priority: 'High', automated: false }
        ]
      }
    ]
  },
  {
    id: 'bp9',
    name: 'GDPR/CCPA Compliance',
    description: 'Ensuring compliance with data privacy regulations.',
    type: 'Administrative',
    stages: [
      {
        id: 's1',
        title: 'Assessment',
        tasks: [
          { id: 't1', title: 'Data Mapping', description: 'Map personal data flow', role: 'Privacy Officer', priority: 'High', automated: true },
          { id: 't2', title: 'Risk Assessment', description: 'Evaluate privacy risks', role: 'Privacy Officer', priority: 'High', automated: false },
          { id: 't3', title: 'Update Policy', description: 'Revise privacy policy if needed', role: 'Privacy Officer', priority: 'Medium', automated: false }
        ]
      }
    ]
  },
  {
    id: 'bp10',
    name: 'Matter Closing & Archive',
    description: 'Procedures for closing a case and archiving files.',
    type: 'Case',
    stages: [
      {
        id: 's1',
        title: 'Closing',
        tasks: [
          { id: 't1', title: 'Return Client Docs', description: 'Send original documents back to client', role: 'Records Dept', priority: 'Medium', automated: false },
          { id: 't2', title: 'Destroy Copies', description: 'Securely destroy extra copies', role: 'Records Dept', priority: 'Low', automated: true },
          { id: 't3', title: 'Archive File', description: 'Move digital files to cold storage', role: 'Records Dept', priority: 'Medium', automated: true }
        ]
      }
    ]
  },
  {
    id: 'bp11',
    name: 'Privilege Log Gen',
    description: 'Generating a log of privileged documents withheld from discovery.',
    type: 'Case',
    stages: [
      {
        id: 's1',
        title: 'Logging',
        tasks: [
          { id: 't1', title: 'Identify Privileged Docs', description: 'Flag documents with attorney-client privilege', role: 'Associate Team', priority: 'High', automated: true },
          { id: 't2', title: 'Draft Descriptions', description: 'Write non-privileged descriptions', role: 'Associate Team', priority: 'High', automated: false },
          { id: 't3', title: 'QC Log', description: 'Quality check the privilege log', role: 'Associate Team', priority: 'High', automated: false }
        ]
      }
    ]
  },
  {
    id: 'bp12',
    name: 'Vendor Risk Assessment',
    description: 'Evaluating security and compliance of third-party vendors.',
    type: 'Administrative',
    stages: [
      {
        id: 's1',
        title: 'Assessment',
        tasks: [
          { id: 't1', title: 'Security Questionnaire', description: 'Send security assessment to vendor', role: 'Compliance', priority: 'High', automated: true },
          { id: 't2', title: 'Financial Check', description: 'Review vendor financial stability', role: 'Compliance', priority: 'Medium', automated: true },
          { id: 't3', title: 'Contract Review', description: 'Legal review of vendor contract', role: 'Compliance', priority: 'High', automated: false }
        ]
      }
    ]
  },
  {
    id: 'bp13',
    name: 'Conflict Waiver Protocol',
    description: 'Obtaining waivers for potential conflicts of interest.',
    type: 'Case',
    stages: [
      {
        id: 's1',
        title: 'Waiver',
        tasks: [
          { id: 't1', title: 'Draft Waiver', description: 'Prepare conflict waiver letter', role: 'Ethics Committee', priority: 'High', automated: false },
          { id: 't2', title: 'Client Consent', description: 'Obtain written consent from client', role: 'Ethics Committee', priority: 'High', automated: false },
          { id: 't3', title: 'Ethical Wall Setup', description: 'Configure software permissions', role: 'Ethics Committee', priority: 'High', automated: true }
        ]
      }
    ]
  },
  {
    id: 'bp14',
    name: 'Litigation Hold Enforcement',
    description: 'Ensuring preservation of relevant documents.',
    type: 'Case',
    stages: [
      {
        id: 's1',
        title: 'Hold',
        tasks: [
          { id: 't1', title: 'Issue Hold Notice', description: 'Send litigation hold to custodians', role: 'General Counsel', priority: 'High', automated: true },
          { id: 't2', title: 'Acknowledge Receipt', description: 'Track custodian acknowledgments', role: 'General Counsel', priority: 'High', automated: true },
          { id: 't3', title: 'Suspend Deletion', description: 'Stop auto-deletion policies', role: 'General Counsel', priority: 'High', automated: true }
        ]
      }
    ]
  },
  {
    id: 'bp15',
    name: 'Court Filing Procedure',
    description: 'Standard steps for filing documents with the court.',
    type: 'Case',
    stages: [
      {
        id: 's1',
        title: 'Filing',
        tasks: [
          { id: 't1', title: 'Format Check', description: 'Ensure document meets court formatting rules', role: 'Paralegal', priority: 'High', automated: true },
          { id: 't2', title: 'E-Filing', description: 'Upload document to court portal', role: 'Paralegal', priority: 'High', automated: false },
          { id: 't3', title: 'Service of Process', description: 'Serve copies to opposing counsel', role: 'Paralegal', priority: 'High', automated: false }
        ]
      }
    ]
  }
];

export const WorkflowConfig: React.FC = () => {
  const [templates, setTemplates] = useState<WorkflowTemplate[]>(DEFAULT_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(DEFAULT_TEMPLATES[0].id);
  const [isEditing, setIsEditing] = useState(false);

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save to the backend
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Template List */}
      <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Workflow Templates</h3>
          <Button size="sm" icon={Plus} variant="outline">New</Button>
        </div>
        
        <div className="space-y-3">
          {templates.map(template => (
            <div 
              key={template.id}
              onClick={() => setSelectedTemplateId(template.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedTemplateId === template.id 
                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                  : 'bg-white border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className={`font-bold ${selectedTemplateId === template.id ? 'text-blue-700' : 'text-slate-900'}`}>
                  {template.name}
                </h4>
                <Badge variant={template.type === 'Case' ? 'info' : 'neutral'}>{template.type}</Badge>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{template.description}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center"><Settings className="h-3 w-3 mr-1"/> {template.stages.length} Stages</span>
                <span className="flex items-center"><CheckSquare className="h-3 w-3 mr-1"/> {template.stages.reduce((acc, s) => acc + s.tasks.length, 0)} Tasks</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Template Editor */}
      <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col overflow-hidden">
        {selectedTemplate ? (
          <>
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-slate-900">{selectedTemplate.name}</h2>
                  <Badge variant="outline">v1.2</Badge>
                </div>
                <p className="text-slate-500 text-sm">{selectedTemplate.description}</p>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <Button variant="primary" icon={Save} onClick={handleSave}>Save Changes</Button>
                ) : (
                  <Button variant="outline" icon={Settings} onClick={() => setIsEditing(true)}>Edit Configuration</Button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {selectedTemplate.stages.map((stage, index) => (
                <div key={stage.id} className="relative pl-8 border-l-2 border-slate-200 last:border-l-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-500"></div>
                  
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800">Stage {index + 1}: {stage.title}</h3>
                    {isEditing && <Button size="sm" variant="ghost" className="text-red-500" icon={Trash2}>Remove</Button>}
                  </div>

                  <div className="space-y-3">
                    {stage.tasks.map(task => (
                      <div key={task.id} className="bg-slate-50 p-4 rounded border border-slate-200 hover:border-blue-200 transition-colors group">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 text-slate-400 cursor-grab active:cursor-grabbing">
                              <GripVertical className="h-4 w-4"/>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-slate-900">{task.title}</span>
                                {task.automated && (
                                  <span className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0.5 rounded flex items-center font-medium">
                                    <Zap className="h-3 w-3 mr-1"/> Auto
                                  </span>
                                )}
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                  task.priority === 'High' ? 'bg-red-100 text-red-700' : 
                                  task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {task.priority}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600">{task.description}</p>
                              <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center"><FileText className="h-3 w-3 mr-1"/> Role: {task.role}</span>
                              </div>
                            </div>
                          </div>
                          {isEditing && (
                            <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500">
                              <Trash2 className="h-4 w-4"/>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                    {isEditing && (
                      <Button variant="ghost" className="w-full border border-dashed border-slate-300 text-slate-500 hover:border-blue-400 hover:text-blue-600" icon={Plus}>
                        Add Task
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {isEditing && (
                <div className="pl-8">
                  <Button variant="outline" className="w-full border-dashed" icon={Plus}>Add New Stage</Button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Settings className="h-12 w-12 mb-4 opacity-20"/>
            <p>Select a workflow template to configure</p>
          </div>
        )}
      </div>
    </div>
  );
};
