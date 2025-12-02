import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DiscoveryRequest } from '../../models/discovery.model';
import { CreateDiscoveryDto } from './dto/create-discovery.dto';
import { UpdateDiscoveryDto } from './dto/update-discovery.dto';

@Injectable()
export class DiscoveryService {
  constructor(
    @InjectModel(DiscoveryRequest)
    private discoveryModel: typeof DiscoveryRequest,
  ) {}

  async create(createDiscoveryDto: CreateDiscoveryDto): Promise<DiscoveryRequest> {
    return this.discoveryModel.create(createDiscoveryDto as any);
  }

  async findAll(caseId?: string): Promise<DiscoveryRequest[]> {
    const whereClause = caseId ? { case_id: caseId } : {};
    return this.discoveryModel.findAll({
      where: whereClause,
      include: ['case'],
    });
  }

  async findOne(id: string): Promise<DiscoveryRequest> {
    const discovery = await this.discoveryModel.findByPk(id, {
      include: ['case'],
    });

    if (!discovery) {
      throw new NotFoundException(`Discovery request with ID ${id} not found`);
    }

    return discovery;
  }

  async update(id: string, updateDiscoveryDto: UpdateDiscoveryDto): Promise<DiscoveryRequest> {
    const [affectedCount, affectedRows] = await this.discoveryModel.update(
      updateDiscoveryDto as any,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Discovery request with ID ${id} not found`);
    }

    return affectedRows[0];
  }

  async remove(id: string): Promise<void> {
    const deletedCount = await this.discoveryModel.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`Discovery request with ID ${id} not found`);
    }
  }
}