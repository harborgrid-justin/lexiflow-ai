import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OpposingCounselProfile } from '../../models/opposing-counsel-profile.model';
import { Op } from 'sequelize';

@Injectable()
export class OpposingCounselService {
  constructor(
    @InjectModel(OpposingCounselProfile)
    private counselModel: typeof OpposingCounselProfile,
  ) {}

  async findAll(): Promise<OpposingCounselProfile[]> {
    return this.counselModel.findAll({
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: string): Promise<OpposingCounselProfile> {
    const profile = await this.counselModel.findByPk(id);

    if (!profile) {
      throw new NotFoundException(\`Opposing counsel profile with ID \${id} not found\`);
    }

    return profile;
  }

  async findByName(name: string): Promise<OpposingCounselProfile[]> {
    return this.counselModel.findAll({
      where: {
        name: { [Op.like]: \`%\${name}%\` },
      },
    });
  }

  async create(createDto: any): Promise<OpposingCounselProfile> {
    const profile = await this.counselModel.create(createDto);
    return this.findOne(profile.id);
  }

  async update(id: string, updateDto: any): Promise<OpposingCounselProfile> {
    const profile = await this.findOne(id);
    await profile.update(updateDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const profile = await this.findOne(id);
    await profile.destroy();
  }
}
