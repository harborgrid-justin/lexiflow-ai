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
import { KnowledgeService } from './knowledge.service';
import { KnowledgeArticle } from '../../models/knowledge.model';

@ApiTags('knowledge')
@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new knowledge article' })
  @ApiResponse({ status: 201, description: 'Knowledge article created successfully', type: KnowledgeArticle })
  create(@Body() createKnowledgeData: Partial<KnowledgeArticle>): Promise<KnowledgeArticle> {
    return this.knowledgeService.create(createKnowledgeData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all knowledge articles' })
  @ApiQuery({ name: 'category', required: false, description: 'Category filter' })
  @ApiResponse({ status: 200, description: 'Knowledge articles retrieved successfully', type: [KnowledgeArticle] })
  findAll(@Query('category') category?: string): Promise<KnowledgeArticle[]> {
    return this.knowledgeService.findAll(category);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search knowledge articles' })
  @ApiQuery({ name: 'q', required: true, description: 'Search query' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully', type: [KnowledgeArticle] })
  search(@Query('q') query: string): Promise<KnowledgeArticle[]> {
    return this.knowledgeService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get knowledge article by ID' })
  @ApiResponse({ status: 200, description: 'Knowledge article retrieved successfully', type: KnowledgeArticle })
  @ApiResponse({ status: 404, description: 'Knowledge article not found' })
  findOne(@Param('id') id: string): Promise<KnowledgeArticle> {
    return this.knowledgeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update knowledge article' })
  @ApiResponse({ status: 200, description: 'Knowledge article updated successfully', type: KnowledgeArticle })
  @ApiResponse({ status: 404, description: 'Knowledge article not found' })
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<KnowledgeArticle>,
  ): Promise<KnowledgeArticle> {
    return this.knowledgeService.update(id, updateData);
  }
}