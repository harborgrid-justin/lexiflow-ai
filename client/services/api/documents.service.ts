// Documents Service
import { LegalDocument } from '../../types';
import { DocumentUploadMetadata } from '../api-error';
import { fetchJson, postJson, putJson, deleteJson, buildQueryString, uploadFile, downloadFile, getDownloadUrl } from '../http-client';

export const documentsService = {
  getAll: (caseId?: string, orgId?: string) =>
    fetchJson<LegalDocument[]>(`/documents${buildQueryString({ caseId, orgId })}`),

  getById: (id: string) =>
    fetchJson<LegalDocument>(`/documents/${id}`),

  getByType: (type: string) =>
    fetchJson<LegalDocument[]>(`/documents/type/${encodeURIComponent(type)}`),

  create: (data: Partial<LegalDocument>) =>
    postJson<LegalDocument>('/documents', data),

  update: (id: string, data: Partial<LegalDocument>) =>
    putJson<LegalDocument>(`/documents/${id}`, data),

  delete: (id: string) =>
    deleteJson(`/documents/${id}`),

  upload: (file: File, metadata?: DocumentUploadMetadata): Promise<LegalDocument> =>
    uploadFile<LegalDocument>('/documents/upload', file, {
      title: metadata?.title || file.name,
      type: metadata?.type || 'General',
      case_id: metadata?.caseId,
      description: metadata?.description,
      tags: metadata?.tags?.join(','),
      classification: metadata?.classification,
    }),

  download: async (id: string): Promise<void> => {
    const { blob, filename } = await downloadFile(`/documents/${id}/download`);

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  getDownloadUrl: (id: string): string => getDownloadUrl('/documents', id),

  getContent: (id: string) =>
    fetchJson<{ content: string; mimeType: string }>(`/documents/${id}/content`),
};
