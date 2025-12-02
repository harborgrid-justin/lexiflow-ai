import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MotionsService } from './motions.service';
import { Motion } from '../../models/motion.model';
import { CreateMotionDto } from './dto/create-motion.dto';
import { UpdateMotionDto } from './dto/update-motion.dto';

@ApiTags('motions')
@Controller('motions')
export class MotionsController {
  constructor(private readonly motionsService: MotionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new motion' })
  @ApiResponse({ status: 201, description: 'Motion created successfully', type: Motion })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createMotionDto: CreateMotionDto): Promise<Motion> {
    return this.motionsService.create(createMotionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all motions' })
  @ApiQuery({ name: 'caseId', required: false, description: 'Case ID filter' })
  @ApiResponse({ status: 200, description: 'Motions retrieved successfully', type: [Motion] })
  findAll(@Query('caseId') caseId?: string): Promise<Motion[]> {
    return this.motionsService.findAll(caseId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get motions by status' })
  @ApiResponse({ status: 200, description: 'Motions retrieved successfully', type: [Motion] })
  findByStatus(@Param('status') status: string): Promise<Motion[]> {
    return this.motionsService.findByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get motion by ID' })
  @ApiResponse({ status: 200, description: 'Motion retrieved successfully', type: Motion })
  @ApiResponse({ status: 404, description: 'Motion not found' })
  findOne(@Param('id') id: string): Promise<Motion> {
    return this.motionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update motion' })
  @ApiResponse({ status: 200, description: 'Motion updated successfully', type: Motion })
  @ApiResponse({ status: 404, description: 'Motion not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  update(
    @Param('id') id: string,
    @Body() updateMotionDto: UpdateMotionDto,
  ): Promise<Motion> {
    return this.motionsService.update(id, updateMotionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete motion' })
  @ApiResponse({ status: 200, description: 'Motion deleted successfully' })
  @ApiResponse({ status: 404, description: 'Motion not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.motionsService.remove(id);
  }
}