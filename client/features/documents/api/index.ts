/**
 * Documents API Exports
 *
 * Re-exports all document management API hooks and types for clean imports.
 */

// Types
export * from './documents.types';

// Document API Hooks
export {
  documentKeys,
  useDocuments,
  useDocument,
  useDocumentVersions,
  useDocumentAnnotations,
  useDocumentStats,
  useDocumentActivity,
  useFolders,
  useUploadDocument,
  useUpdateDocument,
  useDeleteDocument,
  useMoveDocument,
  useShareDocument,
  useAddAnnotation,
  useUpdateAnnotation,
  useDeleteAnnotation,
  useCreateFolder,
  useDeleteFolder,
} from './documents.api';
