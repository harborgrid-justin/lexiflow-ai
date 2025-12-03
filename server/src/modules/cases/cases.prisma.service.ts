import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';

@Injectable()
export class CasesPrismaService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCaseDto: CreateCaseDto): Promise<any> {
    // Convert filing_date string to Date if provided
    const caseData: any = {
      ...createCaseDto,
      filingDate: createCaseDto.filing_date ? new Date(createCaseDto.filing_date) : undefined,
    };

    // Remove the old field name
    delete caseData.filing_date;

    return this.prisma.case.create({
      data: caseData,
      include: {
        organization: true,
        caseMembers: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  async findAll(orgId?: string, page: number = 1, limit: number = 20): Promise<{
    cases: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number
  }> {
    const whereClause = orgId ? { ownerOrgId: orgId } : {};
    const offset = (page - 1) * limit;

    const [cases, total] = await Promise.all([
      this.prisma.case.findMany({
        where: whereClause,
        include: {
          organization: true,
          caseMembers: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.case.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      cases,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string): Promise<any> {
    const caseRecord = await this.prisma.case.findUnique({
      where: { id },
      include: {
        organization: true,
        caseMembers: {
          include: {
            user: true,
          },
        },
        documents: true,
      },
    });

    if (!caseRecord) {
      throw new NotFoundException(`Case with ID ${id} not found`);
    }

    return caseRecord;
  }

  async update(id: string, updateCaseDto: UpdateCaseDto): Promise<any> {
    try {
      const updatedCase = await this.prisma.case.update({
        where: { id },
        data: updateCaseDto as any,
        include: {
          organization: true,
          caseMembers: {
            include: {
              user: true,
            },
          },
        },
      });

      return updatedCase;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Case with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.case.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Case with ID ${id} not found`);
      }
      throw error;
    }
  }

  async findByClient(clientName: string): Promise<any[]> {
    return this.prisma.case.findMany({
      where: { clientName },
      include: {
        organization: true,
      },
    });
  }

  async findByStatus(status: string): Promise<any[]> {
    return this.prisma.case.findMany({
      where: { status },
      include: {
        organization: true,
      },
    });
  }

  async getStats(): Promise<{
    total: number;
    active: number;
    closed: number;
    pending: number;
  }> {
    const [total, active, closed, pending] = await Promise.all([
      this.prisma.case.count(),
      this.prisma.case.count({ where: { status: 'Active' } }),
      this.prisma.case.count({ where: { status: 'Closed' } }),
      this.prisma.case.count({ where: { status: 'Pending' } }),
    ]);

    return { total, active, closed, pending };
  }
}
