import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Client } from '../../models/client.model';
import { Case } from '../../models/case.model';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client)
    private clientModel: typeof Client,
  ) {}

  async findAll(orgId?: string): Promise<Client[]> {
    const whereClause = orgId ? { owner_org_id: orgId } : {};
    return this.clientModel.findAll({
      where: whereClause,
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientModel.findByPk(id, {
      include: [
        {
          model: Case,
          as: 'cases',
        },
      ],
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return client;
  }

  async findByName(name: string): Promise<Client[]> {
    return this.clientModel.findAll({
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
      order: [['name', 'ASC']],
    });
  }

  async create(createClientDto: CreateClientDto): Promise<Client> {
    return this.clientModel.create(createClientDto as any);
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const [affectedCount] = await this.clientModel.update(
      updateClientDto,
      { where: { id } },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const deletedCount = await this.clientModel.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`Client with ID ${id} not found`);
    }
  }
}
