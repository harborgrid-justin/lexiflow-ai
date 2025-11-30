
import { Organization, Group, User } from '../types';

export const MOCK_ORGS: Organization[] = [
  { id: 'org-1', name: 'LexiFlow LLP', type: 'LawFirm', domain: 'lexiflow.com', status: 'Active' },
  { id: 'org-2', name: 'TechCorp Industries', type: 'Corporate', domain: 'techcorp.com', status: 'Active' },
  { id: 'org-3', name: 'Superior Court of CA', type: 'Court', domain: 'courts.ca.gov', status: 'Active' },
  { id: 'org-4', name: 'Forensic Analytics Inc', type: 'Vendor', domain: 'forensics.io', status: 'Active' }
];

export const MOCK_GROUPS: Group[] = [
  // LexiFlow Groups
  { id: 'g-1', orgId: 'org-1', name: 'Litigation Team A', description: 'Primary Civil Litigation Unit', permissions: ['case_view', 'case_edit', 'billing_log'] },
  { id: 'g-2', orgId: 'org-1', name: 'M&A Department', description: 'Mergers & Acquisitions', permissions: ['case_view', 'case_edit', 'contract_review'] },
  { id: 'g-3', orgId: 'org-1', name: 'Partner Committee', description: 'Senior Management', permissions: ['admin', 'billing_approve'] },
  { id: 'g-4', orgId: 'org-1', name: 'Paralegal Pool', description: 'Support Staff', permissions: ['case_view', 'discovery_log'] },
  
  // TechCorp Groups
  { id: 'g-5', orgId: 'org-2', name: 'Legal Department', description: 'In-House Counsel', permissions: ['case_view', 'portal_access'] },
  { id: 'g-6', orgId: 'org-2', name: 'HR Leadership', description: 'Human Resources Execs', permissions: ['limited_view'] },
];

export const HIERARCHY_USERS: User[] = [
  // LexiFlow Internal
  { id: 'u1', name: 'Alexandra H.', email: 'alex@lexiflow.com', role: 'Senior Partner', orgId: 'org-1', groupIds: ['g-1', 'g-3'], userType: 'Internal', office: 'New York' },
  { id: 'u2', name: 'James Doe', email: 'james@lexiflow.com', role: 'Associate', orgId: 'org-1', groupIds: ['g-1'], userType: 'Internal', office: 'Chicago' },
  { id: 'u3', name: 'Sarah Jenkins', email: 'sarah@lexiflow.com', role: 'Paralegal', orgId: 'org-1', groupIds: ['g-1', 'g-4'], userType: 'Internal', office: 'New York' },
  { id: 'u4', name: 'Admin User', email: 'admin@lexiflow.com', role: 'Administrator', orgId: 'org-1', groupIds: ['g-3'], userType: 'Internal', office: 'Remote' },
  
  // External Clients
  { id: 'u5', name: 'John Doe (GC)', email: 'j.doe@techcorp.com', role: 'Client User', orgId: 'org-2', groupIds: ['g-5'], userType: 'External', office: 'San Francisco' },
  { id: 'u6', name: 'Jane Smith (HR)', email: 'j.smith@techcorp.com', role: 'Client User', orgId: 'org-2', groupIds: ['g-6'], userType: 'External', office: 'San Francisco' },
  
  // External Vendors
  { id: 'u7', name: 'Dr. Aris', email: 'aris@forensics.io', role: 'Guest', orgId: 'org-4', groupIds: [], userType: 'External', office: 'Lab A' }
];
