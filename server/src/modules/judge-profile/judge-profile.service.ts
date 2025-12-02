import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { JudgeProfile } from '../../models/judge-profile.model';
import { Op } from 'sequelize';

@Injectable()
export class JudgeProfileService {
  constructor(
    @InjectModel(JudgeProfile)
    private judgeProfileModel: typeof JudgeProfile,
  ) {}

  async findAll(): Promise<JudgeProfile[]> {
    return this.judgeProfileModel.findAll({
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: string): Promise<JudgeProfile> {
    const profile = await this.judgeProfileModel.findByPk(id);

    if (!profile) {
      throw new NotFoundException(\`Judge profile with ID \${id} not found\`);
    }

    return profile;
  }

  async findByName(name: string): Promise<JudgeProfile[]> {
    return this.judgeProfileModel.findAll({
      where: {
        name: { [Op.like]: \`%\${name}%\` },
      },
    });
  }

  async create(createDto: any): Promise<JudgeProfile> {
    const profile = await this.judgeProfileModel.create(createDto);
    return this.findOne(profile.id);
  }

  async update(id: string, updateDto: any): Promise<JudgeProfile> {
    const profile = await this.findOne(id);
    await profile.update(updateDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const profile = await this.findOne(id);
    await profile.destroy();
  }
}
