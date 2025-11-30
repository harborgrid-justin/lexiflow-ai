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
import { JurisdictionsService } from './jurisdictions.service';
import { Jurisdiction } from '../../models/jurisdiction.model';

@ApiTags('jurisdictions')
@Controller('jurisdictions')
export class JurisdictionsController {
  constructor(private readonly jurisdictionsService: JurisdictionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new jurisdiction' })
  @ApiResponse({ status: 201, description: 'Jurisdiction created successfully', type: Jurisdiction })
  create(@Body() createJurisdictionData: Partial<Jurisdiction>): Promise<Jurisdiction> {
    return this.jurisdictionsService.create(createJurisdictionData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all jurisdictions' })
  @ApiQuery({ name: 'country', required: false, description: 'Country filter' })
  @ApiResponse({ status: 200, description: 'Jurisdictions retrieved successfully', type: [Jurisdiction] })
  findAll(@Query('country') country?: string): Promise<Jurisdiction[]> {
    return this.jurisdictionsService.findAll(country);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get jurisdiction by code' })
  @ApiResponse({ status: 200, description: 'Jurisdiction retrieved successfully', type: Jurisdiction })
  @ApiResponse({ status: 404, description: 'Jurisdiction not found' })
  findByCode(@Param('code') code: string): Promise<Jurisdiction> {
    return this.jurisdictionsService.findByCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get jurisdiction by ID' })
  @ApiResponse({ status: 200, description: 'Jurisdiction retrieved successfully', type: Jurisdiction })
  @ApiResponse({ status: 404, description: 'Jurisdiction not found' })
  findOne(@Param('id') id: string): Promise<Jurisdiction> {
    return this.jurisdictionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update jurisdiction' })
  @ApiResponse({ status: 200, description: 'Jurisdiction updated successfully', type: Jurisdiction })
  @ApiResponse({ status: 404, description: 'Jurisdiction not found' })
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<Jurisdiction>,
  ): Promise<Jurisdiction> {
    return this.jurisdictionsService.update(id, updateData);
  }
}