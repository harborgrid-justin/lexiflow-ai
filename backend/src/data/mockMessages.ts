
import { Conversation } from '../types';

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1', name: 'Sarah Jenkins', role: 'Paralegal', isExternal: false, unread: 2, status: 'online',
    messages: [
      { id: 'm1', senderId: 'other', text: 'Good morning! Did you see the new discovery request?', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'read' },
      { id: 'm2', senderId: 'me', text: 'Yes, reviewing it now. We need to collect those logs.', timestamp: new Date(Date.now() - 3500000).toISOString(), status: 'read' },
      { id: 'm3', senderId: 'other', text: 'I have uploaded the new evidence files to the vault.', timestamp: new Date(Date.now() - 900000).toISOString(), status: 'read', attachments: [{ name: 'Server_Logs.zip', type: 'doc', size: '45MB' }] }
    ]
  },
  {
    id: 'c2', name: 'John Doe', role: 'Client (TechCorp)', isExternal: true, unread: 0, status: 'offline',
    messages: [
      { id: 'm1', senderId: 'me', text: 'Please review the attached settlement draft.', timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'read', isPrivileged: true },
      { id: 'm2', senderId: 'other', text: 'Can we reschedule our call to 3 PM?', timestamp: new Date(Date.now() - 82800000).toISOString(), status: 'read' }
    ]
  },
  {
    id: 'c3', name: 'Morgan & Morgan', role: 'Opposing Counsel', isExternal: true, unread: 0, status: 'online',
    messages: [
       { id: 'm1', senderId: 'other', text: 'We are filing for an extension.', timestamp: new Date(Date.now() - 172800000).toISOString(), status: 'read' }
    ]
  }
];
