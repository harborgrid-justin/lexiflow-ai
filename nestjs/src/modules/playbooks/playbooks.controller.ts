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
import { PlaybooksService } from './playbooks.service';
import { CreatePlaybookDto, UpdatePlaybookDto } from './dto/playbook.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('playbooks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('playbooks')
export class PlaybooksController {
  constructor(private readonly playbooksService: PlaybooksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new playbook' })
  @ApiResponse({ status: 201, description: 'Playbook created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createPlaybookDto: CreatePlaybookDto, @Request() req: { user: { id: number } }) {
    return this.playbooksService.create(createPlaybookDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all playbooks' })
  @ApiQuery({ name: 'organizationId', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'activeOnly', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Playbooks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(
    @Query('organizationId', new ParseIntPipe({ optional: true })) organizationId?: number,
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('activeOnly') activeOnly?: boolean,
  ) {
    if (search) {
      return this.playbooksService.search(search, organizationId);
    }
    if (category) {
      return this.playbooksService.findByCategory(category, organizationId);
    }
    if (activeOnly) {
      return this.playbooksService.findActive(organizationId);
    }
    return this.playbooksService.findAll(organizationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a playbook by ID' })
  @ApiResponse({ status: 200, description: 'Playbook retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Playbook not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playbooksService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a playbook' })
  @ApiResponse({ status: 200, description: 'Playbook updated successfully' })
  @ApiResponse({ status: 404, description: 'Playbook not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePlaybookDto: UpdatePlaybookDto) {
    return this.playbooksService.update(id, updatePlaybookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a playbook' })
  @ApiResponse({ status: 200, description: 'Playbook deleted successfully' })
  @ApiResponse({ status: 404, description: 'Playbook not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.playbooksService.remove(id);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get playbooks by category' })
  @ApiQuery({ name: 'organizationId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Playbooks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByCategory(
    @Param('category') category: string,
    @Query('organizationId', new ParseIntPipe({ optional: true })) organizationId?: number,
  ) {
    return this.playbooksService.findByCategory(category, organizationId);
  }

  @Get('author/:authorId')
  @ApiOperation({ summary: 'Get playbooks by author' })
  @ApiResponse({ status: 200, description: 'Playbooks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findByAuthor(@Param('authorId', ParseIntPipe) authorId: number) {
    return this.playbooksService.findByAuthor(authorId);
  }
}