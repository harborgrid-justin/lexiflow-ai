import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';

@Injectable()
export class BillingPrismaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(caseId?: string, userId?: string): Promise<any[]> {
    const whereClause: any = {};

    if (caseId) {
      whereClause.caseId = caseId;
    }

    if (userId) {
      whereClause.userId = userId;
    }

    return this.prisma.timeEntry.findMany({
      where: whereClause,
      orderBy: { workDate: 'desc' },
    });
  }

  async findOne(id: string): Promise<any> {
    const entry = await this.prisma.timeEntry.findUnique({
      where: { id },
    });

    if (!entry) {
      throw new NotFoundException(`Time entry with ID ${id} not found`);
    }

    return entry;
  }

  async create(createDto: CreateTimeEntryDto): Promise<any> {
    // Calculate duration in minutes and total
    const duration = Math.round(createDto.hours * 60);
    const rate = createDto.rate || 0;
    const total = createDto.hours * Number(rate);

    const entry = await this.prisma.timeEntry.create({
      data: {
        caseId: createDto.case_id,
        userId: createDto.user_id,
        workDate: new Date(createDto.date),
        date: createDto.date,
        duration,
        hours: createDto.hours,
        rate,
        total,
        description: createDto.description || '',
        entryType: createDto.entry_type || 'billable',
        status: createDto.status || 'draft',
      },
    });

    return this.findOne(entry.id);
  }

  async update(id: string, updateDto: UpdateTimeEntryDto): Promise<any> {
    const entry = await this.findOne(id);

    const updateData: any = {};

    // Only include fields that are provided in updateDto
    if (updateDto.description !== undefined) updateData.description = updateDto.description;
    if (updateDto.entry_type !== undefined) updateData.entryType = updateDto.entry_type;
    if (updateDto.status !== undefined) updateData.status = updateDto.status;
    if (updateDto.case_id !== undefined) updateData.caseId = updateDto.case_id;
    if (updateDto.user_id !== undefined) updateData.userId = updateDto.user_id;

    // Recalculate if hours or rate changed
    if (updateDto.hours !== undefined || updateDto.rate !== undefined) {
      const hours = updateDto.hours !== undefined ? updateDto.hours : Number(entry.hours);
      const rate = updateDto.rate !== undefined ? Number(updateDto.rate) : Number(entry.rate);
      updateData.hours = hours;
      updateData.rate = rate;
      updateData.duration = Math.round(hours * 60);
      updateData.total = hours * rate;
    }

    if (updateDto.date) {
      updateData.workDate = new Date(updateDto.date);
    }

    await this.prisma.timeEntry.update({
      where: { id },
      data: updateData,
    });

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.timeEntry.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Time entry with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getStats(caseId?: string, startDate?: string, endDate?: string): Promise<any> {
    const whereClause: any = {};

    if (caseId) {
      whereClause.caseId = caseId;
    }

    if (startDate || endDate) {
      whereClause.workDate = {};
      if (startDate) {
        whereClause.workDate.gte = new Date(startDate);
      }
      if (endDate) {
        whereClause.workDate.lte = new Date(endDate);
      }
    }

    const entries = await this.prisma.timeEntry.findMany({
      where: whereClause,
    });

    const totalHours = entries.reduce((sum, entry) => sum + Number(entry.hours || 0), 0);
    const totalAmount = entries.reduce((sum, entry) => sum + Number(entry.total || 0), 0);
    const billableEntries = entries.filter(e => e.entryType === 'billable');
    const billableHours = billableEntries.reduce((sum, entry) => sum + Number(entry.hours || 0), 0);
    const billableAmount = billableEntries.reduce((sum, entry) => sum + Number(entry.total || 0), 0);

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

  calculateTotal(entries: any[]): number {
    return entries.reduce((sum, entry) => sum + Number(entry.total || 0), 0);
  }
}
