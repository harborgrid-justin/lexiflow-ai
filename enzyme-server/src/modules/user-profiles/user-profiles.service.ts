import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserProfile } from '../../models/user-profile.model';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Injectable()
export class UserProfilesService {
  constructor(
    @InjectModel(UserProfile)
    private userProfileModel: typeof UserProfile,
  ) {}

  async create(createUserProfileDto: CreateUserProfileDto): Promise<UserProfile> {
    return this.userProfileModel.create(createUserProfileDto as unknown as Partial<UserProfile>);
  }

  async findAll(): Promise<UserProfile[]> {
    return this.userProfileModel.findAll({
      include: ['user'],
    });
  }

  async findOne(id: string): Promise<UserProfile> {
    const profile = await this.userProfileModel.findByPk(id, {
      include: ['user'],
    });

    if (!profile) {
      throw new NotFoundException(`User profile with ID ${id} not found`);
    }

    return profile;
  }

  async findByUserId(userId: string): Promise<UserProfile> {
    const profile = await this.userProfileModel.findOne({
      where: { user_id: userId },
      include: ['user'],
    });

    if (!profile) {
      throw new NotFoundException(`User profile for user ${userId} not found`);
    }

    return profile;
  }

  async update(id: string, updateUserProfileDto: UpdateUserProfileDto): Promise<UserProfile> {
    const [affectedCount, affectedRows] = await this.userProfileModel.update(
      updateUserProfileDto,
      {
        where: { id },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`User profile with ID ${id} not found`);
    }

    return affectedRows[0];
  }

  async updateByUserId(userId: string, updateUserProfileDto: UpdateUserProfileDto): Promise<UserProfile> {
    const [affectedCount, affectedRows] = await this.userProfileModel.update(
      updateUserProfileDto,
      {
        where: { user_id: userId },
        returning: true,
      },
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`User profile for user ${userId} not found`);
    }

    return affectedRows[0];
  }

  async remove(id: string): Promise<void> {
    const affectedCount = await this.userProfileModel.destroy({
      where: { id },
    });

    if (affectedCount === 0) {
      throw new NotFoundException(`User profile with ID ${id} not found`);
    }
  }

  async updateLastActive(userId: string): Promise<void> {
    await this.userProfileModel.update(
      { last_active: new Date() },
      { where: { user_id: userId } },
    );
  }
}