import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ComplianceRecord } from '../../models/compliance.model';
import { ConflictCheck } from '../../models/conflict-check.model';
import { EthicalWall } from '../../models/ethical-wall.model';
import { CreateComplianceDto } from './dto/create-compliance.dto';
import { UpdateComplianceDto } from './dto/update-compliance.dto';

@Injectable()
export class ComplianceService {
  constructor(
    @InjectModel(ComplianceRecord)
    private complianceModel: typeof ComplianceRecord,
    @InjectModel(ConflictCheck)
    private conflictCheckModel: typeof ConflictCheck,
    @InjectModel(EthicalWall)
    private ethicalWallModel: typeof EthicalWall,
  ) {}

  async findAll(orgId?: string): Promise<ComplianceRecord[]> {
    const whereClause = orgId ? { owner_org_id: orgId } : {};
    return this.complianceModel.findAll({
      where: whereClause,
      include: ['case', 'officer', 'organization'],
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(id: string): Promise<ComplianceRecord> {
    const compliance = await this.complianceModel.findByPk(id, {
      include: ['case', 'officer', 'organization'],
    });

    if (!compliance) {
      throw new NotFoundException(`Compliance record with ID ${id} not found`);
    }

    return compliance;
  }

  async findByRiskLevel(riskLevel: string): Promise<ComplianceRecord[]> {
    return this.complianceModel.findAll({
      where: { risk_level: riskLevel },
      include: ['case', 'officer', 'organization'],
      order: [['created_at', 'DESC']],
    });
  }

  async create(createDto: CreateComplianceDto): Promise<ComplianceRecord> {
    const record = await this.complianceModel.create({
      ...createDto,
      status: 'pending',
    });

    return this.findOne(record.id);
  }

  async update(id: string, updateDto: UpdateComplianceDto): Promise<ComplianceRecord> {
    const record = await this.findOne(id);
    await record.update(updateDto);
    return this.findOne(id);
  }

  // Conflict Check Methods
  async getConflicts(_orgId?: string): Promise<ConflictCheck[]> {
    const whereClause: any = {};
    // Add org filtering if needed based on your schema
    return this.conflictCheckModel.findAll({
      where: whereClause,
      include: ['checker'],
      order: [['check_date', 'DESC']],
    });
  }

  async createConflict(createDto: any): Promise<ConflictCheck> {
    return this.conflictCheckModel.create(createDto);
  }

  // Ethical Wall Methods
  async getWalls(_orgId?: string): Promise<EthicalWall[]> {
    const whereClause: any = {};
    // Add org filtering if needed based on your schema
    return this.ethicalWallModel.findAll({
      where: whereClause,
      include: ['case'],
      order: [['created_at', 'DESC']],
    });
  }

  async createWall(createDto: any): Promise<EthicalWall> {
    return this.ethicalWallModel.create(createDto);
  }
}