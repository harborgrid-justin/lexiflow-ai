import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { 
  Document,
  DocumentEmbedding,
  LegalCitation,
  DocumentAnalysis,
} from '../../models';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

@Module({
  imports: [SequelizeModule.forFeature([Document, DocumentEmbedding, LegalCitation, DocumentAnalysis])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}