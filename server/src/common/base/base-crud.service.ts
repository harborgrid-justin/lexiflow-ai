import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, ModelCtor } from 'sequelize-typescript';
import { FindOptions } from 'sequelize';

export interface BaseEntity {
  id: string | number;
}

@Injectable()
export abstract class BaseCrudService<T extends BaseEntity> {
  constructor(protected readonly model: ModelCtor<Model<T>>) {}

  async create(createData: Partial<T>): Promise<T> {
    return this.model.create(createData as any) as Promise<any>;
  }

  async findAll(options?: FindOptions<T>): Promise<T[]> {
    return this.model.findAll(options) as Promise<any[]>;
  }

  async findOne(id: string | number, options?: FindOptions<T>): Promise<T> {
    const entity = await this.model.findByPk(id, options) as any;
    if (!entity) {throw new NotFoundException(`${this.model.name} with ID ${id} not found`);}
    return entity;
  }

  async update(id: string | number, updateData: Partial<T>): Promise<T> {
    const [affectedCount, affectedRows] = await this.model.update(updateData as any, { where: { id } as any, returning: true });
    if (affectedCount === 0) {throw new NotFoundException(`${this.model.name} with ID ${id} not found`);}
    return affectedRows[0] as any;
  }

  async delete(id: string | number): Promise<void> {
    const affectedCount = await this.model.destroy({ where: { id } as any });
    if (affectedCount === 0) {throw new NotFoundException(`${this.model.name} with ID ${id} not found`);}
  }
}
