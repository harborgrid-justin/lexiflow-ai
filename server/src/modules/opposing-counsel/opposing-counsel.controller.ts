import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OpposingCounselService } from './opposing-counsel.service';
import { OpposingCounselProfile } from '../../models/opposing-counsel-profile.model';

@ApiTags('opposing-counsel')
@Controller('opposing-counsel')
export class OpposingCounselController {
  constructor(private readonly counselService: OpposingCounselService) {}

  @Get()
  @ApiOperation({ summary: 'Get all opposing counsel profiles' })
  @ApiResponse({ status: 200, description: 'Profiles retrieved successfully', type: [OpposingCounselProfile] })
  findAll(): Promise<OpposingCounselProfile[]> {
    return this.counselService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get opposing counsel profile by ID' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully', type: OpposingCounselProfile })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  findOne(@Param('id') id: string): Promise<OpposingCounselProfile> {
    return this.counselService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create opposing counsel profile' })
  @ApiResponse({ status: 201, description: 'Profile created successfully', type: OpposingCounselProfile })
  create(@Body() createDto: any): Promise<OpposingCounselProfile> {
    return this.counselService.create(createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update opposing counsel profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully', type: OpposingCounselProfile })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  update(@Param('id') id: string, @Body() updateDto: any): Promise<OpposingCounselProfile> {
    return this.counselService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete opposing counsel profile' })
  @ApiResponse({ status: 200, description: 'Profile deleted successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.counselService.remove(id);
  }
}
