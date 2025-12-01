import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { Case } from '../../models/case.model';
import { PacerParserService } from '../../services/pacer-parser.service';

/**
 * Cases Controller
 * 
 * Handles all legal case management operations including CRUD operations,
 * searching, filtering, and case lifecycle management.
 * 
 * @class CasesController
 * @implements RESTful API for case management
 * 
 * @description
 * Cases are the core entity in the LexiFlow system. This controller provides
 * endpoints for managing cases throughout their entire lifecycle from intake
 * to resolution. Supports filtering by organization, client, status, and more.
 * 
 * @example
 * // Create a new case
 * POST /api/v1/cases
 * {
 *   "title": "Smith v. Johnson",
 *   "client_name": "John Smith",
 *   "matter_type": "Civil Litigation",
 *   "status": "Active"
 * }
 * 
 * @example
 * // Get all cases for an organization
 * GET /api/v1/cases?orgId=org-uuid
 */
@ApiTags('cases')
@Controller('cases')
export class CasesController {
  /**
   * Creates an instance of CasesController
   * @param {CasesService} casesService - The cases service for business logic
   * @param {PacerParserService} pacerParserService - Service for parsing PACER dockets
   */
  constructor(
    private readonly casesService: CasesService,
    private readonly pacerParserService: PacerParserService,
  ) {}

