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
import { CalendarService } from './calendar.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { CalendarEvent } from '../../models/calendar.model';

@ApiTags('calendar')
@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  @ApiOperation({ summary: 'Get calendar events' })
  @ApiQuery({ name: 'caseId', required: false, description: 'Filter by case ID' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
  @ApiResponse({ status: 200, description: 'Calendar events retrieved successfully', type: [CalendarEvent] })
  findAll(
    @Query('caseId') caseId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<CalendarEvent[]> {
    return this.calendarService.findAll(caseId, startDate, endDate);
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming events' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days ahead to look (default: 7)' })
  @ApiResponse({ status: 200, description: 'Upcoming events retrieved successfully', type: [CalendarEvent] })
  findUpcoming(@Query('days') days?: string): Promise<CalendarEvent[]> {
    const numDays = days ? parseInt(days) : 7;
    return this.calendarService.findUpcoming(numDays);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get events by type (deadline, hearing, statute-of-limitations, team)' })
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

  @Post()
  @ApiOperation({ summary: 'Create a new calendar event' })
  @ApiResponse({ status: 201, description: 'Calendar event created successfully', type: CalendarEvent })
  create(@Body() createDto: CreateCalendarEventDto): Promise<CalendarEvent> {
    return this.calendarService.create(createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update calendar event' })
  @ApiResponse({ status: 200, description: 'Calendar event updated successfully', type: CalendarEvent })
  @ApiResponse({ status: 404, description: 'Calendar event not found' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCalendarEventDto,
  ): Promise<CalendarEvent> {
    return this.calendarService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete calendar event' })
  @ApiResponse({ status: 200, description: 'Calendar event deleted successfully' })
  @ApiResponse({ status: 404, description: 'Calendar event not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.calendarService.remove(id);
  }
}