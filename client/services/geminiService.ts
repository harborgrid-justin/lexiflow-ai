
import OpenAI from 'openai';
import { SearchResult } from "../types";

const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true // Required for client-side usage
});

// Helper to make OpenAI chat completion calls
async function chatCompletion(prompt: string, jsonMode = false): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    ...(jsonMode && { response_format: { type: 'json_object' } }),
  });
  return response.choices[0]?.message?.content || '';
}

export const GeminiService = {
  async analyzeDocument(docContent: string): Promise<{ summary: string; riskScore: number }> {
    try {
      const prompt = `Analyze this legal document. Provide a JSON response with "summary" (brief summary) and "riskScore" (0-100 integer indicating risk level).

Document content:
${docContent.substring(0, 5000)}`;

      const response = await chatCompletion(prompt, true);
      const parsed = JSON.parse(response);
      return {
        summary: parsed.summary || "No summary available.",
        riskScore: typeof parsed.riskScore === 'number' ? parsed.riskScore : 0
      };
    } catch (_e) {
      console.error("Document analysis failed:", _e);
      return { summary: "Error analyzing document.", riskScore: 0 };
    }
  },

  async conductResearch(query: string): Promise<{ text: string; sources: SearchResult[] }> {
    try {
      const prompt = `You are a legal research assistant. Conduct research on the following legal query and provide a comprehensive analysis:

Query: ${query}

Provide your response as a detailed legal analysis. Note: Since you cannot access external sources in real-time, provide analysis based on your legal knowledge.`;

      const response = await chatCompletion(prompt);
      // OpenAI doesn't have built-in web search, so we return empty sources
      return {
        text: response || "No response.",
        sources: []
      };
    } catch (_e) {
      console.error("Research failed:", _e);
      return { text: "Research failed.", sources: [] };
    }
  },

  async generateDraft(context: string, type: string): Promise<string> {
    try {
      const prompt = `You are a legal drafting assistant. Generate a professional legal ${type} document based on the following context:

Context: ${context}

Provide a well-structured legal document draft.`;

      const response = await chatCompletion(prompt);
      return response || "Failed to generate draft.";
    } catch (_e) {
      console.error("Draft generation failed:", _e);
      return "Draft generation failed.";
    }
  },

  async generateWorkflow(desc: string): Promise<Array<{title: string, tasks: string[]}>> {
    try {
      const prompt = `Create a legal workflow for the following description. Return a JSON array of stages, where each stage has a "title" (string) and "tasks" (array of task strings).

Description: ${desc}

Example format:
[
  {"title": "Initial Review", "tasks": ["Review documents", "Identify key issues"]},
  {"title": "Research", "tasks": ["Legal research", "Case law analysis"]}
]`;

      const response = await chatCompletion(prompt, true);
      const parsed = JSON.parse(response);
      return Array.isArray(parsed) ? parsed : [];
    } catch (_e) {
      console.error("Workflow generation failed:", _e);
      return [];
    }
  },

  async reviewContract(content: string): Promise<string> {
    try {
      const prompt = `You are a contract review specialist. Review the following contract and identify:
1. Key risks and concerns
2. Missing or unclear clauses
3. Recommendations for improvement
4. Potential negotiation points

Contract content:
${content.substring(0, 10000)}

Provide a structured review with clear recommendations.`;

      const response = await chatCompletion(prompt);
      return response || "No suggestions available.";
    } catch (_e) {
      console.error("Contract review failed:", _e);
      return "Contract review failed.";
    }
  },

  async refineTimeEntry(raw: string): Promise<string> {
    try {
      const prompt = `Rewrite this legal billing time entry to be professional, specific, and value-oriented. The entry should clearly communicate the work performed and its value to the client.

Original entry: "${raw}"

Provide only the refined entry text, nothing else.`;

      const response = await chatCompletion(prompt);
      return response || raw;
    } catch (_e) {
      console.error("Time entry refinement failed:", _e);
      return raw;
    }
  },

  async parseDocket(text: string): Promise<any> {
    try {
      const prompt = `Parse the following court docket text into structured JSON. Extract:
- caseInfo: object with title, caseNumber, court, judge
- parties: array of objects with name, role, type
- docketEntries: array of objects with date, description, entryNumber
- deadlines: array of objects with date, title, type

Docket text:
${text.substring(0, 15000)}

Return valid JSON only.`;

      const response = await chatCompletion(prompt, true);
      return JSON.parse(response);
    } catch (e) {
      console.error("Docket parsing failed:", e);
      return null;
    }
  }
};
