import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DocumentVersion } from '../../models/document-version.model';
import { CreateDocumentVersionDto, UpdateDocumentVersionDto } from './dto/document-version.dto';
import { Op } from 'sequelize';

@Injectable()
export class DocumentVersionsService {
  constructor(
    @InjectModel(DocumentVersion)
    private documentVersionModel: typeof DocumentVersion,
  ) {}

  async create(createDocumentVersionDto: CreateDocumentVersionDto, userId: number): Promise<DocumentVersion> {
    try {
      const version = await this.documentVersionModel.create({
        ...createDocumentVersionDto,
        uploadedBy: userId,
      });
      return version;
    } catch {
      throw new BadRequestException('Failed to create document version');
    }
  }

  async findAll(documentId?: number): Promise<DocumentVersion[]> {
    const where = documentId ? { documentId } : {};
    return this.documentVersionModel.findAll({
      where,
      order: [['versionNumber', 'DESC']],
    });
  }

  async findOne(id: number): Promise<DocumentVersion> {
    const version = await this.documentVersionModel.findByPk(id);
    if (!version) {
      throw new NotFoundException(`Document version with ID ${id} not found`);
    }
    return version;
  }

  async update(id: number, updateDocumentVersionDto: UpdateDocumentVersionDto): Promise<DocumentVersion> {
    const version = await this.findOne(id);
    
    try {
      await version.update(updateDocumentVersionDto);
      return version;
    } catch {
      throw new BadRequestException('Failed to update document version');
    }
  }

  async remove(id: number): Promise<void> {
    const version = await this.findOne(id);
    await version.destroy();
  }

  async findByDocument(documentId: number): Promise<DocumentVersion[]> {
    return this.documentVersionModel.findAll({
      where: { documentId },
      order: [['versionNumber', 'DESC']],
    });
  }

  async findLatestVersion(documentId: number): Promise<DocumentVersion | null> {
    return this.documentVersionModel.findOne({
      where: { documentId },
      order: [['versionNumber', 'DESC']],
    });
  }

  async findByUser(uploadedBy: number): Promise<DocumentVersion[]> {
    return this.documentVersionModel.findAll({
      where: { uploadedBy },
      order: [['uploadDate', 'DESC']],
    });
  }

  async search(query: string, documentId?: number): Promise<DocumentVersion[]> {
    const where: Record<string, unknown> = {
      [Op.or]: [
        { fileName: { [Op.iLike]: `%${query}%` } },
        { changeDescription: { [Op.iLike]: `%${query}%` } },
      ],
    };

    if (documentId) {
      where.documentId = documentId;
    }

    return this.documentVersionModel.findAll({
      where,
      order: [['uploadDate', 'DESC']],
    });
  }
}