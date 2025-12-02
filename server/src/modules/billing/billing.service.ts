import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TimeEntry } from '../../models/billing.model';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';
import { Op } from 'sequelize';

@Injectable()
export class BillingService {
  constructor(
    @InjectModel(TimeEntry)
    private timeEntryModel: typeof TimeEntry,
  ) {}

  async findAll(caseId?: string, userId?: string): Promise<TimeEntry[]> {
    const whereClause: any = {};

    if (caseId) {
      whereClause.case_id = caseId;
    }

    if (userId) {
      whereClause.user_id = userId;
    }

    return this.timeEntryModel.findAll({
      where: whereClause,
      include: ['case', 'user'],
      order: [['work_date', 'DESC']],
    });
  }

  async findOne(id: string): Promise<TimeEntry> {
    const entry = await this.timeEntryModel.findByPk(id, {
      include: ['case', 'user'],
    });

    if (!entry) {
      throw new NotFoundException(`Time entry with ID ${id} not found`);
    }

    return entry;
  }

  async create(createDto: CreateTimeEntryDto): Promise<TimeEntry> {
    // Calculate duration in minutes and total
    const duration = Math.round(createDto.hours * 60);
    const rate = createDto.rate || 0;
    const total = createDto.hours * rate;

    const entry = await this.timeEntryModel.create({
      ...createDto,
      work_date: new Date(createDto.date),
      duration,
      total,
      entry_type: createDto.entry_type || 'billable',
      status: createDto.status || 'draft',
    });

    return this.findOne(entry.id);
  }

  async update(id: string, updateDto: UpdateTimeEntryDto): Promise<TimeEntry> {
    const entry = await this.findOne(id);

    const updateData: any = { ...updateDto };

    // Recalculate if hours or rate changed
    if (updateDto.hours !== undefined || updateDto.rate !== undefined) {
      const hours = updateDto.hours !== undefined ? updateDto.hours : entry.hours;
      const rate = updateDto.rate !== undefined ? updateDto.rate : entry.rate;
      updateData.duration = Math.round(hours * 60);
      updateData.total = hours * rate;
    }

    if (updateDto.date) {
      updateData.work_date = new Date(updateDto.date);
    }

    await entry.update(updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const entry = await this.findOne(id);
    await entry.destroy();
  }

  async getStats(caseId?: string, startDate?: string, endDate?: string): Promise<any> {
    const whereClause: any = {};

    if (caseId) {
      whereClause.case_id = caseId;
    }

    if (startDate || endDate) {
      whereClause.work_date = {};
      if (startDate) {
        whereClause.work_date[Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereClause.work_date[Op.lte] = new Date(endDate);
      }
    }

    const entries = await this.timeEntryModel.findAll({
      where: whereClause,
    });

    const totalHours = entries.reduce((sum, entry) => sum + Number(entry.hours), 0);
    const totalAmount = entries.reduce((sum, entry) => sum + Number(entry.total), 0);
    const billableEntries = entries.filter(e => e.entry_type === 'billable');
    const billableHours = billableEntries.reduce((sum, entry) => sum + Number(entry.hours), 0);
    const billableAmount = billableEntries.reduce((sum, entry) => sum + Number(entry.total), 0);

    return {
      totalEntries: entries.length,
      totalHours,
      totalAmount,
      billableEntries: billableEntries.length,
      billableHours,
      billableAmount,
      nonBillableHours: totalHours - billableHours,
      averageRate: billableHours > 0 ? billableAmount / billableHours : 0,
    };
  }

  calculateTotal(entries: TimeEntry[]): number {
    return entries.reduce((sum, entry) => sum + Number(entry.total), 0);
  }
}