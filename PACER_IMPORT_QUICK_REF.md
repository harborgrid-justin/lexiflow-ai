# PACER Import - Quick Reference

## 🎯 Quick Start

### For Users

1. **Navigate**: Go to Cases → Click "Import from PACER"
2. **Paste**: Copy complete PACER docket text and paste
3. **Parse**: Click "Parse Docket" (takes 2-5 seconds)
4. **Review**: Check extracted case info, parties, and docket entries
5. **Import**: Click "Import Case" to create

### Example PACER Text Format

```
Court of Appeals Docket #: 25-1229
Nature of Suit: 3422 Bankruptcy Appeals
Smith v. Jones Corporation
Appeal From: United States District Court...
Presiding Judge: Hon. Jane Doe

JOHN SMITH
     Plaintiff - Appellant
     Email: jsmith@email.com
     [Pro Se]

v.

JONES CORPORATION
     Defendant - Appellee
     Robert Attorney
     Email: ratty@lawfirm.com
     LAW FIRM LLP
     123 Main St

03/12/2025  1  Case docketed
03/28/2025  6  MOTION to Dismiss
```

## 📋 What Gets Imported

| Entity | Data Extracted |
|--------|----------------|
| **Case** | Title, docket #, court, judge, filing date, nature of suit, jurisdiction, status |
| **Parties** | Name, role, type, all counsel with contact info |
| **Motions** | Auto-detected from docket entries with type classification |
| **Documents** | Placeholders for all filings with metadata |

## 🔧 For Developers

### Frontend Files
- `client/components/PacerImportModal.tsx` - Import modal UI
- `client/services/geminiService.ts` - AI parsing logic
- `client/services/api/cases.service.ts` - API calls

### Backend Files
- `server/src/services/pacer-parser.service.ts` - Parsing & entity creation
- `server/src/modules/cases/cases.controller.ts` - Import endpoint
- `server/src/modules/cases/cases.module.ts` - Service registration

### API Endpoint
```typescript
POST /api/v1/cases/import-pacer

Request:
{
  caseInfo: { docketNumber, title, court, ... },
  parties: [{ name, role, type, counsel: [...] }],
  docketEntries: [{ entryNumber, date, description, ... }]
}

Response:
{
  case: Case,
  parties: Party[],
  motions: Motion[],
  documents: Document[]
}
```

### Key Methods

**Frontend:**
```typescript
GeminiService.parseDocket(text: string) → ParsedPacerData
ApiService.cases.importPacer(data) → { case, parties, motions, documents }
```

**Backend:**
```typescript
PacerParserService.createCaseFromPacer(parsedData, orgId, userId)
  → { case, parties, motions, documents }
```

## 🧪 Testing

```bash
# Start services
npm run dev              # Frontend (port 3000)
cd server && npm run start:dev  # Backend (port 3001)

# Test flow
1. Go to http://localhost:3000/cases
2. Click "Import from PACER"
3. Paste sample docket (see above)
4. Verify parsing shows all data
5. Import and check case detail page
```

## ⚡ Motion Auto-Detection

Automatically identifies and creates motions for:
- Motion to Dismiss
- Motion for Summary Judgment
- Motion to Compel Discovery
- Motion in Limine
- Motion for Continuance
- Motion for Sanctions
- Emergency Motions
- Petitions and Applications

## 📊 Data Mapping

### PACER Status → System Status
- `active` → Discovery
- `termed` → Closed
- `pending` → Discovery

### Nature of Suit → Matter Type
- Contains "bankruptcy" → Litigation
- Contains "contract" → Commercial Litigation
- Default → Litigation

### Document Type Classification
Docket entries auto-classified as:
- Motion, Brief, Order, Notice
- Complaint, Answer, Exhibit
- Certificate, Disclosure
- Generic "Filing"

## 🚨 Error Handling

**Invalid PACER Text:**
- Shows user-friendly error message
- Provides example format
- Allows retry without losing data

**Import Failures:**
- Error displayed in modal
- Can go back to edit/retry
- Console logs for debugging

**Validation:**
- Checks for required fields (caseInfo, parties)
- Validates date formats
- Handles missing optional data gracefully

## 🔐 Security Notes

- All parsing done server-side via AI
- User must have PACER access credentials
- No PACER API integration (manual copy/paste)
- Documents are placeholders (no auto-download)
- Requires authentication for import endpoint

## 📝 Future Enhancements

- [ ] Direct PACER API integration
- [ ] Automatic document downloads
- [ ] Periodic docket refresh
- [ ] Calendar event auto-creation
- [ ] Task generation from deadlines
- [ ] Duplicate case detection
- [ ] Batch import support
- [ ] Historical case import

## 🐛 Troubleshooting

**Parsing fails:**
- Check PACER text is complete
- Ensure case title includes "v." or "vs."
- Verify party sections are formatted correctly

**Import fails:**
- Check backend is running
- Verify database connection
- Check browser console for errors
- Check server logs for details

**Missing data:**
- Review preview before import
- AI extracts what's available
- Some fields optional (counsel, dates, etc.)

## 📚 Documentation

- Full feature docs: `/PACER_IMPORT_FEATURE.md`
- Backend structure: `/server/PROJECT_STRUCTURE.md`
- Frontend guide: `/.github/copilot-instructions.md`