  /**
   * Create a new case
   * 
   * Creates a new legal case in the system with the provided details.
   * Automatically generates a unique case number and sets creation timestamps.
   * 
   * @param {CreateCaseDto} createCaseDto - Case creation data
   * @returns {Promise<Case>} Newly created case object
   * 
   * @throws {BadRequestException} When validation fails
   * 
   * @example
   * const newCase = await create({
   *   title: "Smith v. Johnson",
   *   client_name: "John Smith",
   *   matter_type: "Civil Litigation",
   *   jurisdiction: "New York",
   *   status: "Active",
   *   organization_id: "org-uuid"
   * });
   */
  @Post()
  @ApiOperation({ summary: 'Create a new case' })
  @ApiResponse({ status: 201, description: 'Case created successfully', type: Case })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createCaseDto: CreateCaseDto): Promise<Case> {
    return this.casesService.create(createCaseDto);
  }

  /**
   * Parse PACER docket text using OpenAI
   * 
   * Accepts raw PACER docket text and returns structured JSON data.
   * Uses enterprise OpenAI API key for secure parsing.
   * 
   * @param {object} body - Request body with docketText
   * @returns {Promise<object>} Parsed PACER data
   */
  @Post('parse-pacer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Parse PACER docket text' })
  @ApiResponse({ 
    status: 200, 
    description: 'PACER text parsed successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid docket text' })
  async parsePacerDocket(
    @Body() body: { docketText: string },
  ): Promise<any> {
    return this.pacerParserService.parsePacerText(body.docketText);
  }

  /**
   * Import case from PACER docket
   * 
   * Creates a new case along with parties, motions, and documents from parsed PACER data.
   * This endpoint processes the entire docket and creates all related entities.
   * 
   * @param {any} parsedPacerData - Parsed PACER docket data from frontend
   * @returns {Promise<object>} Created case with parties, motions, and documents
   * 
   * @example
   * POST /api/v1/cases/import-pacer
   * {
   *   "caseInfo": { "docketNumber": "25-1229", "title": "Smith v. Jones", ... },
   *   "parties": [...],
   *   "docketEntries": [...],
   *   "consolidatedCases": [...]
   * }
   */
  @Post('import-pacer')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Import case from PACER docket' })
  @ApiResponse({ 
    status: 201, 
    description: 'Case imported successfully from PACER',
    schema: {
      type: 'object',
      properties: {
        case: { type: 'object' },
        parties: { type: 'array' },
        motions: { type: 'array' },
        documents: { type: 'array' },
        workflow: {
          type: 'object',
          properties: {
            stages: { type: 'array' },
            tasks: { type: 'array' },
          },
        },
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid PACER data' })
  async importFromPacer(
    @Body() parsedPacerData: any,
    // TODO: Get from authenticated user context
    // For now, we'll use a default org and user
  ): Promise<{
    case: Case;
    parties: any[];
    motions: any[];
    documents: any[];
    workflow: {
      stages: any[];
      tasks: any[];
    };
  }> {
    // TODO: Get ownerOrgId and createdBy from authenticated user
    const ownerOrgId = parsedPacerData.ownerOrgId || 'default-org-id';
    const createdBy = parsedPacerData.createdBy || 'system-user-id';

    return this.pacerParserService.createCaseFromPacer(
      parsedPacerData,
      ownerOrgId,
      createdBy,
    );
  }

  /**
   * Get all cases with optional organization filter
   * 
   * Retrieves all cases, optionally filtered by organization ID.
   * Results are ordered by creation date (newest first).
   * 
   * @param {string} [orgId] - Optional organization ID for filtering
   * @returns {Promise<Case[]>} Array of case objects
   * 
   * @example
   * // Get all cases
   * const allCases = await findAll();
   * 
   * @example
   * // Get cases for specific organization
   * const orgCases = await findAll('org-uuid-123');
   */
  @Get()
  @ApiOperation({ summary: 'Get all cases' })
  @ApiQuery({ name: 'orgId', required: false, description: 'Organization ID filter' })
  @ApiResponse({ status: 200, description: 'Cases retrieved successfully', type: [Case] })
  findAll(@Query('orgId') orgId?: string): Promise<Case[]> {
    return this.casesService.findAll(orgId);
  }

  /**
   * Get cases by client name
   * 
   * Retrieves all cases associated with a specific client.
   * Uses partial matching for flexible client name search.
   * 
   * @param {string} clientName - Client name to search for
   * @returns {Promise<Case[]>} Array of matching cases
   * 
   * @example
   * const clientCases = await findByClient("Acme Corporation");
   */
  @Get('client/:clientName')
  @ApiOperation({ summary: 'Get cases by client name' })
  @ApiResponse({ status: 200, description: 'Cases retrieved successfully', type: [Case] })
  findByClient(@Param('clientName') clientName: string): Promise<Case[]> {
    return this.casesService.findByClient(clientName);
  }

  /**
   * Get cases by status
   * 
   * Retrieves all cases with the specified status.
   * Common statuses: Active, Closed, Pending, On Hold.
   * 
   * @param {string} status - Case status to filter by
   * @returns {Promise<Case[]>} Array of cases with matching status
   * 
   * @example
   * const activeCases = await findByStatus("Active");
   * const closedCases = await findByStatus("Closed");
   */
  @Get('status/:status')
  @ApiOperation({ summary: 'Get cases by status' })
  @ApiResponse({ status: 200, description: 'Cases retrieved successfully', type: [Case] })
  findByStatus(@Param('status') status: string): Promise<Case[]> {
    return this.casesService.findByStatus(status);
  }

  /**
   * Get case statistics
   * 
   * Retrieves aggregate statistics about all cases.
   * 
   * @returns {Promise<object>} Statistics object with counts
   * 
   * @example
   * const stats = await getStats();
   * // { total: 150, active: 75, closed: 50, pending: 25 }
   */
  @Get('stats')
  @ApiOperation({ summary: 'Get case statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getStats(): Promise<{
    total: number;
    active: number;
    closed: number;
    pending: number;
  }> {
    return this.casesService.getStats();
  }

  /**
   * Get a single case by ID
   * 
   * Retrieves detailed information about a specific case.
   * Includes all associated data like documents, tasks, timeline, etc.
   * 
   * @param {string} id - Case UUID
   * @returns {Promise<Case>} Complete case object
   * 
   * @throws {NotFoundException} When case is not found
   * 
   * @example
   * const caseDetails = await findOne("case-uuid-123");
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a case by ID' })
  @ApiResponse({ status: 200, description: 'Case retrieved successfully', type: Case })
  @ApiResponse({ status: 404, description: 'Case not found' })
  findOne(@Param('id') id: string): Promise<Case> {
    return this.casesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a case' })
  @ApiResponse({ status: 200, description: 'Case updated successfully', type: Case })
  @ApiResponse({ status: 404, description: 'Case not found' })
  update(
    @Param('id') id: string,
    @Body() updateCaseDto: UpdateCaseDto,
  ): Promise<Case> {
    return this.casesService.update(id, updateCaseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a case' })
  @ApiResponse({ status: 200, description: 'Case deleted successfully' })
  @ApiResponse({ status: 404, description: 'Case not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.casesService.remove(id);
  }
}