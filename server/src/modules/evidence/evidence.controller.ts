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
import { EvidenceService } from './evidence.service';
import { Evidence } from '../../models/evidence.model';

@ApiTags('evidence')
@Controller('evidence')
export class EvidenceController {
  constructor(private readonly evidenceService: EvidenceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new evidence record' })
  @ApiResponse({ status: 201, description: 'Evidence created successfully', type: Evidence })
  create(@Body() createEvidenceData: Partial<Evidence>): Promise<Evidence> {
    return this.evidenceService.create(createEvidenceData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all evidence records' })
  @ApiQuery({ name: 'caseId', required: false, description: 'Case ID filter' })
  @ApiResponse({ status: 200, description: 'Evidence retrieved successfully', type: [Evidence] })
  findAll(@Query('caseId') caseId?: string): Promise<Evidence[]> {
    return this.evidenceService.findAll(caseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get evidence by ID' })
  @ApiResponse({ status: 200, description: 'Evidence retrieved successfully', type: Evidence })
  @ApiResponse({ status: 404, description: 'Evidence not found' })
  findOne(@Param('id') id: string): Promise<Evidence> {
    return this.evidenceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update evidence' })
  @ApiResponse({ status: 200, description: 'Evidence updated successfully', type: Evidence })
  @ApiResponse({ status: 404, description: 'Evidence not found' })
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<Evidence>,
  ): Promise<Evidence> {
    return this.evidenceService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete evidence' })
  @ApiResponse({ status: 200, description: 'Evidence deleted successfully' })
  @ApiResponse({ status: 404, description: 'Evidence not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.evidenceService.remove(id);
  }
}