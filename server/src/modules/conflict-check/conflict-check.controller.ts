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
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ConflictCheckService } from './conflict-check.service';
import { CreateConflictCheckDto, UpdateConflictCheckDto } from './dto/conflict-check.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('conflict-check')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('conflict-check')
export class ConflictCheckController {
  constructor(private readonly conflictCheckService: ConflictCheckService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new conflict check' })
  @ApiResponse({ status: 201, description: 'Conflict check created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createConflictCheckDto: CreateConflictCheckDto, @Request() req: { user: { id: number } }) {
    return this.conflictCheckService.create(createConflictCheckDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all conflict checks' })
  @ApiQuery({ name: 'organizationId', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Conflict checks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @Query('organizationId', new ParseIntPipe({ optional: true })) organizationId?: number,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    if (search) {
      return this.conflictCheckService.search(search, organizationId);
    }
    if (status) {
      return this.conflictCheckService.findByStatus(status, organizationId);
    }
    return this.conflictCheckService.findAll(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a conflict check by ID' })
  @ApiResponse({ status: 200, description: 'Conflict check retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Conflict check not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.conflictCheckService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a conflict check' })
  @ApiResponse({ status: 200, description: 'Conflict check updated successfully' })
  @ApiResponse({ status: 404, description: 'Conflict check not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateConflictCheckDto: UpdateConflictCheckDto) {
    return this.conflictCheckService.update(id, updateConflictCheckDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a conflict check' })
  @ApiResponse({ status: 200, description: 'Conflict check deleted successfully' })
  @ApiResponse({ status: 404, description: 'Conflict check not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.conflictCheckService.remove(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get conflict checks by user' })
  @ApiResponse({ status: 200, description: 'Conflict checks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.conflictCheckService.findByUser(userId);
  }
}