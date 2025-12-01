# PACER Docket Import Feature

## Overview

The LexiFlow AI platform now supports automatic case creation from PACER court dockets. Users can paste complete PACER docket text, and the system will intelligently parse and extract:

- ✅ Case information (docket numbers, court, judges, nature of suit)
- ✅ All parties with complete counsel information (names, firms, contact details)
- ✅ Docket entries with dates, descriptions, and filing details
- ✅ Consolidated case relationships
- ✅ Deadlines and important dates
- ✅ Motions automatically identified from docket entries
- ✅ Document placeholders for all filings

## Features

### 1. **AI-Powered Parsing**
Uses OpenAI GPT-4o-mini to intelligently extract structured data from free-form PACER text. Handles:
- Multiple date formats (MM/DD/YYYY, ISO)
- Complex party structures with multiple counsel
- Nested case relationships (lead/member consolidated cases)
- Various docket entry types (motions, orders, briefs, notices)

### 2. **Comprehensive Data Extraction**

#### Case Information
- Docket number and originating case number
- Full case title
- Court name and jurisdiction
- Nature of suit
- Filing dates and key milestones
- Presiding and ordering judges
- Case status

#### Parties & Counsel
- Party names with roles (Plaintiff, Defendant, Appellant, Appellee, etc.)
- Party types (Individual, Corporation, Government)
- Complete counsel information:
  - Attorney names
  - Law firm names
  - Email addresses and phone numbers
  - Representation status (Retained, Pro Se, etc.)
  - Office addresses

#### Docket Entries
- Entry numbers
- Filing dates
- Full descriptions
- Page counts and file sizes
- Automatic motion detection

### 3. **Preview Before Import**
Users can review all extracted information before creating the case:
- Case details summary
- All parties with their counsel
- Docket entries (first 10 shown with scroll for more)
- Consolidated cases
- Visual confirmation with color-coded sections

### 4. **Automatic Entity Creation**
Upon import, the system creates:
- **Case record** with all metadata
- **Party records** for all parties (linked to case)
- **Motion records** for identified motions
- **Document placeholders** for all filings

## User Flow

### Step 1: Access Import Feature
From the Case Management view, click **"Import from PACER"** button in the header.

### Step 2: Paste PACER Text
Copy complete docket text from PACER and paste into the text area. Example:

```
Court of Appeals Docket #: 25-1229
Docketed: 03/12/2025
Termed: 09/29/2025
Nature of Suit: 3422 Bankruptcy Appeals Rule 28 USC 158
Justin Saadein-Morales v. Westridge Swim & Racquet Club, Inc.
Appeal From: United States District Court for the Eastern District of Virginia
...
```

### Step 3: AI Parsing
Click **"Parse Docket"** - the AI processes the text and extracts structured data (typically 2-5 seconds).

### Step 4: Review Extracted Data
Review the parsed information:
- Case details
- All parties and their attorneys
- Docket entries summary
- Any consolidated cases

### Step 5: Import
Click **"Import Case"** to create the case and all related entities in the system.

### Step 6: Navigate to Case
System automatically navigates to the newly created case detail view.

## Technical Implementation

### Frontend Components

#### `PacerImportModal.tsx`
Modal component with two-step wizard:
1. **Input step**: Textarea for pasting docket text
2. **Preview step**: Structured display of parsed data with import confirmation

**Key Features:**
- Error handling with user-friendly messages
- Loading states during parsing and import
- Responsive layout with scrollable sections
- Color-coded success/error alerts

#### `GeminiService.parseDocket()`
Enhanced AI parsing method that:
- Accepts raw PACER text
- Sends to OpenAI with detailed parsing instructions
- Returns structured JSON with all extracted data
- Validates response structure

**Updated Response Schema:**
```typescript
{
  caseInfo: {
    docketNumber: string;
    originatingCaseNumber: string;
    title: string;
    court: string;
    jurisdiction: string;
    natureOfSuit: string;
    filingDate: string;
    presidingJudge: string;
    orderingJudge?: string;
    status: string;
  };
  parties: Array<{
    name: string;
    role: string;
    type: 'Individual' | 'Corporation';
    contact: string;
    counsel: Array<{
      name: string;
      firm: string;
      email: string;
      phone: string;
      status: string;
      address: string;
    }>;
  }>;
  docketEntries: Array<{
    entryNumber: number;
    date: string;
    description: string;
    pages?: number;
    fileSize?: string;
  }>;
  consolidatedCases?: Array<{
    caseNumber: string;
    relationship: 'Lead' | 'Member';
    startDate: string;
    endDate?: string;
  }>;
  deadlines?: Array<{
    date: string;
    title: string;
    type: string;
  }>;
}
```

