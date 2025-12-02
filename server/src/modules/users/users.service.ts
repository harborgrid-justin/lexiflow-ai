import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcrypt';
import { User } from '../../models/user.model';
import { UserProfile } from '../../models/user-profile.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
      include: [
        'organization',
        { model: UserProfile, as: 'profile' },
      ],
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
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, first_name, last_name, ...userData } = createUserDto;

    // Hash password with bcrypt
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Generate full name
    const name = `${first_name} ${last_name}`;

    // Create user
    const user = await this.userModel.create({
      ...userData,
      first_name,
      last_name,
      name,
      password_hash,
    });

    // Return user without password_hash
    const userWithoutPassword = await this.findOne(user.id);
    return userWithoutPassword;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const { password, first_name, last_name, ...updateData } = updateUserDto;

    // If password is being updated, hash it
    if (password) {
      const saltRounds = 10;
      updateData['password_hash'] = await bcrypt.hash(password, saltRounds);
    }

    // If first_name or last_name is being updated, regenerate name
    if (first_name || last_name) {
      const user = await this.userModel.findByPk(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      const newFirstName = first_name || user.first_name;
      const newLastName = last_name || user.last_name;
      updateData['name'] = `${newFirstName} ${newLastName}`;
      if (first_name) {updateData['first_name'] = first_name;}
      if (last_name) {updateData['last_name'] = last_name;}
    }

    const [affectedCount, _affectedRows] = await this.userModel.update(
      updateData,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const deletedCount = await this.userModel.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async updateLastActive(id: string): Promise<void> {
    await this.userModel.update(
      { last_active: new Date() },
      { where: { id } },
    );
  }
}