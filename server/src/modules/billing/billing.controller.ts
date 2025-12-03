import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BillingService } from './billing.service';
import { BillingPrismaService } from './billing.prisma.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { TimeEntry } from '../../models/billing.model';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingPrismaService) {}

  @Get('time-entries')
  @ApiOperation({ summary: 'Get all time entries' })
  @ApiQuery({ name: 'caseId', required: false, description: 'Filter by case ID' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiResponse({ status: 200, description: 'Time entries retrieved successfully', type: [TimeEntry] })
  findAll(
    @Query('caseId') caseId?: string,
    @Query('userId') userId?: string,
  ): Promise<TimeEntry[]> {
    return this.billingService.findAll(caseId, userId);
  }

  @Get('time-entries/:id')
  @ApiOperation({ summary: 'Get a time entry by ID' })
  @ApiResponse({ status: 200, description: 'Time entry retrieved successfully', type: TimeEntry })
  @ApiResponse({ status: 404, description: 'Time entry not found' })
  findOne(@Param('id') id: string): Promise<TimeEntry> {
    return this.billingService.findOne(id);
  }

  @Post('time-entries')
  @ApiOperation({ summary: 'Create a new time entry' })
  @ApiResponse({ status: 201, description: 'Time entry created successfully', type: TimeEntry })
  create(@Body() createDto: CreateTimeEntryDto): Promise<TimeEntry> {
    return this.billingService.create(createDto);
  }

  @Patch('time-entries/:id')
  @ApiOperation({ summary: 'Update a time entry' })
  @ApiResponse({ status: 200, description: 'Time entry updated successfully', type: TimeEntry })
  @ApiResponse({ status: 404, description: 'Time entry not found' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateTimeEntryDto,
  ): Promise<TimeEntry> {
    return this.billingService.update(id, updateDto);
  }

  @Delete('time-entries/:id')
  @ApiOperation({ summary: 'Delete a time entry' })
  @ApiResponse({ status: 200, description: 'Time entry deleted successfully' })
  @ApiResponse({ status: 404, description: 'Time entry not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.billingService.remove(id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get billing statistics' })
  @ApiQuery({ name: 'caseId', required: false, description: 'Filter by case ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  getStats(
    @Query('caseId') caseId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    return this.billingService.getStats(caseId, startDate, endDate);
  }
}