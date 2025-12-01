// Core Entity Types (Organizations, Users, Cases)
// API response types matching backend database schema (snake_case)

export interface ApiOrganization {
  id: string;
  name: string;
  type?: string;
  domain?: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  subscription_tier?: string;
  status: string;
  practice_areas?: string;
  tax_id?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface ApiUser {
  id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  role: string;
  position?: string;
  bar_admission?: string;
  bar_number?: string;
  phone?: string;
  expertise?: string;
  office?: string;
  user_type?: string;
  avatar?: string;
  last_active?: Date | string;
  status: string;
  organization_id: string;
  created_at: Date | string;
  updated_at: Date | string;
  organization?: ApiOrganization;
}

export interface ApiParty {
  id: string;
  name: string;
  role: string;
  contact: string;
  type: string;
  counsel?: string;
  case_id: string;
  linked_org_id?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface ApiCaseMember {
  id: string;
  case_id: string;
  user_id: string;
  role: string;
  joined_at: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
  user?: ApiUser;
}

export interface ApiCase {
  id: string;
  title: string;
  client_name: string;
  opposing_counsel?: string;
  status: string;
  filing_date?: Date | string;
  description?: string;
  value?: number;
  matter_type?: string;
  jurisdiction?: string;
  court?: string;
  billing_model?: string;
  judge?: string;
  owner_org_id?: string;
  created_by?: string;
  created_at: Date | string;
  updated_at: Date | string;
  organization?: ApiOrganization;
  parties?: ApiParty[];
  case_members?: ApiCaseMember[];
}
