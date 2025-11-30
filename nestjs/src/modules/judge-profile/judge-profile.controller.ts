import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JudgeProfileService } from './judge-profile.service';
import { CreateJudgeProfileDto, UpdateJudgeProfileDto } from './dto/judge-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('judge-profile')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('judge-profile')
export class JudgeProfileController {
  constructor(private readonly judgeProfileService: JudgeProfileService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new judge profile' })
  @ApiResponse({ status: 201, description: 'Judge profile created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createJudgeProfileDto: CreateJudgeProfileDto) {
    return this.judgeProfileService.create(createJudgeProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all judge profiles' })
  @ApiQuery({ name: 'jurisdiction', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'court', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Judge profiles retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @Query('jurisdiction') jurisdiction?: string,
    @Query('search') search?: string,
    @Query('court') court?: string,
  ) {
    if (search) {
      return this.judgeProfileService.search(search, jurisdiction);
    }
    if (court) {
      return this.judgeProfileService.findByCourt(court);
    }
    return this.judgeProfileService.findAll(jurisdiction);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a judge profile by ID' })
  @ApiResponse({ status: 200, description: 'Judge profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Judge profile not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.judgeProfileService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a judge profile' })
  @ApiResponse({ status: 200, description: 'Judge profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Judge profile not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateJudgeProfileDto: UpdateJudgeProfileDto) {
    return this.judgeProfileService.update(id, updateJudgeProfileDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a judge profile' })
  @ApiResponse({ status: 200, description: 'Judge profile deleted successfully' })
  @ApiResponse({ status: 404, description: 'Judge profile not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.judgeProfileService.remove(id);
  }

  @Get('jurisdiction/:jurisdiction')
  @ApiOperation({ summary: 'Get judge profiles by jurisdiction' })
  @ApiResponse({ status: 200, description: 'Judge profiles retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByJurisdiction(@Param('jurisdiction') jurisdiction: string) {
    return this.judgeProfileService.findByJurisdiction(jurisdiction);
  }

  @Get('court/:court')
  @ApiOperation({ summary: 'Get judge profiles by court' })
  @ApiResponse({ status: 200, description: 'Judge profiles retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByCourt(@Param('court') court: string) {
    return this.judgeProfileService.findByCourt(court);
  }
}