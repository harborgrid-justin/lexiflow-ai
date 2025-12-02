import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EthicalWallService } from './ethical-wall.service';
import { EthicalWall } from '../../models/ethical-wall.model';

@ApiTags('ethical-wall')
@Controller('ethical-wall')
export class EthicalWallController {
  constructor(private readonly ethicalWallService: EthicalWallService) {}

  @Get()
  @ApiOperation({ summary: 'Get all ethical walls' })
  @ApiResponse({ status: 200, description: 'Ethical walls retrieved successfully', type: [EthicalWall] })
  findAll(): Promise<EthicalWall[]> {
    return this.ethicalWallService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ethical wall by ID' })
  @ApiResponse({ status: 200, description: 'Ethical wall retrieved successfully', type: EthicalWall })
  @ApiResponse({ status: 404, description: 'Ethical wall not found' })
  findOne(@Param('id') id: string): Promise<EthicalWall> {
    return this.ethicalWallService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create ethical wall' })
  @ApiResponse({ status: 201, description: 'Ethical wall created successfully', type: EthicalWall })
  create(@Body() createDto: any): Promise<EthicalWall> {
    return this.ethicalWallService.create(createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update ethical wall' })
  @ApiResponse({ status: 200, description: 'Ethical wall updated successfully', type: EthicalWall })
  @ApiResponse({ status: 404, description: 'Ethical wall not found' })
  update(@Param('id') id: string, @Body() updateDto: any): Promise<EthicalWall> {
    return this.ethicalWallService.update(id, updateDto);
  }

  @Get('check/:userId/:caseId')
  @ApiOperation({ summary: 'Check user access to case' })
  @ApiResponse({ status: 200, description: 'Access check completed' })
  checkAccess(
    @Param('userId') userId: string,
    @Param('caseId') caseId: string,
  ): Promise<{ hasAccess: boolean }> {
    return this.ethicalWallService.checkAccess(userId, caseId).then(hasAccess => ({ hasAccess }));
  }
}
