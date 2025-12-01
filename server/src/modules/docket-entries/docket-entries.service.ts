import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DocketEntry } from '../../models/docket-entry.model';
import { CreateDocketEntryDto } from './dto/create-docket-entry.dto';
import { UpdateDocketEntryDto } from './dto/update-docket-entry.dto';

@Injectable()
export class DocketEntriesService {
  constructor(
    @InjectModel(DocketEntry)
    private docketEntryModel: typeof DocketEntry,
  ) {}

  async create(createDocketEntryDto: CreateDocketEntryDto): Promise<DocketEntry> {
    return this.docketEntryModel.create(createDocketEntryDto as any);
  }

  async findAll(): Promise<DocketEntry[]> {
    return this.docketEntryModel.findAll({
      order: [['date_filed', 'DESC'], ['entry_number', 'DESC']],
    });
  }

  async findByCaseId(caseId: string): Promise<DocketEntry[]> {
    return this.docketEntryModel.findAll({
      where: { case_id: caseId },
      order: [['entry_number', 'ASC']],
    });
  }

  async findOne(id: string): Promise<DocketEntry> {
    const docketEntry = await this.docketEntryModel.findByPk(id);
    if (!docketEntry) {
      throw new NotFoundException(`Docket entry with ID ${id} not found`);
    }
    return docketEntry;
  }

  async update(id: string, updateDocketEntryDto: UpdateDocketEntryDto): Promise<DocketEntry> {
    const docketEntry = await this.findOne(id);
    return docketEntry.update(updateDocketEntryDto as any);
  }

  async remove(id: string): Promise<void> {
    const docketEntry = await this.findOne(id);
    await docketEntry.destroy();
  }

  async findByDocumentType(caseId: string, documentType: string): Promise<DocketEntry[]> {
    return this.docketEntryModel.findAll({
      where: {
        case_id: caseId,
        document_type: documentType,
      },
      order: [['date_filed', 'DESC']],
    });
  }

  async findByDateRange(caseId: string, startDate: Date, endDate: Date): Promise<DocketEntry[]> {
    const { Op } = require('sequelize');
    return this.docketEntryModel.findAll({
      where: {
        case_id: caseId,
        date_filed: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['date_filed', 'DESC']],
    });
  }
}
