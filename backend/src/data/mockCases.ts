
import { Case, CaseStatus } from '../types';

export const MOCK_CASES: Case[] = [
  {
    id: 'C-2024-001', title: 'Martinez v. TechCorp Industries', client: 'TechCorp Industries', opposingCounsel: 'Morgan & Morgan',
    status: CaseStatus.Discovery, filingDate: '2023-11-15', description: 'Employment discrimination class action.', value: 4500000,
    matterType: 'Litigation', jurisdiction: 'CA Superior Court', court: 'San Francisco',
    parties: [{ id: 'p1', name: 'John Doe', role: 'Plaintiff', contact: 'john@email.com', type: 'Individual' }]
  },
  {
    id: 'C-2024-112', title: 'In Re: OmniGlobal Merger', client: 'OmniGlobal Inc.', opposingCounsel: 'FTC',
    status: CaseStatus.Discovery, filingDate: '2024-02-01', description: 'Antitrust review of proposed acquisition.', value: 85000000,
    matterType: 'M&A', jurisdiction: 'Federal', court: 'FTC Review', parties: []
  },
  {
    id: 'C-2023-892', title: 'State v. GreenEnergy', client: 'GreenEnergy Corp', opposingCounsel: 'State AG',
    status: CaseStatus.Trial, filingDate: '2023-06-10', description: 'Environmental compliance dispute.', value: 1200000,
    matterType: 'Litigation', jurisdiction: 'State', court: 'Nevada District', parties: []
  },
  {
     id: 'C-2024-004', title: 'Estate of H. Smith', client: 'Smith Family', opposingCounsel: 'IRS',
     status: CaseStatus.Discovery, filingDate: '2024-01-20', description: 'Tax dispute regarding estate valuation.', value: 500000,
     matterType: 'General', jurisdiction: 'Federal', court: 'Tax Court', parties: []
  }
];
