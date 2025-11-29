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
import { ClausesService } from './clauses.service';
import { Clause } from '../../models/clause.model';

@ApiTags('clauses')
@Controller('clauses')
export class ClausesController {
  constructor(private readonly clausesService: ClausesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new clause' })
  @ApiResponse({ status: 201, description: 'Clause created successfully', type: Clause })
  create(@Body() createClauseData: Partial<Clause>): Promise<Clause> {
    return this.clausesService.create(createClauseData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all clauses' })
  @ApiQuery({ name: 'category', required: false, description: 'Category filter' })
  @ApiQuery({ name: 'type', required: false, description: 'Type filter' })
  @ApiResponse({ status: 200, description: 'Clauses retrieved successfully', type: [Clause] })
  findAll(@Query('category') category?: string, @Query('type') type?: string): Promise<Clause[]> {
    return this.clausesService.findAll(category, type);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search clauses' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully', type: [Clause] })
  search(@Query('q') query: string): Promise<Clause[]> {
    return this.clausesService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clause by ID' })
  @ApiResponse({ status: 200, description: 'Clause retrieved successfully', type: Clause })
  @ApiResponse({ status: 404, description: 'Clause not found' })
  findOne(@Param('id') id: string): Promise<Clause> {
    return this.clausesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update clause' })
  @ApiResponse({ status: 200, description: 'Clause updated successfully', type: Clause })
  @ApiResponse({ status: 404, description: 'Clause not found' })
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<Clause>,
  ): Promise<Clause> {
    return this.clausesService.update(id, updateData);
  }
}