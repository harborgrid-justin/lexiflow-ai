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
    return this.caseModel.create(createCaseDto as any);
  }

  async findAll(orgId?: string): Promise<Case[]> {
    const whereClause = orgId ? { owner_org_id: orgId } : {};
    return this.caseModel.findAll({
      where: whereClause,
      include: ['organization'],
    });
  }

  async findOne(id: string): Promise<Case> {
    const caseRecord = await this.caseModel.findByPk(id, {
      include: ['organization'],
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
}