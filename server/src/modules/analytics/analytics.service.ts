import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Analytics } from '../../models/analytics.model';
import { Case } from '../../models/case.model';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Analytics)
    private analyticsModel: typeof Analytics,
    @InjectModel(Case)
    private caseModel: typeof Case,
    private sequelize: Sequelize,
  ) {}

  async create(createAnalyticsData: Partial<Analytics>): Promise<Analytics> {
    return this.analyticsModel.create(createAnalyticsData);
  }

  async findAll(caseId?: string, metricType?: string): Promise<Analytics[]> {
    const whereClause: Record<string, string> = {};
    if (caseId) {whereClause.case_id = caseId;}
    if (metricType) {whereClause.metric_type = metricType;}

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
        metric_type: 'case_outcome_prediction',
      },
      include: ['case', 'creator', 'organization'],
    });
  }

  async getJudgeAnalytics(judgeName: string): Promise<Analytics[]> {
    return this.analyticsModel.findAll({
      where: { 
        metric_type: 'judge_analytics',
        data: {
          judge: judgeName,
        },
      },
      include: ['case', 'creator', 'organization'],
    });
  }

  async getCounselPerformance(counselName: string): Promise<Analytics[]> {
    return this.analyticsModel.findAll({
      where: {
        metric_type: 'counsel_performance',
        data: {
          counsel: counselName,
        },
      },
      include: ['case', 'creator', 'organization'],
    });
  }

  async getDashboard(): Promise<{ stats: any[]; chartData: any[]; alerts: any[] }> {
    // Get case counts by status
    const cases = await this.caseModel.findAll();
    const totalCases = cases.length;
    const activeCases = cases.filter(c => c.status === 'active').length;
    const pendingCases = cases.filter(c => c.status === 'new_lead' || c.status === 'conflict_check' || c.status === 'engagement_letter').length;

    // Calculate total value (handle DECIMAL as string)
    const totalValue = cases.reduce((sum, c) => {
      const val = c.value ? parseFloat(String(c.value)) : 0;
      return sum + (isNaN(val) ? 0 : val);
    }, 0);

    // Get case distribution by phase
    const phaseMap: Record<string, number> = {};
    cases.forEach(c => {
      const phase = c.status || 'Unknown';
      phaseMap[phase] = (phaseMap[phase] || 0) + 1;
    });

    const chartData = Object.entries(phaseMap).map(([name, count]) => ({
      name: name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count,
    }));

    // Build stats for dashboard cards
    const stats = [
      {
        label: 'Active Cases',
        value: activeCases.toString(),
        icon: 'Briefcase',
        color: 'text-blue-600',
        bg: 'bg-blue-100',
      },
      {
        label: 'Pending Intake',
        value: pendingCases.toString(),
        icon: 'Clock',
        color: 'text-amber-600',
        bg: 'bg-amber-100',
      },
      {
        label: 'Total Matters',
        value: totalCases.toString(),
        icon: 'FileText',
        color: 'text-green-600',
        bg: 'bg-green-100',
      },
      {
        label: 'Portfolio Value',
        value: `$${(totalValue / 1000000).toFixed(1)}M`,
        icon: 'AlertTriangle',
        color: 'text-purple-600',
        bg: 'bg-purple-100',
      },
    ];

    // Generate alerts based on recent cases
    const recentCases = cases
      .filter(c => c.createdAt)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const alerts = recentCases.map(c => ({
      id: c.id,
      message: `Case "${c.title}" requires attention`,
      detail: `Client: ${c.client_name || 'Unknown'} | Status: ${c.status}`,
      time: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Unknown',
      caseId: c.id,
    }));

    return { stats, chartData, alerts };
  }
}