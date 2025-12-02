import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConflictCheckService } from './conflict-check.service';
import { ConflictCheck } from '../../models/conflict-check.model';

@ApiTags('conflict-check')
@Controller('conflict-check')
export class ConflictCheckController {
  constructor(private readonly conflictCheckService: ConflictCheckService) {}

  @Get()
  @ApiOperation({ summary: 'Get all conflict checks' })
  @ApiResponse({ status: 200, description: 'Conflict checks retrieved successfully', type: [ConflictCheck] })
  findAll(): Promise<ConflictCheck[]> {
    return this.conflictCheckService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get conflict check by ID' })
  @ApiResponse({ status: 200, description: 'Conflict check retrieved successfully', type: ConflictCheck })
  @ApiResponse({ status: 404, description: 'Conflict check not found' })
  findOne(@Param('id') id: string): Promise<ConflictCheck> {
    return this.conflictCheckService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create conflict check' })
  @ApiResponse({ status: 201, description: 'Conflict check created successfully', type: ConflictCheck })
  create(@Body() createDto: any): Promise<ConflictCheck> {
    return this.conflictCheckService.create(createDto);
  }

  @Post('run')
  @ApiOperation({ summary: 'Run a conflict check' })
  @ApiResponse({ status: 200, description: 'Conflict check completed' })
  runCheck(@Body() checkDto: any): Promise<any> {
    return this.conflictCheckService.runCheck(checkDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update conflict check' })
  @ApiResponse({ status: 200, description: 'Conflict check updated successfully', type: ConflictCheck })
  @ApiResponse({ status: 404, description: 'Conflict check not found' })
  update(@Param('id') id: string, @Body() updateDto: any): Promise<ConflictCheck> {
    return this.conflictCheckService.update(id, updateDto);
  }
}
