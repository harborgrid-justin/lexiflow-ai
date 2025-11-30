import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JudgeProfile } from '../../models/judge-profile.model';
import { CreateJudgeProfileDto, UpdateJudgeProfileDto } from './dto/judge-profile.dto';
import { Op } from 'sequelize';

@Injectable()
export class JudgeProfileService {
  constructor(
    @InjectModel(JudgeProfile)
    private judgeProfileModel: typeof JudgeProfile,
  ) {}

  async create(createJudgeProfileDto: CreateJudgeProfileDto): Promise<JudgeProfile> {
    try {
      const judgeProfile = await this.judgeProfileModel.create(createJudgeProfileDto as any);
      return judgeProfile;
    } catch {
      throw new BadRequestException('Failed to create judge profile');
    }
  }

  async findAll(jurisdiction?: string): Promise<JudgeProfile[]> {
    const where = jurisdiction ? { jurisdiction } : {};
    return this.judgeProfileModel.findAll({
      where,
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: number): Promise<JudgeProfile> {
    const judgeProfile = await this.judgeProfileModel.findByPk(id);
    if (!judgeProfile) {
      throw new NotFoundException(`Judge profile with ID ${id} not found`);
    }
    return judgeProfile;
  }

  async update(id: number, updateJudgeProfileDto: UpdateJudgeProfileDto): Promise<JudgeProfile> {
    const judgeProfile = await this.findOne(id);
    
    try {
      await judgeProfile.update(updateJudgeProfileDto);
      return judgeProfile;
    } catch {
      throw new BadRequestException('Failed to update judge profile');
    }
  }

  async remove(id: number): Promise<void> {
    const judgeProfile = await this.findOne(id);
    await judgeProfile.destroy();
  }

  async search(query: string, jurisdiction?: string): Promise<JudgeProfile[]> {
    const where: Record<string, unknown> = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
        { court: { [Op.iLike]: `%${query}%` } },
        { specialties: { [Op.iLike]: `%${query}%` } },
      ],
    };

    if (jurisdiction) {
      where.jurisdiction = jurisdiction;
    }

    return this.judgeProfileModel.findAll({
      where,
      order: [['name', 'ASC']],
    });
  }

  async findByCourt(court: string): Promise<JudgeProfile[]> {
    return this.judgeProfileModel.findAll({
      where: { court },
      order: [['name', 'ASC']],
    });
  }

  async findByJurisdiction(jurisdiction: string): Promise<JudgeProfile[]> {
    return this.judgeProfileModel.findAll({
      where: { jurisdiction },
      order: [['name', 'ASC']],
    });
  }
}