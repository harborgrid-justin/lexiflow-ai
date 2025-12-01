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
import { TasksService } from './tasks.service';
import { Task } from '../../models/task.model';

@ApiTags('tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created successfully', type: Task })
  create(@Body() createTaskData: Partial<Task>): Promise<Task> {
    return this.tasksService.create(createTaskData);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiQuery({ name: 'caseId', required: false, description: 'Case ID filter' })
  @ApiQuery({ name: 'assigneeId', required: false, description: 'Assignee ID filter' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully', type: [Task] })
  findAll(@Query('caseId') caseId?: string, @Query('assigneeId') assigneeId?: string): Promise<Task[]> {
    return this.tasksService.findAll(caseId, assigneeId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get tasks by status' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully', type: [Task] })
  findByStatus(@Param('status') status: string): Promise<Task[]> {
    return this.tasksService.findByStatus(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  findOne(@Param('id') id: string): Promise<Task> {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<Task>,
  ): Promise<Task> {
    return this.tasksService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(id);
  }
}