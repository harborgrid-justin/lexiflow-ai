import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from '../../models/group.model';
import { CreateGroupDto, UpdateGroupDto } from './dto/group.dto';
import { Op } from 'sequelize';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group)
    private groupModel: typeof Group,
  ) {}

  async create(createGroupDto: CreateGroupDto, userId: number): Promise<Group> {
    try {
      const group = await this.groupModel.create({
        ...createGroupDto,
        createdBy: userId,
      });
      return group;
    } catch {
      throw new BadRequestException('Failed to create group');
    }
  }

  async findAll(organizationId?: number): Promise<Group[]> {
    const where = organizationId ? { organizationId } : {};
    return this.groupModel.findAll({
      where,
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: number): Promise<Group> {
    const group = await this.groupModel.findByPk(id);
    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
    return group;
  }

  async update(id: number, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const group = await this.findOne(id);
    
    try {
      await group.update(updateGroupDto);
      return group;
    } catch {
      throw new BadRequestException('Failed to update group');
    }
  }

  async remove(id: number): Promise<void> {
    const group = await this.findOne(id);
    await group.destroy();
  }

  async search(query: string, organizationId?: number): Promise<Group[]> {
    const where: Record<string, unknown> = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
      ],
    };

    if (organizationId) {
      where.organizationId = organizationId;
    }

    return this.groupModel.findAll({
      where,
      order: [['name', 'ASC']],
    });
  }

  async findByOrganization(organizationId: number): Promise<Group[]> {
    return this.groupModel.findAll({
      where: { organizationId },
      order: [['name', 'ASC']],
    });
  }
}