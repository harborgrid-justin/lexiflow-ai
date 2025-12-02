import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Evidence } from '../../models/evidence.model';
import { ChainOfCustodyEvent } from '../../models/chain-of-custody-event.model';
import { CreateEvidenceDto } from './dto/create-evidence.dto';
import { UpdateEvidenceDto } from './dto/update-evidence.dto';
import { CreateChainOfCustodyEventDto } from './dto/create-chain-of-custody-event.dto';

@Injectable()
export class EvidenceService {
  constructor(
    @InjectModel(Evidence)
    private evidenceModel: typeof Evidence,
    @InjectModel(ChainOfCustodyEvent)
    private chainOfCustodyEventModel: typeof ChainOfCustodyEvent,
  ) {}

  async create(createEvidenceDto: CreateEvidenceDto): Promise<Evidence> {
    // Generate tracking_uuid automatically
    return this.evidenceModel.create(createEvidenceDto as any);
  }

  async findAll(caseId?: string): Promise<Evidence[]> {
    const whereClause = caseId ? { case_id: caseId } : {};
    return this.evidenceModel.findAll({
      where: whereClause,
      include: [
        'case',
        'custodian',
        'organization',
        { association: 'chainOfCustody', separate: true },
      ],
    }) || [];
  }

  async findOne(id: string): Promise<Evidence> {
    const evidence = await this.evidenceModel.findByPk(id, {
      include: [
        'case',
        'custodian',
        'organization',
        { association: 'chainOfCustody', separate: true },
      ],
    });

    if (!evidence) {
      throw new NotFoundException(`Evidence with ID ${id} not found`);
    }

    return evidence;
  }

  async update(id: string, updateEvidenceDto: UpdateEvidenceDto): Promise<Evidence> {
    const [affectedCount, affectedRows] = await this.evidenceModel.update(
      updateEvidenceDto as any,
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

  async addChainOfCustodyEvent(
    evidenceId: string,
    createEventDto: CreateChainOfCustodyEventDto,
  ): Promise<ChainOfCustodyEvent> {
    // Verify evidence exists
    const evidence = await this.evidenceModel.findByPk(evidenceId);
    if (!evidence) {
      throw new NotFoundException(`Evidence with ID ${evidenceId} not found`);
    }

    // Create chain of custody event
    return this.chainOfCustodyEventModel.create({
      evidence_id: evidenceId,
      ...createEventDto,
    } as any);
  }
}