import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { DocumentEmbedding } from '../models/document-embedding.model';
import { SearchQuery } from '../models/search-query.model';
import { Sequelize, QueryTypes, Op } from 'sequelize';

/**
 * Options for configuring vector similarity search
 * 
 * @interface VectorSearchOptions
 */
export interface VectorSearchOptions {
  /** The search query text */
  query: string;
  /** Maximum number of results to return (default: 10) */
  limit?: number;
  /** Minimum similarity threshold 0-1 (default: 0.7) */
  threshold?: number;
  /** Optional filters to narrow search scope */
  filters?: {
    /** Filter by specific document IDs */
    documentIds?: string[];
    /** Filter by organization ID */
    organizationId?: string;
    /** Filter by case ID */
    caseId?: string;
  };
}

/**
 * Result from vector similarity search
 * 
 * @interface VectorSearchResult
 */
export interface VectorSearchResult {
  /** Unique identifier for the embedding chunk */
  id: string;
  /** Text content of the matched chunk */
  content: string;
  /** Cosine similarity score (0-1, higher is better) */
  similarity: number;
  /** ID of the parent document */
  document_id: string;
  /** Additional metadata about the chunk */
  metadata?: Record<string, unknown>;
}

/**
 * Vector Search Service
 * 
 * Provides semantic search capabilities using PostgreSQL with pgvector extension.
 * Enables similarity-based document search using vector embeddings for advanced
 * legal document discovery and research.
 * 
 * @class VectorSearchService
 * @implements Semantic search using vector embeddings
 * 
 * @description
 * This service leverages pgvector to perform cosine similarity search on document
 * embeddings. It supports filtering by organization, case, and document, making
 * it ideal for multi-tenant legal document search scenarios.
 * 
 * @requires PostgreSQL with pgvector extension
 * @requires Document embeddings pre-generated (using OpenAI text-embedding-ada-002)
 * 
 * @example
 * const service = new VectorSearchService(embeddingModel, queryModel, sequelize);
 * const results = await service.semanticSearch(embedding, {
 *   query: "contract termination clause",
 *   limit: 5,
 *   threshold: 0.8,
 *   filters: { organizationId: "org-123" }
 * });
 */
@Injectable()
export class VectorSearchService {
  /**
   * Creates an instance of VectorSearchService
   * 
   * @param {typeof DocumentEmbedding} embeddingModel - Sequelize model for document embeddings
   * @param {typeof SearchQuery} searchQueryModel - Sequelize model for search query logging
   * @param {Sequelize} sequelize - Sequelize connection instance for raw SQL queries
   */
  constructor(
    @InjectModel(DocumentEmbedding)
    private embeddingModel: typeof DocumentEmbedding,
    @InjectModel(SearchQuery)
    private searchQueryModel: typeof SearchQuery,
    @InjectConnection()
    private sequelize: Sequelize,
  ) {}

  /**
   * Perform semantic search using vector similarity
   * 
   * Executes a cosine similarity search on document embeddings using PostgreSQL's
   * pgvector extension. Returns the most similar document chunks based on the
   * provided query embedding.
   * 
   * @param {number[]} queryEmbedding - Vector embedding of the search query (typically 1536 dimensions for OpenAI)
   * @param {VectorSearchOptions} options - Search configuration and filters
   * @returns {Promise<VectorSearchResult[]>} Array of matching document chunks with similarity scores
   * 
   * @algorithm
   * Uses cosine distance operator (<=> in pgvector) for similarity:
   * - Distance of 0 = identical vectors
   * - Similarity score = 1 - distance (so higher is better)
   * - Results are filtered by minimum threshold and sorted by similarity
   * 
   * @performance
   * - Uses pgvector's HNSW index for fast approximate nearest neighbor search
   * - Typical query time: 10-50ms for millions of embeddings
   * 
   * @example
   * const queryEmbedding = await openai.createEmbedding("contract termination");
   * const results = await semanticSearch(queryEmbedding.data[0].embedding, {
   *   query: "contract termination clause",
   *   limit: 10,
   *   threshold: 0.75,
   *   filters: {
   *     organizationId: "org-uuid",
   *     caseId: "case-uuid"
   *   }
   * });
   * 
   * results.forEach(r => {
   *   console.log(`${r.similarity.toFixed(3)}: ${r.content.substring(0, 100)}...`);
   * });
   */
  async semanticSearch(
    queryEmbedding: number[],
    options: VectorSearchOptions,
  ): Promise<VectorSearchResult[]> {
    const { limit = 10, threshold = 0.7, filters } = options;
    
    let whereClause = '';
    const replacements: Record<string, unknown> = {
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
    metadata?: Record<string, unknown>,
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
    const replacements: Record<string, unknown> = {
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
    const whereClause: Record<string, unknown> = { organization_id: organizationId };
    
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