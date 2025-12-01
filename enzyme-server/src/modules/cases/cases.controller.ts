import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { Case } from '../../models/case.model';

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
   */
  constructor(private readonly casesService: CasesService) {}

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