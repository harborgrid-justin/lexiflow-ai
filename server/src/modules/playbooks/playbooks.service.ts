import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Playbook } from '../../models/playbook.model';
import { CreatePlaybookDto, UpdatePlaybookDto } from './dto/playbook.dto';
import { Op } from 'sequelize';

@Injectable()
export class PlaybooksService {
  constructor(
    @InjectModel(Playbook)
    private playbookModel: typeof Playbook,
  ) {}

  async create(createPlaybookDto: CreatePlaybookDto, userId: number): Promise<Playbook> {
    try {
      const playbook = await this.playbookModel.create({
        ...createPlaybookDto,
        authorId: userId,
      });
      return playbook;
    } catch {
      throw new BadRequestException('Failed to create playbook');
    }
  }

  async findAll(organizationId?: number): Promise<Playbook[]> {
    const where = organizationId ? { organizationId } : {};
    return this.playbookModel.findAll({
      where,
      order: [['title', 'ASC']],
    });
  }

  async findOne(id: number): Promise<Playbook> {
    const playbook = await this.playbookModel.findByPk(id);
    if (!playbook) {
      throw new NotFoundException(`Playbook with ID ${id} not found`);
    }
    return playbook;
  }

  async update(id: number, updatePlaybookDto: UpdatePlaybookDto): Promise<Playbook> {
    const playbook = await this.findOne(id);
    
    try {
      await playbook.update(updatePlaybookDto);
      return playbook;
    } catch {
      throw new BadRequestException('Failed to update playbook');
    }
  }

  async remove(id: number): Promise<void> {
    const playbook = await this.findOne(id);
    await playbook.destroy();
  }

  async search(query: string, organizationId?: number): Promise<Playbook[]> {
    const where: Record<string, unknown> = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
        { category: { [Op.iLike]: `%${query}%` } },
        { tags: { [Op.contains]: [query] } },
      ],
    };

    if (organizationId) {
      where.organizationId = organizationId;
    }

    return this.playbookModel.findAll({
      where,
      order: [['title', 'ASC']],
    });
  }

  async findByCategory(category: string, organizationId?: number): Promise<Playbook[]> {
    const where: Record<string, unknown> = { category };
    
    if (organizationId) {
      where.organizationId = organizationId;
    }

    return this.playbookModel.findAll({
      where,
      order: [['title', 'ASC']],
    });
  }

  async findByAuthor(authorId: number): Promise<Playbook[]> {
    return this.playbookModel.findAll({
      where: { authorId },
      order: [['createdAt', 'DESC']],
    });
  }

  async findActive(organizationId?: number): Promise<Playbook[]> {
    const where: Record<string, unknown> = { isActive: true };
    
    if (organizationId) {
      where.organizationId = organizationId;
    }

    return this.playbookModel.findAll({
      where,
      order: [['title', 'ASC']],
    });
  }
}