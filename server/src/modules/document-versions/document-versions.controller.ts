import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DocumentVersionsService } from './document-versions.service';
import { CreateDocumentVersionDto, UpdateDocumentVersionDto } from './dto/document-version.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('document-versions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('document-versions')
export class DocumentVersionsController {
  constructor(private readonly documentVersionsService: DocumentVersionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new document version' })
  @ApiResponse({ status: 201, description: 'Document version created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createDocumentVersionDto: CreateDocumentVersionDto, @Request() req: { user: { id: number } }) {
    return this.documentVersionsService.create(createDocumentVersionDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all document versions' })
  @ApiQuery({ name: 'documentId', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Document versions retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @Query('documentId', new ParseIntPipe({ optional: true })) documentId?: number,
    @Query('search') search?: string,
  ) {
    if (search) {
      return this.documentVersionsService.search(search, documentId);
    }
    return this.documentVersionsService.findAll(documentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a document version by ID' })
  @ApiResponse({ status: 200, description: 'Document version retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Document version not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentVersionsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a document version' })
  @ApiResponse({ status: 200, description: 'Document version updated successfully' })
  @ApiResponse({ status: 404, description: 'Document version not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDocumentVersionDto: UpdateDocumentVersionDto) {
    return this.documentVersionsService.update(id, updateDocumentVersionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document version' })
  @ApiResponse({ status: 200, description: 'Document version deleted successfully' })
  @ApiResponse({ status: 404, description: 'Document version not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentVersionsService.remove(id);
  }

  @Get('document/:documentId')
  @ApiOperation({ summary: 'Get versions for a specific document' })
  @ApiResponse({ status: 200, description: 'Document versions retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByDocument(@Param('documentId', ParseIntPipe) documentId: number) {
    return this.documentVersionsService.findByDocument(documentId);
  }

  @Get('document/:documentId/latest')
  @ApiOperation({ summary: 'Get latest version for a specific document' })
  @ApiResponse({ status: 200, description: 'Latest document version retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Document version not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findLatestVersion(@Param('documentId', ParseIntPipe) documentId: number) {
    return this.documentVersionsService.findLatestVersion(documentId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get document versions uploaded by a user' })
  @ApiResponse({ status: 200, description: 'Document versions retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.documentVersionsService.findByUser(userId);
  }
}