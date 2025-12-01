// Messaging Types
// API response types for conversations and messages

import { ApiUser } from './core-entities';

export interface ApiConversation {
  id: string;
  title?: string;
  participants?: string[];
  last_message?: string;
  last_message_at?: Date | string;
  is_encrypted?: boolean;
  case_id?: string;
  created_at: Date | string;
  updated_at: Date | string;
}

export interface ApiMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  sent_at: Date | string;
  read_at?: Date | string;
  is_encrypted?: boolean;
  attachments?: Array<{
    id: string;
    filename: string;
    file_path: string;
    file_size: number;
    mime_type: string;
  }>;
  created_at: Date | string;
  updated_at: Date | string;
  sender?: ApiUser;
}
