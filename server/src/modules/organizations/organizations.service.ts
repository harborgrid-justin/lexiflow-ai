import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Organization } from '../../models/organization.model';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization)
    private organizationModel: typeof Organization,
  ) {}

  async create(createOrgData: Partial<Organization>): Promise<Organization> {
    return this.organizationModel.create(createOrgData);
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationModel.findAll();
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationModel.findByPk(id);
    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
    return organization;
  }

  async update(id: string, updateData: Partial<Organization>): Promise<Organization> {
    const [affectedCount, affectedRows] = await this.organizationModel.update(
      updateData,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return affectedRows[0];
  }

  async remove(id: string): Promise<void> {
    const deletedCount = await this.organizationModel.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }
  }
}