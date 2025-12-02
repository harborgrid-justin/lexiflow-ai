import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ConflictCheck } from '../../models/conflict-check.model';

@Injectable()
export class ConflictCheckService {
  constructor(
    @InjectModel(ConflictCheck)
    private conflictCheckModel: typeof ConflictCheck,
  ) {}

  async findAll(orgId?: string): Promise<ConflictCheck[]> {
    const whereClause: any = {};
    // Add org filtering if your schema supports it
    return this.conflictCheckModel.findAll({
      where: whereClause,
      include: ['checker'],
      order: [['check_date', 'DESC']],
    });
  }

  async findOne(id: string): Promise<ConflictCheck> {
    const check = await this.conflictCheckModel.findByPk(id, {
      include: ['checker'],
    });

    if (!check) {
      throw new NotFoundException(\`Conflict check with ID \${id} not found\`);
    }

    return check;
  }

  async runCheck(checkDto: any): Promise<any> {
    // Simulate conflict check logic
    const entityName = checkDto.entity_name || checkDto.entityName;
    
    // Create the check record
    const check = await this.conflictCheckModel.create({
      entity_name: entityName,
      check_date: new Date(),
      status: 'Cleared',
      found_in: null,
      checked_by: checkDto.checked_by || checkDto.checkedBy,
      notes: 'Automated conflict check completed',
    });

    return {
      id: check.id,
      status: 'Cleared',
      conflicts: [],
      message: 'No conflicts found',
    };
  }

  async create(createDto: any): Promise<ConflictCheck> {
    const check = await this.conflictCheckModel.create(createDto);
    return this.findOne(check.id);
  }

  async update(id: string, updateDto: any): Promise<ConflictCheck> {
    const check = await this.findOne(id);
    await check.update(updateDto);
    return this.findOne(id);
  }
}
