import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserProfilesService } from './user-profiles.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('user-profiles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user-profiles')
export class UserProfilesController {
  constructor(private readonly userProfilesService: UserProfilesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user profile' })
  @ApiResponse({ status: 201, description: 'User profile created successfully' })
  create(@Body() createUserProfileDto: CreateUserProfileDto) {
    return this.userProfilesService.create(createUserProfileDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user profiles' })
  @ApiResponse({ status: 200, description: 'List of user profiles' })
  findAll() {
    return this.userProfilesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user profile by ID' })
  @ApiResponse({ status: 200, description: 'User profile details' })
  findOne(@Param('id') id: string) {
    return this.userProfilesService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user profile by user ID' })
  @ApiResponse({ status: 200, description: 'User profile details' })
  findByUserId(@Param('userId') userId: string) {
    return this.userProfilesService.findByUserId(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'User profile updated successfully' })
  update(@Param('id') id: string, @Body() updateUserProfileDto: UpdateUserProfileDto) {
    return this.userProfilesService.update(id, updateUserProfileDto);
  }

  @Patch('user/:userId')
  @ApiOperation({ summary: 'Update user profile by user ID' })
  @ApiResponse({ status: 200, description: 'User profile updated successfully' })
  updateByUserId(@Param('userId') userId: string, @Body() updateUserProfileDto: UpdateUserProfileDto) {
    return this.userProfilesService.updateByUserId(userId, updateUserProfileDto);
  }

  @Patch('user/:userId/last-active')
  @ApiOperation({ summary: 'Update user last active timestamp' })
  @ApiResponse({ status: 200, description: 'Last active updated successfully' })
  updateLastActive(@Param('userId') userId: string) {
    return this.userProfilesService.updateLastActive(userId);
  }

  @Put('user/:userId/last-active')
  @ApiOperation({ summary: 'Update user last active timestamp (PUT)' })
  @ApiResponse({ status: 200, description: 'Last active updated successfully' })
  updateLastActivePut(@Param('userId') userId: string) {
    return this.userProfilesService.updateLastActive(userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user profile' })
  @ApiResponse({ status: 200, description: 'User profile deleted successfully' })
  remove(@Param('id') id: string) {
    return this.userProfilesService.remove(id);
  }
}