import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConflictCheck } from '../../models/conflict-check.model';
import { CreateConflictCheckDto, UpdateConflictCheckDto } from './dto/conflict-check.dto';
import { Op } from 'sequelize';

@Injectable()
export class ConflictCheckService {
  constructor(
    @InjectModel(ConflictCheck)
    private conflictCheckModel: typeof ConflictCheck,
  ) {}

  async create(createConflictCheckDto: CreateConflictCheckDto, userId: number): Promise<ConflictCheck> {
    try {
      const conflictCheck = await this.conflictCheckModel.create({
        ...createConflictCheckDto,
        performedBy: userId,
      });
      return conflictCheck;
    } catch {
      throw new BadRequestException('Failed to create conflict check');
    }
  }

  async findAll(organizationId?: number): Promise<ConflictCheck[]> {
    const where = organizationId ? { organizationId } : {};
    return this.conflictCheckModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: number): Promise<ConflictCheck> {
    const conflictCheck = await this.conflictCheckModel.findByPk(id);
    if (!conflictCheck) {
      throw new NotFoundException(`Conflict check with ID ${id} not found`);
    }
    return conflictCheck;
  }

  async update(id: number, updateConflictCheckDto: UpdateConflictCheckDto): Promise<ConflictCheck> {
    const conflictCheck = await this.findOne(id);
    
    try {
      await conflictCheck.update(updateConflictCheckDto);
      return conflictCheck;
    } catch {
      throw new BadRequestException('Failed to update conflict check');
    }
  }

  async remove(id: number): Promise<void> {
    const conflictCheck = await this.findOne(id);
    await conflictCheck.destroy();
  }

  async search(query: string, organizationId?: number): Promise<ConflictCheck[]> {
    const where: Record<string, unknown> = {
      [Op.or]: [
        { clientName: { [Op.iLike]: `%${query}%` } },
        { matterDescription: { [Op.iLike]: `%${query}%` } },
        { conflictDetails: { [Op.iLike]: `%${query}%` } },
      ],
    };

    if (organizationId) {
      where.organizationId = organizationId;
    }

    return this.conflictCheckModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
  }

  async findByStatus(status: string, organizationId?: number): Promise<ConflictCheck[]> {
    const where: Record<string, unknown> = { status };
    
    if (organizationId) {
      where.organizationId = organizationId;
    }

    return this.conflictCheckModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
  }

  async findByUser(performedBy: number): Promise<ConflictCheck[]> {
    return this.conflictCheckModel.findAll({
      where: { performedBy },
      order: [['createdAt', 'DESC']],
    });
  }
}