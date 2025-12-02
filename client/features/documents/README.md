# Document Management System

A comprehensive enterprise-grade document management system for LexiFlow AI that rivals tools like Dropbox, Box, and specialized legal document management solutions.

## Features

### 1. Document Browser
- **Split-pane interface** with folder tree navigation and document list/grid
- **Multiple view modes**: List, Grid, Preview
- **Advanced search** with full-text search and filters:
  - Document type (PDF, DOCX, etc.)
  - Date range
  - Author
  - Tags
  - Classification
- **Drag-and-drop upload** with progress tracking
- **Multi-file selection** and bulk operations
- **Context menu** for quick actions
- **Recent documents** and starred/favorites

### 2. Folder Management
- **Hierarchical folder structure** with unlimited nesting
- **Color-coded folders** for visual organization
- **Drag-and-drop** to move documents
- **Breadcrumb navigation**
- **Folder permissions** (future enhancement)

### 3. Document Viewer
- **Full-featured PDF viewer** (requires pdf.js integration)
- **Page navigation** with thumbnails
- **Zoom controls** (50% - 200%)
- **Rotation** and fit modes
- **Search within document**
- **Print support**
- **Annotation layer** with:
  - Text highlighting
  - Comments and replies
  - Shapes (rectangles, arrows)
  - Sticky notes
  - Drawing tools

### 4. Version Control
- **Automatic version tracking**
- **Version history** with timestamps and authors
- **Compare versions** side-by-side
- **Restore previous versions**
- **Version notes** and summaries

### 5. Sharing & Collaboration
- **Share via link or email**
- **Granular permissions**:
  - View
  - Comment
  - Edit
  - Share with others
- **Password protection**
- **Expiration dates**
- **Download restrictions**

### 6. Document Metadata
- **Custom metadata fields**
- **Tag management** with suggestions
- **Document classification** (Public, Internal, Confidential, Privileged)
- **Status tracking** (Draft, Final, Signed)
- **Custom properties**

### 7. Upload Management
- **Global upload queue**
- **Progress tracking** per file
- **Retry failed uploads**
- **Background upload** support
- **Validation** (file type, size limits)

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **TanStack Query** - Data fetching and caching
- **Lucide React** - Icons
- **Tailwind CSS** - Styling (via existing common components)

## Architecture

```
/features/documents/
├── api/
│   ├── documents.api.ts      # TanStack Query hooks
│   └── documents.types.ts     # TypeScript types
├── components/
│   ├── DocumentCard.tsx       # Grid view card
│   ├── DocumentRow.tsx        # List view row
│   ├── FolderTree.tsx         # Folder navigation
│   ├── UploadDropzone.tsx     # Drag-drop upload
│   ├── UploadManager.tsx      # Global upload queue
│   ├── DocumentPreview.tsx    # Quick preview modal
│   ├── DocumentMetadata.tsx   # Metadata editor
│   ├── VersionHistory.tsx     # Version list
│   ├── AnnotationTools.tsx    # Annotation toolbar
│   ├── ShareDialog.tsx        # Sharing dialog
│   ├── MoveDialog.tsx         # Move to folder
│   ├── NewFolderDialog.tsx    # Create folder
│   └── DocumentTags.tsx       # Tag management
├── pages/
│   ├── DocumentsPage.tsx      # Main document browser
│   └── DocumentViewerPage.tsx # Full document viewer
├── store/
│   └── documents.store.ts     # Global state management
└── index.ts                   # Exports
```

## Usage

### Basic Import

```tsx
import { DocumentsPage, DocumentViewerPage } from '@/features/documents';
```

### Using the Document Browser

```tsx
import { DocumentsPage } from '@/features/documents';

function App() {
  return <DocumentsPage />;
}
```

### Using the Document Viewer

```tsx
import { DocumentViewerPage } from '@/features/documents';

function DocumentView({ documentId }: { documentId: string }) {
  return (
    <DocumentViewerPage
      documentId={documentId}
      onClose={() => navigate('/documents')}
    />
  );
}
```

### Using Individual Components

```tsx
import { DocumentCard, FolderTree, UploadDropzone } from '@/features/documents';

function MyComponent() {
  return (
    <div>
      <FolderTree folders={folders} onFolderSelect={handleSelect} />
      <DocumentCard document={doc} onClick={handleClick} />
      <UploadDropzone onUploadComplete={handleUpload} />
    </div>
  );
}
```

### Using API Hooks

```tsx
import { useDocuments, useUploadDocument } from '@/features/documents';

function MyDocumentList() {
  const { data: documents, isLoading } = useDocuments({
    search: 'contract',
    tags: ['important'],
  });

  const uploadMutation = useUploadDocument();

  const handleUpload = async (file: File) => {
    await uploadMutation.mutateAsync({
      file,
      metadata: { type: 'Contract', tags: ['new'] },
    });
  };

  return (
    <div>
      {documents?.map(doc => (
        <div key={doc.id}>{doc.title}</div>
      ))}
    </div>
  );
}
```

## API Integration

The system expects these backend endpoints:

- `GET /api/documents` - List documents
- `GET /api/documents/:id` - Get document
- `POST /api/documents/upload` - Upload document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents/:id/versions` - Get versions
- `GET /api/documents/:id/annotations` - Get annotations
- `POST /api/documents/:id/annotations` - Add annotation

## Future Enhancements

1. **PDF.js Integration** - Full PDF rendering support
2. **OCR Support** - Extract text from scanned documents
3. **E-signature Integration** - DocuSign, Adobe Sign
4. **AI Features**:
   - Smart tagging
   - Document summarization
   - Content extraction
   - Similar document suggestions
5. **Advanced Search** - Full-text search with Elasticsearch
6. **Folder Permissions** - Role-based access control
7. **Document Templates** - Create from templates
8. **Workflow Automation** - Approval workflows
9. **Mobile App** - React Native mobile app
10. **Desktop App** - Electron desktop app

## Performance Optimizations

- **Virtual scrolling** for large document lists
- **Lazy loading** for thumbnails and previews
- **Optimistic updates** with TanStack Query
- **Request deduplication** and caching
- **Progressive image loading**
- **Web Workers** for PDF rendering
- **Service Worker** for offline support

## Security Considerations

- **End-to-end encryption** for sensitive documents
- **Audit logging** for all document access
- **Watermarking** for protected documents
- **DLP (Data Loss Prevention)** integration
- **Compliance** (GDPR, HIPAA, SOC 2)

## Accessibility

- **Keyboard navigation** support
- **Screen reader** compatible
- **ARIA labels** and landmarks
- **Focus management**
- **Color contrast** compliance

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT
