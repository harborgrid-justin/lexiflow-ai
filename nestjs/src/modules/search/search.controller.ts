import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SearchService } from './search.service';
import { VectorSearchService } from '../../services/vector-search.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../../models';

@ApiTags('search')
@Controller('search')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly vectorSearchService: VectorSearchService,
  ) {}

  @Post('semantic')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Perform semantic search across documents' })
  @ApiResponse({ status: 200, description: 'Search results returned successfully' })
  async semanticSearch(
    @Body() body: { query: string; limit?: number; threshold?: number },
    @CurrentUser() user: User,
  ) {
    return this.vectorSearchService.semanticSearch(
      body.query,
      user.organization_id,
      body.limit,
      body.threshold,
    );
  }

  @Post('hybrid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Perform hybrid search (semantic + keyword)' })
  @ApiResponse({ status: 200, description: 'Hybrid search results returned successfully' })
  async hybridSearch(
    @Body() body: { query: string; limit?: number; semanticWeight?: number },
    @CurrentUser() user: User,
  ) {
    return this.vectorSearchService.hybridSearch(
      body.query,
      user.organization_id,
      body.limit,
      body.semanticWeight,
    );
  }

  @Get('similar-documents/:documentId')
  @ApiOperation({ summary: 'Find documents similar to a given document' })
  @ApiResponse({ status: 200, description: 'Similar documents found successfully' })
  async findSimilarDocuments(
    @Query('documentId') documentId: string,
    @Query('limit') limit?: number,
    @CurrentUser() user: User,
  ) {
    return this.vectorSearchService.findSimilarDocuments(
      documentId,
      user.organization_id,
      limit,
    );
  }

  @Post('legal-citations')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Extract legal citations from text' })
  @ApiResponse({ status: 200, description: 'Legal citations extracted successfully' })
  async extractLegalCitations(
    @Body() body: { text: string; documentId?: string },
    @CurrentUser() user: User,
  ) {
    return this.searchService.extractLegalCitations(
      body.text,
      body.documentId,
      user,
    );
  }

  @Get('query-history')
  @ApiOperation({ summary: 'Get search query history for analytics' })
  @ApiResponse({ status: 200, description: 'Search history retrieved successfully' })
  async getQueryHistory(
    @Query('limit') limit?: number,
    @CurrentUser() user: User,
  ) {
    return this.searchService.getQueryHistory(user.organization_id, limit);
  }
}