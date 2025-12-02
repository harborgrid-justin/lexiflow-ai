import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CalendarEvent } from '../../models/calendar.model';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { Op } from 'sequelize';

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(CalendarEvent)
    private calendarModel: typeof CalendarEvent,
  ) {}

  async findAll(caseId?: string, startDate?: string, endDate?: string): Promise<CalendarEvent[]> {
    const whereClause: any = {};

    if (caseId) {
      whereClause.case_id = caseId;
    }

    if (startDate && endDate) {
      whereClause.start_time = {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    return this.calendarModel.findAll({
      where: whereClause,
      include: ['case', 'organizer', 'organization'],
      order: [['start_time', 'ASC']],
    });
  }

  async findOne(id: string): Promise<CalendarEvent> {
    const event = await this.calendarModel.findByPk(id, {
      include: ['case', 'organizer', 'organization'],
    });

    if (!event) {
      throw new NotFoundException(`Calendar event with ID ${id} not found`);
    }

    return event;
  }

  async findUpcoming(days: number = 7): Promise<CalendarEvent[]> {
    const now = new Date();
    const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));

    return this.calendarModel.findAll({
      where: {
        start_time: {
          [Op.between]: [now, futureDate],
        },
      },
      include: ['case', 'organizer', 'organization'],
      order: [['start_time', 'ASC']],
    });
  }

  async findByType(type: string): Promise<CalendarEvent[]> {
    return this.calendarModel.findAll({
      where: { type },
      include: ['case', 'organizer', 'organization'],
      order: [['start_time', 'ASC']],
    });
  }

  async create(createDto: CreateCalendarEventDto): Promise<CalendarEvent> {
    const event = await this.calendarModel.create({
      ...createDto,
      status: createDto.status || 'scheduled',
      priority: createDto.priority || 'medium',
      all_day: createDto.all_day || false,
    });

    return this.findOne(event.id);
  }

  async update(id: string, updateDto: UpdateCalendarEventDto): Promise<CalendarEvent> {
    const event = await this.findOne(id);
    await event.update(updateDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const event = await this.findOne(id);
    await event.destroy();
  }
}