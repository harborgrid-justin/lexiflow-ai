import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Clause } from '../../models/clause.model';
import { Op } from 'sequelize';

@Injectable()
export class ClausesService {
  constructor(
    @InjectModel(Clause)
    private clauseModel: typeof Clause,
  ) {}

  async findAll(category?: string, type?: string): Promise<Clause[]> {
    const whereClause: any = {};
    if (category) {whereClause.category = category;}
    if (type) {whereClause.type = type;}

    return this.clauseModel.findAll({
      where: whereClause,
      include: ['author', 'modifier', 'organization'],
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(id: string): Promise<Clause> {
    const clause = await this.clauseModel.findByPk(id, {
      include: ['author', 'modifier', 'organization'],
    });

    if (!clause) {
      throw new NotFoundException(`Clause with ID ${id} not found`);
    }

    // Increment usage count
    await clause.increment('usage_count');

    return clause;
  }

  async search(query: string): Promise<Clause[]> {
    return this.clauseModel.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { content: { [Op.like]: `%${query}%` } },
          { tags: { [Op.like]: `%${query}%` } },
        ],
      },
      include: ['author', 'organization'],
      order: [['usage_count', 'DESC']],
    });
  }

  async create(createData: Partial<Clause>): Promise<Clause> {
    const clause = await this.clauseModel.create({
      ...createData,
      status: createData.status || 'active',
      version: createData.version || 1,
      usage_count: 0,
      visibility: createData.visibility || 'internal',
    });

    return this.findOne(clause.id);
  }

  async update(id: string, updateData: Partial<Clause>): Promise<Clause> {
    const clause = await this.clauseModel.findByPk(id);
    
    if (!clause) {
      throw new NotFoundException(`Clause with ID ${id} not found`);
    }

    await clause.update(updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const clause = await this.clauseModel.findByPk(id);
    
    if (!clause) {
      throw new NotFoundException(`Clause with ID ${id} not found`);
    }

    await clause.destroy();
  }
}
