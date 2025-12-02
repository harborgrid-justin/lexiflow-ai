import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Jurisdiction } from '../../models/jurisdiction.model';
import { CreateJurisdictionDto } from './dto/create-jurisdiction.dto';
import { UpdateJurisdictionDto } from './dto/update-jurisdiction.dto';

@Injectable()
export class JurisdictionsService {
  constructor(
    @InjectModel(Jurisdiction)
    private jurisdictionModel: typeof Jurisdiction,
  ) {}

  async findAll(country?: string): Promise<Jurisdiction[]> {
    const whereClause = country ? { country } : {};
    return this.jurisdictionModel.findAll({
      where: whereClause,
      include: ['parent', 'organization'],
      order: [['name', 'ASC']],
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

  async create(createJurisdictionDto: CreateJurisdictionDto): Promise<Jurisdiction> {
    return this.jurisdictionModel.create(createJurisdictionDto);
  }

  async update(id: string, updateJurisdictionDto: UpdateJurisdictionDto): Promise<Jurisdiction> {
    const [affectedCount] = await this.jurisdictionModel.update(
      updateJurisdictionDto,
      { where: { id } }
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Jurisdiction with ID ${id} not found`);
    }

    return this.findOne(id);
  }
}
