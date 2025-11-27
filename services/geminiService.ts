
import { GoogleGenAI, Type } from "@google/genai";
import { SearchResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const GeminiService = {
  async analyzeDocument(docContent: string): Promise<{ summary: string; riskScore: number }> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Analyze legal doc. Summary & Risk (0-100). Content: ${docContent.substring(0, 5000)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: { type: Type.OBJECT, properties: { summary: { type: Type.STRING }, riskScore: { type: Type.INTEGER } } }
        }
      });
      return JSON.parse(response.text || '{}');
    } catch (e) { return { summary: "Error.", riskScore: 0 }; }
  },

  async conductResearch(query: string): Promise<{ text: string; sources: SearchResult[] }> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', contents: `Legal research: ${query}`, config: { tools: [{ googleSearch: {} }] }
      });
      const sources: SearchResult[] = [];
      response.candidates?.[0]?.groundingMetadata?.groundingChunks?.forEach((c: any) => {
        if (c.web) sources.push({ title: c.web.title, url: c.web.uri, snippet: "Source found via Google Search" });
      });
      return { text: response.text || "No response.", sources };
    } catch (e) { return { text: "Research failed.", sources: [] }; }
  },

  async generateDraft(context: string, type: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Draft legal ${type}. Context: ${context}` });
      return response.text || "";
    } catch (e) { return "Draft failed."; }
  },

  async generateWorkflow(desc: string): Promise<Array<{title: string, tasks: string[]}>> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', contents: `Create legal workflow: ${desc}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, tasks: { type: Type.ARRAY, items: { type: Type.STRING } } } } }
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (e) { return []; }
  },

  async reviewContract(content: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Review contract. Identify risks. Content: ${content}` });
      return response.text || "No suggestions.";
    } catch (e) { return "Review failed."; }
  },

  async refineTimeEntry(raw: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Rewrite this legal billing entry to be professional, specific, and value-oriented: "${raw}"` });
      return response.text || raw;
    } catch (e) { return raw; }
  }
};
