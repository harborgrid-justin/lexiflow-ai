/**
 * @fileoverview Main application module for LexiFlow AI Backend
 * 
 * This module configures and bootstraps the entire NestJS application including:
 * - Database connection (PostgreSQL with Sequelize)
 * - Environment configuration
 * - All feature modules and controllers
 * - All Sequelize models
 * - Global services and providers
 * 
 * @module AppModule
 * @requires NestJS @nestjs/common
 * @requires Sequelize @nestjs/sequelize
 * @requires dotenv via @nestjs/config
 * 
 * @author LexiFlow Development Team
 * @version 1.0.0
 */

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
  // New models
  Party,
  CaseMember,
  UserProfile,
  Group,
  UserGroup,
  ConflictCheck,
  EthicalWall,
  AuditLogEntry,
  JudgeProfile,
  OpposingCounselProfile,
  ChainOfCustodyEvent,
  FileChunk,
  Playbook,
  DocumentVersion,
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

// New modules
import { PartiesModule } from './modules/parties/parties.module';
import { UserProfilesModule } from './modules/user-profiles/user-profiles.module';
import { AuditModule } from './modules/audit/audit.module';
import { GroupsModule } from './modules/groups/groups.module';
import { ConflictCheckModule } from './modules/conflict-check/conflict-check.module';
import { EthicalWallModule } from './modules/ethical-wall/ethical-wall.module';
import { JudgeProfileModule } from './modules/judge-profile/judge-profile.module';
import { OpposingCounselModule } from './modules/opposing-counsel/opposing-counsel.module';
import { DocumentVersionsModule } from './modules/document-versions/document-versions.module';
import { PlaybooksModule } from './modules/playbooks/playbooks.module';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Redis (must be before other modules that depend on it)
    RedisModule,

    // Database
    SequelizeModule.forRoot({
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      uri: process.env.DATABASE_URL,
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
        // New models
        Party,
        CaseMember,
        UserProfile,
        Group,
        UserGroup,
        ConflictCheck,
        EthicalWall,
        AuditLogEntry,
        JudgeProfile,
        OpposingCounselProfile,
        ChainOfCustodyEvent,
        FileChunk,
        Playbook,
        DocumentVersion,
      ],
      autoLoadModels: false, // Disable auto-loading models
      synchronize: true, // Temporarily enable sync to create tables
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      retry: {
        max: 3,
      },
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
    
    // New modules
    PartiesModule,
    UserProfilesModule,
    AuditModule,
    GroupsModule,
    ConflictCheckModule,
    EthicalWallModule,
    JudgeProfileModule,
    OpposingCounselModule,
    DocumentVersionsModule,
    PlaybooksModule,
  ],
})
export class AppModule {}