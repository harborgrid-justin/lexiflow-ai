import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { ResponseFormatJSONSchema } from 'openai/resources';
import { Case } from '../models/case.model';
import { Party } from '../models/party.model';
import { Motion } from '../models/motion.model';
import { Document } from '../models/document.model';
import { WorkflowStage, WorkflowTask } from '../models/workflow.model';

export interface PacerCounsel {
  name: string;
  firm: string;
  phone: string;
  email: string;
  status: string;
  address: string;
}

export interface PacerParty {
  name: string;
  role: string;
  type: 'Individual' | 'Corporation';
  contact: string;
  counsel: PacerCounsel[];
}

export interface PacerDocketEntry {
  entryNumber: number;
  date: string;
  description: string;
  pages?: number;
  fileSize?: string;
  documentId?: string;
}

export interface PacerConsolidatedCase {
  caseNumber: string;
  relationship: 'Lead' | 'Member';
  startDate: string;
  endDate?: string;
}

export interface PacerDeadline {
  date: string;
  title: string;
  type: string;
}

export interface PacerCaseInfo {
  docketNumber: string;
  originatingCaseNumber: string;
  title: string;
  court: string;
  jurisdiction: string;
  natureOfSuit: string;
  caseType: string;
  filingDate: string;
  dateOrderJudgment?: string;
  dateNOAFiled?: string;
  dateRecvCOA?: string;
  feeStatus: string;
  presidingJudge: string;
  orderingJudge?: string;
  status: string;
}

export interface ParsedPacerData {
  caseInfo: PacerCaseInfo;
  parties: PacerParty[];
  docketEntries: PacerDocketEntry[];
  consolidatedCases?: PacerConsolidatedCase[];
  priorCases?: string[];
  deadlines?: PacerDeadline[];
}

// Maximum input size in characters (~8000 tokens)
const MAX_DOCKET_INPUT_CHARS = 32000;

// Structured Output Schema for guaranteed valid JSON
const PacerDocketSchema: ResponseFormatJSONSchema = {
  type: 'json_schema',
  json_schema: {
    name: 'pacer_docket',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        caseInfo: {
          type: 'object',
          properties: {
            docketNumber: { type: ['string', 'null'] },
            originatingCaseNumber: { type: ['string', 'null'] },
            title: { type: ['string', 'null'] },
            court: { type: ['string', 'null'] },
            jurisdiction: { type: ['string', 'null'] },
            natureOfSuit: { type: ['string', 'null'] },
            caseType: { type: ['string', 'null'] },
            filingDate: { type: ['string', 'null'] },
            dateOrderJudgment: { type: ['string', 'null'] },
            dateNOAFiled: { type: ['string', 'null'] },
            dateRecvCOA: { type: ['string', 'null'] },
            feeStatus: { type: ['string', 'null'] },
            presidingJudge: { type: ['string', 'null'] },
            orderingJudge: { type: ['string', 'null'] },
            status: { type: ['string', 'null'] },
          },
          required: ['docketNumber', 'originatingCaseNumber', 'title', 'court', 'jurisdiction', 'natureOfSuit', 'caseType', 'filingDate', 'dateOrderJudgment', 'dateNOAFiled', 'dateRecvCOA', 'feeStatus', 'presidingJudge', 'orderingJudge', 'status'],
          additionalProperties: false,
        },
        parties: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              role: { type: ['string', 'null'] },
              type: { type: ['string', 'null'] },
              contact: { type: ['string', 'null'] },
              counsel: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: ['string', 'null'] },
                    firm: { type: ['string', 'null'] },
                    phone: { type: ['string', 'null'] },
                    email: { type: ['string', 'null'] },
                    status: { type: ['string', 'null'] },
                    address: { type: ['string', 'null'] },
                  },
                  required: ['name', 'firm', 'phone', 'email', 'status', 'address'],
                  additionalProperties: false,
                },
              },
            },
            required: ['name', 'role', 'type', 'contact', 'counsel'],
            additionalProperties: false,
          },
        },
        docketEntries: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              entryNumber: { type: 'integer' },
              date: { type: ['string', 'null'] },
              description: { type: ['string', 'null'] },
              pages: { type: ['integer', 'null'] },
              fileSize: { type: ['string', 'null'] },
              documentId: { type: ['string', 'null'] },
            },
            required: ['entryNumber', 'date', 'description', 'pages', 'fileSize', 'documentId'],
            additionalProperties: false,
          },
        },
        consolidatedCases: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              caseNumber: { type: ['string', 'null'] },
              relationship: { type: ['string', 'null'] },
              startDate: { type: ['string', 'null'] },
              endDate: { type: ['string', 'null'] },
            },
            required: ['caseNumber', 'relationship', 'startDate', 'endDate'],
            additionalProperties: false,
          },
        },
        priorCases: {
          type: 'array',
          items: { type: 'string' },
        },
        deadlines: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date: { type: ['string', 'null'] },
              title: { type: ['string', 'null'] },
              type: { type: ['string', 'null'] },
            },
            required: ['date', 'title', 'type'],
            additionalProperties: false,
          },
        },
      },
      required: ['caseInfo', 'parties', 'docketEntries', 'consolidatedCases', 'priorCases', 'deadlines'],
      additionalProperties: false,
    },
  },
};

