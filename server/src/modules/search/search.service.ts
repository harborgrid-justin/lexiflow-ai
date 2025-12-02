import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  DocumentEmbedding,
  LegalCitation,
  DocumentAnalysis,
  SearchQuery,
  Document,
  User,
} from '../../models';
import { VectorSearchService } from '../../services/vector-search.service';
import { GoogleCustomSearchService } from '../../services/google-custom-search.service';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(DocumentEmbedding)
    private readonly documentEmbeddingModel: typeof DocumentEmbedding,
    @InjectModel(LegalCitation)
    private readonly legalCitationModel: typeof LegalCitation,
    @InjectModel(DocumentAnalysis)
    private readonly documentAnalysisModel: typeof DocumentAnalysis,
    @InjectModel(SearchQuery)
    private readonly searchQueryModel: typeof SearchQuery,
    @InjectModel(Document)
    private readonly documentModel: typeof Document,
    private readonly vectorSearchService: VectorSearchService,
    private readonly googleSearchService: GoogleCustomSearchService,
  ) {}

  /**
   * Perform legal research using Google Custom Search API
   */
  async performLegalResearch(
    query: string,
    user: User,
    options?: {
      jurisdiction?: string;
      includeStatutes?: boolean;
      includeCaseLaw?: boolean;
      includeArticles?: boolean;
      includeNews?: boolean;
    },
  ) {
    // Log the search query
    await this.searchQueryModel.create({
      query_text: query,
      search_type: 'legal_research',
      user_id: user.id,
      organization_id: user.organization_id,
      results_count: 0,
    });

    try {
      // Perform comprehensive search if no specific options provided
      if (!options || (!options.includeCaseLaw && !options.includeStatutes && !options.includeArticles && !options.includeNews)) {
        const results = await this.googleSearchService.comprehensiveResearch(
          query,
          options?.jurisdiction,
        );

        return {
          query,
          jurisdiction: options?.jurisdiction,
          results: {
            caseLaw: results.caseLaw,
            statutes: results.statutes,
            articles: results.articles,
            general: results.general,
          },
          totalResults: 
            results.caseLaw.length + 
            results.statutes.length + 
            results.articles.length + 
            results.general.length,
          timestamp: new Date().toISOString(),
        };
      }

      // Perform targeted searches based on options
      const searchPromises: Array<Promise<any>> = [];
      const resultTypes: string[] = [];

      if (options.includeCaseLaw) {
        searchPromises.push(
          this.googleSearchService.searchCaseLaw(query, options.jurisdiction),
        );
        resultTypes.push('caseLaw');
      }

      if (options.includeStatutes) {
        searchPromises.push(
          this.googleSearchService.searchStatutes(query, options.jurisdiction),
        );
        resultTypes.push('statutes');
      }

      if (options.includeArticles) {
        searchPromises.push(
          this.googleSearchService.searchLegalArticles(query),
        );
        resultTypes.push('articles');
      }

      if (options.includeNews) {
        searchPromises.push(
          this.googleSearchService.searchLegalNews(query),
        );
        resultTypes.push('news');
      }

      const searchResults = await Promise.all(searchPromises);
      
      const results: any = {};
      resultTypes.forEach((type, index) => {
        results[type] = searchResults[index];
      });

      return {
        query,
        jurisdiction: options.jurisdiction,
        results,
        totalResults: Object.values(results).reduce((sum: number, arr: any) => sum + arr.length, 0),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Legal research error:', error);
      throw error;
    }
  }

  /**
   * Search case law
   */
  async searchCaseLaw(query: string, jurisdiction?: string, user?: User) {
    if (user) {
      await this.searchQueryModel.create({
        query,
        search_type: 'case_law',
        user_id: user.id,
        organization_id: user.organization_id,
        results_count: 0,
      });
    }

    return this.googleSearchService.searchCaseLaw(query, jurisdiction);
  }

  /**
   * Search statutes and regulations
   */
  async searchStatutes(query: string, jurisdiction?: string, user?: User) {
    if (user) {
      await this.searchQueryModel.create({
        query,
        search_type: 'statutes',
        user_id: user.id,
        organization_id: user.organization_id,
        results_count: 0,
      });
    }

    return this.googleSearchService.searchStatutes(query, jurisdiction);
  }

  /**
   * Search legal news
   */
  async searchLegalNews(query: string, daysBack?: number, user?: User) {
    if (user) {
      await this.searchQueryModel.create({
        query,
        search_type: 'legal_news',
        user_id: user.id,
        organization_id: user.organization_id,
        results_count: 0,
      });
    }

    return this.googleSearchService.searchLegalNews(query, daysBack);
  }

  async extractLegalCitations(
    text: string,
    documentId?: string,
    user?: User,
  ) {
    // Legal citation pattern matching
    const citationPatterns = [
      /\d+\s+[A-Z][a-z.]*\s+\d+/g, // Basic citation pattern like "123 F.3d 456"
      /\d+\s+U\.S\.\s+\d+/g, // U.S. Supreme Court
      /\d+\s+S\.\s*Ct\.\s+\d+/g, // Supreme Court Reporter
      /\d+\s+F\.\d*d\s+\d+/g, // Federal Reporter
    ];

    const foundCitations = [];
    for (const pattern of citationPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        foundCitations.push(...matches);
      }
    }

    // Save citations if document is provided
    if (documentId && user && foundCitations.length > 0) {
      for (const citation of foundCitations) {
        await this.legalCitationModel.create({
          case_name: citation, // This would need enhancement to parse case names
          citation,
          document_id: documentId,
          added_by: user.id,
          owner_org_id: user.organization_id,
        });
      }
    }

    return {
      citations: foundCitations,
      count: foundCitations.length,
    };
  }

  async getQueryHistory(organizationId: string, limit: number = 50) {
    return this.searchQueryModel.findAll({
      where: { organization_id: organizationId },
      order: [['created_at', 'DESC']],
      limit,
    });
  }

  async getDocumentAnalysis(documentId: string) {
    return this.documentAnalysisModel.findAll({
      where: { document_id: documentId },
      order: [['created_at', 'DESC']],
    });
  }

  async createDocumentAnalysis(
    documentId: string,
    analysisType: string,
    results: Record<string, unknown>,
    user: User,
  ) {
    return this.documentAnalysisModel.create({
      document_id: documentId,
      analysis_type: analysisType,
      status: 'completed',
      results,
      confidence_score: results.confidence || 0.0,
      model_used: 'gpt-4',
      model_version: '2024-11-29',
      summary: results.summary || '',
      initiated_by: user.id,
      owner_org_id: user.organization_id,
      completed_at: new Date(),
    });
  }

  async getDocumentEmbeddings(documentId: string) {
    return this.documentEmbeddingModel.findAll({
      where: { document_id: documentId },
      order: [['chunk_index', 'ASC']],
    });
  }

  async getLegalCitations(documentId?: string, organizationId?: string) {
    const whereClause: Record<string, string> = {};
    if (documentId) {whereClause.document_id = documentId;}
    if (organizationId) {whereClause.owner_org_id = organizationId;}

    return this.legalCitationModel.findAll({
      where: whereClause,
      include: [
        {
          model: this.documentModel,
          attributes: ['id', 'title', 'filename'],
        },
      ],
      order: [['created_at', 'DESC']],
    });
  }

  /**
   * Semantic search using vector embeddings
   */
  async semanticSearch(
    query: string,
    options: {
      limit?: number;
      threshold?: number;
      caseId?: string;
      documentType?: string;
      orgId?: string;
    },
    user: User,
  ) {
    const results = await this.vectorSearchService.semanticSearchWithQuery(query, {
      limit: options.limit || 10,
      threshold: options.threshold || 0.7,
      caseId: options.caseId,
      orgId: user.organization_id,
    });

    return {
      query,
      results,
      total: results.length,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Hybrid search combining semantic and keyword search
   */
  async hybridSearch(
    query: string,
    options: {
      limit?: number;
      keywordWeight?: number;
      semanticWeight?: number;
      caseId?: string;
      orgId?: string;
    },
    user: User,
  ) {
    const results = await this.vectorSearchService.hybridSearchWithQuery(query, {
      limit: options.limit || 10,
      keywordWeight: options.keywordWeight || 0.3,
      semanticWeight: options.semanticWeight || 0.7,
      caseId: options.caseId,
      orgId: user.organization_id,
    });

    return {
      query,
      results,
      total: results.length,
      weights: {
        keyword: options.keywordWeight || 0.3,
        semantic: options.semanticWeight || 0.7,
      },
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Find similar documents based on document ID
   */
  async findSimilarDocuments(documentId: string, limit?: number, _user?: User) {
    const results = await this.vectorSearchService.findSimilarDocuments(
      documentId,
      limit || 5,
    );

    return {
      sourceDocumentId: documentId,
      similarDocuments: results,
      total: results.length,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Analyze document using AI
   */
  async analyzeDocument(
    documentId: string,
    user: User,
  ): Promise<DocumentAnalysis> {
    // Get document
    const document = await this.documentModel.findByPk(documentId);
    if (!document) {
      throw new Error(`Document ${documentId} not found`);
    }

    // For now, create a basic analysis
    // In a real implementation, this would use AI to analyze the document
    const analysisResults = {
      documentType: document.type || 'Unknown',
      summary: `Analysis of ${document.title}`,
      keyTerms: [],
      entities: [],
      riskScore: 0.5,
      confidence: 0.85,
    };

    return this.createDocumentAnalysis(
      documentId,
      'general_analysis',
      analysisResults,
      user,
    );
  }

  /**
   * Create a legal citation
   */
  async createCitation(
    documentId: string,
    citation: string,
    user: User,
    additionalData?: {
      caseName?: string;
      year?: number;
      court?: string;
      jurisdiction?: string;
    },
  ): Promise<LegalCitation> {
    return this.legalCitationModel.create({
      document_id: documentId,
      citation,
      case_name: additionalData?.caseName || citation,
      year: additionalData?.year,
      court: additionalData?.court,
      jurisdiction: additionalData?.jurisdiction,
      added_by: user.id,
      owner_org_id: user.organization_id,
      verified: false,
    });
  }

  /**
   * Save research session
   */
  async saveResearchSession(sessionData: {
    query: string;
    results: any;
    userId: string;
    organizationId: string;
    caseId?: string;
  }) {
    return this.searchQueryModel.create({
      query_text: sessionData.query,
      search_type: 'research_session',
      user_id: sessionData.userId,
      organization_id: sessionData.organizationId,
      case_context: sessionData.caseId,
      result_count: sessionData.results?.length || 0,
    });
  }

  /**
   * Update feedback on search/research session
   */
  async updateFeedback(
    sessionId: string,
    feedback: 'positive' | 'negative',
  ): Promise<void> {
    const session = await this.searchQueryModel.findByPk(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    // Store feedback in filters field as JSONB
    const currentFilters = session.filters || {};
    await session.update({
      filters: {
        ...currentFilters,
        feedback,
        feedbackTimestamp: new Date().toISOString(),
      },
    });
  }

  /**
   * Get search history for user/organization
   */
  async getSearchHistory(
    organizationId: string,
    userId?: string,
    limit: number = 50,
  ) {
    const whereClause: Record<string, string> = { organization_id: organizationId };
    if (userId) {
      whereClause.user_id = userId;
    }

    return this.searchQueryModel.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit,
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
  }
}