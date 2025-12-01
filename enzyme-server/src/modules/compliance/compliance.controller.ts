import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ComplianceService } from './compliance.service';
import { ComplianceRecord } from '../../models/compliance.model';

@ApiTags('compliance')
@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new compliance record' })
  @ApiResponse({ status: 201, description: 'Compliance record created successfully', type: ComplianceRecord })
  create(@Body() createComplianceData: Partial<ComplianceRecord>): Promise<ComplianceRecord> {
    return this.complianceService.create(createComplianceData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all compliance records' })
  @ApiQuery({ name: 'orgId', required: false, description: 'Organization ID filter' })
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

  @Get(':id')
  @ApiOperation({ summary: 'Get compliance record by ID' })
  @ApiResponse({ status: 200, description: 'Compliance record retrieved successfully', type: ComplianceRecord })
  @ApiResponse({ status: 404, description: 'Compliance record not found' })
  findOne(@Param('id') id: string): Promise<ComplianceRecord> {
    return this.complianceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update compliance record' })
  @ApiResponse({ status: 200, description: 'Compliance record updated successfully', type: ComplianceRecord })
  @ApiResponse({ status: 404, description: 'Compliance record not found' })
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<ComplianceRecord>,
  ): Promise<ComplianceRecord> {
    return this.complianceService.update(id, updateData);
  }
}