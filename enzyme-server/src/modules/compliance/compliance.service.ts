import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ComplianceRecord } from '../../models/compliance.model';

@Injectable()
export class ComplianceService {
  constructor(
    @InjectModel(ComplianceRecord)
    private complianceModel: typeof ComplianceRecord,
  ) {}

  async create(createComplianceData: Partial<ComplianceRecord>): Promise<ComplianceRecord> {
    return this.complianceModel.create(createComplianceData);
  }

  async findAll(orgId?: string): Promise<ComplianceRecord[]> {
    const whereClause = orgId ? { owner_org_id: orgId } : {};
    return this.complianceModel.findAll({
      where: whereClause,
    });
  }

  async findOne(id: string): Promise<ComplianceRecord> {
    const compliance = await this.complianceModel.findByPk(id);

    if (!compliance) {
      throw new NotFoundException(`Compliance record with ID ${id} not found`);
    }

    return compliance;
  }

  async update(id: string, updateData: Partial<ComplianceRecord>): Promise<ComplianceRecord> {
    const [affectedCount, affectedRows] = await this.complianceModel.update(
      updateData,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Compliance record with ID ${id} not found`);
    }

    return affectedRows[0];
  }

  async findByRiskLevel(riskLevel: string): Promise<ComplianceRecord[]> {
    return this.complianceModel.findAll({
      where: { risk_level: riskLevel },
    });
  }
}