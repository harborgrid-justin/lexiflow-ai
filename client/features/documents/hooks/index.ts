/**
 * Documents Hooks Exports
 */

export {
  useDocumentManager,
  useDocumentDetail,
  useDocumentUpload,
} from './useDocuments';

// Re-export types
export type { LegalDocument, DocumentFilters, Folder, Annotation } from './useDocuments';
