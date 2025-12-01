
import OpenAI from 'openai';
import type { ResponseFormatJSONSchema } from 'openai/resources';

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_ENTERPRISE_KEY || '';
const openaiBaseUrl = import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1';

// Input size limits (in characters) to prevent token explosion
const INPUT_LIMITS = {
  DOCUMENT: 8000,      // ~2000 tokens for document analysis
  CONTRACT: 16000,     // ~4000 tokens for contract review
  DOCKET: 32000,       // ~8000 tokens for PACER parsing
  QUERY: 2000,         // ~500 tokens for research queries
  CONTEXT: 4000,       // ~1000 tokens for draft context
  TIME_ENTRY: 500,     // ~125 tokens for time entries
} as const;

const openai = new OpenAI({
  apiKey: openaiApiKey,
  baseURL: openaiBaseUrl,
  dangerouslyAllowBrowser: true,
  timeout: 30000,
  maxRetries: 2,
});

// Truncate input to prevent token explosion
function truncateInput(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.substring(0, maxChars) + '\n[...truncated]';
}

// =============================================================================
// JSON SCHEMAS for Structured Outputs (guarantees valid JSON matching schema)
// =============================================================================

const DocumentAnalysisSchema: ResponseFormatJSONSchema = {
  type: 'json_schema',
  json_schema: {
    name: 'document_analysis',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        summary: { type: 'string', description: 'Brief 2-3 sentence summary of the document' },
        riskScore: { type: 'integer', description: 'Risk score from 0 to 100' }
      },
      required: ['summary', 'riskScore'],
      additionalProperties: false
    }
  }
};

const WorkflowSchema: ResponseFormatJSONSchema = {
  type: 'json_schema',
  json_schema: {
    name: 'workflow_stages',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        stages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              title: { type: 'string' },
              tasks: { type: 'array', items: { type: 'string' } }
            },
            required: ['title', 'tasks'],
            additionalProperties: false
          }
        }
      },
      required: ['stages'],
      additionalProperties: false
    }
  }
};

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
            feeStatus: { type: ['string', 'null'] },
            presidingJudge: { type: ['string', 'null'] },
            status: { type: ['string', 'null'] }
          },
          required: ['docketNumber', 'originatingCaseNumber', 'title', 'court', 'jurisdiction', 'natureOfSuit', 'caseType', 'filingDate', 'feeStatus', 'presidingJudge', 'status'],
          additionalProperties: false
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
                    address: { type: ['string', 'null'] }
                  },
                  required: ['name', 'firm', 'phone', 'email', 'status', 'address'],
                  additionalProperties: false
                }
              }
            },
            required: ['name', 'role', 'type', 'contact', 'counsel'],
            additionalProperties: false
          }
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
              documentId: { type: ['string', 'null'] }
            },
            required: ['entryNumber', 'date', 'description', 'pages', 'fileSize', 'documentId'],
            additionalProperties: false
          }
        },
        deadlines: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              date: { type: ['string', 'null'] },
              title: { type: ['string', 'null'] },
              type: { type: ['string', 'null'] }
            },
            required: ['date', 'title', 'type'],
            additionalProperties: false
          }
        }
      },
      required: ['caseInfo', 'parties', 'docketEntries', 'deadlines'],
      additionalProperties: false
    }
  }
};

// =============================================================================
// Chat Completion Helpers
// =============================================================================

// Plain text response
async function chatCompletionText(
  systemPrompt: string,
  userContent: string,
  maxTokens = 1024
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ],
    max_tokens: maxTokens,
    temperature: 0.7,
    n: 1,
  });
  return response.choices[0]?.message?.content || '';
}

// Structured JSON response with guaranteed schema compliance
async function chatCompletionStructured<T>(
  systemPrompt: string,
  userContent: string,
  responseFormat: ResponseFormatJSONSchema,
  maxTokens = 1024
): Promise<T> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ],
    max_tokens: maxTokens,
    temperature: 0.2, // Lower for consistent structured output
    n: 1,
    response_format: responseFormat,
  });
  
  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('Empty response from API');
  
  return JSON.parse(content) as T;
}

// =============================================================================
// Type Definitions
// =============================================================================

interface DocumentAnalysisResult {
  summary: string;
  riskScore: number;
}

interface WorkflowStage {
  title: string;
  tasks: string[];
}

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

interface PacerCounsel {
  name: string | null;
  firm: string | null;
  phone: string | null;
  email: string | null;
  status: string | null;
  address: string | null;
}

interface PacerParty {
  name: string;
  role: string | null;
  type: string | null;
  contact: string | null;
  counsel: PacerCounsel[];
}

interface PacerDocketEntry {
  entryNumber: number;
  date: string | null;
  description: string | null;
  pages: number | null;
  fileSize: string | null;
  documentId: string | null;
}

interface PacerDeadline {
  date: string | null;
  title: string | null;
  type: string | null;
}

