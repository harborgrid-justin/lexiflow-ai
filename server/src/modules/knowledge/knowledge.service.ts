import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { KnowledgeArticle } from '../../models/knowledge.model';
import { Op } from 'sequelize';

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectModel(KnowledgeArticle)
    private knowledgeModel: typeof KnowledgeArticle,
  ) {}

  async findAll(category?: string): Promise<KnowledgeArticle[]> {
    const whereClause = category ? { category } : {};
    return this.knowledgeModel.findAll({
      where: whereClause,
      include: ['author', 'modifier', 'organization'],
      order: [['created_at', 'DESC']],
    });
  }

  async findOne(id: string): Promise<KnowledgeArticle> {
    const article = await this.knowledgeModel.findByPk(id, {
      include: ['author', 'modifier', 'organization'],
    });

    if (!article) {
      throw new NotFoundException(`Knowledge article with ID ${id} not found`);
    }

    // Increment view count
    await article.increment('view_count');

    return article;
  }

  async search(query: string): Promise<KnowledgeArticle[]> {
    return this.knowledgeModel.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { content: { [Op.like]: `%${query}%` } },
          { tags: { [Op.like]: `%${query}%` } },
        ],
      },
      include: ['author', 'organization'],
      order: [['view_count', 'DESC']],
    });
  }

  async create(createData: Partial<KnowledgeArticle>): Promise<KnowledgeArticle> {
    const article = await this.knowledgeModel.create({
      ...createData,
      status: createData.status || 'draft',
      visibility: createData.visibility || 'internal',
      view_count: 0,
    });

    return this.findOne(article.id);
  }

  async update(id: string, updateData: Partial<KnowledgeArticle>): Promise<KnowledgeArticle> {
    const article = await this.knowledgeModel.findByPk(id);
    
    if (!article) {
      throw new NotFoundException(`Knowledge article with ID ${id} not found`);
    }

    await article.update(updateData);
    return this.findOne(id);
  }
}
