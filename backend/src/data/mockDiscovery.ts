
import { DiscoveryRequest } from '../types';

export const MOCK_DISCOVERY: DiscoveryRequest[] = [
  {
    id: 'DR-001',
    caseId: 'C-2024-001',
    type: 'Production',
    propoundingParty: 'TechCorp Industries',
    respondingParty: 'Martinez (Plaintiff)',
    serviceDate: '2024-03-01',
    dueDate: '2024-03-31',
    status: 'Served',
    title: 'RFP Set One - Employment Records',
    description: 'Request for production of all performance reviews, email communications regarding termination, and payroll records.',
  },
  {
    id: 'DR-002',
    caseId: 'C-2024-001',
    type: 'Interrogatory',
    propoundingParty: 'Martinez (Plaintiff)',
    respondingParty: 'TechCorp Industries',
    serviceDate: '2024-03-05',
    dueDate: '2024-04-04',
    status: 'Overdue',
    title: 'Special Interrogatories - Set 1',
    description: 'Identify all individuals involved in the decision to terminate Plaintiff.',
  },
  {
    id: 'DR-003',
    caseId: 'C-2024-112',
    type: 'Admission',
    propoundingParty: 'FTC',
    respondingParty: 'OmniGlobal Inc.',
    serviceDate: '2024-02-15',
    dueDate: '2024-03-16',
    status: 'Responded',
    title: 'RFA - Market Share Data',
    description: 'Admit that OmniGlobal controls >40% of the widget market in the Northeast region.',
  },
  {
    id: 'DR-004',
    caseId: 'C-2024-001',
    type: 'Deposition',
    propoundingParty: 'Martinez (Plaintiff)',
    respondingParty: 'CEO of TechCorp',
    serviceDate: '2024-03-10',
    dueDate: '2024-04-10',
    status: 'Draft',
    title: 'Notice of Deposition - CEO',
    description: 'Deposition of TechCorp CEO regarding corporate culture and hiring practices.',
  }
];

export const MOCK_PRIVILEGE_LOG = [
  { id: 'PL-001', date: '2023-11-10', author: 'J. Smith', recipient: 'K. Jones', type: 'Email', basis: 'Attorney-Client Privilege', desc: 'Legal advice re: termination risk.' },
  { id: 'PL-002', date: '2023-11-12', author: 'General Counsel', recipient: 'Board', type: 'Memo', basis: 'Work Product', desc: 'Case strategy and litigation anticipation.' },
];

export const MOCK_LEGAL_HOLDS = [
  { id: 'LH-01', custodian: 'John Doe', dept: 'Engineering', issued: '2023-11-01', status: 'Acknowledged' },
  { id: 'LH-02', custodian: 'Jane Smith', dept: 'HR', issued: '2023-11-01', status: 'Pending' },
  { id: 'LH-03', custodian: 'IT Director', dept: 'IT Infrastructure', issued: '2023-11-01', status: 'Acknowledged' },
];

export const MOCK_DISCOVERY_DOCS = {
  minutes: {
    id: 'DOC-MIN-001',
    title: "Minutes: Rule 26(f) Conference",
    date: "Oct 15, 2023",
    type: "Conference Minute",
    content: `MINUTES OF DISCOVERY CONFERENCE (FRCP 26(f))

Date: October 15, 2023
Location: Teleconference

Attendees: 
- Plaintiff Counsel: J. Doe
- Defense Counsel: S. Miller (LexiFlow Firm)

1. Preservation of Electronically Stored Information (ESI)
Parties agreed to preserve all emails from key custodians (List A) dating back to Jan 2020. No specific form of production agreed upon yet for databases.

2. Privilege Claims
Agreed to use 'quick peek' clawback agreement pursuant to FRE 502(d). A proposed order will be submitted.

3. Initial Disclosures
Scheduled for exchange by Nov 14, 2023. Plaintiff to provide damage computation.

4. Phasing
Phase 1: Written discovery and document production (Nov-Feb). 
Phase 2: Depositions (Mar-May 2024).

5. Settlement
Parties agreed to discuss ADR after Phase 1 discovery.

Minutes recorded by: S. Miller`
  },
  filing: {
    id: 'DOC-FIL-052',
    title: "Joint Discovery Plan (Form 52)",
    date: "Nov 01, 2023",
    type: "Court Filing",
    content: `UNITED STATES DISTRICT COURT
NORTHERN DISTRICT OF CALIFORNIA

MARTINEZ v. TECHCORP INDUSTRIES
Case No. C-2024-001

JOINT REPORT AND DISCOVERY PLAN

1. Changes to Discovery Rules
No changes to standard limitations on interrogatories (25) or depositions (10 per side) proposed.

2. Subjects of Discovery
- Employment history of Plaintiff.
- Internal communications regarding the 'Restructure Initiative'.
- Performance reviews of comparable employees.

3. ESI Format
- Text: Searchable PDF or TIFF with load files.
- Spreadsheets: Native format with metadata preserved.

4. Deadlines
- Initial Disclosures: Nov 14, 2023
- Fact Discovery Cutoff: June 1, 2024
- Expert Discovery Cutoff: Aug 1, 2024
- Dispositive Motions: Sept 15, 2024

Respectfully submitted,

/s/ J. Doe (Plaintiff Counsel)
/s/ S. Miller (Defense Counsel)`
  }
};
