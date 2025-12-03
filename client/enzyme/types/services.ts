// Service Types
// Consolidated types for Enzyme services

export interface Argument {
  id: string;
  caseId: string;
  title: string;
  content: string;
  type: 'Opening' | 'Closing' | 'Motion' | 'Objection';
  strengthScore?: number;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  version?: number;
  tags?: string[];
  status?: 'Draft' | 'Review' | 'Final';
}

export interface ArgumentVersion {
  id: string;
  argumentId: string;
  content: string;
  authorId: string;
  createdAt: string;
  changeSummary?: string;
}

export interface JudgeAnalytics {
  judgeName: string;
  rulingTendency: Record<string, number>; // e.g., { 'Motion to Dismiss': 0.4 }
  citationPreferences: string[];
  averageCaseDuration: number;
}

export interface DefenseStrategy {
  id: string;
  caseId: string;
  name: string;
  description: string;
  successProbability: number;
  risks: string[];
  createdAt: string;
  opponentProfileId?: string;
  juryImpactScore?: number;
}

export interface OpponentProfile {
  id: string;
  name: string;
  firm: string;
  winRate: number;
  commonStrategies: string[];
  weaknesses: string[];
}

export interface Simulation {
  id: string;
  caseId: string;
  name: string;
  type: 'Standard' | 'MonteCarlo' | 'DecisionTree';
  parameters: Record<string, any>;
  status: 'Pending' | 'Running' | 'Completed' | 'Failed';
  results?: any;
  createdAt: string;
  iterations?: number;
}

export interface WarRoomSession {
  id: string;
  caseId: string;
  name: string;
  status: 'Active' | 'Scheduled' | 'Closed';
  participants: string[]; // User IDs
  startTime: string;
  endTime?: string;
  recordingUrl?: string;
  transcriptId?: string;
}

export interface Citation {
  id: string;
  sourceId?: string;
  text: string;
  format: 'Bluebook' | 'ALWD' | 'Other';
  isValid: boolean;
  metadata?: any;
  shepardStatus?: 'Positive' | 'Negative' | 'Caution' | 'Neutral';
  flags?: string[];
}

export interface Reference {
  id: string;
  title: string;
  type: 'Case' | 'Statute' | 'Regulation' | 'Treatise';
  citation: string;
  url?: string;
  summary?: string;
  lastUpdated?: string;
  status?: 'Current' | 'Overturned' | 'Amended';
}

export interface FormattingTemplate {
  id: string;
  name: string;
  description: string;
  jurisdiction?: string;
  court?: string;
  rules: any;
  isDefault?: boolean;
}

export interface EntityLink {
  id: string;
  sourceId: string;
  sourceType: 'Document' | 'Citation' | 'Asset' | 'Task' | 'Person' | 'Organization';
  targetId: string;
  targetType: 'Document' | 'Citation' | 'Asset' | 'Task' | 'Person' | 'Organization';
  relationship: string;
  confidence?: number;
  metadata?: any;
}
