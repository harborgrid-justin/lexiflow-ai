# LexiFlow AI Backend - Project Structure

## 📁 Directory Overview

```
nestjs/
├── src/
│   ├── models/                    # Sequelize models (22 total)
│   │   ├── index.ts               # Model exports
│   │   ├── organization.model.ts  # Organizations
│   │   ├── user.model.ts          # Users
│   │   ├── case.model.ts          # Legal cases
│   │   ├── document.model.ts      # Documents
│   │   ├── evidence.model.ts      # Evidence management
│   │   ├── message.model.ts       # Secure messaging
│   │   ├── workflow.model.ts      # Workflow management
│   │   ├── motion.model.ts        # Legal motions
│   │   ├── billing.model.ts       # Time tracking & billing
│   │   ├── discovery.model.ts     # Discovery requests
│   │   ├── client.model.ts        # Client management
│   │   ├── analytics.model.ts     # Analytics & insights
│   │   ├── compliance.model.ts    # Compliance records
│   │   ├── knowledge.model.ts     # Knowledge base
│   │   ├── jurisdiction.model.ts  # Jurisdictions
│   │   ├── calendar.model.ts      # Calendar events
│   │   ├── task.model.ts          # Task management
│   │   ├── clause.model.ts        # Clause library
│   │   ├── document-embedding.model.ts  # AI: Document vectors
│   │   ├── legal-citation.model.ts      # AI: Legal citations
│   │   ├── document-analysis.model.ts   # AI: Document analysis
│   │   └── search-query.model.ts        # AI: Search analytics
│   │
│   ├── modules/                   # Feature modules (20 total)
│   │   ├── index.ts               # Module exports
│   │   ├── auth/                  # Authentication
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── current-user.decorator.ts
│   │   ├── organizations/         # Organization management
│   │   ├── users/                 # User management
│   │   ├── cases/                 # Case management
│   │   ├── documents/             # Document management
│   │   ├── evidence/              # Evidence handling
│   │   ├── messages/              # Secure messaging
│   │   ├── workflow/              # Workflow automation
│   │   ├── motions/               # Motion management
│   │   ├── billing/               # Time & billing
│   │   ├── discovery/             # Discovery management
│   │   ├── clients/               # Client management
│   │   ├── analytics/             # Analytics & reporting
│   │   ├── compliance/            # Compliance tracking
│   │   ├── knowledge/             # Knowledge base
│   │   ├── jurisdictions/         # Jurisdiction management
│   │   ├── calendar/              # Calendar & scheduling
│   │   ├── tasks/                 # Task management
│   │   ├── clauses/               # Clause library
│   │   └── search/                # AI-powered search
│   │       ├── search.module.ts
│   │       ├── search.controller.ts
│   │       └── search.service.ts
│   │
│   ├── services/                  # Global services
│   │   ├── index.ts               # Service exports
│   │   └── vector-search.service.ts  # Vector similarity search
│   │
│   ├── database/                  # Database management
│   │   ├── README.md              # Setup documentation
│   │   ├── migrations/            # Schema migrations
│   │   │   ├── 000_enable_extensions.sql
│   │   │   ├── 001_initial_schema.sql
│   │   │   └── 002_create_indexes.sql
│   │   ├── seeders/               # Sample data
│   │   │   └── 003_sample_data.sql
│   │   └── scripts/               # Setup scripts
│   │       ├── setup_database.sh      # Linux/macOS
│   │       └── setup_database.ps1     # Windows
│   │
│   ├── app.module.ts              # Main application module
│   ├── main.ts                    # Application bootstrap
│   └── index.ts                   # Main exports
│
├── test/                          # Test files
├── dist/                          # Compiled JavaScript
├── package.json                   # Dependencies & scripts
├── .env.example                   # Environment template
├── .env                          # Environment variables
├── tsconfig.json                 # TypeScript configuration
├── nest-cli.json                 # Nest CLI configuration
└── README.md                     # Project documentation
```

## 🏗️ Architecture Overview

### Models Layer (22 Models)
- **Core Business Models**: Organization, User, Case, Document, Evidence
- **Workflow Models**: WorkflowStage, WorkflowTask, Motion, Task
- **Communication**: Conversation, Message
- **Management**: Client, TimeEntry, DiscoveryRequest, CalendarEvent
- **Knowledge**: KnowledgeArticle, Clause, Jurisdiction
- **Analytics**: Analytics, ComplianceRecord
- **AI-Powered Models**: DocumentEmbedding, LegalCitation, DocumentAnalysis, SearchQuery

### Modules Layer (20 Modules)
Each module follows NestJS best practices:
- **Controller**: HTTP endpoint handlers
- **Service**: Business logic implementation
- **Module**: Dependency injection configuration

### Services Layer
- **VectorSearchService**: Semantic and hybrid search using pgvector
- **AuthService**: JWT authentication and authorization
- **Individual Services**: One per module for business logic

