# Document Management System - Quick Start Guide

## Installation Complete!

The Document Management System has been successfully created at `/client/features/documents/`.

## File Structure

```
/client/features/documents/
├── api/
│   ├── documents.api.ts      ✓ TanStack Query hooks for all document operations
│   └── documents.types.ts    ✓ TypeScript interfaces and types
│
├── components/
│   ├── AnnotationTools.tsx   ✓ Annotation toolbar with drawing tools
│   ├── DocumentCard.tsx      ✓ Grid view card with thumbnail
│   ├── DocumentMetadata.tsx  ✓ Metadata editor
│   ├── DocumentPreview.tsx   ✓ Quick preview modal
│   ├── DocumentRow.tsx       ✓ List view row
│   ├── DocumentTags.tsx      ✓ Tag management interface
│   ├── FolderTree.tsx        ✓ Hierarchical folder navigation
│   ├── MoveDialog.tsx        ✓ Move documents to folders
│   ├── NewFolderDialog.tsx   ✓ Create new folders
│   ├── ShareDialog.tsx       ✓ Share with permissions
│   ├── UploadDropzone.tsx    ✓ Drag-drop file upload
│   ├── UploadManager.tsx     ✓ Global upload queue manager
│   └── VersionHistory.tsx    ✓ Version history with compare
│
├── pages/
│   ├── DocumentsPage.tsx     ✓ Main document browser (split-pane)
│   └── DocumentViewerPage.tsx ✓ Full document viewer with annotations
│
├── store/
│   └── documents.store.ts    ✓ Global state management
│
├── index.ts                  ✓ Centralized exports
├── README.md                 ✓ Full documentation
└── QUICKSTART.md            ✓ This file
```

## Next Steps

### 1. Add to Routing

Add the document pages to your routing configuration:

```tsx
// In your App.tsx or router configuration
import { DocumentsPage, DocumentViewerPage } from './features/documents';

// Add routes
<Route path="/documents" element={<DocumentsPage />} />
<Route path="/documents/:id/view" element={<DocumentViewerPage />} />
```

### 2. Add to Navigation

Update your sidebar/navigation to include the documents link:

```tsx
import { FileText } from 'lucide-react';

// In your Sidebar component
<NavLink to="/documents">
  <FileText className="h-5 w-5" />
  Documents
</NavLink>
```

### 3. Backend Integration

Ensure your backend has these endpoints:

```
GET    /api/documents              - List documents
GET    /api/documents/:id          - Get single document
POST   /api/documents/upload       - Upload document
PUT    /api/documents/:id          - Update document
DELETE /api/documents/:id          - Delete document
GET    /api/documents/:id/versions - Get version history
GET    /api/documents/:id/annotations - Get annotations
POST   /api/documents/:id/annotations - Add annotation
GET    /api/documents/:id/download - Download document
```

### 4. PDF Support (Optional but Recommended)

For full PDF rendering, install pdf.js:

```bash
npm install pdfjs-dist
npm install --save-dev @types/pdfjs-dist
```

Then integrate into DocumentViewerPage.tsx:

```tsx
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Load PDF
const loadingTask = pdfjsLib.getDocument(documentUrl);
const pdf = await loadingTask.promise;
```

### 5. Test the System

1. Navigate to `/documents`
2. Create a folder
3. Upload a document
4. Click to preview
5. Open in full viewer
6. Add annotations
7. Share the document

## Key Features Implemented

✅ **Document Browser** with split-pane interface
✅ **Folder Management** with hierarchical tree
✅ **Upload System** with drag-drop and progress tracking
✅ **Document Viewer** with annotation support
✅ **Version Control** with history and restore
✅ **Sharing** with permissions and expiration
✅ **Metadata Management** with tags and classification
✅ **Search & Filters** for advanced queries
✅ **Multi-select** and bulk operations
✅ **View Modes**: List, Grid, Preview

## API Hooks Usage Examples

### Fetch Documents
```tsx
const { data: documents } = useDocuments({
  search: 'contract',
  tags: ['important'],
  caseId: '123',
});
```

### Upload Document
```tsx
const uploadMutation = useUploadDocument();

await uploadMutation.mutateAsync({
  file: selectedFile,
  metadata: {
    title: 'My Document',
    type: 'Contract',
    tags: ['important', 'reviewed'],
  },
});
```

### Get Document Details
```tsx
const { data: document } = useDocument(documentId);
```

### Delete Document
```tsx
const deleteMutation = useDeleteDocument();
await deleteMutation.mutateAsync(documentId);
```

## Component Usage Examples

### Standalone Upload
```tsx
<UploadDropzone
  onUploadComplete={(id) => console.log('Uploaded:', id)}
  metadata={{ caseId: '123' }}
  maxSize={100 * 1024 * 1024} // 100MB
  accept=".pdf,.doc,.docx"
/>
```

### Folder Tree
```tsx
<FolderTree
  folders={folders}
  selectedFolderId={currentFolder}
  onFolderSelect={handleFolderSelect}
  onCreateFolder={handleCreateFolder}
/>
```

### Document Card
```tsx
<DocumentCard
  document={doc}
  selected={isSelected}
  onSelect={handleSelect}
  onClick={handleClick}
  onDownload={handleDownload}
/>
```

## Customization

### Styling
All components use Tailwind CSS classes. Customize by modifying the className props or updating your Tailwind config.

### API Endpoints
Update endpoint URLs in `api/documents.api.ts` to match your backend.

### File Types
Modify accepted file types in upload components by changing the `accept` prop.

### Permissions
Extend `SharePermissions` type in `documents.types.ts` for custom permissions.

## Troubleshooting

### Issue: Documents not loading
- Check that API endpoints are correct
- Verify backend CORS configuration
- Check browser console for errors

### Issue: Upload fails
- Verify file size limits
- Check accepted file types
- Ensure backend endpoint is working

### Issue: PDF not rendering
- Install and configure pdf.js (see step 4 above)
- Check browser compatibility
- Verify PDF file is valid

## Performance Tips

1. **Lazy load thumbnails** for large document lists
2. **Implement virtual scrolling** for 1000+ documents
3. **Use Web Workers** for PDF processing
4. **Enable service worker** for offline support
5. **Optimize images** and thumbnails

## Support

For issues or questions:
1. Check the README.md for full documentation
2. Review the component source code
3. Check the browser console for errors
4. Verify API responses

## What's Next?

Consider these enhancements:
- OCR support for scanned documents
- E-signature integration (DocuSign, Adobe Sign)
- AI-powered document analysis
- Mobile app (React Native)
- Desktop app (Electron)
- Advanced search with Elasticsearch
- Workflow automation
- Template management

---

**Congratulations! Your enterprise document management system is ready to use!** 🎉
