import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attorney } from '../../models/attorney.model';
import { CreateAttorneyDto } from './dto/create-attorney.dto';
import { UpdateAttorneyDto } from './dto/update-attorney.dto';

@Injectable()
export class AttorneysService {
  constructor(
    @InjectModel(Attorney)
    private attorneyModel: typeof Attorney,
  ) {}

  async create(createAttorneyDto: CreateAttorneyDto): Promise<Attorney> {
    return this.attorneyModel.create(createAttorneyDto as any);
  }

  async findAll(): Promise<Attorney[]> {
    return this.attorneyModel.findAll({
      order: [['last_name', 'ASC'], ['first_name', 'ASC']],
    });
  }

  async findByPartyId(partyId: string): Promise<Attorney[]> {
    return this.attorneyModel.findAll({
      where: { party_id: partyId },
      order: [['is_lead', 'DESC'], ['last_name', 'ASC']],
    });
  }

  async findOne(id: string): Promise<Attorney> {
    const attorney = await this.attorneyModel.findByPk(id);
    if (!attorney) {
      throw new NotFoundException(`Attorney with ID ${id} not found`);
    }
    return attorney;
  }

  async update(id: string, updateAttorneyDto: UpdateAttorneyDto): Promise<Attorney> {
    const attorney = await this.findOne(id);
    return attorney.update(updateAttorneyDto as any);
  }

  async remove(id: string): Promise<void> {
    const attorney = await this.findOne(id);
    await attorney.destroy();
  }

  async findByFirm(firm: string): Promise<Attorney[]> {
    const { Op } = require('sequelize');
    return this.attorneyModel.findAll({
      where: {
        firm: {
          [Op.iLike]: `%${firm}%`,
        },
      },
      order: [['last_name', 'ASC']],
    });
  }

  async findByBarNumber(barNumber: string): Promise<Attorney | null> {
    return this.attorneyModel.findOne({
      where: { bar_number: barNumber },
    });
  }

  async findActive(): Promise<Attorney[]> {
    return this.attorneyModel.findAll({
      where: { status: 'active' },
      order: [['last_name', 'ASC']],
    });
  }
}
