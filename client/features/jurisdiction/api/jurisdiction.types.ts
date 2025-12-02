/**
 * Jurisdiction Feature - Type Definitions
 */

export type JurisdictionView = 
  | 'federal' 
  | 'state' 
  | 'regulatory' 
  | 'international' 
  | 'arbitration' 
  | 'local' 
  | 'map';

export interface Court {
  id: string;
  name: string;
  type: 'Federal' | 'State' | 'Appellate' | 'Supreme' | 'Regulatory' | 'Arbitration';
  jurisdiction: string;
  circuit?: string;
  district?: string;
  address?: string;
  phone?: string;
  website?: string;
  filingDeadlines?: FilingDeadline[];
  localRules?: LocalRule[];
}

export interface FilingDeadline {
  id: string;
  name: string;
  daysFromEvent: number;
  eventType: string;
  description: string;
}

export interface LocalRule {
  id: string;
  ruleNumber: string;
  title: string;
  description: string;
  effectiveDate: string;
  lastUpdated: string;
}

export interface RegulatoryBody {
  id: string;
  name: string;
  abbreviation: string;
  jurisdiction: string;
  type: 'Federal' | 'State' | 'International';
  website?: string;
  enforcementActions?: EnforcementAction[];
}

export interface EnforcementAction {
  id: string;
  date: string;
  type: string;
  description: string;
  status: 'Pending' | 'Resolved' | 'Appealed';
}

export interface ArbitrationOrganization {
  id: string;
  name: string;
  abbreviation: string;
  type: 'Domestic' | 'International';
  rules: string[];
  website?: string;
}

export interface JurisdictionFilters {
  search: string;
  type: string;
  circuit?: string;
  state?: string;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  name: string;
  type: string;
  id: string;
}
