import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentVersion, Document, User } from '../../models';
import { DocumentVersionsController } from './document-versions.controller';
import { DocumentVersionsService } from './document-versions.service';

@Module({
  imports: [SequelizeModule.forFeature([DocumentVersion, Document, User])],
  controllers: [DocumentVersionsController],
  providers: [DocumentVersionsService],
  exports: [DocumentVersionsService],
})
export class DocumentVersionsModule {}