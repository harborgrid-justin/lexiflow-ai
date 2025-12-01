import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Client } from '../../models/client.model';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client)
    private clientModel: typeof Client,
  ) {}

  async create(createClientData: Partial<Client>): Promise<Client> {
    return this.clientModel.create(createClientData);
  }

  async findAll(orgId?: string): Promise<Client[]> {
    const whereClause = orgId ? { owner_org_id: orgId } : {};
    return this.clientModel.findAll({
      where: whereClause,
      include: ['organization'],
    });
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientModel.findByPk(id, {
      include: ['organization'],
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async update(id: string, updateData: Partial<Client>): Promise<Client> {
    const [affectedCount, affectedRows] = await this.clientModel.update(
      updateData,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return affectedRows[0];
  }

  async remove(id: string): Promise<void> {
    const deletedCount = await this.clientModel.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
  }

  async findByName(name: string): Promise<Client[]> {
    return this.clientModel.findAll({
      where: { name },
      include: ['organization'],
    });
  }
}