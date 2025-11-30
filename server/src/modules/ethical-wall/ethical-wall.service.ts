import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { EthicalWall } from '../../models/ethical-wall.model';
import { CreateEthicalWallDto, UpdateEthicalWallDto } from './dto/ethical-wall.dto';
import { Op } from 'sequelize';

@Injectable()
export class EthicalWallService {
  constructor(
    @InjectModel(EthicalWall)
    private ethicalWallModel: typeof EthicalWall,
  ) {}

  async create(createEthicalWallDto: CreateEthicalWallDto, userId: number): Promise<EthicalWall> {
    try {
      const ethicalWall = await this.ethicalWallModel.create({
        ...createEthicalWallDto,
        createdBy: userId,
      });
      return ethicalWall;
    } catch {
      throw new BadRequestException('Failed to create ethical wall');
    }
  }

  async findAll(organizationId?: number): Promise<EthicalWall[]> {
    const where = organizationId ? { organizationId } : {};
    return this.ethicalWallModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number): Promise<EthicalWall> {
    const ethicalWall = await this.ethicalWallModel.findByPk(id);
    if (!ethicalWall) {
      throw new NotFoundException(`Ethical wall with ID ${id} not found`);
    }
    return ethicalWall;
  }

  async update(id: number, updateEthicalWallDto: UpdateEthicalWallDto): Promise<EthicalWall> {
    const ethicalWall = await this.findOne(id);
    
    try {
      await ethicalWall.update(updateEthicalWallDto);
      return ethicalWall;
    } catch {
      throw new BadRequestException('Failed to update ethical wall');
    }
  }

  async remove(id: number): Promise<void> {
    const ethicalWall = await this.findOne(id);
    await ethicalWall.destroy();
  }

  async search(query: string, organizationId?: number): Promise<EthicalWall[]> {
    const where: Record<string, unknown> = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
        { reason: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
      ],
    };

    if (organizationId) {
      where.organizationId = organizationId;
    }

    return this.ethicalWallModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
  }

  async findByUser(userId: number): Promise<EthicalWall[]> {
    return this.ethicalWallModel.findAll({
      where: {
        [Op.or]: [
          { affectedUsers: { [Op.contains]: [userId] } },
          { createdBy: userId },
        ],
      },
      order: [['createdAt', 'DESC']],
    });
  }

  async findActive(organizationId?: number): Promise<EthicalWall[]> {
    const where: Record<string, unknown> = { isActive: true };
    
    if (organizationId) {
      where.organizationId = organizationId;
    }

    return this.ethicalWallModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
  }
}