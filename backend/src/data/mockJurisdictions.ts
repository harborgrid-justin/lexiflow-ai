export const MOCK_JURISDICTIONS = [
    {
        id: 'jur-001',
        name: 'U.S. Supreme Court',
        type: 'Federal',
        parent_id: null,
        metadata: {
            circuit: 'SCOTUS',
            courtType: 'Highest',
            judges: 9,
            status: 'Active Session'
        }
    },
    {
        id: 'jur-002',
        name: '9th Circuit Court of Appeals',
        type: 'Federal',
        parent_id: 'jur-001',
        metadata: {
            circuit: '9th',
            courtType: 'Appellate',
            judges: 29,
            status: 'Recess'
        }
    },
    {
        id: 'jur-003',
        name: 'N.D. California',
        type: 'Federal',
        parent_id: 'jur-002',
        metadata: {
            circuit: '9th',
            courtType: 'District',
            judges: 14,
            status: 'Active'
        }
    },
    {
        id: 'jur-004',
        name: 'S.D. New York',
        type: 'Federal',
        parent_id: null,
        metadata: {
            circuit: '2nd',
            courtType: 'District',
            judges: 28,
            status: 'Active'
        }
    },
    {
        id: 'jur-005',
        name: 'California Superior Court',
        type: 'State',
        parent_id: null,
        metadata: {
            state: 'California',
            level: 'Trial',
            status: 'Active',
            eFiling: 'Required',
            system: 'Journal Tech'
        }
    },
    {
        id: 'jur-006',
        name: 'Delaware Court of Chancery',
        type: 'State',
        parent_id: null,
        metadata: {
            state: 'Delaware',
            level: 'Equity',
            status: 'Active',
            eFiling: 'Required',
            system: 'File & Serve'
        }
    },
    {
        id: 'jur-007',
        name: 'Federal Trade Commission (FTC)',
        type: 'Regulatory',
        parent_id: null,
        metadata: {
            description: 'Antitrust reviews & Consumer protection.',
            reference: '15 U.S.C. § 41',
            iconColor: 'blue'
        }
    },
    {
        id: 'jur-008',
        name: 'Securities & Exchange Commission (SEC)',
        type: 'Regulatory',
        parent_id: null,
        metadata: {
            description: 'Capital markets oversight & enforcement.',
            reference: 'Sarbanes-Oxley',
            iconColor: 'green'
        }
    },
    {
        id: 'jur-009',
        name: 'Hague Service Convention',
        type: 'International',
        parent_id: null,
        metadata: {
            subjectMatter: 'Service of Process',
            status: 'Ratified',
            parties: 79
        }
    },
    {
        id: 'jur-010',
        name: 'New York Convention',
        type: 'International',
        parent_id: null,
        metadata: {
            subjectMatter: 'Arbitration Enforcement',
            status: 'Ratified',
            parties: 172
        }
    },
    {
        id: 'jur-011',
        name: 'GDPR (EU)',
        type: 'International',
        parent_id: null,
        metadata: {
            subjectMatter: 'Data Privacy',
            status: 'Enforcement Active',
            parties: 27
        }
    }
];
