import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Analytics } from '../../models/analytics.model';
import { Op } from 'sequelize';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Analytics)
    private analyticsModel: typeof Analytics,
  ) {}

  async findAll(caseId?: string, metricType?: string): Promise<Analytics[]> {
    const whereClause: any = {};
    if (caseId) {whereClause.case_id = caseId;}
    if (metricType) {whereClause.metric_type = metricType;}

    return this.analyticsModel.findAll({
      where: whereClause,
      include: ['case', 'creator', 'organization'],
      order: [['created_at', 'DESC']],
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

  async getDashboard(orgId?: string): Promise<any> {
    // Return dashboard data with analytics metrics
    const recentAnalytics = await this.analyticsModel.findAll({
      where: orgId ? { owner_org_id: orgId } : {},
      limit: 10,
      order: [['created_at', 'DESC']],
      include: ['case'],
    });

    return {
      recentAnalytics,
      summary: {
        totalRecords: await this.analyticsModel.count(orgId ? { where: { owner_org_id: orgId } } : {}),
      },
    };
  }

  async getCasePrediction(caseId: string): Promise<any> {
    const caseAnalytics = await this.analyticsModel.findAll({
      where: { 
        case_id: caseId,
        metric_type: 'case_outcome_prediction',
      },
      order: [['created_at', 'DESC']],
      limit: 1,
    });

    if (caseAnalytics.length === 0) {
      return { prediction: 'unknown', confidence: 0, message: 'No prediction data available' };
    }

    return caseAnalytics[0].data || {};
  }

  async getJudgeAnalytics(judgeName: string): Promise<any> {
    const judgeAnalytics = await this.analyticsModel.findAll({
      where: {
        metric_type: 'judge_analytics',
        title: { [Op.like]: `%${judgeName}%` },
      },
      order: [['created_at', 'DESC']],
      limit: 1,
    });

    if (judgeAnalytics.length === 0) {
      return { message: 'No analytics available for this judge' };
    }

    return judgeAnalytics[0].data || {};
  }

  async getCounselPerformance(counselName: string): Promise<any> {
    const counselAnalytics = await this.analyticsModel.findAll({
      where: {
        metric_type: 'counsel_performance',
        title: { [Op.like]: `%${counselName}%` },
      },
      order: [['created_at', 'DESC']],
      limit: 1,
    });

    if (counselAnalytics.length === 0) {
      return { message: 'No analytics available for this counsel' };
    }

    return counselAnalytics[0].data || {};
  }

  async create(createData: Partial<Analytics>): Promise<Analytics> {
    const record = await this.analyticsModel.create(createData);
    return this.findOne(record.id);
  }
}
