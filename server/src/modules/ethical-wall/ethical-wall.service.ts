import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EthicalWall } from '../../models/ethical-wall.model';

@Injectable()
export class EthicalWallService {
  constructor(
    @InjectModel(EthicalWall)
    private ethicalWallModel: typeof EthicalWall,
  ) {}

  async findAll(orgId?: string): Promise<EthicalWall[]> {
    const whereClause: any = {};
    // Add org filtering if your schema supports it
    return this.ethicalWallModel.findAll({
      where: whereClause,
      include: ['case'],
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(id: string): Promise<EthicalWall> {
    const wall = await this.ethicalWallModel.findByPk(id, {
      include: ['case'],
    });

    if (!wall) {
      throw new NotFoundException(\`Ethical wall with ID \${id} not found\`);
    }

    return wall;
  }

  async create(createDto: any): Promise<EthicalWall> {
    const wall = await this.ethicalWallModel.create({
      ...createDto,
      status: createDto.status || 'Active',
    });

    return this.findOne(wall.id);
  }

  async update(id: string, updateDto: any): Promise<EthicalWall> {
    const wall = await this.findOne(id);
    await wall.update(updateDto);
    return this.findOne(id);
  }

  async checkAccess(userId: string, caseId: string): Promise<boolean> {
    const walls = await this.ethicalWallModel.findAll({
      where: {
        case_id: caseId,
        status: 'Active',
      },
    });

    for (const wall of walls) {
      const authorizedUsers = wall.authorized_users ? wall.authorized_users.split(',') : [];
      const restrictedGroups = wall.restricted_groups ? wall.restricted_groups.split(',') : [];

      // Check if user is explicitly authorized
      if (authorizedUsers.includes(userId)) {
        return true;
      }

      // If there are restricted groups, you'd need to check user's group membership
      // For now, we'll allow access if no restrictions apply
    }

    // If no walls exist or user is authorized, grant access
    return walls.length === 0 || false;
  }
}
