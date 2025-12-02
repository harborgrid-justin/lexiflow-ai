import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Playbook } from '../../models/playbook.model';
import { Op } from 'sequelize';

@Injectable()
export class PlaybooksService {
  constructor(
    @InjectModel(Playbook)
    private playbookModel: typeof Playbook,
  ) {}

  async findAll(): Promise<Playbook[]> {
    return this.playbookModel.findAll({
      include: ['jurisdiction'],
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: string): Promise<Playbook> {
    const playbook = await this.playbookModel.findByPk(id, {
      include: ['jurisdiction'],
    });

    if (!playbook) {
      throw new NotFoundException(`Playbook with ID ${id} not found`);
    }

    return playbook;
  }

  async findByJurisdiction(jurisdictionId: string): Promise<Playbook[]> {
    return this.playbookModel.findAll({
      where: { jurisdiction_id: jurisdictionId },
      include: ['jurisdiction'],
    });
  }

  async findByMatterType(matterType: string): Promise<Playbook[]> {
    return this.playbookModel.findAll({
      where: {
        matter_type: { [Op.like]: `%${matterType}%` },
      },
      include: ['jurisdiction'],
    });
  }

  async create(createDto: any): Promise<Playbook> {
    const playbook = await this.playbookModel.create({
      ...createDto,
      status: createDto.status || 'Active',
    });

    return this.findOne(playbook.id);
  }

  async update(id: string, updateDto: any): Promise<Playbook> {
    const playbook = await this.findOne(id);
    await playbook.update(updateDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const playbook = await this.findOne(id);
    await playbook.destroy();
  }
}
