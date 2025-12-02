import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JudgeProfileService } from './judge-profile.service';
import { JudgeProfile } from '../../models/judge-profile.model';

@ApiTags('judge-profile')
@Controller('judge-profile')
export class JudgeProfileController {
  constructor(private readonly judgeProfileService: JudgeProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get all judge profiles' })
  @ApiResponse({ status: 200, description: 'Judge profiles retrieved successfully', type: [JudgeProfile] })
  findAll(): Promise<JudgeProfile[]> {
    return this.judgeProfileService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get judge profile by ID' })
  @ApiResponse({ status: 200, description: 'Judge profile retrieved successfully', type: JudgeProfile })
  @ApiResponse({ status: 404, description: 'Judge profile not found' })
  findOne(@Param('id') id: string): Promise<JudgeProfile> {
    return this.judgeProfileService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create judge profile' })
  @ApiResponse({ status: 201, description: 'Judge profile created successfully', type: JudgeProfile })
  create(@Body() createDto: any): Promise<JudgeProfile> {
    return this.judgeProfileService.create(createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update judge profile' })
  @ApiResponse({ status: 200, description: 'Judge profile updated successfully', type: JudgeProfile })
  @ApiResponse({ status: 404, description: 'Judge profile not found' })
  update(@Param('id') id: string, @Body() updateDto: any): Promise<JudgeProfile> {
    return this.judgeProfileService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete judge profile' })
  @ApiResponse({ status: 200, description: 'Judge profile deleted successfully' })
  @ApiResponse({ status: 404, description: 'Judge profile not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.judgeProfileService.remove(id);
  }
}
