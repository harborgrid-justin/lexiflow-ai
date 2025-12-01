// Document and Evidence Transformers
// Transform ApiDocument, ApiDocumentVersion, ApiEvidence

import { ApiDocument, ApiDocumentVersion, ApiEvidence } from '../../shared-types';
import { LegalDocument, DocumentVersion, EvidenceItem } from '../../types';
import { ensureTagsArray } from './string-utils';

export function transformApiDocumentVersion(apiVersion: ApiDocumentVersion): DocumentVersion {
  return {
    id: apiVersion.id,
    documentId: apiVersion.document_id,
    versionNumber: apiVersion.version_number,
    uploadDate: typeof apiVersion.upload_date === 'string'
      ? apiVersion.upload_date
      : apiVersion.upload_date?.toISOString(),
    uploadedBy: apiVersion.uploaded_by,
    summary: apiVersion.summary,
    contentSnapshot: apiVersion.content_snapshot,
    filePath: apiVersion.file_path,
    fileSize: apiVersion.file_size,
    createdAt: typeof apiVersion.created_at === 'string'
      ? apiVersion.created_at
      : apiVersion.created_at?.toISOString(),
    updatedAt: typeof apiVersion.updated_at === 'string'
      ? apiVersion.updated_at
      : apiVersion.updated_at?.toISOString(),
  };
}

export function transformApiDocument(apiDoc: ApiDocument): LegalDocument {
  return {
    id: apiDoc.id,
    caseId: apiDoc.case_id,
    title: apiDoc.title,
    filename: apiDoc.filename,
    type: apiDoc.type,
    content: apiDoc.content,
    uploadDate: typeof apiDoc.upload_date === 'string'
      ? apiDoc.upload_date
      : apiDoc.upload_date?.toISOString() || (typeof apiDoc.created_at === 'string'
        ? apiDoc.created_at
        : apiDoc.created_at?.toISOString()),
    summary: apiDoc.summary,
    description: apiDoc.description,
    riskScore: apiDoc.risk_score,
    tags: ensureTagsArray(apiDoc.tags),
    versions: apiDoc.versions?.map(transformApiDocumentVersion),
    lastModified: typeof apiDoc.last_modified === 'string'
      ? apiDoc.last_modified
      : apiDoc.last_modified?.toISOString() || (typeof apiDoc.updated_at === 'string'
        ? apiDoc.updated_at
        : apiDoc.updated_at?.toISOString()),
    filePath: apiDoc.file_path,
    mimeType: apiDoc.mime_type,
    version: apiDoc.version,
    versionNotes: apiDoc.version_notes,
    classification: apiDoc.classification,
    sourceModule: apiDoc.source_module,
    status: apiDoc.status,
    isEncrypted: apiDoc.is_encrypted,
    sharedWithClient: apiDoc.shared_with_client,
    fileSize: apiDoc.file_size,
    uploadedBy: apiDoc.uploaded_by,
    createdBy: apiDoc.created_by,
    modifiedBy: apiDoc.modified_by,
    ownerOrgId: apiDoc.owner_org_id,
    createdAt: typeof apiDoc.created_at === 'string'
      ? apiDoc.created_at
      : apiDoc.created_at?.toISOString(),
    updatedAt: typeof apiDoc.updated_at === 'string'
      ? apiDoc.updated_at
      : apiDoc.updated_at?.toISOString(),
  };
}

export function transformApiEvidence(apiEvidence: ApiEvidence): EvidenceItem {
  let custodianName = '';
  if (apiEvidence.custodian && typeof apiEvidence.custodian === 'object') {
    custodianName = apiEvidence.custodian.name ||
      `${apiEvidence.custodian.first_name || ''} ${apiEvidence.custodian.last_name || ''}`.trim();
  } else if (typeof apiEvidence.collected_by === 'string') {
    custodianName = apiEvidence.collected_by;
  }

  const collectedBy = apiEvidence.collected_by || custodianName;

  return {
    id: apiEvidence.id,
    trackingUuid: apiEvidence.tracking_uuid || apiEvidence.id,
    blockchainHash: apiEvidence.blockchain_hash,
    caseId: apiEvidence.case_id || '',
    title: apiEvidence.title,
    type: apiEvidence.type as any,
    fileType: apiEvidence.file_type,
    fileSize: apiEvidence.file_size,
    description: apiEvidence.description || '',
    collectionDate: typeof apiEvidence.collected_date === 'string'
      ? apiEvidence.collected_date
      : apiEvidence.collected_date?.toISOString() || '',
    collectedBy: collectedBy,
    collectedByUserId: apiEvidence.collected_by_user_id || apiEvidence.custodian_id,
    custodian: custodianName,
    location: apiEvidence.location || '',
    admissibility: (apiEvidence.admissibility_status as any) || 'Pending',
    chainOfCustody: (apiEvidence.chainOfCustody || []).map(event => ({
      id: event.id,
      date: typeof event.timestamp === 'string' ? event.timestamp : event.timestamp?.toISOString() || '',
      action: event.action,
      actor: event.actor,
      notes: event.notes,
    })),
    tags: ensureTagsArray(apiEvidence.tags),
  };
}
