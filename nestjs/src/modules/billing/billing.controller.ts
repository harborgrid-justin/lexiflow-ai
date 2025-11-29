import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { TimeEntry } from '../../models/billing.model';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('time-entries')
  @ApiOperation({ summary: 'Create a new time entry' })
  @ApiResponse({ status: 201, description: 'Time entry created successfully', type: TimeEntry })
  createTimeEntry(@Body() createTimeEntryData: Partial<TimeEntry>): Promise<TimeEntry> {
    return this.billingService.createTimeEntry(createTimeEntryData);
  }

  @Get('time-entries')
  @ApiOperation({ summary: 'Get all time entries' })
  @ApiQuery({ name: 'caseId', required: false, description: 'Case ID filter' })
  @ApiQuery({ name: 'userId', required: false, description: 'User ID filter' })
  @ApiResponse({ status: 200, description: 'Time entries retrieved successfully', type: [TimeEntry] })
  findTimeEntries(@Query('caseId') caseId?: string, @Query('userId') userId?: string): Promise<TimeEntry[]> {
    return this.billingService.findTimeEntries(caseId, userId);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get billing statistics' })
  @ApiQuery({ name: 'caseId', required: false, description: 'Case ID filter' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date filter' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date filter' })
  @ApiResponse({ status: 200, description: 'Billing stats retrieved successfully' })
  getBillingStats(
    @Query('caseId') caseId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ): Promise<any> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.billingService.getBillingStats(caseId, start, end);
  }

  @Get('time-entries/:id')
  @ApiOperation({ summary: 'Get time entry by ID' })
  @ApiResponse({ status: 200, description: 'Time entry retrieved successfully', type: TimeEntry })
  @ApiResponse({ status: 404, description: 'Time entry not found' })
  findTimeEntry(@Param('id') id: string): Promise<TimeEntry> {
    return this.billingService.findTimeEntry(id);
  }

  @Patch('time-entries/:id')
  @ApiOperation({ summary: 'Update time entry' })
  @ApiResponse({ status: 200, description: 'Time entry updated successfully', type: TimeEntry })
  @ApiResponse({ status: 404, description: 'Time entry not found' })
  updateTimeEntry(
    @Param('id') id: string,
    @Body() updateData: Partial<TimeEntry>,
  ): Promise<TimeEntry> {
    return this.billingService.updateTimeEntry(id, updateData);
  }

  @Delete('time-entries/:id')
  @ApiOperation({ summary: 'Delete time entry' })
  @ApiResponse({ status: 200, description: 'Time entry deleted successfully' })
  @ApiResponse({ status: 404, description: 'Time entry not found' })
  removeTimeEntry(@Param('id') id: string): Promise<void> {
    return this.billingService.removeTimeEntry(id);
  }
}