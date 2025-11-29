import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CalendarEvent } from '../../models/calendar.model';
import { Op } from 'sequelize';

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(CalendarEvent)
    private calendarModel: typeof CalendarEvent,
  ) {}

  async create(createEventData: Partial<CalendarEvent>): Promise<CalendarEvent> {
    return this.calendarModel.create(createEventData);
  }

  async findAll(caseId?: string, startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
    const whereClause: any = {};
    if (caseId) whereClause.case_id = caseId;
    if (startDate && endDate) {
      whereClause.start_time = {
        [Op.between]: [startDate, endDate],
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

  async update(id: string, updateData: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const [affectedCount, affectedRows] = await this.calendarModel.update(
      updateData,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Calendar event with ID ${id} not found`);
    }

    return affectedRows[0];
  }

  async findByType(type: string): Promise<CalendarEvent[]> {
    return this.calendarModel.findAll({
      where: { type },
      include: ['case', 'organizer', 'organization'],
      order: [['start_time', 'ASC']],
    });
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
}