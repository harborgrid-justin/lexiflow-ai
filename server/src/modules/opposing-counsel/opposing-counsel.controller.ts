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
import { OpposingCounselProfileService } from './opposing-counsel.service';
import { CreateOpposingCounselProfileDto, UpdateOpposingCounselProfileDto } from './dto/opposing-counsel-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('opposing-counsel')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('opposing-counsel')
export class OpposingCounselController {
  constructor(private readonly opposingCounselService: OpposingCounselProfileService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new opposing counsel profile' })
  @ApiResponse({ status: 201, description: 'Opposing counsel profile created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createOpposingCounselProfileDto: CreateOpposingCounselProfileDto) {
    return this.opposingCounselService.create(createOpposingCounselProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all opposing counsel profiles' })
  @ApiQuery({ name: 'firmName', required: false, type: String })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Opposing counsel profiles retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @Query('firmName') firmName?: string,
    @Query('search') search?: string,
  ) {
    if (search) {
      return this.opposingCounselService.search(search, firmName);
    }
    return this.opposingCounselService.findAll(firmName);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an opposing counsel profile by ID' })
  @ApiResponse({ status: 200, description: 'Opposing counsel profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Opposing counsel profile not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.opposingCounselService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an opposing counsel profile' })
  @ApiResponse({ status: 200, description: 'Opposing counsel profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Opposing counsel profile not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateOpposingCounselProfileDto: UpdateOpposingCounselProfileDto) {
    return this.opposingCounselService.update(id, updateOpposingCounselProfileDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an opposing counsel profile' })
  @ApiResponse({ status: 200, description: 'Opposing counsel profile deleted successfully' })
  @ApiResponse({ status: 404, description: 'Opposing counsel profile not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.opposingCounselService.remove(id);
  }

  @Get('firm/:firmName')
  @ApiOperation({ summary: 'Get opposing counsel profiles by firm' })
  @ApiResponse({ status: 200, description: 'Opposing counsel profiles retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByFirm(@Param('firmName') firmName: string) {
    return this.opposingCounselService.findByFirm(firmName);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get opposing counsel profile by email' })
  @ApiResponse({ status: 200, description: 'Opposing counsel profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByEmail(@Param('email') email: string) {
    return this.opposingCounselService.findByEmail(email);
  }
}