import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { VectorSearchService } from '../../services/vector-search.service';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import {
  DocumentEmbedding,
  LegalCitation,
  DocumentAnalysis,
  SearchQuery,
  Document,
} from '../../models';

@Module({
  imports: [
    SequelizeModule.forFeature([
      DocumentEmbedding,
      LegalCitation,
      DocumentAnalysis,
      SearchQuery,
      Document,
    ]),
  ],
  controllers: [SearchController],
  providers: [SearchService, VectorSearchService],
  exports: [SearchService, VectorSearchService],
})
export class SearchModule {}