#### `ApiService.cases.importPacer()`
New API service method that:
- Sends parsed data to backend
- Receives created case with all entities
- Transforms API response to frontend types

### Backend Services

#### `PacerParserService` (`server/src/services/pacer-parser.service.ts`)
Core parsing and entity creation service with methods:

**`createCaseFromPacer(parsedData, ownerOrgId, createdBy)`**
- Creates case record
- Creates all party records
- Identifies and creates motion records
- Creates document placeholders
- Returns complete case with all entities

**Helper Methods:**
- `extractClientName()` - Extracts client from case title
- `mapPacerStatusToCaseStatus()` - Maps PACER status to system status
- `extractMatterType()` - Determines matter type from nature of suit
- `parseDate()` - Handles multiple date formats
- `formatCounselInfo()` - Formats counsel data for storage
- `isMotionEntry()` - Identifies motion-type docket entries
- `extractMotionType()` - Classifies motion types
- `extractDocumentType()` - Classifies document types

### Backend Controller

#### `CasesController.importFromPacer()`
POST endpoint at `/api/v1/cases/import-pacer` that:
- Accepts parsed PACER data
- Validates structure
- Calls PacerParserService to create entities
- Returns created case with parties, motions, documents

**Response:**
```typescript
{
  case: Case;
  parties: Party[];
  motions: Motion[];
  documents: Document[];
}
```

## Data Models

### Case Model
All standard case fields populated from PACER data:
- `title` - Full case title
- `client_name` - Extracted from case title
- `status` - Mapped from PACER status
- `filing_date` - Case filing date
- `description` - Nature of suit + docket number
- `matter_type` - Extracted from nature of suit
- `jurisdiction` - Court jurisdiction
- `court` - Full court name
- `judge` - Presiding judge name
- `owner_org_id` - Organization ID
- `created_by` - User who imported

### Party Model
Supports complete party and counsel data:
- `name` - Party name
- `role` - Role in case (e.g., "Debtor - Appellant")
- `type` - Individual, Corporation, Government
- `contact` - Email or phone
- `counsel` - Formatted string with all attorney info
- `case_id` - Foreign key to case

### Motion Model
Auto-created for motion-type docket entries:
- `case_id` - Foreign key to case
- `title` - Motion description
- `motion_type` - Classified type (dismiss, summary_judgment, etc.)
- `status` - Set to 'filed'
- `filing_date` - From docket entry date
- `description` - Full docket entry text

### Document Model
Placeholders for all filings:
- `case_id` - Foreign key to case
- `title` - "Docket Entry X: [description]"
- `filename` - "docket_X.pdf"
- `type` - Classified (Motion, Brief, Order, etc.)
- `status` - Set to 'final'
- `source_module` - Set to 'General'
- `description` - Full docket entry text

## Example PACER Input

```
Court of Appeals Docket #: 25-1229	Docketed: 03/12/2025
Termed: 09/29/2025
Nature of Suit: 3422 Bankruptcy Appeals Rule 28 USC 158
Justin Saadein-Morales v. Westridge Swim & Racquet Club, Inc.
Appeal From: United States District Court for the Eastern District of Virginia at Alexandria
Fee Status: fee paid

Originating Court Information:
     District: 0422-1 : 1:24-cv-01442-LMB-IDD
     Presiding Judge: Leonie M. Brinkema, U. S. District Court Judge
     Ordering Judge: Ivan Darnell Davis, U. S. Magistrate Judge
     Date Filed: 08/16/2024

JUSTIN JEFFREY SAADEIN-MORALES
                     Debtor - Appellant	
     Justin Jeffrey Saadein-Morales
     Direct: 678-650-6400
     Email: justin.saadein@harborgrid.com
     [NTC Pro Se]
     P. O. Box 55268
     Washington, DC 20040

v.

WESTRIDGE SWIM & RACQUET CLUB, INC., A Community Association
                     Creditor - Appellee	
     Thomas Charles Junker
     Direct: 703-837-5000
     Email: thomas.junker@mercertrigiani.com
     [COR NTC Retained]
     MERCERTRIGIANI
     112 South Alfred Street
     Alexandria, VA 22314

03/12/2025	  1 
1 pg, 60.43 KB	Case docketed. [25-1229]

03/28/2025	  6 
12 pg, 784.43 KB	MOTION by Justin Jeffrey Saadein-Morales to GRANT Summary Reversal
```

## Example Output

### Created Case
```json
{
  "id": "case-uuid-123",
  "title": "Justin Saadein-Morales v. Westridge Swim & Racquet Club, Inc.",
  "client_name": "Justin Saadein-Morales",
  "status": "Closed",
  "filing_date": "2024-08-16T00:00:00Z",
  "description": "3422 Bankruptcy Appeals Rule 28 USC 158 - Court Docket #25-1229",
  "matter_type": "Litigation",
  "jurisdiction": "Federal",
  "court": "United States District Court for the Eastern District of Virginia at Alexandria",
  "judge": "Leonie M. Brinkema, U. S. District Court Judge"
}
```

