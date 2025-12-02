import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DocumentVersion } from '../../models/document-version.model';
import { Document } from '../../models/document.model';
import { CreateDocumentVersionDto } from './dto/create-document-version.dto';

@Injectable()
export class DocumentVersionsService {
  constructor(
    @InjectModel(DocumentVersion)
    private documentVersionModel: typeof DocumentVersion,
    @InjectModel(Document)
    private documentModel: typeof Document,
  ) {}

  async create(createDocumentVersionDto: CreateDocumentVersionDto): Promise<DocumentVersion> {
    // Verify document exists
    const document = await this.documentModel.findByPk(createDocumentVersionDto.document_id);
    if (!document) {
      throw new NotFoundException(`Document with ID ${createDocumentVersionDto.document_id} not found`);
    }

    // Get the next version number
    const latestVersion = await this.documentVersionModel.findOne({
      where: { document_id: createDocumentVersionDto.document_id },
      order: [['version_number', 'DESC']],
    });

    const nextVersionNumber = latestVersion ? latestVersion.version_number + 1 : 1;

    return this.documentVersionModel.create({
      ...createDocumentVersionDto,
      version_number: nextVersionNumber,
      upload_date: new Date(),
    } as Partial<DocumentVersion>);
  }

  async findAll(documentId?: string): Promise<DocumentVersion[]> {
    const whereClause = documentId ? { document_id: documentId } : {};

    return this.documentVersionModel.findAll({
      where: whereClause,
      include: ['document', 'uploader'],
      order: [['version_number', 'DESC']],
    });
  }

  async findOne(id: string): Promise<DocumentVersion> {
    const version = await this.documentVersionModel.findByPk(id, {
      include: ['document', 'uploader'],
    });

    if (!version) {
      throw new NotFoundException(`Document version with ID ${id} not found`);
    }

    return version;
  }

  async findByDocument(documentId: string): Promise<DocumentVersion[]> {
    return this.documentVersionModel.findAll({
      where: { document_id: documentId },
      include: ['document', 'uploader'],
      order: [['version_number', 'DESC']],
    });
  }
}
