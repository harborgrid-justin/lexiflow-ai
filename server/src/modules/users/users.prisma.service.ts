import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersPrismaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(orgId?: string): Promise<any[]> {
    const whereClause = orgId ? { organizationId: orgId } : {};

    return this.prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true,
        role: true,
        status: true,
        organizationId: true,
        lastActive: true,
        createdAt: true,
        updatedAt: true,
        organization: true,
        // Exclude passwordHash
      },
    });
  }

  async findOne(id: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true,
        role: true,
        status: true,
        organizationId: true,
        lastActive: true,
        createdAt: true,
        updatedAt: true,
        organization: true,
        // Exclude passwordHash
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        organization: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    const { password, first_name, last_name, organization_id, ...userData } = createUserDto;

    // Hash password with bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate full name
    const name = `${first_name} ${last_name}`;

    // Create user
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        firstName: first_name,
        lastName: last_name,
        name,
        passwordHash,
        organizationId: organization_id,
      },
      include: {
        organization: true,
      },
    });

    // Return user without password_hash
    return this.findOne(user.id);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    const { password, first_name, last_name, ...updateData } = updateUserDto;

    const dataToUpdate: any = { ...updateData };

    // If password is being updated, hash it
    if (password) {
      const saltRounds = 10;
      dataToUpdate.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    // If first_name or last_name is being updated, regenerate name
    if (first_name || last_name) {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      const newFirstName = first_name || user.firstName;
      const newLastName = last_name || user.lastName;
      dataToUpdate.name = `${newFirstName} ${newLastName}`;
      if (first_name) dataToUpdate.firstName = first_name;
      if (last_name) dataToUpdate.lastName = last_name;
    }

    try {
      await this.prisma.user.update({
        where: { id },
        data: dataToUpdate,
      });

      return this.findOne(id);
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }

  async updateLastActive(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { lastActive: new Date() },
    });
  }
}
