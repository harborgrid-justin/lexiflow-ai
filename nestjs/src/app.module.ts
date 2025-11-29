import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

// Import all models
import {
  Organization,
  User,
  Case,
  Document,
  Evidence,
  Message,
  Conversation,
  WorkflowStage,
  WorkflowTask,
  Motion,
  TimeEntry,
  DiscoveryRequest,
  Client,
  Analytics,
  ComplianceRecord,
  KnowledgeArticle,
  Jurisdiction,
  CalendarEvent,
  Task,
  Clause,
  DocumentEmbedding,
  LegalCitation,
  DocumentAnalysis,
  SearchQuery,
} from './models';

// Import all modules
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { UsersModule } from './modules/users/users.module';
import { CasesModule } from './modules/cases/cases.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { EvidenceModule } from './modules/evidence/evidence.module';
import { MessagesModule } from './modules/messages/messages.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { MotionsModule } from './modules/motions/motions.module';
import { BillingModule } from './modules/billing/billing.module';
import { DiscoveryModule } from './modules/discovery/discovery.module';
import { ClientsModule } from './modules/clients/clients.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { JurisdictionsModule } from './modules/jurisdictions/jurisdictions.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { ClausesModule } from './modules/clauses/clauses.module';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'lexiflow',
      models: [
        Organization,
        User,
        Case,
        Document,
        Evidence,
        Message,
        Conversation,
        WorkflowStage,
        WorkflowTask,
        Motion,
        TimeEntry,
        DiscoveryRequest,
        Client,
        Analytics,
        ComplianceRecord,
        KnowledgeArticle,
        Jurisdiction,
        CalendarEvent,
        Task,
        Clause,
        DocumentEmbedding,
        LegalCitation,
        DocumentAnalysis,
        SearchQuery,
      ],
      autoLoadModels: true,
      synchronize: true, // Only for development
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    }),

    // Feature modules
    AuthModule,
    OrganizationsModule,
    UsersModule,
    CasesModule,
    DocumentsModule,
    EvidenceModule,
    MessagesModule,
    WorkflowModule,
    MotionsModule,
    BillingModule,
    DiscoveryModule,
    ClientsModule,
    AnalyticsModule,
    ComplianceModule,
    KnowledgeModule,
    JurisdictionsModule,
    CalendarModule,
    TasksModule,
    ClausesModule,
    SearchModule,
  ],
})
export class AppModule {}