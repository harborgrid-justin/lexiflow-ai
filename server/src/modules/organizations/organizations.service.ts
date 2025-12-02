import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Organization } from '../../models/organization.model';
import { User } from '../../models/user.model';
import { Case } from '../../models/case.model';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization)
    private organizationModel: typeof Organization,
  ) {}

  async create(createOrgDto: CreateOrganizationDto): Promise<Organization> {
    return this.organizationModel.create(createOrgDto);
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationModel.findAll({
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationModel.findByPk(id, {
      include: [
        {
          model: User,
          as: 'users',
          attributes: { exclude: ['password_hash'] },
        },
      ],
      attributes: {
        include: [
          [
            this.organizationModel.sequelize.literal(
              '(SELECT COUNT(*) FROM cases WHERE cases.organization_id = Organization.id)'
            ),
            'casesCount',
          ],
        ],
      },
    });

    if (!organization) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return organization;
  }

  async update(id: string, updateOrgDto: UpdateOrganizationDto): Promise<Organization> {
    const [affectedCount] = await this.organizationModel.update(
      updateOrgDto,
      { where: { id } }
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Organization with ID ${id} not found`);
    }

    return this.findOne(id);
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
