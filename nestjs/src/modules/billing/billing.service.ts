import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TimeEntry } from '../../models/billing.model';
import { Op } from 'sequelize';

@Injectable()
export class BillingService {
  constructor(
    @InjectModel(TimeEntry)
    private timeEntryModel: typeof TimeEntry,
  ) {}

  async createTimeEntry(createTimeEntryData: Partial<TimeEntry>): Promise<TimeEntry> {
    return this.timeEntryModel.create(createTimeEntryData);
  }

  async findTimeEntries(caseId?: string, userId?: string): Promise<TimeEntry[]> {
    const whereClause: Record<string, string> = {};
    if (caseId) {whereClause.case_id = caseId;}
    if (userId) {whereClause.user_id = userId;}

    return this.timeEntryModel.findAll({
      where: whereClause,
      include: ['case', 'user', 'organization'],
    });
  }

  async findTimeEntry(id: string): Promise<TimeEntry> {
    const timeEntry = await this.timeEntryModel.findByPk(id, {
      include: ['case', 'user', 'organization'],
    });

    if (!timeEntry) {
      throw new NotFoundException(`Time entry with ID ${id} not found`);
    }

    return timeEntry;
  }

  async updateTimeEntry(id: string, updateData: Partial<TimeEntry>): Promise<TimeEntry> {
    const [affectedCount, affectedRows] = await this.timeEntryModel.update(
      updateData,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Time entry with ID ${id} not found`);
    }

    return affectedRows[0];
  }

  async removeTimeEntry(id: string): Promise<void> {
    const deletedCount = await this.timeEntryModel.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`Time entry with ID ${id} not found`);
    }
  }

  async getBillingStats(caseId?: string, startDate?: Date, endDate?: Date): Promise<Record<string, unknown>> {
    const whereClause: Record<string, unknown> = {};
    if (caseId) {whereClause.case_id = caseId;}
    if (startDate && endDate) {
      whereClause.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    const timeEntries = await this.timeEntryModel.findAll({
      where: whereClause,
      include: ['case', 'user'],
    });

    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const totalAmount = timeEntries.reduce((sum, entry) => sum + (entry.hours * (entry.rate || 0)), 0);

    return {
      totalHours,
      totalAmount,
      entryCount: timeEntries.length,
      timeEntries,
    };
  }
}