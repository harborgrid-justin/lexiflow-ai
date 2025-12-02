import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  Document,
  DocumentVersion,
  DocumentEmbedding,
  LegalCitation,
  DocumentAnalysis,
  Case,
  Organization,
  User,
} from '../../models';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Document,
      DocumentVersion,
      DocumentEmbedding,
      LegalCitation,
      DocumentAnalysis,
      Case,
      Organization,
      User,
    ]),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}