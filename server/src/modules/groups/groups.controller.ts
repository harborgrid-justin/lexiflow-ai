import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Query,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GroupsService } from './groups.service';
import { Group } from '../../models/group.model';
import { User } from '../../models/user.model';
import { CreateGroupDto, UpdateGroupDto, AddMemberDto } from './dto/group.dto';

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Get()
  @ApiOperation({ summary: 'List groups' })
  @ApiQuery({ name: 'orgId', required: false, description: 'Organization ID filter' })
  @ApiResponse({ status: 200, description: 'Groups retrieved successfully', type: [Group] })
  findAll(@Query('orgId') orgId?: string): Promise<Group[]> {
    return this.groupsService.findAll(orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get group by ID' })
  @ApiResponse({ status: 200, description: 'Group retrieved successfully', type: Group })
  @ApiResponse({ status: 404, description: 'Group not found' })
  findOne(@Param('id') id: string): Promise<Group> {
    return this.groupsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new group' })
  @ApiResponse({ status: 201, description: 'Group created successfully', type: Group })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupsService.create(createGroupDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a group' })
  @ApiResponse({ status: 200, description: 'Group updated successfully', type: Group })
  @ApiResponse({ status: 404, description: 'Group not found' })
  update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<Group> {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a group' })
  @ApiResponse({ status: 200, description: 'Group deleted successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.groupsService.remove(id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Add member to group' })
  @ApiResponse({ status: 201, description: 'Member added successfully' })
  @ApiResponse({ status: 404, description: 'Group or user not found' })
  addMember(
    @Param('id') groupId: string,
    @Body() addMemberDto: AddMemberDto,
  ) {
    return this.groupsService.addMember(groupId, addMemberDto.user_id, addMemberDto.role);
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove member from group' })
  @ApiResponse({ status: 200, description: 'Member removed successfully' })
  @ApiResponse({ status: 404, description: 'Member not found in group' })
  removeMember(
    @Param('id') groupId: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    return this.groupsService.removeMember(groupId, userId);
  }

  @Get(':id/members')
  @ApiOperation({ summary: 'Get group members' })
  @ApiResponse({ status: 200, description: 'Members retrieved successfully', type: [User] })
  @ApiResponse({ status: 404, description: 'Group not found' })
  getMembers(@Param('id') groupId: string): Promise<User[]> {
    return this.groupsService.getMembers(groupId);
  }
}
