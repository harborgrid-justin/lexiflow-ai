import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConsolidatedCase } from '../../models/consolidated-case.model';
import { CreateConsolidatedCaseDto } from './dto/create-consolidated-case.dto';
import { UpdateConsolidatedCaseDto } from './dto/update-consolidated-case.dto';

@Injectable()
export class ConsolidatedCasesService {
  constructor(
    @InjectModel(ConsolidatedCase)
    private consolidatedCaseModel: typeof ConsolidatedCase,
  ) {}

  async create(createConsolidatedCaseDto: CreateConsolidatedCaseDto): Promise<ConsolidatedCase> {
    return this.consolidatedCaseModel.create(createConsolidatedCaseDto as any);
  }

  async findAll(): Promise<ConsolidatedCase[]> {
    return this.consolidatedCaseModel.findAll({
      order: [['date_start', 'DESC']],
    });
  }

  async findByCaseId(caseId: string): Promise<ConsolidatedCase[]> {
    const { Op } = require('sequelize');
    return this.consolidatedCaseModel.findAll({
      where: {
        [Op.or]: [
          { lead_case_id: caseId },
          { member_case_id: caseId },
        ],
      },
      order: [['date_start', 'DESC']],
    });
  }

  async findLeadCases(caseId: string): Promise<ConsolidatedCase[]> {
    return this.consolidatedCaseModel.findAll({
      where: { member_case_id: caseId },
      order: [['date_start', 'DESC']],
    });
  }

  async findMemberCases(caseId: string): Promise<ConsolidatedCase[]> {
    return this.consolidatedCaseModel.findAll({
      where: { lead_case_id: caseId },
      order: [['date_start', 'DESC']],
    });
  }

  async findOne(id: string): Promise<ConsolidatedCase> {
    const consolidatedCase = await this.consolidatedCaseModel.findByPk(id);
    if (!consolidatedCase) {
      throw new NotFoundException(`Consolidated case with ID ${id} not found`);
    }
    return consolidatedCase;
  }

  async update(id: string, updateConsolidatedCaseDto: UpdateConsolidatedCaseDto): Promise<ConsolidatedCase> {
    const consolidatedCase = await this.findOne(id);
    return consolidatedCase.update(updateConsolidatedCaseDto as any);
  }

  async remove(id: string): Promise<void> {
    const consolidatedCase = await this.findOne(id);
    await consolidatedCase.destroy();
  }
}
