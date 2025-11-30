import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../models/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(orgId?: string): Promise<User[]> {
    const whereClause = orgId ? { organization_id: orgId } : {};
    return this.userModel.findAll({
      where: whereClause,
      include: ['organization'],
      attributes: { exclude: ['password_hash'] },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findByPk(id, {
      include: ['organization'],
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: { email },
      include: ['organization'],
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    const [affectedCount, affectedRows] = await this.userModel.update(
      updateData,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return affectedRows[0];
  }

  async remove(id: string): Promise<void> {
    const deletedCount = await this.userModel.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}