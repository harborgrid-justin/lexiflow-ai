import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OpposingCounselProfile } from '../../models/opposing-counsel-profile.model';
import { CreateOpposingCounselProfileDto, UpdateOpposingCounselProfileDto } from './dto/opposing-counsel-profile.dto';
import { Op } from 'sequelize';

@Injectable()
export class OpposingCounselProfileService {
  constructor(
    @InjectModel(OpposingCounselProfile)
    private opposingCounselProfileModel: typeof OpposingCounselProfile,
  ) {}

  async create(createOpposingCounselProfileDto: CreateOpposingCounselProfileDto): Promise<OpposingCounselProfile> {
    try {
      const profile = await this.opposingCounselProfileModel.create(createOpposingCounselProfileDto as any);
      return profile;
    } catch {
      throw new BadRequestException('Failed to create opposing counsel profile');
    }
  }

  async findAll(firmName?: string): Promise<OpposingCounselProfile[]> {
    const where = firmName ? { firmName } : {};
    return this.opposingCounselProfileModel.findAll({
      where,
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: number): Promise<OpposingCounselProfile> {
    const profile = await this.opposingCounselProfileModel.findByPk(id);
    if (!profile) {
      throw new NotFoundException(`Opposing counsel profile with ID ${id} not found`);
    }
    return profile;
  }

  async update(id: number, updateOpposingCounselProfileDto: UpdateOpposingCounselProfileDto): Promise<OpposingCounselProfile> {
    const profile = await this.findOne(id);
    
    try {
      await profile.update(updateOpposingCounselProfileDto);
      return profile;
    } catch {
      throw new BadRequestException('Failed to update opposing counsel profile');
    }
  }

  async remove(id: number): Promise<void> {
    const profile = await this.findOne(id);
    await profile.destroy();
  }

  async search(query: string, firmName?: string): Promise<OpposingCounselProfile[]> {
    const where: Record<string, unknown> = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
        { firmName: { [Op.iLike]: `%${query}%` } },
        { email: { [Op.iLike]: `%${query}%` } },
        { specialties: { [Op.iLike]: `%${query}%` } },
      ],
    };

    if (firmName) {
      where.firmName = { [Op.iLike]: `%${firmName}%` };
    }

    return this.opposingCounselProfileModel.findAll({
      where,
      order: [['name', 'ASC']],
    });
  }

  async findByFirm(firmName: string): Promise<OpposingCounselProfile[]> {
    return this.opposingCounselProfileModel.findAll({
      where: { firmName: { [Op.iLike]: `%${firmName}%` } },
      order: [['name', 'ASC']],
    });
  }

  async findByEmail(email: string): Promise<OpposingCounselProfile | null> {
    return this.opposingCounselProfileModel.findOne({
      where: { email },
    });
  }
}