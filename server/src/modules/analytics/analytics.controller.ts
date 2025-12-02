import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { Analytics } from '../../models/analytics.model';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all analytics records' })
  @ApiQuery({ name: 'caseId', required: false, description: 'Filter by case ID' })
  @ApiQuery({ name: 'metricType', required: false, description: 'Filter by metric type' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully', type: [Analytics] })
  findAll(
    @Query('caseId') caseId?: string,
    @Query('metricType') metricType?: string,
  ): Promise<Analytics[]> {
    return this.analyticsService.findAll(caseId, metricType);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get analytics dashboard' })
  @ApiQuery({ name: 'orgId', required: false, description: 'Filter by organization ID' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  getDashboard(@Query('orgId') orgId?: string): Promise<any> {
    return this.analyticsService.getDashboard(orgId);
  }

  @Get('case-prediction/:caseId')
  @ApiOperation({ summary: 'Get case outcome prediction' })
  @ApiResponse({ status: 200, description: 'Case prediction retrieved successfully' })
  getCasePrediction(@Param('caseId') caseId: string): Promise<any> {
    return this.analyticsService.getCasePrediction(caseId);
  }

  @Get('judge/:judgeName')
  @ApiOperation({ summary: 'Get judge analytics' })
  @ApiResponse({ status: 200, description: 'Judge analytics retrieved successfully' })
  getJudgeAnalytics(@Param('judgeName') judgeName: string): Promise<any> {
    return this.analyticsService.getJudgeAnalytics(judgeName);
  }

  @Get('counsel/:counselName')
  @ApiOperation({ summary: 'Get opposing counsel performance' })
  @ApiResponse({ status: 200, description: 'Counsel performance retrieved successfully' })
  getCounselPerformance(@Param('counselName') counselName: string): Promise<any> {
    return this.analyticsService.getCounselPerformance(counselName);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get analytics record by ID' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully', type: Analytics })
  @ApiResponse({ status: 404, description: 'Analytics not found' })
  findOne(@Param('id') id: string): Promise<Analytics> {
    return this.analyticsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create analytics record' })
  @ApiResponse({ status: 201, description: 'Analytics created successfully', type: Analytics })
  create(@Body() createData: Partial<Analytics>): Promise<Analytics> {
    return this.analyticsService.create(createData);
  }
}
