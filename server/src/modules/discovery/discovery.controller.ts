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
import { DiscoveryService } from './discovery.service';
import { DiscoveryRequest } from '../../models/discovery.model';

@ApiTags('discovery')
@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new discovery request' })
  @ApiResponse({ status: 201, description: 'Discovery request created successfully', type: DiscoveryRequest })
  create(@Body() createDiscoveryData: Partial<DiscoveryRequest>): Promise<DiscoveryRequest> {
    return this.discoveryService.create(createDiscoveryData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all discovery requests' })
  @ApiQuery({ name: 'caseId', required: false, description: 'Case ID filter' })
  @ApiResponse({ status: 200, description: 'Discovery requests retrieved successfully', type: [DiscoveryRequest] })
  findAll(@Query('caseId') caseId?: string): Promise<DiscoveryRequest[]> {
    return this.discoveryService.findAll(caseId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get discovery request by ID' })
  @ApiResponse({ status: 200, description: 'Discovery request retrieved successfully', type: DiscoveryRequest })
  @ApiResponse({ status: 404, description: 'Discovery request not found' })
  findOne(@Param('id') id: string): Promise<DiscoveryRequest> {
    return this.discoveryService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update discovery request' })
  @ApiResponse({ status: 200, description: 'Discovery request updated successfully', type: DiscoveryRequest })
  @ApiResponse({ status: 404, description: 'Discovery request not found' })
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<DiscoveryRequest>,
  ): Promise<DiscoveryRequest> {
    return this.discoveryService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete discovery request' })
  @ApiResponse({ status: 200, description: 'Discovery request deleted successfully' })
  @ApiResponse({ status: 404, description: 'Discovery request not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.discoveryService.remove(id);
  }
}