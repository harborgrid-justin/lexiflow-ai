import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Motion } from '../../models/motion.model';
import { CreateMotionDto } from './dto/create-motion.dto';
import { UpdateMotionDto } from './dto/update-motion.dto';

@Injectable()
export class MotionsService {
  constructor(
    @InjectModel(Motion)
    private motionModel: typeof Motion,
  ) {}

  async create(createMotionDto: CreateMotionDto): Promise<Motion> {
    return this.motionModel.create(createMotionDto as any);
  }

  async findAll(caseId?: string): Promise<Motion[]> {
    const whereClause = caseId ? { case_id: caseId } : {};
    return this.motionModel.findAll({
      where: whereClause,
      include: ['case'],
    });
  }

  async findOne(id: string): Promise<Motion> {
    const motion = await this.motionModel.findByPk(id, {
      include: ['case'],
    });

    if (!motion) {
      throw new NotFoundException(`Motion with ID ${id} not found`);
    }

    return motion;
  }

  async findByStatus(status: string): Promise<Motion[]> {
    return this.motionModel.findAll({
      where: { status },
      include: ['case'],
    });
  }

  async update(id: string, updateMotionDto: UpdateMotionDto): Promise<Motion> {
    const [affectedCount, affectedRows] = await this.motionModel.update(
      updateMotionDto as any,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Motion with ID ${id} not found`);
    }

    return affectedRows[0];
  }

  async remove(id: string): Promise<void> {
    const deletedCount = await this.motionModel.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`Motion with ID ${id} not found`);
    }
  }
}