@Injectable()
export class PacerParserService {
  private readonly logger = new Logger(PacerParserService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.openai = new OpenAI({
      apiKey,
      timeout: 30000,
      maxRetries: 2,
    });
  }

  /**
   * Truncate input to prevent token explosion
   */
  private truncateInput(text: string, maxChars: number): string {
    if (text.length <= maxChars) {return text;}
    this.logger.warn(`Truncating docket text from ${text.length} to ${maxChars} characters`);
    return text.substring(0, maxChars) + '\n[...truncated]';
  }

  /**
   * Parse raw PACER docket text using OpenAI with Structured Outputs
   */
  async parsePacerText(docketText: string): Promise<ParsedPacerData> {
    // Truncate input to prevent massive token usage
    const truncatedText = this.truncateInput(docketText, MAX_DOCKET_INPUT_CHARS);
    
    // Concise system message - schema defines the structure
    const systemMessage = 'Parse the PACER docket text. Extract case information, parties with counsel, docket entries, consolidated cases, prior cases, and deadlines. Use null for missing fields. Format dates as ISO (YYYY-MM-DD).';

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: truncatedText },
      ],
      response_format: PacerDocketSchema,
      max_tokens: 4096,
      temperature: 0.2,
      n: 1,
    });

    const parsedText = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(parsedText);

    if (!parsed.caseInfo || !parsed.parties) {
      throw new Error('Invalid PACER data structure');
    }

    return parsed;
  }

  /**
   * Create a new case from parsed PACER data
   */
  async createCaseFromPacer(
    parsedData: ParsedPacerData,
    ownerOrgId: string,
    createdBy: string,
  ): Promise<{
    case: Case;
    parties: Party[];
    motions: Motion[];
    documents: Document[];
    workflow: {
      stages: WorkflowStage[];
      tasks: WorkflowTask[];
    };
  }> {
    const { caseInfo, parties, docketEntries } = parsedData;

    // Create the case
    const caseData = await this.createCase(caseInfo, ownerOrgId, createdBy);

    // Create parties and their counsel
    const createdParties = await this.createParties(
      parties,
      caseData.id,
      ownerOrgId,
    );

    // Create motions from docket entries
    const createdMotions = await this.createMotionsFromDocket(
      docketEntries,
      caseData.id,
      createdBy,
    );

    // Create document placeholders from docket entries
    const createdDocuments = await this.createDocumentsFromDocket(
      docketEntries,
      caseData.id,
      ownerOrgId,
      createdBy,
    );

    // Create PACER Import Workflow
    const workflow = await this.createPacerImportWorkflow(
      caseData.id,
      createdBy,
      parsedData,
    );

    this.logger.log(
      `Created case ${caseData.id} with ${createdParties.length} parties, ${createdMotions.length} motions, ${createdDocuments.length} documents, ${workflow.stages.length} workflow stages, ${workflow.tasks.length} tasks`,
    );

    return {
      case: caseData,
      parties: createdParties,
      motions: createdMotions,
      documents: createdDocuments,
      workflow,
    };
  }

  /**
   * Create case record from PACER case info
   */
  private async createCase(
    caseInfo: PacerCaseInfo,
    ownerOrgId: string,
    createdBy: string,
  ): Promise<Case> {
    // Extract client name from case title (usually the first party)
    const clientName = this.extractClientName(caseInfo.title);

    const caseRecord = await Case.create({
      title: caseInfo.title,
      client_name: clientName,
      status: this.mapPacerStatusToCaseStatus(caseInfo.status),
      filing_date: this.parseDate(caseInfo.filingDate),
      description: `${caseInfo.natureOfSuit} - Court Docket #${caseInfo.docketNumber}`,
      matter_type: this.extractMatterType(caseInfo.natureOfSuit),
      jurisdiction: caseInfo.jurisdiction || 'Federal',
      court: caseInfo.court,
      judge: caseInfo.presidingJudge,
      owner_org_id: ownerOrgId,
      created_by: createdBy,
    });

    return caseRecord;
  }

  /**
   * Create party records from PACER parties data
   */
  private async createParties(
    parties: PacerParty[],
    caseId: string,
    _ownerOrgId: string,
  ): Promise<Party[]> {
    const createdParties: Party[] = [];

    for (const party of parties) {
      // Create main party
      const partyRecord = await Party.create({
        case_id: caseId,
        name: party.name,
        role: party.role,
        type: party.type,
        contact: party.contact || this.extractContactFromCounsel(party.counsel),
        counsel: this.formatCounselInfo(party.counsel),
      });

      createdParties.push(partyRecord);
    }

    return createdParties;
  }

  /**
   * Create motion records from docket entries that represent motions
   */
  private async createMotionsFromDocket(
    docketEntries: PacerDocketEntry[],
    caseId: string,
    createdBy: string,
  ): Promise<Motion[]> {
    const motions: Motion[] = [];

    // Filter docket entries that are motions
    const motionEntries = docketEntries.filter((entry) =>
      this.isMotionEntry(entry.description),
    );

    for (const entry of motionEntries) {
      const motionType = this.extractMotionType(entry.description);
      const motion = await Motion.create({
        case_id: caseId,
        title: entry.description,
        motion_type: motionType.toLowerCase().replace(/\s+/g, '_'),
        type: motionType,
        status: 'filed',
        filing_date: entry.date,
        filed_date: this.parseDate(entry.date),
        description: entry.description,
        created_by: createdBy,
        filed_by: createdBy,
      });

      motions.push(motion);
    }

    return motions;
  }

  /**
   * Create document placeholders from docket entries
   */
  private async createDocumentsFromDocket(
    docketEntries: PacerDocketEntry[],
    caseId: string,
    ownerOrgId: string,
    createdBy: string,
  ): Promise<Document[]> {
    const documents: Document[] = [];

    for (const entry of docketEntries) {
      // Skip entries without documents
      if (!entry.pages || entry.pages === 0) {
        continue;
      }

      const document = await Document.create({
        case_id: caseId,
        title: `Docket Entry ${entry.entryNumber}: ${entry.description.substring(0, 100)}`,
        filename: `docket_${entry.entryNumber}.pdf`,
        type: this.extractDocumentType(entry.description),
        status: 'final',
        file_path: `/pacer-imports/${caseId}/docket_${entry.entryNumber}.pdf`,
        mime_type: 'application/pdf',
        description: entry.description,
        upload_date: this.parseDate(entry.date),
        source_module: 'General',
        owner_org_id: ownerOrgId,
        created_by: createdBy,
      });

      documents.push(document);
    }

    return documents;
  }

  // Helper methods

  private extractClientName(caseTitle: string): string {
    // Extract first party name from "Party A v. Party B" format
    const parts = caseTitle.split(/\s+v\.?\s+/i);
    if (parts.length > 0) {
      return parts[0].trim();
    }
    return 'Unknown Client';
  }

  private mapPacerStatusToCaseStatus(pacerStatus: string): string {
    const statusMap: Record<string, string> = {
      active: 'Discovery',
      termed: 'Closed',
      pending: 'Discovery',
    };
    return statusMap[pacerStatus.toLowerCase()] || 'Discovery';
  }

  private extractMatterType(natureOfSuit: string): string {
    if (natureOfSuit.toLowerCase().includes('bankruptcy')) {
      return 'Litigation';
    }
    if (natureOfSuit.toLowerCase().includes('contract')) {
      return 'Commercial Litigation';
    }
    return 'Litigation';
  }

  private parseDate(dateStr: string): Date {
    if (!dateStr) {
      return new Date();
    }
    
    // Handle MM/DD/YYYY format
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      return new Date(`${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`);
    }
    
    return new Date(dateStr);
  }

  private extractContactFromCounsel(counsel: PacerCounsel[]): string {
    if (counsel && counsel.length > 0) {
      return counsel[0].email || counsel[0].phone || 'No contact';
    }
    return 'No contact';
  }

  private formatCounselInfo(counsel: PacerCounsel[]): string {
    if (!counsel || counsel.length === 0) {
      return 'Pro Se';
    }
    
    return counsel
      .map(
        (c) =>
          `${c.name} (${c.firm}) - ${c.email || c.phone} ${c.status}`,
      )
      .join('; ');
  }

  private isMotionEntry(description: string): boolean {
    const motionKeywords = [
      'motion',
      'petition',
      'application',
      'request',
      'complaint',
      'answer',
      'response',
      'reply',
    ];
    const lowerDesc = description.toLowerCase();
    return motionKeywords.some((keyword) => lowerDesc.includes(keyword));
  }

  private extractMotionType(description: string): string {
    const typeMap: Record<string, string> = {
      'summary judgment': 'Summary Judgment',
      'dismiss': 'Dismiss',
      'compel': 'Compel Discovery',
      'limine': 'In Limine',
      'continuance': 'Continuance',
      'sanctions': 'Sanctions',
      'injunctive relief': 'Injunctive Relief',
      'stay': 'Stay',
      'expedite': 'Expedite',
    };

    const lowerDesc = description.toLowerCase();
    for (const [key, value] of Object.entries(typeMap)) {
      if (lowerDesc.includes(key)) {
        return value;
      }
    }

    return 'Other';
  }

  private extractDocumentType(description: string): string {
    const lowerDesc = description.toLowerCase();
    
    if (lowerDesc.includes('motion')) {
      return 'Motion';
    }
    if (lowerDesc.includes('brief')) {
      return 'Brief';
    }
    if (lowerDesc.includes('order')) {
      return 'Court Order';
    }
    if (lowerDesc.includes('notice')) {
      return 'Notice';
    }
    if (lowerDesc.includes('complaint')) {
      return 'Complaint';
    }
    if (lowerDesc.includes('answer')) {
      return 'Answer';
    }
    if (lowerDesc.includes('exhibit')) {
      return 'Exhibit';
    }
    if (lowerDesc.includes('certificate')) {
      return 'Certificate';
    }
    if (lowerDesc.includes('disclosure')) {
      return 'Disclosure';
    }
    
    return 'Filing';
  }

  /**
   * Create PACER Import Workflow
   * Creates a structured workflow for processing the imported case
   */
  private async createPacerImportWorkflow(
    caseId: string,
    createdBy: string,
    parsedData: ParsedPacerData,
  ): Promise<{
    stages: WorkflowStage[];
    tasks: WorkflowTask[];
  }> {
    const stages: WorkflowStage[] = [];
    const tasks: WorkflowTask[] = [];

    // Stage 1: Case Verification
    const verificationStage = await WorkflowStage.create({
      case_id: caseId,
      name: 'PACER Import Verification',
      description: 'Verify imported PACER data and complete case setup',
      status: 'in-progress',
      order: 1,
      start_date: new Date(),
      progress: 0,
    });
    stages.push(verificationStage);

    // Tasks for Stage 1
    const verificationTasks = [
      {
        title: 'Verify Case Information',
        description: `Review case details: ${parsedData.caseInfo.title}. Confirm docket number, court, judges, and filing dates are accurate.`,
        priority: 'high',
        estimated_hours: 0.5,
        related_module: 'Cases',
        action_label: 'Review Case',
      },
      {
        title: 'Verify Parties & Counsel',
        description: `Review ${parsedData.parties.length} parties and their counsel information. Confirm contact details and representation status.`,
        priority: 'high',
        estimated_hours: 0.75,
        related_module: 'Cases',
        action_label: 'Review Parties',
      },
      {
        title: 'Review Docket Entries',
        description: `Review ${parsedData.docketEntries.length} docket entries. Verify motions and filings are correctly classified.`,
        priority: 'medium',
        estimated_hours: 1,
        related_module: 'Documents',
        action_label: 'Review Docket',
      },
    ];

    for (const taskData of verificationTasks) {
      const task = await WorkflowTask.create({
        stage_id: verificationStage.id,
        case_id: caseId,
        title: taskData.title,
        description: taskData.description,
        status: 'pending',
        priority: taskData.priority,
        estimated_hours: taskData.estimated_hours,
        related_module: taskData.related_module,
        action_label: taskData.action_label,
        created_by: createdBy,
        automated_trigger: 'pacer_import',
      });
      tasks.push(task);
    }

    // Stage 2: Client Onboarding
    const onboardingStage = await WorkflowStage.create({
      case_id: caseId,
      name: 'Client Onboarding',
      description: 'Complete client intake and engagement setup',
      status: 'pending',
      order: 2,
      progress: 0,
    });
    stages.push(onboardingStage);

    const onboardingTasks = [
      {
        title: 'Client Conflict Check',
        description: 'Run conflict check for all parties involved in the case',
        priority: 'high',
        estimated_hours: 1,
        related_module: 'Compliance',
      },
      {
        title: 'Engagement Letter',
        description: 'Prepare and send engagement letter to client',
        priority: 'high',
        estimated_hours: 1.5,
        related_module: 'Documents',
      },
      {
        title: 'Retainer Agreement',
        description: 'Execute retainer agreement and process initial payment',
        priority: 'high',
        estimated_hours: 1,
        related_module: 'Billing',
      },
    ];

    for (const taskData of onboardingTasks) {
      const task = await WorkflowTask.create({
        stage_id: onboardingStage.id,
        case_id: caseId,
        title: taskData.title,
        description: taskData.description,
        status: 'pending',
        priority: taskData.priority,
        estimated_hours: taskData.estimated_hours,
        related_module: taskData.related_module,
        created_by: createdBy,
        automated_trigger: 'pacer_import',
      });
      tasks.push(task);
    }

    // Stage 3: Document Collection
    const documentStage = await WorkflowStage.create({
      case_id: caseId,
      name: 'Document Collection',
      description: 'Download and organize PACER documents',
      status: 'pending',
      order: 3,
      progress: 0,
    });
    stages.push(documentStage);

    const documentTasks = [
      {
        title: 'Download PACER Documents',
        description: `Access PACER and download all ${parsedData.docketEntries.length} docket entries`,
        priority: 'medium',
        estimated_hours: 2,
        related_module: 'Documents',
      },
      {
        title: 'Organize Case Files',
        description: 'Create folder structure and organize documents by type (motions, orders, briefs, etc.)',
        priority: 'medium',
        estimated_hours: 1,
        related_module: 'Documents',
      },
      {
        title: 'OCR & Index Documents',
        description: 'Run OCR on scanned documents and create searchable index',
        priority: 'low',
        estimated_hours: 0.5,
        related_module: 'Documents',
      },
    ];

    for (const taskData of documentTasks) {
      const task = await WorkflowTask.create({
        stage_id: documentStage.id,
        case_id: caseId,
        title: taskData.title,
        description: taskData.description,
        status: 'pending',
        priority: taskData.priority,
        estimated_hours: taskData.estimated_hours,
        related_module: taskData.related_module,
        created_by: createdBy,
        automated_trigger: 'pacer_import',
      });
      tasks.push(task);
    }

    // Stage 4: Case Assessment
    const assessmentStage = await WorkflowStage.create({
      case_id: caseId,
      name: 'Case Assessment',
      description: 'Analyze case merits and develop strategy',
      status: 'pending',
      order: 4,
      progress: 0,
    });
    stages.push(assessmentStage);

    const assessmentTasks = [
      {
        title: 'Review Case History',
        description: 'Review complete docket history and identify key events',
        priority: 'high',
        estimated_hours: 3,
        related_module: 'Cases',
      },
      {
        title: 'Legal Research',
        description: 'Conduct legal research on key issues and applicable precedents',
        priority: 'high',
        estimated_hours: 4,
        related_module: 'Research',
      },
      {
        title: 'Case Strategy Memo',
        description: 'Prepare initial case assessment and recommended strategy',
        priority: 'medium',
        estimated_hours: 2,
        related_module: 'Documents',
      },
    ];

    for (const taskData of assessmentTasks) {
      const task = await WorkflowTask.create({
        stage_id: assessmentStage.id,
        case_id: caseId,
        title: taskData.title,
        description: taskData.description,
        status: 'pending',
        priority: taskData.priority,
        estimated_hours: taskData.estimated_hours,
        related_module: taskData.related_module,
        created_by: createdBy,
        automated_trigger: 'pacer_import',
      });
      tasks.push(task);
    }

    // Stage 5: Calendar & Deadlines
    const calendarStage = await WorkflowStage.create({
      case_id: caseId,
      name: 'Calendar & Deadlines',
      description: 'Set up case calendar and deadline tracking',
      status: 'pending',
      order: 5,
      progress: 0,
    });
    stages.push(calendarStage);

    const calendarTasks = [
      {
        title: 'Import Court Deadlines',
        description: 'Add all court-imposed deadlines to calendar with reminders',
        priority: 'high',
        estimated_hours: 1,
        related_module: 'Calendar',
      },
      {
        title: 'Schedule Team Meetings',
        description: 'Set up initial case team meetings and strategy sessions',
        priority: 'medium',
        estimated_hours: 0.5,
        related_module: 'Calendar',
      },
      {
        title: 'Configure Alerts',
        description: 'Set up automated alerts for filing deadlines and hearings',
        priority: 'medium',
        estimated_hours: 0.5,
        related_module: 'Calendar',
      },
    ];

    for (const taskData of calendarTasks) {
      const task = await WorkflowTask.create({
        stage_id: calendarStage.id,
        case_id: caseId,
        title: taskData.title,
        description: taskData.description,
        status: 'pending',
        priority: taskData.priority,
        estimated_hours: taskData.estimated_hours,
        related_module: taskData.related_module,
        created_by: createdBy,
        automated_trigger: 'pacer_import',
      });
      tasks.push(task);
    }

    // Stage 6: Team Assignment
    const teamStage = await WorkflowStage.create({
      case_id: caseId,
      name: 'Team Assignment',
      description: 'Assign case team members and roles',
      status: 'pending',
      order: 6,
      progress: 0,
    });
    stages.push(teamStage);

    const teamTasks = [
      {
        title: 'Assign Lead Attorney',
        description: 'Assign lead attorney responsible for case strategy',
        priority: 'high',
        estimated_hours: 0.25,
        related_module: 'Cases',
      },
      {
        title: 'Assign Associates',
        description: 'Assign associate attorneys for research and drafting',
        priority: 'medium',
        estimated_hours: 0.25,
        related_module: 'Cases',
      },
      {
        title: 'Assign Paralegal',
        description: 'Assign paralegal for document management and coordination',
        priority: 'medium',
        estimated_hours: 0.25,
        related_module: 'Cases',
      },
    ];

    for (const taskData of teamTasks) {
      const task = await WorkflowTask.create({
        stage_id: teamStage.id,
        case_id: caseId,
        title: taskData.title,
        description: taskData.description,
        status: 'pending',
        priority: taskData.priority,
        estimated_hours: taskData.estimated_hours,
        related_module: taskData.related_module,
        created_by: createdBy,
        automated_trigger: 'pacer_import',
      });
      tasks.push(task);
    }

    return { stages, tasks };
  }
}
