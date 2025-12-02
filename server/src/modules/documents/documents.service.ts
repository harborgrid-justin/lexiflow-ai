import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Document } from '../../models/document.model';
import { DocumentVersion } from '../../models/document-version.model';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document)
    private documentModel: typeof Document,
    @InjectModel(DocumentVersion)
    private documentVersionModel: typeof DocumentVersion,
  ) {}

  async create(createDocumentDto: CreateDocumentDto): Promise<Document> {
    return this.documentModel.create(createDocumentDto as unknown as Partial<Document>);
  }

  async findAll(caseId?: string, orgId?: string): Promise<Document[]> {
    const whereClause: Record<string, string> = {};
    if (caseId) whereClause.case_id = caseId;
    if (orgId) whereClause.owner_org_id = orgId;

    return this.documentModel.findAll({
      where: whereClause,
      include: [
        'case',
        'creator',
        'modifier',
        'organization',
        'versions',
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentModel.findByPk(id, {
      include: [
        'case',
        'creator',
        'modifier',
        'organization',
        'versions',
      ],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  async findByType(type: string, orgId?: string): Promise<Document[]> {
    const whereClause: Record<string, string> = { type };
    if (orgId) whereClause.owner_org_id = orgId;

    return this.documentModel.findAll({
      where: whereClause,
      include: ['case', 'creator', 'modifier', 'organization'],
      order: [['created_at', 'DESC']],
    });
  }

  async getContent(id: string): Promise<{ content: string; mimeType: string }> {
    const document = await this.findOne(id);
    return {
      content: document.content || '',
      mimeType: document.mime_type || 'text/plain',
    };
  }

  async update(id: string, updateDocumentDto: UpdateDocumentDto): Promise<Document> {
    const [affectedCount, affectedRows] = await this.documentModel.update(
      updateDocumentDto,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return affectedRows[0];
  }

  async remove(id: string): Promise<void> {
    const deletedCount = await this.documentModel.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
  }

  async createVersion(documentId: string, versionData: Partial<DocumentVersion>): Promise<DocumentVersion> {
    // Verify document exists
    await this.findOne(documentId);

    // Get the latest version number
    const latestVersion = await this.documentVersionModel.findOne({
      where: { document_id: documentId },
      order: [['version_number', 'DESC']],
    });

    const nextVersionNumber = latestVersion ? latestVersion.version_number + 1 : 1;

    return this.documentVersionModel.create({
      ...versionData,
      document_id: documentId,
      version_number: nextVersionNumber,
      upload_date: new Date(),
    } as Partial<DocumentVersion>);
  }
}