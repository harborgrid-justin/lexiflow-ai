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
import { EthicalWallService } from './ethical-wall.service';
import { CreateEthicalWallDto, UpdateEthicalWallDto } from './dto/ethical-wall.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('ethical-wall')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ethical-wall')
export class EthicalWallController {
  constructor(private readonly ethicalWallService: EthicalWallService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ethical wall' })
  @ApiResponse({ status: 201, description: 'Ethical wall created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createEthicalWallDto: CreateEthicalWallDto, @Request() req: { user: { id: number } }) {
    return this.ethicalWallService.create(createEthicalWallDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ethical walls' })
  @ApiQuery({ name: 'organizationId', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Ethical walls retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @Query('organizationId', new ParseIntPipe({ optional: true })) organizationId?: number,
    @Query('search') search?: string,
    @Query('activeOnly') activeOnly?: boolean,
  ) {
    if (search) {
      return this.ethicalWallService.search(search, organizationId);
    }
    if (activeOnly) {
      return this.ethicalWallService.findActive(organizationId);
    }
    return this.ethicalWallService.findAll(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an ethical wall by ID' })
  @ApiResponse({ status: 200, description: 'Ethical wall retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Ethical wall not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ethicalWallService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an ethical wall' })
  @ApiResponse({ status: 200, description: 'Ethical wall updated successfully' })
  @ApiResponse({ status: 404, description: 'Ethical wall not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateEthicalWallDto: UpdateEthicalWallDto) {
    return this.ethicalWallService.update(id, updateEthicalWallDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an ethical wall' })
  @ApiResponse({ status: 200, description: 'Ethical wall deleted successfully' })
  @ApiResponse({ status: 404, description: 'Ethical wall not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ethicalWallService.remove(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get ethical walls affecting a user' })
  @ApiResponse({ status: 200, description: 'Ethical walls retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.ethicalWallService.findByUser(userId);
  }
}