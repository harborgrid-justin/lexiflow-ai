import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Jurisdiction } from '../../models/jurisdiction.model';

@Injectable()
export class JurisdictionsService {
  constructor(
    @InjectModel(Jurisdiction)
    private jurisdictionModel: typeof Jurisdiction,
  ) {}

  async create(createJurisdictionData: Partial<Jurisdiction>): Promise<Jurisdiction> {
    return this.jurisdictionModel.create(createJurisdictionData);
  }

  async findAll(country?: string): Promise<Jurisdiction[]> {
    const whereClause = country ? { country } : {};
    return this.jurisdictionModel.findAll({
      where: whereClause,
      include: ['parent', 'organization'],
    });
  }

  async findOne(id: string): Promise<Jurisdiction> {
    const jurisdiction = await this.jurisdictionModel.findByPk(id, {
      include: ['parent', 'organization'],
    });

    if (!jurisdiction) {
      throw new NotFoundException(`Jurisdiction with ID ${id} not found`);
    }

    return jurisdiction;
  }

  async findByCode(code: string): Promise<Jurisdiction> {
    const jurisdiction = await this.jurisdictionModel.findOne({
      where: { code },
      include: ['parent', 'organization'],
    });

    if (!jurisdiction) {
      throw new NotFoundException(`Jurisdiction with code ${code} not found`);
    }

    return jurisdiction;
  }

  async update(id: string, updateData: Partial<Jurisdiction>): Promise<Jurisdiction> {
    const [affectedCount, affectedRows] = await this.jurisdictionModel.update(
      updateData,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Jurisdiction with ID ${id} not found`);
    }

    return affectedRows[0];
  }
}