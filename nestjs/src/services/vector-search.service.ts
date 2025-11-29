import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DocumentEmbedding } from '../models/document-embedding.model';
import { SearchQuery } from '../models/search-query.model';
import { Sequelize, QueryTypes, Op } from 'sequelize';

export interface VectorSearchOptions {
  query: string;
  limit?: number;
  threshold?: number;
  filters?: {
    documentIds?: string[];
    organizationId?: string;
    caseId?: string;
  };
}

export interface VectorSearchResult {
  id: string;
  content: string;
  similarity: number;
  document_id: string;
  metadata?: any;
}

@Injectable()
export class VectorSearchService {
  constructor(
    @InjectModel(DocumentEmbedding)
    private embeddingModel: typeof DocumentEmbedding,
    @InjectModel(SearchQuery)
    private searchQueryModel: typeof SearchQuery,
    private sequelize: Sequelize,
  ) {}

  /**
   * Perform semantic search using vector similarity
   */
  async semanticSearch(
    queryEmbedding: number[],
    options: VectorSearchOptions,
  ): Promise<VectorSearchResult[]> {
    const { limit = 10, threshold = 0.7, filters } = options;
    
    let whereClause = '';
    const replacements: any = {
      embedding: `[${queryEmbedding.join(',')}]`,
      limit,
      threshold,
    };

    // Add filters to WHERE clause
    if (filters?.organizationId) {
      whereClause += ' AND owner_org_id = :orgId';
      replacements.orgId = filters.organizationId;
    }

    if (filters?.documentIds?.length) {
      whereClause += ' AND document_id = ANY(:documentIds)';
      replacements.documentIds = filters.documentIds;
    }

    const query = `
      SELECT 
        id,
        content,
        document_id,
        metadata,
        1 - (embedding <=> :embedding::vector) as similarity
      FROM document_embeddings 
      WHERE 1 = 1 ${whereClause}
        AND 1 - (embedding <=> :embedding::vector) > :threshold
      ORDER BY embedding <=> :embedding::vector
      LIMIT :limit
    `;

    const results = await this.sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT,
    });

    return results as VectorSearchResult[];
  }

  /**
   * Generate and store embeddings for a document chunk
   */
  async storeEmbedding(
    documentId: string,
    content: string,
    embedding: number[],
    chunkIndex: number,
    metadata?: any,
    userId?: string,
    organizationId?: string,
  ): Promise<DocumentEmbedding> {
    return this.embeddingModel.create({
      document_id: documentId,
      content,
      embedding,
      model: 'text-embedding-ada-002', // Default OpenAI model
      dimension: embedding.length,
      chunk_index: chunkIndex,
      metadata,
      created_by: userId,
      owner_org_id: organizationId,
    });
  }

  /**
   * Store search query for analytics
   */
  async logSearchQuery(
    queryText: string,
    queryEmbedding: number[],
    resultCount: number,
    resultDocumentIds: string[],
    userId?: string,
    organizationId?: string,
    executionTime?: number,
  ): Promise<SearchQuery> {
    return this.searchQueryModel.create({
      query_text: queryText,
      search_type: 'semantic',
      query_embedding: queryEmbedding,
      result_count: resultCount,
      result_document_ids: resultDocumentIds,
      user_id: userId,
      organization_id: organizationId,
      execution_time_ms: executionTime,
    });
  }

  /**
   * Find similar documents based on content
   */
  async findSimilarDocuments(
    documentId: string,
    limit: number = 5,
  ): Promise<VectorSearchResult[]> {
    // Get embeddings for the source document
    const sourceEmbeddings = await this.embeddingModel.findAll({
      where: { document_id: documentId },
      limit: 1,
      order: [['chunk_index', 'ASC']],
    });

    if (!sourceEmbeddings.length) {
      return [];
    }

    const sourceEmbedding = sourceEmbeddings[0].embedding;

    return this.semanticSearch(sourceEmbedding, {
      query: '',
      limit,
      threshold: 0.8,
      filters: {
        // Exclude the source document
        documentIds: [], // Could add logic to exclude source doc
      },
    });
  }

  /**
   * Hybrid search combining vector and text search
   */
  async hybridSearch(
    queryText: string,
    queryEmbedding: number[],
    options: VectorSearchOptions,
  ): Promise<VectorSearchResult[]> {
    const { limit = 10, filters } = options;
    
    let whereClause = '';
    const replacements: any = {
      queryText: `%${queryText}%`,
      embedding: `[${queryEmbedding.join(',')}]`,
      limit,
    };

    // Add filters
    if (filters?.organizationId) {
      whereClause += ' AND owner_org_id = :orgId';
      replacements.orgId = filters.organizationId;
    }

    const query = `
      SELECT 
        id,
        content,
        document_id,
        metadata,
        -- Combine text and vector similarity scores
        (
          (1 - (embedding <=> :embedding::vector)) * 0.7 +
          (CASE WHEN content ILIKE :queryText THEN 0.3 ELSE 0 END)
        ) as similarity
      FROM document_embeddings 
      WHERE 1 = 1 ${whereClause}
        AND (
          content ILIKE :queryText OR 
          1 - (embedding <=> :embedding::vector) > 0.6
        )
      ORDER BY similarity DESC
      LIMIT :limit
    `;

    const results = await this.sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT,
    });

    return results as VectorSearchResult[];
  }

  /**
   * Get search analytics for an organization
   */
  async getSearchAnalytics(
    organizationId: string,
    startDate?: Date,
    endDate?: Date,
  ) {
    const whereClause: any = { organization_id: organizationId };
    
    if (startDate && endDate) {
      whereClause.created_at = {
        [Op.between]: [startDate, endDate],
      };
    }

    const queries = await this.searchQueryModel.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
    });

    const totalQueries = queries.length;
    const avgExecutionTime = queries.reduce((sum, q) => sum + (q.execution_time_ms || 0), 0) / totalQueries;
    const avgResultCount = queries.reduce((sum, q) => sum + (q.result_count || 0), 0) / totalQueries;

    return {
      totalQueries,
      avgExecutionTime,
      avgResultCount,
      recentQueries: queries.slice(0, 10),
    };
  }
}