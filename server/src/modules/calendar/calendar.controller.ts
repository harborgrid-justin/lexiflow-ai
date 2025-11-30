import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CalendarService } from './calendar.service';
import { CalendarEvent } from '../../models/calendar.model';

@ApiTags('calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new calendar event' })
  @ApiResponse({ status: 201, description: 'Calendar event created successfully', type: CalendarEvent })
  create(@Body() createEventData: Partial<CalendarEvent>): Promise<CalendarEvent> {
    return this.calendarService.create(createEventData);
  }

  @Get()
  @ApiOperation({ summary: 'Get calendar events' })
  @ApiQuery({ name: 'caseId', required: false, description: 'Case ID filter' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date filter' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date filter' })
  @ApiResponse({ status: 200, description: 'Calendar events retrieved successfully', type: [CalendarEvent] })
  findAll(
    @Query('caseId') caseId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<CalendarEvent[]> {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    return this.calendarService.findAll(caseId, start, end);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming events' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days ahead to look' })
  @ApiResponse({ status: 200, description: 'Upcoming events retrieved successfully', type: [CalendarEvent] })
  findUpcoming(@Query('days') days?: string): Promise<CalendarEvent[]> {
    const numDays = days ? parseInt(days) : 7;
    return this.calendarService.findUpcoming(numDays);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get events by type' })
  @ApiResponse({ status: 200, description: 'Calendar events retrieved successfully', type: [CalendarEvent] })
  findByType(@Param('type') type: string): Promise<CalendarEvent[]> {
    return this.calendarService.findByType(type);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get calendar event by ID' })
  @ApiResponse({ status: 200, description: 'Calendar event retrieved successfully', type: CalendarEvent })
  @ApiResponse({ status: 404, description: 'Calendar event not found' })
  findOne(@Param('id') id: string): Promise<CalendarEvent> {
    return this.calendarService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update calendar event' })
  @ApiResponse({ status: 200, description: 'Calendar event updated successfully', type: CalendarEvent })
  @ApiResponse({ status: 404, description: 'Calendar event not found' })
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<CalendarEvent>,
  ): Promise<CalendarEvent> {
    return this.calendarService.update(id, updateData);
  }
}