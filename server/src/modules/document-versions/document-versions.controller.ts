import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { DocumentVersionsService } from './document-versions.service';
import { DocumentVersion } from '../../models/document-version.model';
import { CreateDocumentVersionDto } from './dto/create-document-version.dto';

/**
 * Document Versions Controller
 *
 * Manages document version history and tracking.
 * Supports creating new versions and querying version history.
 *
 * @class DocumentVersionsController
 * @implements RESTful API for document version management
 *
 * @description
 * Document versions enable tracking changes to documents over time.
 * Each version maintains a snapshot of the document state with metadata
 * about who made changes and when.
 *
 * @example
 * // Create a new version
 * POST /api/v1/document-versions
 * {
 *   "document_id": "doc-uuid-123",
 *   "uploaded_by": "user-uuid-456",
 *   "summary": "Updated terms in section 5"
 * }
 */
@ApiTags('document-versions')
@Controller('document-versions')
export class DocumentVersionsController {
  constructor(private readonly documentVersionsService: DocumentVersionsService) {}

  /**
   * Create a new document version
   *
   * Creates a new version record for a document. The version number
   * is automatically incremented from the latest version.
   *
   * @param {CreateDocumentVersionDto} createDocumentVersionDto - Version creation data
   * @returns {Promise<DocumentVersion>} Newly created version
   *
   * @throws {NotFoundException} When parent document is not found
   * @throws {BadRequestException} When validation fails
   */
  @Post()
  @ApiOperation({ summary: 'Create a new document version' })
  @ApiResponse({
    status: 201,
    description: 'Document version created successfully',
    type: DocumentVersion,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  create(@Body() createDocumentVersionDto: CreateDocumentVersionDto): Promise<DocumentVersion> {
    return this.documentVersionsService.create(createDocumentVersionDto);
  }

  /**
   * Get all document versions with optional filtering
   *
   * Retrieves all document versions. Can be filtered by document ID.
   * Results are ordered by version number (descending - newest first).
   *
   * @param {string} [documentId] - Optional document ID for filtering
   * @returns {Promise<DocumentVersion[]>} Array of document versions
   *
   * @example
   * // Get all versions
   * GET /api/v1/document-versions
   *
   * @example
   * // Get versions for a specific document
   * GET /api/v1/document-versions?documentId=doc-uuid-123
   */
  @Get()
  @ApiOperation({ summary: 'Get all document versions' })
  @ApiQuery({
    name: 'documentId',
    required: false,
    description: 'Filter by document ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Document versions retrieved successfully',
    type: [DocumentVersion],
  })
  findAll(@Query('documentId') documentId?: string): Promise<DocumentVersion[]> {
    return this.documentVersionsService.findAll(documentId);
  }

  /**
   * Get a single document version by ID
   *
   * Retrieves detailed information about a specific document version.
   *
   * @param {string} id - Document version UUID
   * @returns {Promise<DocumentVersion>} Complete version object
   *
   * @throws {NotFoundException} When version is not found
   *
   * @example
   * const version = await findOne("version-uuid-123");
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a document version by ID' })
  @ApiResponse({
    status: 200,
    description: 'Document version retrieved successfully',
    type: DocumentVersion,
  })
  @ApiResponse({ status: 404, description: 'Document version not found' })
  findOne(@Param('id') id: string): Promise<DocumentVersion> {
    return this.documentVersionsService.findOne(id);
  }
}
