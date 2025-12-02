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
import { CreateJurisdictionDto, UpdateJurisdictionDto } from './dto';

@ApiTags('jurisdictions')
@Controller('jurisdictions')
export class JurisdictionsController {
  constructor(private readonly jurisdictionsService: JurisdictionsService) {}

  @Get()
  @ApiOperation({ summary: 'List jurisdictions' })
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

  @Post()
  @ApiOperation({ summary: 'Create jurisdiction' })
  @ApiResponse({ status: 201, description: 'Jurisdiction created successfully', type: Jurisdiction })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createJurisdictionDto: CreateJurisdictionDto): Promise<Jurisdiction> {
    return this.jurisdictionsService.create(createJurisdictionDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update jurisdiction' })
  @ApiResponse({ status: 200, description: 'Jurisdiction updated successfully', type: Jurisdiction })
  @ApiResponse({ status: 404, description: 'Jurisdiction not found' })
  update(
    @Param('id') id: string,
    @Body() updateJurisdictionDto: UpdateJurisdictionDto,
  ): Promise<Jurisdiction> {
    return this.jurisdictionsService.update(id, updateJurisdictionDto);
  }
}
