import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from '../../models/group.model';
import { UserGroup } from '../../models/user-group.model';
import { User } from '../../models/user.model';
import { CreateGroupDto } from './dto/group.dto';
import { UpdateGroupDto } from './dto/group.dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group)
    private groupModel: typeof Group,
    @InjectModel(UserGroup)
    private userGroupModel: typeof UserGroup,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findAll(orgId?: string): Promise<Group[]> {
    const whereClause = orgId ? { org_id: orgId } : {};
    return this.groupModel.findAll({
      where: whereClause,
      include: ['organization'],
      order: [['name', 'ASC']],
    });
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.groupModel.findByPk(id, {
      include: ['organization'],
    });

    if (!group) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return group;
  }

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const { permissions, ...groupData } = createGroupDto;

    // Convert permissions array to comma-separated string if provided
    const permissionsString = permissions ? permissions.join(',') : undefined;

    const group = await this.groupModel.create({
      ...groupData,
      org_id: createGroupDto.owner_org_id,
      permissions: permissionsString,
    });

    return this.findOne(group.id);
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const { permissions, owner_org_id, ...updateData } = updateGroupDto;

    // Convert permissions array to comma-separated string if provided
    const permissionsString = permissions ? permissions.join(',') : undefined;

    const dataToUpdate: any = { ...updateData };
    if (permissionsString !== undefined) {
      dataToUpdate.permissions = permissionsString;
    }
    if (owner_org_id) {
      dataToUpdate.org_id = owner_org_id;
    }

    const [affectedCount] = await this.groupModel.update(
      dataToUpdate,
      { where: { id } }
    );

    if (affectedCount === 0) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const deletedCount = await this.groupModel.destroy({
      where: { id },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(`Group with ID ${id} not found`);
    }
  }

  async addMember(groupId: string, userId: string, role?: string): Promise<UserGroup> {
    // Verify group exists
    await this.findOne(groupId);

    // Verify user exists
    const user = await this.userModel.findByPk(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Create user-group relationship
    const userGroup = await this.userGroupModel.create({
      user_id: userId,
      group_id: groupId,
      joined_at: new Date(),
      role: role || 'Member',
    });

    return userGroup;
  }

  async removeMember(groupId: string, userId: string): Promise<void> {
    const deletedCount = await this.userGroupModel.destroy({
      where: {
        group_id: groupId,
        user_id: userId,
      },
    });

    if (deletedCount === 0) {
      throw new NotFoundException(
        `User ${userId} is not a member of group ${groupId}`
      );
    }
  }

  async getMembers(groupId: string): Promise<User[]> {
    // Verify group exists
    await this.findOne(groupId);

    const userGroups = await this.userGroupModel.findAll({
      where: { group_id: groupId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password_hash'] },
        }
      ],
    });

    return userGroups.map(ug => ug.user);
  }
}
