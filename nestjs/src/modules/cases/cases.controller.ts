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

@ApiTags('cases')
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new case' })
  @ApiResponse({ status: 201, description: 'Case created successfully', type: Case })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createCaseDto: CreateCaseDto): Promise<Case> {
    return this.casesService.create(createCaseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cases' })
  @ApiQuery({ name: 'orgId', required: false, description: 'Organization ID filter' })
  @ApiResponse({ status: 200, description: 'Cases retrieved successfully', type: [Case] })
  findAll(@Query('orgId') orgId?: string): Promise<Case[]> {
    return this.casesService.findAll(orgId);
  }

  @Get('client/:clientName')
  @ApiOperation({ summary: 'Get cases by client name' })
  @ApiResponse({ status: 200, description: 'Cases retrieved successfully', type: [Case] })
  findByClient(@Param('clientName') clientName: string): Promise<Case[]> {
    return this.casesService.findByClient(clientName);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get cases by status' })
  @ApiResponse({ status: 200, description: 'Cases retrieved successfully', type: [Case] })
  findByStatus(@Param('status') status: string): Promise<Case[]> {
    return this.casesService.findByStatus(status);
  }

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