import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Analytics } from '../../models/analytics.model';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Analytics)
    private analyticsModel: typeof Analytics,
  ) {}

  async create(createAnalyticsData: Partial<Analytics>): Promise<Analytics> {
    return this.analyticsModel.create(createAnalyticsData);
  }

  async findAll(caseId?: string, metricType?: string): Promise<Analytics[]> {
    const whereClause: any = {};
    if (caseId) whereClause.case_id = caseId;
    if (metricType) whereClause.metric_type = metricType;

    return this.analyticsModel.findAll({
      where: whereClause,
      include: ['case', 'creator', 'organization'],
    });
  }

  async findOne(id: string): Promise<Analytics> {
    const analytics = await this.analyticsModel.findByPk(id, {
      include: ['case', 'creator', 'organization'],
    });

    if (!analytics) {
      throw new NotFoundException(`Analytics record with ID ${id} not found`);
    }

    return analytics;
  }

  async getCaseOutcomePrediction(caseId: string): Promise<Analytics[]> {
    return this.analyticsModel.findAll({
      where: { 
        case_id: caseId,
        metric_type: 'case_outcome_prediction'
      },
      include: ['case', 'creator', 'organization'],
    });
  }

  async getJudgeAnalytics(judgeName: string): Promise<Analytics[]> {
    return this.analyticsModel.findAll({
      where: { 
        metric_type: 'judge_analytics',
        data: {
          judge: judgeName
        }
      },
      include: ['case', 'creator', 'organization'],
    });
  }

  async getCounselPerformance(counselName: string): Promise<Analytics[]> {
    return this.analyticsModel.findAll({
      where: { 
        metric_type: 'counsel_performance',
        data: {
          counsel: counselName
        }
      },
      include: ['case', 'creator', 'organization'],
    });
  }
}