import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { VectorSearchService } from '../../services/vector-search.service';
import { GoogleCustomSearchService } from '../../services/google-custom-search.service';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import {
  DocumentEmbedding,
  LegalCitation,
  DocumentAnalysis,
  SearchQuery,
  Document,
  FileChunk,
} from '../../models';

@Module({
  imports: [
    ConfigModule,
    SequelizeModule.forFeature([
      DocumentEmbedding,
      LegalCitation,
      DocumentAnalysis,
      SearchQuery,
      Document,
      FileChunk,
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService, VectorSearchService, GoogleCustomSearchService],
  exports: [SearchService, VectorSearchService, GoogleCustomSearchService],
})
export class SearchModule {}