interface PacerCaseInfo {
  docketNumber: string | null;
  originatingCaseNumber: string | null;
  title: string | null;
  court: string | null;
  jurisdiction: string | null;
  natureOfSuit: string | null;
  caseType: string | null;
  filingDate: string | null;
  feeStatus: string | null;
  presidingJudge: string | null;
  status: string | null;
}

interface ParsedPacerData {
  caseInfo: PacerCaseInfo;
  parties: PacerParty[];
  docketEntries: PacerDocketEntry[];
  deadlines: PacerDeadline[];
}

// =============================================================================
// Exported Service
// =============================================================================

export const OpenAIService = {
  async analyzeDocument(docContent: string): Promise<DocumentAnalysisResult> {
    try {
      const systemPrompt = 'Analyze this legal document. Provide a brief summary and risk assessment.';
      const userContent = truncateInput(docContent, INPUT_LIMITS.DOCUMENT);

      const result = await chatCompletionStructured<DocumentAnalysisResult>(
        systemPrompt,
        userContent,
        DocumentAnalysisSchema,
        512
      );
      
      return {
        summary: result.summary || "No summary available.",
        riskScore: typeof result.riskScore === 'number' ? Math.min(100, Math.max(0, result.riskScore)) : 0
      };
    } catch (e) {
      console.error("Document analysis failed:", e);
      return { summary: "Error analyzing document.", riskScore: 0 };
    }
  },

  async conductResearch(query: string): Promise<{ text: string; sources: SearchResult[] }> {
    try {
      const systemPrompt = 'You are a legal research assistant. Provide concise legal analysis based on your knowledge. Be direct and practical.';
      const userContent = truncateInput(query, INPUT_LIMITS.QUERY);

      const response = await chatCompletionText(systemPrompt, userContent, 1500);
      return {
        text: response || "No response.",
        sources: []
      };
    } catch (e) {
      console.error("Research failed:", e);
      return { text: "Research failed.", sources: [] };
    }
  },

  async generateDraft(context: string, type: string): Promise<string> {
    try {
      const systemPrompt = `You are a legal drafting assistant. Generate professional ${type} documents. Be concise and use standard legal formatting.`;
      const userContent = truncateInput(context, INPUT_LIMITS.CONTEXT);

      const response = await chatCompletionText(systemPrompt, userContent, 2000);
      return response || "Failed to generate draft.";
    } catch (e) {
      console.error("Draft generation failed:", e);
      return "Draft generation failed.";
    }
  },

  async generateWorkflow(desc: string): Promise<WorkflowStage[]> {
    try {
      const systemPrompt = 'Create a legal workflow with 3-5 stages. Each stage needs a title and list of tasks.';
      const userContent = truncateInput(desc, INPUT_LIMITS.QUERY);

      const result = await chatCompletionStructured<{ stages: WorkflowStage[] }>(
        systemPrompt,
        userContent,
        WorkflowSchema,
        1024
      );
      
      return result.stages || [];
    } catch (e) {
      console.error("Workflow generation failed:", e);
      return [];
    }
  },

  async reviewContract(content: string): Promise<string> {
    try {
      const systemPrompt = 'You are a contract review specialist. Identify: 1) Key risks 2) Missing clauses 3) Recommendations 4) Negotiation points. Be concise and actionable.';
      const userContent = truncateInput(content, INPUT_LIMITS.CONTRACT);

      const response = await chatCompletionText(systemPrompt, userContent, 1500);
      return response || "No suggestions available.";
    } catch (e) {
      console.error("Contract review failed:", e);
      return "Contract review failed.";
    }
  },

  async refineTimeEntry(raw: string): Promise<string> {
    try {
      const systemPrompt = 'Rewrite the billing entry to be professional and value-oriented. Return only the refined text.';
      const userContent = truncateInput(raw, INPUT_LIMITS.TIME_ENTRY);

      const response = await chatCompletionText(systemPrompt, userContent, 256);
      return response || raw;
    } catch (e) {
      console.error("Time entry refinement failed:", e);
      return raw;
    }
  },

  async parseDocket(text: string): Promise<ParsedPacerData | null> {
    try {
      const systemPrompt = `Parse the PACER docket text into structured data. Extract case information, parties with their counsel, docket entries, and any deadlines. Use null for missing fields. Format dates as ISO (YYYY-MM-DD) where possible.`;
      const userContent = truncateInput(text, INPUT_LIMITS.DOCKET);

      const result = await chatCompletionStructured<ParsedPacerData>(
        systemPrompt,
        userContent,
        PacerDocketSchema,
        4096
      );
      
      if (!result.caseInfo || !result.parties) {
        throw new Error('Invalid PACER data structure');
      }
      
      return result;
    } catch (e) {
      console.error("PACER docket parsing failed:", e);
      return null;
    }
  }
};
