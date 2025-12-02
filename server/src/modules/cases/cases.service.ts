import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Case } from '../../models/case.model';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';

@Injectable()
export class CasesService {
  constructor(
    @InjectModel(Case)
    private caseModel: typeof Case,
  ) {}

  async create(createCaseDto: CreateCaseDto): Promise<Case> {
    // Convert filing_date string to Date if provided
    const caseData = {
      ...createCaseDto,
      filing_date: createCaseDto.filing_date ? new Date(createCaseDto.filing_date) : undefined,
    };
    return this.caseModel.create(caseData as unknown as Partial<Case>);
  }

  async findAll(orgId?: string): Promise<Case[]> {
    const whereClause = orgId ? { owner_org_id: orgId } : {};
    return this.caseModel.findAll({
      where: whereClause,
      include: [
        'organization',
        'parties',
        'caseMembers',
        'docketEntries',
      ],
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(id: string): Promise<Case> {
    const caseRecord = await this.caseModel.findByPk(id, {
      include: [
        'organization',
        'parties',
        'caseMembers',
        'docketEntries',
      ],
    });

    if (!caseRecord) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }

    return caseRecord;
  }

  async update(id: string, updateCaseDto: UpdateCaseDto): Promise<Case> {
    const [affectedCount, affectedRows] = await this.caseModel.update(
      updateCaseDto,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }

    return affectedRows[0];
  }

  async remove(id: string): Promise<void> {
    const deletedCount = await this.caseModel.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }
  }

  async findByClient(clientName: string): Promise<Case[]> {
    return this.caseModel.findAll({
      where: { client_name: clientName },
      include: ['organization'],
    });
  }

  async findByStatus(status: string): Promise<Case[]> {
    return this.caseModel.findAll({
      where: { status },
      include: ['organization'],
    });
  }

  async getStats(): Promise<{
    total: number;
    active: number;
    closed: number;
    pending: number;
  }> {
    const [total, active, closed, pending] = await Promise.all([
      this.caseModel.count(),
      this.caseModel.count({ where: { status: 'Active' } }),
      this.caseModel.count({ where: { status: 'Closed' } }),
      this.caseModel.count({ where: { status: 'Pending' } }),
    ]);

    return { total, active, closed, pending };
  }
}