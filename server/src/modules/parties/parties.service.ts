import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Party } from '../../models/party.model';
import { CreatePartyDto } from './dto/create-party.dto';
import { UpdatePartyDto } from './dto/update-party.dto';

@Injectable()
export class PartiesService {
  constructor(
    @InjectModel(Party)
    private partyModel: typeof Party,
  ) {}

  async create(createPartyDto: CreatePartyDto): Promise<Party> {
    return this.partyModel.create(createPartyDto as unknown as Partial<Party>);
  }

  async findAll(caseId?: string): Promise<Party[]> {
    const whereClause = caseId ? { case_id: caseId } : {};
    return this.partyModel.findAll({
      where: whereClause,
      include: ['case', 'linkedOrganization'],
    });
  }

  async findOne(id: string): Promise<Party> {
    const party = await this.partyModel.findByPk(id, {
      include: ['case', 'linkedOrganization'],
    });

    if (!party) {
      throw new NotFoundException(`Party with ID ${id} not found`);
    }

    return party;
  }

  async update(id: string, updatePartyDto: UpdatePartyDto): Promise<Party> {
    const [affectedCount, affectedRows] = await this.partyModel.update(
      updatePartyDto,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Party with ID ${id} not found`);
    }

    return affectedRows[0];
  }

  async remove(id: string): Promise<void> {
    const affectedCount = await this.partyModel.destroy({
      where: { id },
    });

    if (affectedCount === 0) {
      throw new NotFoundException(`Party with ID ${id} not found`);
    }
  }

  async findByCaseId(caseId: string): Promise<Party[]> {
    return this.partyModel.findAll({
      where: { case_id: caseId },
      include: ['linkedOrganization'],
    });
  }

  async removeFromCase(caseId: string, userId: string): Promise<void> {
    const affectedCount = await this.partyModel.destroy({
      where: {
        case_id: caseId,
        linked_org_id: userId, // Assuming userId is mapped to linked_org_id
      },
    });

    if (affectedCount === 0) {
      throw new NotFoundException(`Party with user ID ${userId} not found in case ${caseId}`);
    }
  }
}