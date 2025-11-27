
import { TimeEntry } from '../types';

export const MOCK_TIME_ENTRIES: TimeEntry[] = [
    { id: '1', caseId: 'C-2024-001', date: '2024-03-01', duration: 30, description: 'Initial review of complaint', rate: 450, total: 225, status: 'Billed' },
    { id: '2', caseId: 'C-2024-001', date: '2024-03-02', duration: 60, description: 'Drafting response strategy', rate: 450, total: 450, status: 'Unbilled' },
    { id: '3', caseId: 'C-2024-112', date: '2024-03-05', duration: 120, description: 'Due diligence review', rate: 550, total: 1100, status: 'Unbilled' }
];

export const MOCK_WIP_DATA = [
    { name: 'TechCorp', wip: 45000, billed: 120000 },
    { name: 'OmniGlobal', wip: 28000, billed: 85000 },
    { name: 'StartUp Inc', wip: 12000, billed: 45000 },
];
  
export const MOCK_REALIZATION_DATA = [
    { name: 'Billed', value: 85, color: '#10b981' },
    { name: 'Write-off', value: 15, color: '#ef4444' },
];
