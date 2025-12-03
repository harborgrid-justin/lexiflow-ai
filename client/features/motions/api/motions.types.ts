import { Motion, MotionType, MotionStatus } from '../../../types';

export interface MotionFilters {
  caseId?: string;
  status?: string;
  type?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateMotionPayload {
  caseId: string;
  title: string;
  type: MotionType;
  status?: MotionStatus;
  filingDate?: string;
  hearingDate?: string;
  outcome?: string;
  documents?: string[];
  assignedAttorney?: string;
  oppositionDueDate?: string;
  replyDueDate?: string;
  description?: string;
}

export interface UpdateMotionPayload extends Partial<CreateMotionPayload> {
  id: string;
}
