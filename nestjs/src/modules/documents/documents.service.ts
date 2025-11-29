import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Document } from '../../models/document.model';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document)
    private documentModel: typeof Document,
  ) {}

  async create(createDocData: Partial<Document>): Promise<Document> {
    return this.documentModel.create(createDocData);
  }

  async findAll(caseId?: string, orgId?: string): Promise<Document[]> {
    const whereClause: any = {};
    if (caseId) whereClause.case_id = caseId;
    if (orgId) whereClause.owner_org_id = orgId;
    
    return this.documentModel.findAll({
      where: whereClause,
      include: ['case', 'creator', 'modifier', 'organization'],
    });
  }

  async findOne(id: string): Promise<Document> {
    const document = await this.documentModel.findByPk(id, {
      include: ['case', 'creator', 'modifier', 'organization'],
    });

    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return document;
  }

  async update(id: string, updateData: Partial<Document>): Promise<Document> {
    const [affectedCount, affectedRows] = await this.documentModel.update(
      updateData,
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

  async findByType(type: string): Promise<Document[]> {
    return this.documentModel.findAll({
      where: { type },
      include: ['case', 'creator', 'modifier', 'organization'],
    });
  }
}