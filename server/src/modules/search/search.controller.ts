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

  @Post('legal-research')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Perform comprehensive legal research using Google Custom Search' })
  @ApiResponse({ status: 200, description: 'Legal research results returned successfully' })
  async legalResearch(
    @Body() body: {
      query: string;
      jurisdiction?: string;
      includeCaseLaw?: boolean;
      includeStatutes?: boolean;
      includeArticles?: boolean;
      includeNews?: boolean;
    },
    @CurrentUser() user: User,
  ) {
    return this.searchService.performLegalResearch(
      body.query,
      user,
      {
        jurisdiction: body.jurisdiction,
        includeCaseLaw: body.includeCaseLaw,
        includeStatutes: body.includeStatutes,
        includeArticles: body.includeArticles,
        includeNews: body.includeNews,
      },
    );
  }

  @Post('case-law')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search case law using Google Custom Search' })
  @ApiResponse({ status: 200, description: 'Case law results returned successfully' })
  async searchCaseLaw(
    @Body() body: { query: string; jurisdiction?: string },
    @CurrentUser() user: User,
  ) {
    return this.searchService.searchCaseLaw(body.query, body.jurisdiction, user);
  }

  @Post('statutes')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search statutes and regulations using Google Custom Search' })
  @ApiResponse({ status: 200, description: 'Statute results returned successfully' })
  async searchStatutes(
    @Body() body: { query: string; jurisdiction?: string },
    @CurrentUser() user: User,
  ) {
    return this.searchService.searchStatutes(body.query, body.jurisdiction, user);
  }

  @Post('legal-news')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Search recent legal news and developments' })
  @ApiResponse({ status: 200, description: 'Legal news results returned successfully' })
  async searchLegalNews(
    @Body() body: { query: string; daysBack?: number },
    @CurrentUser() user: User,
  ) {
    return this.searchService.searchLegalNews(body.query, body.daysBack, user);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get search history for analytics' })
  @ApiResponse({ status: 200, description: 'Search history retrieved successfully' })
  async getSearchHistory(
    @CurrentUser() user: User,
    @Query('userId') userId?: string,
    @Query('limit') limit?: number,
  ) {
    return this.searchService.getSearchHistory(
      user.organization_id,
      userId || user.id,
      limit ? Number(limit) : 50,
    );
  }

  @Post('sessions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Save research session' })
  @ApiResponse({ status: 201, description: 'Research session saved successfully' })
  async saveResearchSession(
    @Body() body: {
      query: string;
      results: any;
      caseId?: string;
    },
    @CurrentUser() user: User,
  ) {
    return this.searchService.saveResearchSession({
      query: body.query,
      results: body.results,
      userId: user.id,
      organizationId: user.organization_id,
      caseId: body.caseId,
    });
  }

  @Patch('sessions/:id/feedback')
  @ApiOperation({ summary: 'Update feedback on research session' })
  @ApiResponse({ status: 200, description: 'Feedback updated successfully' })
  async updateFeedback(
    @Param('id') sessionId: string,
    @Body() body: { feedback: 'positive' | 'negative' },
    @CurrentUser() _user: User,
  ) {
    await this.searchService.updateFeedback(sessionId, body.feedback);
    return { message: 'Feedback updated successfully' };
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'General search endpoint (supports semantic, hybrid, and keyword)' })
  @ApiResponse({ status: 200, description: 'Search results returned successfully' })
  async generalSearch(
    @Body() body: {
      query: string;
      searchType?: 'semantic' | 'hybrid' | 'keyword';
      limit?: number;
      threshold?: number;
      caseId?: string;
    },
    @CurrentUser() user: User,
  ) {
    const searchType = body.searchType || 'hybrid';

    switch (searchType) {
      case 'semantic':
        return this.searchService.semanticSearch(
          body.query,
          {
            limit: body.limit,
            threshold: body.threshold,
            caseId: body.caseId,
          },
          user,
        );

      case 'hybrid':
        return this.searchService.hybridSearch(
          body.query,
          {
            limit: body.limit,
            caseId: body.caseId,
          },
          user,
        );

      default:
        // For keyword search, use hybrid with higher keyword weight
        return this.searchService.hybridSearch(
          body.query,
          {
            limit: body.limit,
            keywordWeight: 0.8,
            semanticWeight: 0.2,
            caseId: body.caseId,
          },
          user,
        );
    }
  }

  @Get('citations')
  @ApiOperation({ summary: 'Get legal citations' })
  @ApiResponse({ status: 200, description: 'Citations retrieved successfully' })
  async getCitations(
    @CurrentUser() user: User,
    @Query('documentId') documentId?: string,
  ) {
    return this.searchService.getLegalCitations(documentId, user.organization_id);
  }

  @Post('documents/:documentId/analyze')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Analyze document using AI' })
  @ApiResponse({ status: 200, description: 'Document analysis completed successfully' })
  async analyzeDocument(
    @Param('documentId') documentId: string,
    @CurrentUser() user: User,
  ) {
    return this.searchService.analyzeDocument(documentId, user);
  }

  @Get('documents/:documentId/analysis')
  @ApiOperation({ summary: 'Get document analysis results' })
  @ApiResponse({ status: 200, description: 'Document analysis retrieved successfully' })
  async getDocumentAnalysis(
    @Param('documentId') documentId: string,
    @CurrentUser() _user: User,
  ) {
    return this.searchService.getDocumentAnalysis(documentId);
  }

  @Get('documents/:documentId/embeddings')
  @ApiOperation({ summary: 'Get document embeddings' })
  @ApiResponse({ status: 200, description: 'Document embeddings retrieved successfully' })
  async getDocumentEmbeddings(
    @Param('documentId') documentId: string,
    @CurrentUser() _user: User,
  ) {
    return this.searchService.getDocumentEmbeddings(documentId);
  }
}