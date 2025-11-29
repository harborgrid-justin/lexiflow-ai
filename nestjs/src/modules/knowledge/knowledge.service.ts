import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { KnowledgeArticle } from '../../models/knowledge.model';

@Injectable()
export class KnowledgeService {
  constructor(
    @InjectModel(KnowledgeArticle)
    private knowledgeModel: typeof KnowledgeArticle,
  ) {}

  async create(createKnowledgeData: Partial<KnowledgeArticle>): Promise<KnowledgeArticle> {
    return this.knowledgeModel.create(createKnowledgeData);
  }

  async findAll(category?: string): Promise<KnowledgeArticle[]> {
    const whereClause = category ? { category } : {};
    return this.knowledgeModel.findAll({
      where: whereClause,
      include: ['author', 'modifier', 'organization'],
    });
  }

  async findOne(id: string): Promise<KnowledgeArticle> {
    const article = await this.knowledgeModel.findByPk(id, {
      include: ['author', 'modifier', 'organization'],
    });

    if (!article) {
      throw new NotFoundException(`Knowledge article with ID ${id} not found`);
    }

    return article;
  }

  async search(query: string): Promise<KnowledgeArticle[]> {
    return this.knowledgeModel.findAll({
      where: {
        $or: [
          { title: { $iLike: `%${query}%` } },
          { content: { $iLike: `%${query}%` } },
          { tags: { $iLike: `%${query}%` } }
        ]
      },
      include: ['author', 'modifier', 'organization'],
    });
  }

  async update(id: string, updateData: Partial<KnowledgeArticle>): Promise<KnowledgeArticle> {
    const [affectedCount, affectedRows] = await this.knowledgeModel.update(
      updateData,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Knowledge article with ID ${id} not found`);
    }

    return affectedRows[0];
  }
}