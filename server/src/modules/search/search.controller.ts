import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
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
    @Body() body: { query: string; limit?: number; threshold?: number; embedding?: number[] },
    @CurrentUser() user: User,
  ) {
    // If embedding is provided, use it directly; otherwise, embedding generation
    // should be handled by a separate embedding service (e.g., OpenAI ada-002)
    if (body.embedding && body.embedding.length > 0) {
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
    }

    // Return empty array when no embedding provided
    // Frontend should either:
    // 1. Generate embeddings client-side (not recommended)
    // 2. Call a dedicated embedding endpoint first
    // 3. Use hybrid search which can fall back to keyword matching
    return [];
  }

  @Post('hybrid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Perform hybrid search (semantic + keyword)' })
  @ApiResponse({ status: 200, description: 'Hybrid search results returned successfully' })
  async hybridSearch(
    @Body() body: { query: string; limit?: number; semanticWeight?: number; embedding?: number[] },
    @CurrentUser() user: User,
  ) {
    // If embedding is provided, use full hybrid search
    if (body.embedding && body.embedding.length > 0) {
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
    }

    // Without embedding, return empty array
    // Consider implementing keyword-only search fallback
    return [];
  }

  @Get('similar-documents/:documentId')
  @ApiOperation({ summary: 'Find documents similar to a given document' })
  @ApiResponse({ status: 200, description: 'Similar documents found successfully' })
  async findSimilarDocuments(
    @Param('documentId') documentId: string,
    @Query('limit') limit: number | undefined,
    @CurrentUser() _user: User,
  ) {
    return this.vectorSearchService.findSimilarDocuments(
      documentId,
      limit ? Number(limit) : 5,
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
    @CurrentUser() user: User,
    @Query('limit') limit?: number,
  ) {
    return this.searchService.getQueryHistory(user.organization_id, limit);
  }
}