### Database Layer
- **PostgreSQL** with **pgvector** extension for vector similarity search
- **Comprehensive indexing** (150+ indexes) for performance
- **Migration system** for schema management
- **Seeder system** for sample data

## 🔧 Technology Stack

### Core Framework
- **NestJS 10+**: Progressive Node.js framework
- **TypeScript**: Type-safe development
- **Express**: HTTP server foundation

### Database
- **PostgreSQL 14+**: Primary database
- **pgvector**: Vector similarity search
- **Sequelize**: ORM with TypeScript support

### Authentication
- **JWT**: Token-based authentication
- **Passport**: Authentication middleware
- **bcrypt**: Password hashing

### Documentation
- **Swagger/OpenAPI**: Comprehensive API documentation
- **Class Validators**: Request validation
- **Class Transformers**: Data transformation

### AI/ML Features
- **Vector Embeddings**: Document semantic search
- **OpenAI Integration**: Text embeddings (ada-002)
- **Legal Citation Extraction**: Pattern matching
- **Document Analysis**: Automated content analysis

## 🚀 Key Features

### Legal Management
- **Case Management**: Complete litigation lifecycle
- **Document Management**: Version control, classification
- **Evidence Tracking**: Chain of custody
- **Workflow Automation**: Customizable processes
- **Time & Billing**: Comprehensive tracking
- **Calendar Integration**: Deadlines and hearings

### AI-Powered Features
- **Semantic Search**: Find documents by meaning
- **Hybrid Search**: Combine keyword and semantic
- **Similar Documents**: Find related content
- **Legal Citations**: Automatic extraction
- **Document Analysis**: AI-powered insights
- **Search Analytics**: Query performance tracking

### Security & Compliance
- **Organization Isolation**: Multi-tenant architecture
- **Role-Based Access**: Admin, attorney, paralegal
- **Audit Trails**: Complete action history
- **Data Encryption**: Secure password storage
- **CORS Protection**: Secure frontend integration

## 📊 Database Schema

### Relationships
- **Organizations** → Users, Cases, Clients (1:many)
- **Cases** → Documents, Evidence, Motions, Tasks (1:many)
- **Documents** → Embeddings, Citations, Analysis (1:many)
- **Users** → Time Entries, Tasks, Messages (1:many)
- **Workflow Stages** → Workflow Tasks (1:many)

### Performance Optimizations
- **Vector Indexes**: IVFFlat for similarity search
- **Full-Text Indexes**: Trigram for fuzzy matching
- **Composite Indexes**: Multi-column queries
- **Foreign Key Indexes**: Join optimization
- **JSONB Indexes**: Metadata search

## 🔌 API Endpoints

### Core APIs
- `GET /api/v1/cases` - List cases with filtering
- `POST /api/v1/documents` - Upload documents
- `GET /api/v1/evidence` - Evidence management
- `POST /api/v1/auth/login` - User authentication

### AI-Powered APIs
- `POST /api/v1/search/semantic` - Semantic document search
- `POST /api/v1/search/hybrid` - Hybrid search
- `GET /api/v1/search/similar-documents/:id` - Similar documents
- `POST /api/v1/search/legal-citations` - Extract citations

### Management APIs
- `GET /api/v1/workflow` - Workflow management
- `POST /api/v1/billing/time-entries` - Time tracking
- `GET /api/v1/calendar/events` - Calendar management
- `GET /api/v1/analytics` - Case analytics

## 🧪 Testing Strategy

### Unit Tests
- Model validation tests
- Service logic tests
- Controller endpoint tests
- Authentication tests

### Integration Tests
- Database interaction tests
- Module integration tests
- API endpoint tests
- Vector search tests

### E2E Tests
- Complete user workflows
- Authentication flows
- Search functionality
- File upload/download

## 🚀 Deployment

### Development
```bash
npm install
npm run start:dev
```

### Production
```bash
npm run build
npm run start:prod
```

### Database Setup
```bash
# PostgreSQL with extensions
./src/database/scripts/setup_database.sh
```

### Environment Variables
Copy `.env.example` to `.env` and configure:
- Database connection
- JWT secrets
- OpenAI API keys
- File upload settings

## 📈 Performance Characteristics

### Search Performance
- **Vector Search**: Sub-second similarity queries
- **Hybrid Search**: Optimized ranking algorithm
- **Full-Text Search**: Trigram-based fuzzy matching
- **Caching**: Query result optimization

### Scalability
- **Horizontal Scaling**: Stateless API design
- **Database Optimization**: Comprehensive indexing
- **Connection Pooling**: Efficient resource usage
- **Background Jobs**: Async processing ready

## 🔒 Security Measures

### Authentication & Authorization
- JWT token validation
- Role-based access control
- Organization-level isolation
- Password strength requirements

### Data Protection
- Encrypted password storage
- Secure file uploads
- SQL injection prevention
- XSS protection via validation

### API Security
- Rate limiting ready
- CORS configuration
- Request validation
- Error handling without leakage

---

This backend provides a complete foundation for enterprise legal management with AI-powered features and production-ready scalability.