### Created Parties (2)
```json
[
  {
    "name": "Justin Jeffrey Saadein-Morales",
    "role": "Debtor - Appellant",
    "type": "Individual",
    "contact": "justin.saadein@harborgrid.com",
    "counsel": "Justin Jeffrey Saadein-Morales - justin.saadein@harborgrid.com [NTC Pro Se]"
  },
  {
    "name": "Westridge Swim & Racquet Club, Inc.",
    "role": "Creditor - Appellee",
    "type": "Corporation",
    "contact": "thomas.junker@mercertrigiani.com",
    "counsel": "Thomas Charles Junker (MERCERTRIGIANI) - thomas.junker@mercertrigiani.com [COR NTC Retained]"
  }
]
```

### Created Motions (1)
```json
[
  {
    "title": "MOTION by Justin Jeffrey Saadein-Morales to GRANT Summary Reversal",
    "motion_type": "summary_reversal",
    "status": "filed",
    "filing_date": "03/28/2025"
  }
]
```

## Files Modified/Created

### Frontend
- ✅ `client/services/geminiService.ts` - Enhanced parseDocket method
- ✅ `client/services/api/cases.service.ts` - Added importPacer method
- ✅ `client/components/PacerImportModal.tsx` - NEW: Import modal component
- ✅ `client/components/CaseList.tsx` - Added import button and modal integration

### Backend
- ✅ `server/src/services/pacer-parser.service.ts` - NEW: PACER parsing service
- ✅ `server/src/modules/cases/cases.controller.ts` - Added import-pacer endpoint
- ✅ `server/src/modules/cases/cases.module.ts` - Registered PacerParserService

### Models (Already Existed - No Changes Needed)
- ✅ `server/src/models/case.model.ts` - Supports all PACER fields
- ✅ `server/src/models/party.model.ts` - Supports parties and counsel
- ✅ `server/src/models/motion.model.ts` - Supports motion data
- ✅ `server/src/models/document.model.ts` - Supports document metadata

### Types (Already Existed - No Changes Needed)
- ✅ `client/types.ts` - Has Party, Motion, Document interfaces
- ✅ `client/shared-types/` - API types already support all fields

## Testing the Feature

1. **Start the application:**
   ```bash
   # Terminal 1: Frontend
   npm run dev
   
   # Terminal 2: Backend
   cd server
   npm run start:dev
   ```

2. **Navigate to Case Management:**
   - Click "Cases" in sidebar
   - Click "Import from PACER" button

3. **Paste sample PACER docket:**
   - Use the example provided above
   - Or paste any real PACER docket text

4. **Verify parsing:**
   - All case fields extracted correctly
   - All parties with counsel shown
   - Docket entries listed
   - No errors in console

5. **Import case:**
   - Click "Import Case"
   - System should navigate to new case
   - Verify case detail page shows all data

## Future Enhancements

### Potential Improvements
1. **Document Download**: Fetch actual documents from PACER
2. **Docket Tracking**: Auto-refresh from PACER for updates
3. **Calendar Integration**: Auto-create events for deadlines
4. **Task Creation**: Generate tasks from docket deadlines
5. **Duplicate Detection**: Check for existing cases before import
6. **Batch Import**: Import multiple cases at once
7. **Template Mapping**: Map PACER data to custom workflows
8. **Historical Data**: Import complete case history from closed cases

### Known Limitations
- Requires manual copy/paste (no direct PACER API integration)
- Document files are placeholders (actual PDFs not downloaded)
- No automatic updates after initial import
- User must have PACER credentials to access docket text

## API Documentation

### Endpoint: `POST /api/v1/cases/import-pacer`

**Request Body:**
```typescript
{
  caseInfo: PacerCaseInfo;
  parties: PacerParty[];
  docketEntries: PacerDocketEntry[];
  consolidatedCases?: PacerConsolidatedCase[];
  deadlines?: PacerDeadline[];
}
```

**Response:**
```typescript
{
  case: Case;
  parties: Party[];
  motions: Motion[];
  documents: Document[];
}
```

**Status Codes:**
- `201 Created` - Case imported successfully
- `400 Bad Request` - Invalid PACER data structure
- `500 Internal Server Error` - Server error during import

## Conclusion

The PACER import feature provides a seamless way to create comprehensive case records from court dockets. The AI-powered parsing handles the complexity of free-form PACER text, while the structured preview ensures accuracy before import. All data models were already in place - this feature simply adds the capability to auto-populate them from PACER sources.
