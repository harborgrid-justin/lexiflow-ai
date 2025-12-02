/**
 * Compliance Module Types
 */

export interface ComplianceDashboard {
  conflictsCount: number;
  pendingReviews: number;
  activeWalls: number;
  riskScore: number;
  recentActivity: ComplianceActivity[];
  alerts: ComplianceAlert[];
}

export interface ComplianceActivity {
  id: string;
  type: 'conflict_check' | 'wall_created' | 'wall_updated' | 'policy_violation';
  description: string;
  user: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface ComplianceAlert {
  id: string;
  type: 'conflict' | 'deadline' | 'policy' | 'ethics';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'acknowledged' | 'resolved';
  createdAt: string;
  dueDate?: string;
  assignedTo?: string;
}

export interface ConflictCheckResult {
  id: string;
  entityName: string;
  status: 'Cleared' | 'Flagged' | 'Review';
  foundIn: string[];
  checkedBy: string;
  checkedAt: string;
  details?: ConflictDetail[];
}

export interface ConflictDetail {
  source: string;
  type: 'client' | 'opposing_party' | 'matter' | 'employee';
  relationship: string;
  severity: 'low' | 'medium' | 'high';
}

export interface EthicalWallFormData {
  caseId: string;
  title: string;
  restrictedGroups: string[];
  authorizedUsers: string[];
  reason?: string;
}

export interface RiskAssessment {
  id: string;
  caseId?: string;
  clientId?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactor[];
  mitigations: string[];
  assessedBy: string;
  assessedAt: string;
  nextReviewDate: string;
}

export interface RiskFactor {
  category: string;
  description: string;
  weight: number;
  score: number;
}

export type ComplianceViewMode = 'dashboard' | 'conflicts' | 'walls' | 'risk' | 'policies';
