import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ComplianceService } from './compliance.service';
import { CreateComplianceDto } from './dto/create-compliance.dto';
import { UpdateComplianceDto } from './dto/update-compliance.dto';
import { ComplianceRecord } from '../../models/compliance.model';
import { ConflictCheck } from '../../models/conflict-check.model';
import { EthicalWall } from '../../models/ethical-wall.model';

@ApiTags('compliance')
@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all compliance records' })
  @ApiQuery({ name: 'orgId', required: false, description: 'Filter by organization ID' })
  @ApiResponse({ status: 200, description: 'Compliance records retrieved successfully', type: [ComplianceRecord] })
  findAll(@Query('orgId') orgId?: string): Promise<ComplianceRecord[]> {
    return this.complianceService.findAll(orgId);
  }

  @Get('risk-level/:riskLevel')
  @ApiOperation({ summary: 'Get compliance records by risk level' })
  @ApiResponse({ status: 200, description: 'Compliance records retrieved successfully', type: [ComplianceRecord] })
  findByRiskLevel(@Param('riskLevel') riskLevel: string): Promise<ComplianceRecord[]> {
    return this.complianceService.findByRiskLevel(riskLevel);
  }

  @Get('conflicts')
  @ApiOperation({ summary: 'Get conflict checks' })
  @ApiQuery({ name: 'orgId', required: false, description: 'Filter by organization ID' })
  @ApiResponse({ status: 200, description: 'Conflict checks retrieved successfully', type: [ConflictCheck] })
  getConflicts(@Query('orgId') orgId?: string): Promise<ConflictCheck[]> {
    return this.complianceService.getConflicts(orgId);
  }

  @Post('conflicts')
  @ApiOperation({ summary: 'Create a conflict check' })
  @ApiResponse({ status: 201, description: 'Conflict check created successfully', type: ConflictCheck })
  createConflict(@Body() createDto: any): Promise<ConflictCheck> {
    return this.complianceService.createConflict(createDto);
  }

  @Get('walls')
  @ApiOperation({ summary: 'Get ethical walls' })
  @ApiQuery({ name: 'orgId', required: false, description: 'Filter by organization ID' })
  @ApiResponse({ status: 200, description: 'Ethical walls retrieved successfully', type: [EthicalWall] })
  getWalls(@Query('orgId') orgId?: string): Promise<EthicalWall[]> {
    return this.complianceService.getWalls(orgId);
  }

  @Post('walls')
  @ApiOperation({ summary: 'Create an ethical wall' })
  @ApiResponse({ status: 201, description: 'Ethical wall created successfully', type: EthicalWall })
  createWall(@Body() createDto: any): Promise<EthicalWall> {
    return this.complianceService.createWall(createDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get compliance record by ID' })
  @ApiResponse({ status: 200, description: 'Compliance record retrieved successfully', type: ComplianceRecord })
  @ApiResponse({ status: 404, description: 'Compliance record not found' })
  findOne(@Param('id') id: string): Promise<ComplianceRecord> {
    return this.complianceService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new compliance record' })
  @ApiResponse({ status: 201, description: 'Compliance record created successfully', type: ComplianceRecord })
  create(@Body() createDto: CreateComplianceDto): Promise<ComplianceRecord> {
    return this.complianceService.create(createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update compliance record' })
  @ApiResponse({ status: 200, description: 'Compliance record updated successfully', type: ComplianceRecord })
  @ApiResponse({ status: 404, description: 'Compliance record not found' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateComplianceDto,
  ): Promise<ComplianceRecord> {
    return this.complianceService.update(id, updateDto);
  }
}