import { Controller, Get, Post, Patch, Delete, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ClausesService } from './clauses.service';
import { Clause } from '../../models/clause.model';

@ApiTags('clauses')
@Controller('clauses')
export class ClausesController {
  constructor(private readonly clausesService: ClausesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all clauses' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by type' })
  @ApiResponse({ status: 200, description: 'Clauses retrieved successfully', type: [Clause] })
  findAll(
    @Query('category') category?: string,
    @Query('type') type?: string,
  ): Promise<Clause[]> {
    return this.clausesService.findAll(category, type);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search clauses' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully', type: [Clause] })
  search(@Query('q') query?: string): Promise<Clause[]> {
    return this.clausesService.search(query || '');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clause by ID' })
  @ApiResponse({ status: 200, description: 'Clause retrieved successfully', type: Clause })
  @ApiResponse({ status: 404, description: 'Clause not found' })
  findOne(@Param('id') id: string): Promise<Clause> {
    return this.clausesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create clause' })
  @ApiResponse({ status: 201, description: 'Clause created successfully', type: Clause })
  create(@Body() createData: Partial<Clause>): Promise<Clause> {
    return this.clausesService.create(createData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update clause' })
  @ApiResponse({ status: 200, description: 'Clause updated successfully', type: Clause })
  @ApiResponse({ status: 404, description: 'Clause not found' })
  update(@Param('id') id: string, @Body() updateData: Partial<Clause>): Promise<Clause> {
    return this.clausesService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete clause' })
  @ApiResponse({ status: 200, description: 'Clause deleted successfully' })
  @ApiResponse({ status: 404, description: 'Clause not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.clausesService.remove(id);
  }
}
