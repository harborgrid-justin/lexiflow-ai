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
<<<<<<< HEAD
    @Body() body: { query: string; limit?: number; threshold?: number; embedding: number[] },
    @CurrentUser() user: User,
  ) {
    return this.vectorSearchService.semanticSearch(
      body.embedding,
      {
        query: body.query,
        limit: body.limit,
        threshold: body.threshold,
        filters: {
          organizationId: user.organization_id,
        },
      },
    );
=======
    @Body() _body: { query: string; limit?: number; threshold?: number },
    @CurrentUser() _user: User,
  ) {
    // Note: This would need proper embedding generation from query
    // For now, returning empty array as the semanticSearch expects embeddings
    return [];
>>>>>>> b4d0bc2f20729f0cae80795919d7732bb666bd98
  }

  @Post('hybrid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Perform hybrid search (semantic + keyword)' })
  @ApiResponse({ status: 200, description: 'Hybrid search results returned successfully' })
  async hybridSearch(
<<<<<<< HEAD
    @Body() body: { query: string; limit?: number; semanticWeight?: number; embedding: number[] },
    @CurrentUser() user: User,
  ) {
    return this.vectorSearchService.hybridSearch(
      body.query,
      body.embedding,
      {
        query: body.query,
        limit: body.limit,
        filters: {
          organizationId: user.organization_id,
        },
      },
    );
=======
    @Body() _body: { query: string; limit?: number; semanticWeight?: number },
    @CurrentUser() _user: User,
  ) {
    // Note: This would need proper embedding generation from query
    // For now, returning empty array as the hybridSearch expects embeddings
    return [];
>>>>>>> b4d0bc2f20729f0cae80795919d7732bb666bd98
  }

  @Get('similar-documents/:documentId')
  @ApiOperation({ summary: 'Find documents similar to a given document' })
  @ApiResponse({ status: 200, description: 'Similar documents found successfully' })
  async findSimilarDocuments(
    @Query('documentId') documentId: string,
<<<<<<< HEAD
    @Query('limit') limit?: number,
  ) {
    return this.vectorSearchService.findSimilarDocuments(
      documentId,
      limit ? Number(limit) : 5,
=======
    @Query('limit') limit: number = 5,
    @CurrentUser() _user: User,
  ) {
    return this.vectorSearchService.findSimilarDocuments(
      documentId,
      limit,
>>>>>>> b4d0bc2f20729f0cae80795919d7732bb666bd98
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
<<<<<<< HEAD
=======
    @Query('limit') limit: number = 50,
>>>>>>> b4d0bc2f20729f0cae80795919d7732bb666bd98
    @CurrentUser() user: User,
    @Query('limit') limit?: number,
  ) {
    return this.searchService.getQueryHistory(user.organization_id, limit);
  }
}