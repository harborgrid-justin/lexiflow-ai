import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { Organization } from '../../models/organization.model';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto';

@ApiTags('organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get()
  @ApiOperation({ summary: 'List organizations' })
  @ApiResponse({ status: 200, description: 'Organizations retrieved successfully', type: [Organization] })
  findAll(): Promise<Organization[]> {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get organization by ID' })
  @ApiResponse({ status: 200, description: 'Organization retrieved successfully', type: Organization })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  findOne(@Param('id') id: string): Promise<Organization> {
    return this.organizationsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create organization' })
  @ApiResponse({ status: 201, description: 'Organization created successfully', type: Organization })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update organization' })
  @ApiResponse({ status: 200, description: 'Organization updated successfully', type: Organization })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  update(
    @Param('id') id: string,
    @Body() updateOrganizationDto: UpdateOrganizationDto,
  ): Promise<Organization> {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete organization' })
  @ApiResponse({ status: 200, description: 'Organization deleted successfully' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.organizationsService.remove(id);
  }
}
