import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Clause } from '../../models/clause.model';

@Injectable()
export class ClausesService {
  constructor(
    @InjectModel(Clause)
    private clauseModel: typeof Clause,
  ) {}

  async create(createClauseData: Partial<Clause>): Promise<Clause> {
    return this.clauseModel.create(createClauseData);
  }

  async findAll(category?: string, type?: string): Promise<Clause[]> {
    const whereClause: Record<string, string> = {};
    if (category) {whereClause.category = category;}
    if (type) {whereClause.type = type;}

    return this.clauseModel.findAll({
      where: whereClause,
      include: ['author', 'modifier', 'organization'],
    });
  }

  async findOne(id: string): Promise<Clause> {
    const clause = await this.clauseModel.findByPk(id, {
      include: ['author', 'modifier', 'organization'],
    });

    if (!clause) {
      throw new NotFoundException(`Clause with ID ${id} not found`);
    }

    return clause;
  }

  async update(id: string, updateData: Partial<Clause>): Promise<Clause> {
    const [affectedCount, affectedRows] = await this.clauseModel.update(
      updateData,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Clause with ID ${id} not found`);
    }

    return affectedRows[0];
  }

  async search(query: string): Promise<Clause[]> {
    return this.clauseModel.findAll({
      where: {
        $or: [
          { title: { $iLike: `%${query}%` } },
          { content: { $iLike: `%${query}%` } },
          { tags: { $iLike: `%${query}%` } },
        ],
      },
      include: ['author', 'modifier', 'organization'],
    });
  }
}