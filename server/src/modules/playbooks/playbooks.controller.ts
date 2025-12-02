import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PlaybooksService } from './playbooks.service';
import { Playbook } from '../../models/playbook.model';

@ApiTags('playbooks')
@Controller('playbooks')
export class PlaybooksController {
  constructor(private readonly playbooksService: PlaybooksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all playbooks' })
  @ApiResponse({ status: 200, description: 'Playbooks retrieved successfully', type: [Playbook] })
  findAll(): Promise<Playbook[]> {
    return this.playbooksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get playbook by ID' })
  @ApiResponse({ status: 200, description: 'Playbook retrieved successfully', type: Playbook })
  @ApiResponse({ status: 404, description: 'Playbook not found' })
  findOne(@Param('id') id: string): Promise<Playbook> {
    return this.playbooksService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create playbook' })
  @ApiResponse({ status: 201, description: 'Playbook created successfully', type: Playbook })
  create(@Body() createDto: any): Promise<Playbook> {
    return this.playbooksService.create(createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update playbook' })
  @ApiResponse({ status: 200, description: 'Playbook updated successfully', type: Playbook })
  @ApiResponse({ status: 404, description: 'Playbook not found' })
  update(@Param('id') id: string, @Body() updateDto: any): Promise<Playbook> {
    return this.playbooksService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete playbook' })
  @ApiResponse({ status: 200, description: 'Playbook deleted successfully' })
  @ApiResponse({ status: 404, description: 'Playbook not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.playbooksService.remove(id);
  }
}
