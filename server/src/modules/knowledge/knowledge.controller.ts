import { Controller, Get, Post, Patch, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { KnowledgeService } from './knowledge.service';
import { KnowledgeArticle } from '../../models/knowledge.model';

@ApiTags('knowledge')
@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all knowledge articles' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiResponse({ status: 200, description: 'Articles retrieved successfully', type: [KnowledgeArticle] })
  findAll(@Query('category') category?: string): Promise<KnowledgeArticle[]> {
    return this.knowledgeService.findAll(category);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search knowledge articles' })
  @ApiQuery({ name: 'q', required: false, description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully', type: [KnowledgeArticle] })
  search(@Query('q') query?: string): Promise<KnowledgeArticle[]> {
    return this.knowledgeService.search(query || '');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get knowledge article by ID' })
  @ApiResponse({ status: 200, description: 'Article retrieved successfully', type: KnowledgeArticle })
  @ApiResponse({ status: 404, description: 'Article not found' })
  findOne(@Param('id') id: string): Promise<KnowledgeArticle> {
    return this.knowledgeService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create knowledge article' })
  @ApiResponse({ status: 201, description: 'Article created successfully', type: KnowledgeArticle })
  create(@Body() createData: Partial<KnowledgeArticle>): Promise<KnowledgeArticle> {
    return this.knowledgeService.create(createData);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update knowledge article' })
  @ApiResponse({ status: 200, description: 'Article updated successfully', type: KnowledgeArticle })
  @ApiResponse({ status: 404, description: 'Article not found' })
  update(@Param('id') id: string, @Body() updateData: Partial<KnowledgeArticle>): Promise<KnowledgeArticle> {
    return this.knowledgeService.update(id, updateData);
  }
}
