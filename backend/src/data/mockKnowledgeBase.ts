export const MOCK_KNOWLEDGE_BASE = [
    {
        id: 'kb-001',
        title: 'California Employment Litigation',
        category: 'Playbook',
        summary: 'Standard operating procedures for discrimination claims filed in CA Superior Court.',
        content: 'Full content of the playbook...',
        tags: ['California', 'Employment', 'Discrimination'],
        author: 'Senior Partner',
        last_updated: '2024-01-15T10:00:00Z',
        metadata: {
            icon: 'Book',
            color: 'purple'
        }
    },
    {
        id: 'kb-002',
        title: 'Handling GDPR Subject Requests',
        category: 'Q&A',
        summary: 'Step-by-step guide for responding to data deletion requests from EU clients.',
        content: 'Full content of the guide...',
        tags: ['GDPR', 'Privacy', 'EU'],
        author: 'Compliance Officer',
        last_updated: '2023-11-20T14:30:00Z',
        metadata: {
            icon: 'Lightbulb',
            color: 'amber'
        }
    },
    {
        id: 'kb-003',
        title: 'Smith v. MegaCorp (2021)',
        category: 'Precedent',
        summary: 'Successfully argued Motion to Dismiss based on lack of standing in similar class action.',
        content: 'Case analysis...',
        tags: ['Class Action', 'Dismissal'],
        author: 'Associate',
        last_updated: '2021-06-10T09:00:00Z',
        metadata: {
            similarity: 92,
            icon: 'FileText',
            color: 'blue'
        }
    },
    {
        id: 'kb-004',
        title: 'Doe v. TechGiant (2019)',
        category: 'Precedent',
        summary: 'Settlement reached during discovery. Key leverage was internal email retention policy violation.',
        content: 'Case analysis...',
        tags: ['Discovery', 'Settlement'],
        author: 'Partner',
        last_updated: '2019-09-15T11:00:00Z',
        metadata: {
            similarity: 88,
            icon: 'FileText',
            color: 'blue'
        }
    },
    {
        id: 'kb-005',
        title: 'How do we handle "Service of Process" for international defendants in China?',
        category: 'Q&A',
        summary: 'Asked by James Doe • 2 days ago',
        content: 'Requires compliance with the Hague Convention. Do not attempt direct mail. Use the central authority pathway...',
        tags: ['International', 'Service of Process', 'China'],
        author: 'James Doe',
        last_updated: '2024-02-25T16:00:00Z',
        metadata: {
            isQuestion: true,
            topAnswer: 'Requires compliance with the Hague Convention. Do not attempt direct mail. Use the central authority pathway...'
        }
    }
];
