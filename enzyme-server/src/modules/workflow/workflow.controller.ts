import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { WorkflowService } from './workflow.service';
import { WorkflowStage, WorkflowTask } from '../../models/workflow.model';

@ApiTags('workflow')
@Controller('workflow')
export class WorkflowController {
  constructor(private readonly workflowService: WorkflowService) {}

  @Post('stages')
  @ApiOperation({ summary: 'Create a new workflow stage' })
  @ApiResponse({ status: 201, description: 'Workflow stage created successfully', type: WorkflowStage })
  createStage(@Body() createStageData: Partial<WorkflowStage>): Promise<WorkflowStage> {
    return this.workflowService.createStage(createStageData);
  }

  @Post('tasks')
  @ApiOperation({ summary: 'Create a new workflow task' })
  @ApiResponse({ status: 201, description: 'Workflow task created successfully', type: WorkflowTask })
  createTask(@Body() createTaskData: Partial<WorkflowTask>): Promise<WorkflowTask> {
    return this.workflowService.createTask(createTaskData);
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
  updateStage(
    @Param('id') id: string,
    @Body() updateData: Partial<WorkflowStage>,
  ): Promise<WorkflowStage> {
    return this.workflowService.updateStage(id, updateData);
  }

  @Patch('tasks/:id')
  @ApiOperation({ summary: 'Update workflow task' })
  @ApiResponse({ status: 200, description: 'Workflow task updated successfully', type: WorkflowTask })
  @ApiResponse({ status: 404, description: 'Workflow task not found' })
  updateTask(
    @Param('id') id: string,
    @Body() updateData: Partial<WorkflowTask>,
  ): Promise<WorkflowTask> {
    return this.workflowService.updateTask(id, updateData);
  }
}