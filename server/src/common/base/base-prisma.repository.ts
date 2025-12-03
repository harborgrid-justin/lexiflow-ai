import { PrismaService } from '../../prisma/prisma.service';

export abstract class BasePrismaRepository<T, CreateDTO, UpdateDTO> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string,
  ) {}

  async findAll(where?: any): Promise<T[]> {
    return (this.prisma as any)[this.modelName].findMany({ where });
  }

  async findOne(id: string): Promise<T | null> {
    return (this.prisma as any)[this.modelName].findUnique({ where: { id } });
  }

  async create(data: CreateDTO): Promise<T> {
    return (this.prisma as any)[this.modelName].create({ data });
  }

  async update(id: string, data: UpdateDTO): Promise<T> {
    return (this.prisma as any)[this.modelName].update({ where: { id }, data });
  }

  async delete(id: string): Promise<T> {
    return (this.prisma as any)[this.modelName].delete({ where: { id } });
  }
}
