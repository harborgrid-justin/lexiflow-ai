import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { Analytics } from '../../models/analytics.model';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new analytics record' })
  @ApiResponse({ status: 201, description: 'Analytics record created successfully', type: Analytics })
  create(@Body() createAnalyticsData: Partial<Analytics>): Promise<Analytics> {
    return this.analyticsService.create(createAnalyticsData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all analytics records' })
  @ApiQuery({ name: 'caseId', required: false, description: 'Case ID filter' })
  @ApiQuery({ name: 'metricType', required: false, description: 'Metric type filter' })
  @ApiResponse({ status: 200, description: 'Analytics records retrieved successfully', type: [Analytics] })
  findAll(@Query('caseId') caseId?: string, @Query('metricType') metricType?: string): Promise<Analytics[]> {
    return this.analyticsService.findAll(caseId, metricType);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  getDashboard(): Promise<{ stats: any[]; chartData: any[]; alerts: any[] }> {
    return this.analyticsService.getDashboard();
  }

  @Get('judge')
  @ApiOperation({ summary: 'Get all judge analytics summary' })
  @ApiResponse({ status: 200, description: 'Judge analytics summary retrieved successfully' })
  getJudgeAnalyticsSummary(): Promise<{ profile: any; stats: any[] }> {
    return this.analyticsService.getJudgeAnalyticsSummary();
  }

  @Get('counsel')
  @ApiOperation({ summary: 'Get all counsel analytics summary' })
  @ApiResponse({ status: 200, description: 'Counsel analytics summary retrieved successfully' })
  getCounselAnalyticsSummary(): Promise<{ profile: any; outcomes: any[] }> {
    return this.analyticsService.getCounselAnalyticsSummary();
  }

  @Get('case-prediction/:caseId')
  @ApiOperation({ summary: 'Get case outcome prediction' })
  @ApiResponse({ status: 200, description: 'Case prediction retrieved successfully', type: [Analytics] })
  getCaseOutcomePrediction(@Param('caseId') caseId: string): Promise<Analytics[]> {
    return this.analyticsService.getCaseOutcomePrediction(caseId);
  }

  @Get('judge/:judgeName')
  @ApiOperation({ summary: 'Get judge analytics' })
  @ApiResponse({ status: 200, description: 'Judge analytics retrieved successfully', type: [Analytics] })
  getJudgeAnalytics(@Param('judgeName') judgeName: string): Promise<Analytics[]> {
    return this.analyticsService.getJudgeAnalytics(judgeName);
  }

  @Get('counsel/:counselName')
  @ApiOperation({ summary: 'Get counsel performance analytics' })
  @ApiResponse({ status: 200, description: 'Counsel analytics retrieved successfully', type: [Analytics] })
  getCounselPerformance(@Param('counselName') counselName: string): Promise<Analytics[]> {
    return this.analyticsService.getCounselPerformance(counselName);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get analytics record by ID' })
  @ApiResponse({ status: 200, description: 'Analytics record retrieved successfully', type: Analytics })
  @ApiResponse({ status: 404, description: 'Analytics record not found' })
  findOne(@Param('id') id: string): Promise<Analytics> {
    return this.analyticsService.findOne(id);
  }
}