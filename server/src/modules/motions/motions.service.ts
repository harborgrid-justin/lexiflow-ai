import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Motion } from '../../models/motion.model';

@Injectable()
export class MotionsService {
  constructor(
    @InjectModel(Motion)
    private motionModel: typeof Motion,
  ) {}

  async create(createMotionData: Partial<Motion>): Promise<Motion> {
    return this.motionModel.create(createMotionData);
  }

  async findAll(caseId?: string): Promise<Motion[]> {
    const whereClause = caseId ? { case_id: caseId } : {};
    return this.motionModel.findAll({
      where: whereClause,
      include: ['case', 'filed_by', 'organization'],
    });
  }

  async findOne(id: string): Promise<Motion> {
    const motion = await this.motionModel.findByPk(id, {
      include: ['case', 'filed_by', 'organization'],
    });

    if (!motion) {
      throw new NotFoundException(`Motion with ID ${id} not found`);
    }

    return motion;
  }

  async update(id: string, updateData: Partial<Motion>): Promise<Motion> {
    const [affectedCount, affectedRows] = await this.motionModel.update(
      updateData,
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

  async findByStatus(status: string): Promise<Motion[]> {
    return this.motionModel.findAll({
      where: { status },
      include: ['case', 'filed_by', 'organization'],
    });
  }
}