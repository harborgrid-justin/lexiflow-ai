import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DiscoveryRequest } from '../../models/discovery.model';

@Injectable()
export class DiscoveryService {
  constructor(
    @InjectModel(DiscoveryRequest)
    private discoveryRequestModel: typeof DiscoveryRequest,
  ) {}

  async create(createDiscoveryData: Partial<DiscoveryRequest>): Promise<DiscoveryRequest> {
    return this.discoveryRequestModel.create(createDiscoveryData);
  }

  async findAll(caseId?: string): Promise<DiscoveryRequest[]> {
    const whereClause = caseId ? { case_id: caseId } : {};
    return this.discoveryRequestModel.findAll({
      where: whereClause,
      include: ['case', 'creator'],
    });
  }

  async findOne(id: string): Promise<DiscoveryRequest> {
    const discoveryRequest = await this.discoveryRequestModel.findByPk(id, {
      include: ['case', 'creator'],
    });

    if (!discoveryRequest) {
      throw new NotFoundException(`Discovery request with ID ${id} not found`);
    }

    return discoveryRequest;
  }

  async update(id: string, updateData: Partial<DiscoveryRequest>): Promise<DiscoveryRequest> {
    const [affectedCount, affectedRows] = await this.discoveryRequestModel.update(
      updateData,
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
    const deletedCount = await this.discoveryRequestModel.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`Discovery request with ID ${id} not found`);
    }
  }
}