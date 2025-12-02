import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { WorkflowService } from './workflow.service';
import { WorkflowStage, WorkflowTask } from '../../models/workflow.model';
import {
  CreateWorkflowStageDto,
  UpdateWorkflowStageDto,
  CreateWorkflowTaskDto,
  UpdateWorkflowTaskDto,
} from './dto';

@ApiTags('workflow')
@Controller('workflow')
@UsePipes(new ValidationPipe({ transform: true }))
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('stages')
  @ApiOperation({ summary: 'Create a new workflow stage' })
  @ApiResponse({ status: 201, description: 'Workflow stage created successfully', type: WorkflowStage })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  createStage(@Body() createStageDto: CreateWorkflowStageDto): Promise<WorkflowStage> {
    return this.workflowService.createStage(createStageDto);
  }

  @Post('tasks')
  @ApiOperation({ summary: 'Create a new workflow task' })
  @ApiResponse({ status: 201, description: 'Workflow task created successfully', type: WorkflowTask })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  createTask(@Body() createTaskDto: CreateWorkflowTaskDto): Promise<WorkflowTask> {
    return this.workflowService.createTask(createTaskDto);
  }

  @Get('stages')
  @ApiOperation({ summary: 'Get all workflow stages' })
  @ApiQuery({ name: 'caseId', required: false, description: 'Case ID filter' })
  @ApiResponse({ status: 200, description: 'Workflow stages retrieved successfully', type: [WorkflowStage] })
  findStages(@Query('caseId') caseId?: string): Promise<WorkflowStage[]> {
    return this.workflowService.findStages(caseId);
  }

  @Get('tasks')
  @ApiOperation({ summary: 'Get all workflow tasks' })
  @ApiQuery({ name: 'stageId', required: false, description: 'Stage ID filter' })
  @ApiQuery({ name: 'assigneeId', required: false, description: 'Assignee ID filter' })
  @ApiResponse({ status: 200, description: 'Workflow tasks retrieved successfully', type: [WorkflowTask] })
  findTasks(@Query('stageId') stageId?: string, @Query('assigneeId') assigneeId?: string): Promise<WorkflowTask[]> {
    return this.workflowService.findTasks(stageId, assigneeId);
  }

  @Get('stages/:id')
  @ApiOperation({ summary: 'Get workflow stage by ID' })
  @ApiResponse({ status: 200, description: 'Workflow stage retrieved successfully', type: WorkflowStage })
  @ApiResponse({ status: 404, description: 'Workflow stage not found' })
  findStage(@Param('id') id: string): Promise<WorkflowStage> {
    return this.workflowService.findStage(id);
  }

  @Get('tasks/:id')
  @ApiOperation({ summary: 'Get workflow task by ID' })
  @ApiResponse({ status: 200, description: 'Workflow task retrieved successfully', type: WorkflowTask })
  @ApiResponse({ status: 404, description: 'Workflow task not found' })
  findTask(@Param('id') id: string): Promise<WorkflowTask> {
    return this.workflowService.findTask(id);
  }

  @Patch('stages/:id')
  @ApiOperation({ summary: 'Update workflow stage' })
  @ApiResponse({ status: 200, description: 'Workflow stage updated successfully', type: WorkflowStage })
  @ApiResponse({ status: 404, description: 'Workflow stage not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  updateStage(
    @Param('id') id: string,
    @Body() updateStageDto: UpdateWorkflowStageDto,
  ): Promise<WorkflowStage> {
    return this.workflowService.updateStage(id, updateStageDto);
  }

  @Patch('tasks/:id')
  @ApiOperation({ summary: 'Update workflow task' })
  @ApiResponse({ status: 200, description: 'Workflow task updated successfully', type: WorkflowTask })
  @ApiResponse({ status: 404, description: 'Workflow task not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateWorkflowTaskDto,
  ): Promise<WorkflowTask> {
    return this.workflowService.updateTask(id, updateTaskDto);
  }
}