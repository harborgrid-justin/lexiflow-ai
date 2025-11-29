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
import { DocumentsService } from './documents.service';
import { Document } from '../../models/document.model';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new document' })
  @ApiResponse({ status: 201, description: 'Document created successfully', type: Document })
  create(@Body() createDocData: Partial<Document>): Promise<Document> {
    return this.documentsService.create(createDocData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  @ApiQuery({ name: 'caseId', required: false, description: 'Case ID filter' })
  @ApiQuery({ name: 'orgId', required: false, description: 'Organization ID filter' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully', type: [Document] })
  findAll(@Query('caseId') caseId?: string, @Query('orgId') orgId?: string): Promise<Document[]> {
    return this.documentsService.findAll(caseId, orgId);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get documents by type' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully', type: [Document] })
  findByType(@Param('type') type: string): Promise<Document[]> {
    return this.documentsService.findByType(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a document by ID' })
  @ApiResponse({ status: 200, description: 'Document retrieved successfully', type: Document })
  @ApiResponse({ status: 404, description: 'Document not found' })
  findOne(@Param('id') id: string): Promise<Document> {
    return this.documentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a document' })
  @ApiResponse({ status: 200, description: 'Document updated successfully', type: Document })
  @ApiResponse({ status: 404, description: 'Document not found' })
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<Document>,
  ): Promise<Document> {
    return this.documentsService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.documentsService.remove(id);
  }
}