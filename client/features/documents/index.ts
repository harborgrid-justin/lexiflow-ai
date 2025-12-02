/**
 * Document Management System - Exports
 * Centralized exports for easy importing
 */

// API & Types
export * from './api/documents.api';
export * from './api/documents.types';

// Pages
export { DocumentsPage } from './pages/DocumentsPage';
export { DocumentViewerPage } from './pages/DocumentViewerPage';

// Core Components
export { DocumentCard } from './components/DocumentCard';
export { DocumentRow } from './components/DocumentRow';
export { FolderTree } from './components/FolderTree';

// Upload Components
export { UploadDropzone } from './components/UploadDropzone';
export { UploadManager } from './components/UploadManager';

// Management Components
export { DocumentPreview } from './components/DocumentPreview';
export { DocumentMetadata } from './components/DocumentMetadata';
export { VersionHistory } from './components/VersionHistory';
export { AnnotationTools } from './components/AnnotationTools';
export { ShareDialog } from './components/ShareDialog';
export { MoveDialog } from './components/MoveDialog';
export { NewFolderDialog } from './components/NewFolderDialog';
export { DocumentTags } from './components/DocumentTags';

// Store
export * from './store/documents.store';
