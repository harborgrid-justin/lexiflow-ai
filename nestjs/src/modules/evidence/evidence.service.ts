import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Evidence } from '../../models/evidence.model';

@Injectable()
export class EvidenceService {
  constructor(
    @InjectModel(Evidence)
    private evidenceModel: typeof Evidence,
  ) {}

  async create(createEvidenceData: Partial<Evidence>): Promise<Evidence> {
    return this.evidenceModel.create(createEvidenceData);
  }

  async findAll(caseId?: string): Promise<Evidence[]> {
    const whereClause = caseId ? { case_id: caseId } : {};
    return this.evidenceModel.findAll({
      where: whereClause,
      include: ['case', 'custodian', 'organization'],
    });
  }

  async findOne(id: string): Promise<Evidence> {
    const evidence = await this.evidenceModel.findByPk(id, {
      include: ['case', 'custodian', 'organization'],
    });

    if (!evidence) {
      throw new NotFoundException(`Evidence with ID ${id} not found`);
    }

    return evidence;
  }

  async update(id: string, updateData: Partial<Evidence>): Promise<Evidence> {
    const [affectedCount, affectedRows] = await this.evidenceModel.update(
      updateData,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Evidence with ID ${id} not found`);
    }

    return affectedRows[0];
  }

  async remove(id: string): Promise<void> {
    const deletedCount = await this.evidenceModel.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`Evidence with ID ${id} not found`);
    }
  }
}