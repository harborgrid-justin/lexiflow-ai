// Litigation Transformers
// Transform ApiMotion, ApiDiscovery

import { ApiMotion, ApiDiscovery } from '../../shared-types';
import { Motion, DiscoveryRequest } from '../../types';

export function transformApiMotion(apiMotion: ApiMotion): Motion {
  return {
    id: apiMotion.id,
    caseId: apiMotion.case_id,
    title: apiMotion.title,
    type: apiMotion.motion_type as any,
    status: apiMotion.status as any,
    filingDate: typeof apiMotion.filed_date === 'string' ? apiMotion.filed_date : apiMotion.filed_date?.toISOString(),
    hearingDate: typeof apiMotion.hearing_date === 'string' ? apiMotion.hearing_date : apiMotion.hearing_date?.toISOString(),
    outcome: apiMotion.outcome,
    assignedAttorney: apiMotion.filed_by,
    createdBy: apiMotion.filed_by,
  };
}

export function transformApiDiscovery(apiDiscovery: ApiDiscovery): DiscoveryRequest {
  return {
    id: apiDiscovery.id,
    caseId: apiDiscovery.case_id,
    type: apiDiscovery.discovery_type as any,
    propoundingParty: apiDiscovery.propounding_party || 'Us',
    respondingParty: apiDiscovery.responding_party,
    serviceDate: typeof apiDiscovery.served_date === 'string' ? apiDiscovery.served_date : apiDiscovery.served_date?.toISOString() || '',
    dueDate: typeof apiDiscovery.due_date === 'string' ? apiDiscovery.due_date : apiDiscovery.due_date?.toISOString() || '',
    status: apiDiscovery.status as any,
    title: apiDiscovery.title,
    description: apiDiscovery.description || '',
    responsePreview: apiDiscovery.response_summary,
  };
}
