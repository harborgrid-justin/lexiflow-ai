import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
  StreamableFile,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Multer } from 'multer';
import { createReadStream, existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DocumentsService } from './documents.service';
import { Document } from '../../models/document.model';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

// Storage path for uploaded documents
const UPLOAD_DIR = process.env.DOCUMENT_STORAGE_PATH || './uploads/documents';

@ApiTags('documents')
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new document metadata record' })
  @ApiResponse({
    status: 201,
    description: 'Document created successfully',
    type: Document,
  })
  create(@Body() createDocumentDto: CreateDocumentDto): Promise<Document> {
    return this.documentsService.create(createDocumentDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a document file with metadata' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Document file to upload',
        },
        title: {
          type: 'string',
          description: 'Document title',
        },
        type: {
          type: 'string',
          description: 'Document type (e.g., Contract, Brief, Motion)',
        },
        case_id: {
          type: 'string',
          format: 'uuid',
          description: 'Associated case ID',
        },
        description: {
          type: 'string',
          description: 'Document description',
        },
        tags: {
          type: 'string',
          description: 'Comma-separated tags',
        },
        classification: {
          type: 'string',
          description: 'Security classification',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Document uploaded successfully',
    type: Document,
  })
  @ApiResponse({ status: 400, description: 'No file uploaded or invalid file' })
  async uploadDocument(
    @UploadedFile() file: { buffer: Buffer; originalname: string; mimetype: string; size: number },
    @Body()
    metadata: {
      title?: string;
      type?: string;
      case_id?: string;
      description?: string;
      tags?: string;
      classification?: string;
    },
  ): Promise<Document> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Ensure upload directory exists
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop() || '';
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    const filePath = join(UPLOAD_DIR, uniqueFilename);

    // Save file to disk
    await writeFile(filePath, file.buffer);

    // Create document record
    const documentData: Partial<Document> = {
      filename: file.originalname,
      title: metadata.title || file.originalname,
      type: metadata.type || 'General',
      file_path: filePath,
      mime_type: file.mimetype,
      file_size: file.size,
      description: metadata.description,
      tags: metadata.tags,
      classification: metadata.classification,
      upload_date: new Date(),
      status: 'draft',
    };

    if (metadata.case_id) {
      documentData.case_id = metadata.case_id;
    }

    return this.documentsService.create(documentData as CreateDocumentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all documents' })
  @ApiQuery({ name: 'caseId', required: false, description: 'Case ID filter' })
  @ApiQuery({
    name: 'orgId',
    required: false,
    description: 'Organization ID filter',
  })
  @ApiResponse({
    status: 200,
    description: 'Documents retrieved successfully',
    type: [Document],
  })
  findAll(
    @Query('caseId') caseId?: string,
    @Query('orgId') orgId?: string,
  ): Promise<Document[]> {
    return this.documentsService.findAll(caseId, orgId);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get documents by type' })
  @ApiResponse({
    status: 200,
    description: 'Documents retrieved successfully',
    type: [Document],
  })
  findByType(@Param('type') type: string): Promise<Document[]> {
    return this.documentsService.findByType(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a document by ID' })
  @ApiResponse({
    status: 200,
    description: 'Document retrieved successfully',
    type: Document,
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  findOne(@Param('id') id: string): Promise<Document> {
    return this.documentsService.findOne(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download a document file' })
  @ApiResponse({ status: 200, description: 'File download stream' })
  @ApiResponse({ status: 404, description: 'Document or file not found' })
  async downloadDocument(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<StreamableFile> {
    const document = await this.documentsService.findOne(id);

    if (!document.file_path || !existsSync(document.file_path)) {
      throw new NotFoundException('Document file not found on disk');
    }

    const file = createReadStream(document.file_path);

    // Set response headers
    res.set({
      'Content-Type': document.mime_type || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(document.filename)}"`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    });

    return new StreamableFile(file);
  }

  @Get(':id/content')
  @ApiOperation({ summary: 'Get document content/preview' })
  @ApiResponse({
    status: 200,
    description: 'Document content retrieved',
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string' },
        mimeType: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getContent(
    @Param('id') id: string,
  ): Promise<{ content: string; mimeType: string }> {
    const document = await this.documentsService.findOne(id);

    return {
      content: document.content || '',
      mimeType: document.mime_type || 'text/plain',
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a document' })
  @ApiResponse({
    status: 200,
    description: 'Document updated successfully',
    type: Document,
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
  ): Promise<Document> {
    return this.documentsService.update(id, updateDocumentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a document' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.documentsService.remove(id);
  }
}
